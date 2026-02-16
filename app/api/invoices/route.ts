import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import { z } from 'zod'

const invoiceSchema = z.object({
    bookingId: z.string(),
    pages: z.number().optional(),
    originalCopies: z.number().default(1),
    additionalCopies: z.number().default(0),
    realtimeDevices: z.number().optional(),
    afterHoursCount: z.number().optional(),
    notes: z.string().optional(),
})

// GET all invoices
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const contactId = searchParams.get('contactId')
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        const where: any = {}
        if (contactId) where.contactId = contactId
        if (status) where.status = status

        const [invoices, total] = await Promise.all([
            prisma.invoice.findMany({
                where,
                include: {
                    contact: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            companyName: true,
                        },
                    },
                    booking: {
                        select: {
                            id: true,
                            bookingNumber: true,
                            bookingDate: true,
                            service: {
                                select: {
                                    serviceName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { invoiceDate: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.invoice.count({ where }),
        ])

        return NextResponse.json({
            invoices,
            total,
            limit,
            offset,
        })
    } catch (error) {
        console.error('Get invoices error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST create new invoice
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = invoiceSchema.parse(body)

        // Get booking details
        const booking = await prisma.booking.findUnique({
            where: { id: data.bookingId },
            include: {
                contact: {
                    include: {
                        customPricing: true,
                    },
                },
                service: true,
            },
        })

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            )
        }

        // Check if invoice already exists
        const existingInvoice = await prisma.invoice.findUnique({
            where: { bookingId: data.bookingId },
        })

        if (existingInvoice) {
            return NextResponse.json(
                { error: 'Invoice already exists for this booking' },
                { status: 409 }
            )
        }

        // Determine pricing (custom or default)
        let pricing = {
            pageRate: booking.service.pageRate,
            appearanceFee: booking.appearanceType === 'REMOTE'
                ? booking.service.appearanceFeeRemote
                : booking.service.appearanceFeeInPerson,
            realtimeFee: booking.service.realtimeFee,
            minimumFee: booking.service.defaultMinimumFee,
        }

        // Check for custom pricing
        if (booking.contact.customPricingEnabled && booking.contact.customPricing.length > 0) {
            const customPricing = booking.contact.customPricing[0]
            pricing = {
                pageRate: customPricing.pageRate || pricing.pageRate,
                appearanceFee: booking.appearanceType === 'REMOTE'
                    ? (customPricing.appearanceFeeRemote || pricing.appearanceFee)
                    : (customPricing.appearanceFeeInPerson || pricing.appearanceFee),
                realtimeFee: customPricing.realtimeFee || pricing.realtimeFee,
                minimumFee: customPricing.minimumFee || pricing.minimumFee,
            }
        }

        // Calculate invoice amounts
        const pages = data.pages || 0
        const originalCopies = data.originalCopies
        const additionalCopies = data.additionalCopies
        const copyRate = 1.00

        const originalAmount = pages * pricing.pageRate * originalCopies
        const copyAmount = pages * copyRate * additionalCopies
        const appearanceFee = pricing.appearanceFee
        const congestionFee = 9.00

        let realtimeFee = 0
        if (data.realtimeDevices && data.realtimeDevices > 0) {
            realtimeFee = pages * 1.50 * data.realtimeDevices
        }

        let afterHoursFee = 0
        if (data.afterHoursCount && data.afterHoursCount > 0) {
            afterHoursFee = data.afterHoursCount * 100
        }

        const subtotal = originalAmount + copyAmount + appearanceFee + congestionFee + realtimeFee + afterHoursFee
        const total = Math.max(subtotal, pricing.minimumFee)

        // Generate invoice number
        const count = await prisma.invoice.count()
        const invoiceNumber = `INV${String(count + 1).padStart(6, '0')}`

        // Create invoice
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                bookingId: data.bookingId,
                contactId: booking.contactId,
                jobNumber: booking.bookingNumber,
                pages,
                originalCopies,
                additionalCopies,
                pageRate: pricing.pageRate,
                copyRate,
                appearanceFee,
                congestionFee,
                realtimeFee: realtimeFee > 0 ? realtimeFee : null,
                realtimeDevices: data.realtimeDevices,
                afterHoursFee: afterHoursFee > 0 ? afterHoursFee : null,
                afterHoursCount: data.afterHoursCount,
                minimumFee: pricing.minimumFee,
                subtotal,
                total,
                notes: data.notes,
                status: 'DRAFT',
            },
            include: {
                contact: true,
                booking: true,
            },
        })

        // Update booking invoice status
        await prisma.booking.update({
            where: { id: data.bookingId },
            data: { invoiceStatus: 'DRAFT' },
        })

        // Send invoice email
        const clientName = `${invoice.contact.firstName} ${invoice.contact.lastName}`
        const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${invoice.id}`
        const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${invoice.id}/pay`

        const emailTemplate = emailTemplates.invoiceGenerated(
            clientName,
            invoiceNumber,
            total,
            invoiceLink,
            paymentLink
        )

        await sendEmail({
            to: invoice.contact.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        })

        return NextResponse.json(invoice, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Create invoice error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
