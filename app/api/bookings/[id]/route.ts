import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailTemplates, sendEmail } from '@/lib/email'
import { z } from 'zod'
import { format } from 'date-fns'
import { integrationOrchestrator } from '@/lib/integration-orchestrator'
import { BookingRulesService } from '@/lib/booking-rules'

const updateSchema = z.object({
    bookingStatus: z.enum([
        'SUBMITTED',
        'PENDING',
        'MAYBE',
        'ACCEPTED',
        'CONFIRMED',
        'DECLINED',
        'CANCELLED',
        'COMPLETED'
    ]).optional(),
    isMarketplace: z.boolean().optional(),
    isOpened: z.boolean().optional(),
    reporterId: z.string().nullable().optional(),
    notes: z.string().optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const data = updateSchema.parse(body)

        // Get existing booking for context
        const existingBooking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
                contact: true,
                service: true,
            },
        })

        if (!existingBooking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // If reporterId is provided or changed, fetch and lock reporter base rates
        if (data.reporterId && data.reporterId !== existingBooking.reporterId) {
            const reporter = await prisma.user.findUnique({
                where: { id: data.reporterId }
            });

            if (reporter) {
                (data as any).lockedReporterPageRate = reporter.basePageRate;
                (data as any).lockedReporterAppearanceFee = reporter.baseAppearanceFee;
                (data as any).lockedReporterMinimumFee = reporter.baseMinimumFee;
            }
        }

        // Update booking
        const rawBooking = await prisma.booking.update({
            where: { id: params.id },
            data: data as any,
            include: {
                contact: true,
                service: true,
                reporter: true,
            },
        })
        const booking = rawBooking as any

        // Handle side effects based on status change
        if (data.bookingStatus && data.bookingStatus !== existingBooking.bookingStatus) {
            if (data.bookingStatus === 'ACCEPTED') {
                const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/confirm/${booking.id}`
                const emailTemplate = emailTemplates.bookingAccepted(
                    booking.bookingNumber,
                    `${booking.contact.firstName} ${booking.contact.lastName}`,
                    {
                        date: format(booking.bookingDate, 'MMMM dd, yyyy'),
                        time: booking.bookingTime,
                        service: booking.service.serviceName,
                        location: booking.location || 'Remote/Zoom',
                    },
                    confirmationLink
                )

                await sendEmail({
                    to: booking.contact.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                })
            } else if (data.bookingStatus === 'DECLINED') {
                const emailTemplate = emailTemplates.bookingDeclined(
                    booking.bookingNumber,
                    `${booking.contact.firstName} ${booking.contact.lastName}`
                )

                await sendEmail({
                    to: booking.contact.email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                })
            } else if (data.bookingStatus === 'CANCELLED') {
                try {
                    const cancellationInfo = await BookingRulesService.canCancelWithoutFee(booking.id)
                    if (!cancellationInfo.canCancel) {
                        await BookingRulesService.generateCancellationInvoice(booking.id)
                    }
                } catch (error) {
                    console.error('Cancellation processing failed:', error)
                }
            }

            if (data.bookingStatus === 'COMPLETED') {
                try {
                    await (integrationOrchestrator as any).completeBooking(booking.id)
                } catch (completionError) {
                    console.error('Integration completion failed:', completionError)
                }
            }
        }

        return NextResponse.json(booking)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Update booking error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
                contact: true,
                service: true,
                reporter: true,
            },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Fetch booking error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.booking.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete booking error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
