import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { BookingRulesService, MINIMUM_BOOKING_FEE } from '@/lib/booking-rules'
import { sendEmail } from '@/lib/email'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookingId = params.id

        // Fetch the full booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                contact: true,
                service: true,
            },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Authorization: only the booking owner (by email) or admin can cancel
        const userRole = payload.role?.toUpperCase() || 'CLIENT'
        const isAdmin = ['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(userRole)
        const isOwner = booking.contact?.email === payload.email

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Cannot cancel an already-cancelled or completed booking
        if (['CANCELLED', 'COMPLETED', 'DECLINED'].includes(booking.bookingStatus)) {
            return NextResponse.json(
                { error: `Booking is already ${booking.bookingStatus.toLowerCase()} and cannot be cancelled.` },
                { status: 400 }
            )
        }

        // Check if cancellation fee applies (after 3 PM previous business day)
        const now = new Date()
        const deadline = BookingRulesService.calculateCancellationDeadline(new Date(booking.bookingDate))
        const feeApplies = now > deadline

        let cancellationInvoice = null

        if (feeApplies) {
            // Generate $400 auto-invoice for late cancellation
            const invoiceCount = await prisma.invoice.count()
            const invoiceNumber = `INV-CANCEL-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`
            const minFee = (booking as any).lockedMinimumFee || MINIMUM_BOOKING_FEE

            cancellationInvoice = await (prisma.invoice as any).create({
                data: {
                    invoiceNumber,
                    bookingId: booking.id,
                    contactId: booking.contactId,
                    jobNumber: booking.bookingNumber,
                    invoiceDate: new Date(),
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Net 14
                    status: 'SENT',
                    pages: 0,
                    pageRate: 0,
                    appearanceFee: 0,
                    minimumFee: minFee,
                    cancellationFee: minFee,
                    subtotal: minFee,
                    tax: 0,
                    total: minFee,
                    notes: `LATE CANCELLATION FEE\n\nBooking: ${booking.bookingNumber}\nBooking Date: ${new Date(booking.bookingDate).toLocaleDateString()}\nCancellation Deadline: ${deadline.toLocaleString()}\nCancelled At: ${now.toLocaleString()}\n\nPer the cancellation policy, cancellations made after 3:00 PM on the previous business day are subject to the $${minFee.toFixed(2)} minimum booking fee.`,
                },
            })

            // Send cancellation fee invoice email to client
            try {
                const clientName = `${booking.contact.firstName} ${booking.contact.lastName}`
                await sendEmail({
                    to: booking.contact.email,
                    subject: `Booking Cancelled — Cancellation Fee Invoice #${invoiceNumber}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">Marina Dubson</h1>
                                <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
                            </div>
                            <div style="padding: 30px; background: #f9fafb;">
                                <h2 style="color: #dc2626;">Booking Cancelled — Late Cancellation Fee</h2>
                                <p>Dear ${clientName},</p>
                                <p>Your booking <strong>#${booking.bookingNumber}</strong> has been cancelled.</p>
                                <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                                    <p style="margin: 0; font-weight: bold; color: #991b1b;">⚠️ Late Cancellation Fee Applied</p>
                                    <p style="margin: 10px 0 0 0; color: #991b1b;">
                                        The cancellation deadline for this booking was <strong>${deadline.toLocaleString()}</strong>.
                                        Since the booking was cancelled after this deadline, a cancellation fee has been applied.
                                    </p>
                                </div>
                                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Invoice Number</p>
                                    <p style="margin: 5px 0; font-size: 20px; font-weight: bold; color: #1f2937;">#${invoiceNumber}</p>
                                    <p style="margin: 15px 0 0 0; font-size: 28px; font-weight: bold; color: #dc2626;">$${minFee.toFixed(2)}</p>
                                    <p style="margin: 5px 0; color: #6b7280; font-size: 13px;">Due within 14 days</p>
                                </div>
                                <p style="margin-top: 30px;">
                                    Best regards,<br>
                                    <strong>Marina Dubson Stenographic Services</strong><br>
                                    (917) 494-1859<br>
                                    MarinaDubson@gmail.com
                                </p>
                            </div>
                            <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
                                <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
                                <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
                            </div>
                        </div>
                    `,
                })
            } catch (emailErr) {
                console.error('Failed to send cancellation fee email:', emailErr)
            }
        } else {
            // Free cancellation — send simple confirmation email
            try {
                const clientName = `${booking.contact.firstName} ${booking.contact.lastName}`
                await sendEmail({
                    to: booking.contact.email,
                    subject: `Booking #${booking.bookingNumber} Cancelled — No Charge`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">Marina Dubson</h1>
                                <p style="color: white; margin: 5px 0;">Stenographic Services, LLC</p>
                            </div>
                            <div style="padding: 30px; background: #f9fafb;">
                                <h2 style="color: #059669;">✓ Booking Cancelled — No Charge</h2>
                                <p>Dear ${clientName},</p>
                                <p>Your booking <strong>#${booking.bookingNumber}</strong> has been successfully cancelled.</p>
                                <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                                    <p style="margin: 0; color: #065f46;">No cancellation fee has been applied. The cancellation was made before the deadline of <strong>${deadline.toLocaleString()}</strong>.</p>
                                </div>
                                <p>We hope to work with you in the future. Please contact us anytime to schedule a new booking.</p>
                                <p style="margin-top: 30px;">
                                    Best regards,<br>
                                    <strong>Marina Dubson Stenographic Services</strong><br>
                                    (917) 494-1859<br>
                                    MarinaDubson@gmail.com
                                </p>
                            </div>
                            <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
                                <p style="margin: 0;">"Committed to accuracy, high quality and excellent customer service"</p>
                                <p style="margin: 10px 0 0 0;">12A Saturn Lane, Staten Island, NY 10314</p>
                            </div>
                        </div>
                    `,
                })
            } catch (emailErr) {
                console.error('Failed to send free cancellation email:', emailErr)
            }
        }

        // Update booking status to CANCELLED
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                bookingStatus: 'CANCELLED',
                ...(feeApplies ? { invoiceStatus: 'SENT' } : {}),
            },
        })

        return NextResponse.json({
            success: true,
            feeApplied: feeApplies,
            feeAmount: feeApplies ? (booking as any).lockedMinimumFee || MINIMUM_BOOKING_FEE : 0,
            deadline: deadline.toISOString(),
            message: feeApplies
                ? `Booking cancelled. A $${((booking as any).lockedMinimumFee || MINIMUM_BOOKING_FEE).toFixed(2)} cancellation fee has been applied and invoiced.`
                : 'Booking cancelled successfully. No cancellation fee applied.',
            invoice: cancellationInvoice,
        })
    } catch (error: any) {
        console.error('Cancel booking error:', error)
        return NextResponse.json({ error: error.message || 'Failed to cancel booking' }, { status: 500 })
    }
}

// GET - Check cancellation policy for a booking (before cancelling)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        const result = await BookingRulesService.canCancelWithoutFee(params.id)
        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Cancel check error:', error)
        return NextResponse.json({ error: error.message || 'Failed to check cancellation policy' }, { status: 500 })
    }
}
