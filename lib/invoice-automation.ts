import prisma from './prisma'
import { sendEmail, emailTemplates } from './email'

export async function generateInvoiceForBooking(bookingId: string) {
    // 1. Get Booking details
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            contact: {
                include: {
                    customPricing: true,
                },
            },
            service: true,
        },
    })

    if (!booking) throw new Error('Booking not found')

    // 2. Check if invoice already exists
    const existingInvoice = await prisma.invoice.findUnique({
        where: { bookingId },
    })
    if (existingInvoice) return existingInvoice

    // 3. Determine Pricing (Priority: Custom Contact Pricing > Default Service Pricing)
    let pricing = {
        pageRate: booking.service.pageRate,
        appearanceFee: booking.appearanceType === 'REMOTE'
            ? booking.service.appearanceFeeRemote
            : booking.service.appearanceFeeInPerson,
        realtimeFee: booking.service.realtimeFee,
        minimumFee: booking.service.defaultMinimumFee,
    }

    // Apply custom pricing if enabled
    if (booking.contact.customPricingEnabled && booking.contact.customPricing.length > 0) {
        const custom = booking.contact.customPricing[0]
        pricing = {
            pageRate: custom.pageRate ?? pricing.pageRate,
            appearanceFee: booking.appearanceType === 'REMOTE'
                ? (custom.appearanceFeeRemote ?? pricing.appearanceFee)
                : (custom.appearanceFeeInPerson ?? pricing.appearanceFee),
            realtimeFee: custom.realtimeFee ?? pricing.realtimeFee,
            minimumFee: custom.minimumFee ?? pricing.minimumFee,
        }
    }

    // 4. Calculate Amounts
    // For automation, we assume standard defaults if not specified. 
    // Usually pages are entered by the reporter when completing the job.
    // If we don't have pages yet, we'll mark as DRAFT.
    const pages = 0 // Will be updated by reporter/admin later
    const originalCopies = 1
    const additionalCopies = 0
    const copyRate = 1.00
    const congestionFee = 9.00

    const subtotal = (pages * pricing.pageRate) + pricing.appearanceFee + congestionFee

    // MANDATORY MINIMUM FEE Enforcement ($400 by default)
    const total = Math.max(subtotal, pricing.minimumFee)

    // 5. Generate Invoice Number
    const count = await prisma.invoice.count()
    const invoiceNumber = `INV${String(count + 1).padStart(6, '0')}`

    // 6. Create Invoice
    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber,
            bookingId: booking.id,
            contactId: booking.contactId,
            jobNumber: booking.bookingNumber,
            pages,
            originalCopies,
            additionalCopies,
            pageRate: pricing.pageRate,
            copyRate,
            appearanceFee: pricing.appearanceFee,
            congestionFee,
            minimumFee: pricing.minimumFee,
            subtotal,
            total,
            status: 'DRAFT',
        },
        include: {
            contact: true,
            booking: true,
        },
    })

    // 7. Update booking invoice status
    await prisma.booking.update({
        where: { id: bookingId },
        data: { invoiceStatus: 'DRAFT' },
    })

    // 8. Send Automation Triggered Email (to Admin or Client)
    const clientName = `${invoice.contact.firstName} ${invoice.contact.lastName}`
    const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${invoice.id}`
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${invoice.id}/pay`

    const template = emailTemplates.invoiceGenerated(
        clientName,
        invoiceNumber,
        total,
        invoiceLink,
        paymentLink
    )

    await sendEmail({
        to: invoice.contact.email,
        subject: template.subject,
        html: template.html,
    })

    return invoice
}
