/**
 * Booking Rules & Legal Enforcement
 * Enforces minimum fees, cancellation policies, and legal confirmations
 */

import prisma from './prisma'

export const MINIMUM_BOOKING_FEE = 400.00

export class BookingRulesService {
    /**
     * 4.1 Minimum Fee Enforcement
     * Ensures $400 minimum fee is applied to all bookings
     */
    static calculateMinimumFee(calculatedTotal: number): number {
        return Math.max(calculatedTotal, MINIMUM_BOOKING_FEE)
    }

    /**
     * 4.2 Cancellation Policy - Calculate Deadline
     * Returns the cancellation deadline (3 PM previous business day)
     */
    static calculateCancellationDeadline(bookingDate: Date): Date {
        const deadline = new Date(bookingDate)

        // Go back one day
        deadline.setDate(deadline.getDate() - 1)

        // Check if it's a weekend, keep going back until we hit a weekday
        while (deadline.getDay() === 0 || deadline.getDay() === 6) {
            deadline.setDate(deadline.getDate() - 1)
        }

        // Set time to 3:00 PM (15:00)
        deadline.setHours(15, 0, 0, 0)

        return deadline
    }

    /**
     * 4.2 Cancellation Policy - Check if Cancellation Fee Applies
     * Returns true if cancellation is after deadline
     */
    static isCancellationFeeApplicable(
        bookingDate: Date,
        cancellationDate: Date = new Date()
    ): boolean {
        const deadline = this.calculateCancellationDeadline(bookingDate)
        return cancellationDate > deadline
    }

    /**
     * 4.2 Auto-Generate Cancellation Invoice
     * Creates $400 minimum invoice for late cancellations
     */
    static async generateCancellationInvoice(bookingId: string): Promise<any> {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                contact: true,
                service: true
            }
        })

        if (!booking) {
            throw new Error('Booking not found')
        }

        // Check if cancellation fee applies
        const feeApplies = this.isCancellationFeeApplicable(
            new Date(booking.bookingDate),
            new Date()
        )

        if (!feeApplies) {
            throw new Error('Cancellation is within allowed timeframe - no fee applies')
        }

        // Generate invoice number
        const invoiceCount = await prisma.invoice.count()
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`

        // Create cancellation invoice
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                bookingId: booking.id,
                contactId: booking.contactId,
                jobNumber: booking.bookingNumber,
                invoiceDate: new Date(),
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
                status: 'SENT',

                // Cancellation fee line items
                pages: 0,
                pageRate: 0,
                appearanceFee: 0,
                minimumFee: MINIMUM_BOOKING_FEE,
                cancellationFee: MINIMUM_BOOKING_FEE,

                subtotal: MINIMUM_BOOKING_FEE,
                tax: 0,
                total: MINIMUM_BOOKING_FEE,

                notes: `CANCELLATION FEE - Booking cancelled after deadline.\n\nOriginal Booking: ${booking.bookingNumber}\nBooking Date: ${booking.bookingDate.toLocaleDateString()}\nCancellation Deadline: ${this.calculateCancellationDeadline(new Date(booking.bookingDate)).toLocaleString()}\nCancelled: ${new Date().toLocaleString()}\n\nPer our cancellation policy, cancellations made after 3 PM on the previous business day are subject to the $400 minimum booking fee.`
            }
        })

        // Update booking status
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                bookingStatus: 'CANCELLED',
                invoiceStatus: 'SENT'
            }
        })

        return invoice
    }

    /**
     * 4.3 Legal Confirmation - Validate Confirmation
     * Ensures all three confirmations are checked
     */
    static validateConfirmation(confirmation: {
        confirmedScheduling: boolean
        confirmedCancellation: boolean
        confirmedFinancial: boolean
    }): { valid: boolean; errors: string[] } {
        const errors: string[] = []

        if (!confirmation.confirmedScheduling) {
            errors.push('Scheduling details must be confirmed')
        }

        if (!confirmation.confirmedCancellation) {
            errors.push('Cancellation policy must be confirmed')
        }

        if (!confirmation.confirmedFinancial) {
            errors.push('Financial responsibility must be confirmed under penalty of perjury')
        }

        return {
            valid: errors.length === 0,
            errors
        }
    }

    /**
     * 4.3 Legal Confirmation - Create Confirmation Record
     * Stores timestamped confirmation with IP and user agent
     */
    static async createConfirmation(data: {
        bookingId: string
        contactId: string
        confirmedScheduling: boolean
        confirmedCancellation: boolean
        confirmedFinancial: boolean
        ipAddress?: string
        userAgent?: string
    }): Promise<any> {
        // Validate confirmation
        const validation = this.validateConfirmation({
            confirmedScheduling: data.confirmedScheduling,
            confirmedCancellation: data.confirmedCancellation,
            confirmedFinancial: data.confirmedFinancial
        })

        if (!validation.valid) {
            throw new Error(`Confirmation validation failed: ${validation.errors.join(', ')}`)
        }

        // Create confirmation record
        const confirmation = await prisma.clientConfirmation.create({
            data: {
                bookingId: data.bookingId,
                contactId: data.contactId,
                confirmedScheduling: data.confirmedScheduling,
                confirmedCancellation: data.confirmedCancellation,
                confirmedFinancial: data.confirmedFinancial,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                confirmedAt: new Date()
            }
        })

        // Update booking status to CONFIRMED
        await prisma.booking.update({
            where: { id: data.bookingId },
            data: {
                bookingStatus: 'CONFIRMED',
                confirmedAt: new Date(),
                cancellationDeadline: this.calculateCancellationDeadline(
                    (await prisma.booking.findUnique({ where: { id: data.bookingId } }))!.bookingDate
                )
            }
        })

        return confirmation
    }

    /**
     * Get Confirmation Terms Text
     * Returns the legal text that clients must agree to
     */
    static getConfirmationTerms(booking: {
        bookingNumber: string
        bookingDate: Date
        bookingTime: string
        serviceName: string
        location?: string
        appearanceType: string
        estimatedTotal: number
    }): {
        schedulingTerms: string
        cancellationTerms: string
        financialTerms: string
    } {
        const deadline = this.calculateCancellationDeadline(booking.bookingDate)

        return {
            schedulingTerms: `I confirm that the following scheduling details are accurate:

• Booking Number: ${booking.bookingNumber}
• Service: ${booking.serviceName}
• Date: ${booking.bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
• Time: ${booking.bookingTime}
• Type: ${booking.appearanceType}
${booking.location ? `• Location: ${booking.location}` : ''}

I understand that I am responsible for ensuring all parties are present and ready at the scheduled time.`,

            cancellationTerms: `I acknowledge and agree to the following cancellation policy:

• Cancellations must be made before 3:00 PM on the previous business day
• Cancellation Deadline for this booking: ${deadline.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
• Cancellations made after this deadline will incur the minimum booking fee of $400.00
• This fee will be invoiced immediately upon late cancellation
• Payment is due within 14 days of invoice date

I understand that this policy is in place because court reporters reserve their time exclusively for scheduled proceedings and cannot accept other assignments during that time.`,

            financialTerms: `I acknowledge and agree to the following financial terms:

• Estimated Total: $${booking.estimatedTotal.toFixed(2)}
• Minimum Booking Fee: $${MINIMUM_BOOKING_FEE.toFixed(2)} (enforced on all bookings)
• Payment due within 14 days of invoice date
• Late payments subject to 1.5% monthly interest charge
• I am financially responsible for all charges related to this booking

UNDER PENALTY OF PERJURY, I declare that:
1. I have the authority to bind my organization to this agreement
2. I will ensure payment of all invoices within the stated terms
3. I understand the cancellation policy and associated fees
4. All information provided is true and accurate

I understand that this confirmation creates a legally binding agreement between myself/my organization and Marina Dubson Stenographic Services.`
        }
    }

    /**
     * Check if booking can be cancelled without fee
     */
    static async canCancelWithoutFee(bookingId: string): Promise<{
        canCancel: boolean
        deadline: Date
        hoursRemaining?: number
        message: string
    }> {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        })

        if (!booking) {
            throw new Error('Booking not found')
        }

        const deadline = this.calculateCancellationDeadline(new Date(booking.bookingDate))
        const now = new Date()
        const canCancel = now <= deadline

        const hoursRemaining = canCancel
            ? Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
            : undefined

        return {
            canCancel,
            deadline,
            hoursRemaining,
            message: canCancel
                ? `You can cancel without fee until ${deadline.toLocaleString()}. ${hoursRemaining} hours remaining.`
                : `Cancellation deadline has passed. A $${MINIMUM_BOOKING_FEE} cancellation fee will apply.`
        }
    }
}

export default BookingRulesService
