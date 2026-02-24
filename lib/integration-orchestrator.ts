/**
 * Integration Orchestrator
 * Manages the complete flow: Client Portal → Zoho CRM → Zoho Books → Stripe/PayPal → Mailchimp
 */

import { zohoCRM } from './zoho-crm'
import { zohoBooks } from './zoho-books'
import { mailchimp } from './mailchimp'
import prisma from './prisma'
import { PricingEngine } from './pricing-engine'
import { sendEmail, emailTemplates } from './email'

interface BookingIntegrationData {
    bookingId: string
    contactEmail: string
    contactFirstName: string
    contactLastName: string
    contactPhone?: string
    companyName?: string
    serviceName: string
    serviceAmount: number
    bookingDate: string
    bookingNumber: string
    proceedingType: string
}

export class IntegrationOrchestrator {
    /**
     * Step 1: Sync booking to Zoho CRM
     * Creates/updates contact and creates a deal
     */
    async syncToZohoCRM(data: BookingIntegrationData): Promise<{
        contactId: string
        dealId: string
    }> {
        try {
            // Create or update contact in Zoho CRM
            const contactResult = await zohoCRM.upsertContact({
                First_Name: data.contactFirstName,
                Last_Name: data.contactLastName,
                Email: data.contactEmail,
                Phone: data.contactPhone,
                Account_Name: data.companyName,
                Description: `Client from Marina Dubson Portal - Booking ${data.bookingNumber}`
            })

            // Create deal in Zoho CRM
            const dealResult = await zohoCRM.createDeal({
                Deal_Name: `${data.bookingNumber} - ${data.serviceName}`,
                Stage: 'Qualification', // Initial stage
                Amount: data.serviceAmount,
                Closing_Date: data.bookingDate,
                Contact_Name: {
                    id: contactResult.id
                },
                Description: `${data.proceedingType} - Created from portal`,
                Type: 'Court Reporting Service'
            })

            // Store Zoho IDs in local database
            await prisma.booking.update({
                where: { id: data.bookingId },
                data: {
                    notes: JSON.stringify({
                        zohoCRMContactId: contactResult.id,
                        zohoCRMDealId: dealResult.id
                    })
                }
            })

            // Update Mailchimp
            await mailchimp.updateMemberForBookingStage(
                data.contactEmail,
                data.contactFirstName,
                data.contactLastName,
                'submitted'
            )

            return {
                contactId: contactResult.id,
                dealId: dealResult.id
            }
        } catch (error) {
            console.error('Zoho CRM sync failed:', error)
            throw error
        }
    }

    /**
     * Automated Flow: Triggered after Client Confirmation
     * Creates the initial invoice record
     */
    async createInvoiceAfterApproval(data: BookingIntegrationData): Promise<void> {
        try {
            const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`

            await prisma.invoice.create({
                data: {
                    invoiceNumber,
                    jobNumber: data.bookingNumber,
                    contactId: (await prisma.booking.findUnique({ where: { id: data.bookingId } }))?.contactId || '',
                    bookingId: data.bookingId,
                    invoiceDate: new Date(),
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
                    status: 'DRAFT',
                    pageRate: 0, // Will be updated during finalization
                    appearanceFee: data.serviceAmount,
                    subtotal: data.serviceAmount,
                    total: data.serviceAmount,
                    notes: `Automated invoice generated for ${data.serviceName} - ${data.proceedingType}`
                }
            })

            // Requirement 7.1: Also sync to Zoho Books
            try {
                const customerResult = await zohoBooks.upsertCustomer({
                    contact_name: `${data.contactFirstName} ${data.contactLastName}`,
                    company_name: data.companyName,
                    email: data.contactEmail,
                    phone: data.contactPhone
                })

                await zohoBooks.createInvoice({
                    customer_id: customerResult.id,
                    date: new Date().toISOString().split('T')[0],
                    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    line_items: [{
                        name: data.serviceName,
                        description: `Initial booking for ${data.proceedingType}`,
                        rate: data.serviceAmount,
                        quantity: 1
                    }],
                    notes: `Booking confirmation for ${data.bookingNumber}`
                })
            } catch (zohoError) {
                console.error('Initial Zoho Books sync failed, will retry at completion:', zohoError)
            }

            // Requirement 8.1: Mailchimp Stage Update
            await mailchimp.updateMemberForBookingStage(
                data.contactEmail,
                data.contactFirstName,
                data.contactLastName,
                'approved'
            )
        } catch (error) {
            console.error('createInvoiceAfterApproval failed:', error)
            throw error
        }
    }

    /**
     * Step 2: Create final invoice in Zoho Books after completion
     */
    async generateFinalInvoice(bookingId: string, billingData: {
        pages: number,
        originalCopies: number,
        additionalCopies: number,
        realtimeDevices?: number,
        hasRough?: boolean,
        hasVideographer?: boolean,
        hasInterpreter?: boolean,
        hasExpert?: boolean,
        afterHoursCount?: number,
        waitTimeCount?: number,
        notes?: string
    }): Promise<any> {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { contact: true, service: true }
            })

            if (!booking) throw new Error('Booking not found')

            const baseRates = await PricingEngine.getApplicableRates(booking.contactId, booking.serviceId)

            const rates = {
                ...baseRates,
                pageRate: booking.lockedPageRate || baseRates.pageRate,
                appearanceFeeRemote: booking.lockedAppearanceFee || baseRates.appearanceFeeRemote,
                appearanceFeeInPerson: booking.lockedAppearanceFee || baseRates.appearanceFeeInPerson,
                minimumFee: booking.lockedMinimumFee || baseRates.minimumFee,
            }

            const { subtotal, total } = PricingEngine.calculateTotal(rates, {
                ...billingData,
                isRemote: booking.location?.toLowerCase().includes('remote')
            })

            const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
            const jobNumber = booking.bookingNumber

            const localInvoice = await prisma.invoice.create({
                data: {
                    invoiceNumber,
                    jobNumber,
                    contactId: booking.contactId,
                    bookingId: booking.id,
                    invoiceDate: new Date(),
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    status: 'SENT',
                    pages: billingData.pages,
                    originalCopies: billingData.originalCopies,
                    additionalCopies: billingData.additionalCopies,
                    pageRate: rates.pageRate,
                    copyRate: rates.copyRate,
                    appearanceFee: booking.location?.toLowerCase().includes('remote') ? rates.appearanceFeeRemote : rates.appearanceFeeInPerson,
                    congestionFee: rates.congestionFee,
                    realtimeFee: billingData.realtimeDevices ? (billingData.pages * rates.realtimeDeviceRate * billingData.realtimeDevices) : 0,
                    realtimeDevices: billingData.realtimeDevices,
                    roughFee: billingData.hasRough ? (billingData.pages * rates.roughRate) : 0,
                    videographerFee: billingData.hasVideographer ? (billingData.pages * rates.videographerRate) : 0,
                    interpreterFee: billingData.hasInterpreter ? (billingData.pages * rates.interpreterRate) : 0,
                    expertFee: billingData.hasExpert ? (billingData.pages * rates.expertRate) : 0,
                    afterHoursFee: billingData.afterHoursCount ? (billingData.afterHoursCount * rates.afterHoursRate) : 0,
                    afterHoursCount: billingData.afterHoursCount,
                    waitTimeFee: billingData.waitTimeCount ? (billingData.waitTimeCount * rates.waitTimeRate) : 0,
                    waitTimeCount: billingData.waitTimeCount ?? null,
                    subtotal,
                    minimumFee: rates.minimumFee,
                    total,
                    notes: billingData.notes || `Job: ${booking.proceedingType}`
                }
            })

            let zohoInvoiceId = null
            try {
                const customerResult = await zohoBooks.upsertCustomer({
                    contact_name: `${booking.contact.firstName} ${booking.contact.lastName}`,
                    company_name: booking.contact.companyName ?? undefined,
                    email: booking.contact.email
                })

                const lineItems = [
                    {
                        name: 'Original Transcript',
                        description: `(${billingData.pages} pgs x $${rates.pageRate})`,
                        rate: rates.pageRate,
                        quantity: billingData.pages * billingData.originalCopies
                    }
                ]

                if (billingData.additionalCopies > 0) {
                    lineItems.push({
                        name: 'Transcript Copies',
                        description: `(${billingData.pages} pgs x $${rates.copyRate})`,
                        rate: rates.copyRate,
                        quantity: billingData.pages * billingData.additionalCopies
                    })
                }

                lineItems.push({
                    name: 'Appearance & Logistics',
                    description: 'Flat Fee + Congestion Surcharge',
                    rate: (booking.location?.toLowerCase().includes('remote') ? rates.appearanceFeeRemote : rates.appearanceFeeInPerson) + rates.congestionFee,
                    quantity: 1
                })

                if (billingData.hasRough) {
                    lineItems.push({
                        name: 'Rough Draft Access',
                        description: `(+$${rates.roughRate} per page)`,
                        rate: rates.roughRate,
                        quantity: billingData.pages
                    })
                }

                if (billingData.hasVideographer) {
                    lineItems.push({
                        name: 'Videography Services',
                        description: `(+$${rates.videographerRate} per page)`,
                        rate: rates.videographerRate,
                        quantity: billingData.pages
                    })
                }

                if (billingData.hasInterpreter) {
                    lineItems.push({
                        name: 'Interpreter Services',
                        description: `(+$${rates.interpreterRate} per page)`,
                        rate: rates.interpreterRate,
                        quantity: billingData.pages
                    })
                }

                if (billingData.hasExpert) {
                    lineItems.push({
                        name: 'Expert Witness Services',
                        description: `(+$${rates.expertRate} per page)`,
                        rate: rates.expertRate,
                        quantity: billingData.pages
                    })
                }

                if (billingData.afterHoursCount && billingData.afterHoursCount > 0) {
                    lineItems.push({
                        name: 'After-hours Surcharge',
                        description: `(${billingData.afterHoursCount} hours after 5:30 PM)`,
                        rate: rates.afterHoursRate,
                        quantity: billingData.afterHoursCount
                    })
                }

                if (billingData.waitTimeCount && billingData.waitTimeCount > 0) {
                    lineItems.push({
                        name: 'Wait Time Surcharge',
                        description: `(${billingData.waitTimeCount} hours wait time)`,
                        rate: rates.waitTimeRate,
                        quantity: billingData.waitTimeCount
                    })
                }

                const zohoInvoice = await zohoBooks.createInvoice({
                    customer_id: customerResult.id,
                    date: new Date().toISOString().split('T')[0],
                    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    line_items: lineItems,
                    notes: `Invoice for ${booking.proceedingType}. JOB: ${booking.bookingNumber}`
                })
                zohoInvoiceId = zohoInvoice.id
            } catch (zohoError) {
                console.error('Zoho Books sync failed during completion:', zohoError)
            }

            const currentMetadata = JSON.parse(booking.notes || '{}')
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    bookingStatus: 'COMPLETED',
                    invoiceStatus: 'SENT',
                    notes: JSON.stringify({
                        ...currentMetadata,
                        zohoBooksInvoiceId: zohoInvoiceId
                    })
                }
            })

            try {
                if (zohoInvoiceId) {
                    try {
                        await zohoBooks.sendInvoiceEmail(zohoInvoiceId)
                    } catch (zErr) {
                        console.warn('Failed to dispatch Zoho email, continuing local sync...', zErr)
                    }
                }

                const clientEmailData = emailTemplates.invoiceGenerated(
                    booking.contact.firstName,
                    localInvoice.invoiceNumber,
                    localInvoice.total,
                    `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${localInvoice.id}`,
                    `${process.env.NEXT_PUBLIC_APP_URL}/client/invoices/${localInvoice.id}`
                )
                await sendEmail({
                    to: booking.contact.email,
                    ...clientEmailData
                })

                const adminEmailData = emailTemplates.adminInvoiceNotification(
                    'Marina',
                    `${booking.contact.firstName} ${booking.contact.lastName}`,
                    localInvoice.invoiceNumber,
                    localInvoice.total,
                    `${process.env.NEXT_PUBLIC_APP_URL}/admin/invoices/${localInvoice.id}`
                )
                await sendEmail({
                    to: process.env.SMTP_USER || 'MarinaDubson@gmail.com',
                    ...adminEmailData
                })

                await mailchimp.updateMemberForBookingStage(
                    booking.contact.email,
                    booking.contact.firstName,
                    booking.contact.lastName,
                    'invoiced'
                )

                console.log('Automated invoice notifications dispatched.')
            } catch (emailError) {
                console.error('Notification dispatch failed:', emailError)
            }

            return { localInvoice, zohoInvoiceId }
        } catch (error) {
            console.error('Final invoice generation failed:', error)
            throw error
        }
    }

    /**
     * Step 3: Record payment from Stripe/PayPal webhook
     */
    async recordPayment(bookingId: string, paymentData: {
        amount: number
        paymentMethod: 'stripe' | 'paypal'
        transactionId: string
        paidAt: string
    }): Promise<void> {
        try {
            const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
            if (!booking) throw new Error('Booking not found')

            const metadata = JSON.parse(booking.notes || '{}')
            const invoiceId = metadata.zohoBooksInvoiceId

            if (!invoiceId) {
                throw new Error('No Zoho Books invoice found for this booking')
            }

            await zohoBooks.recordPayment(invoiceId, {
                amount: paymentData.amount,
                payment_mode: paymentData.paymentMethod === 'stripe' ? 'Credit Card' : 'PayPal',
                date: paymentData.paidAt.split('T')[0],
                reference_number: paymentData.transactionId,
                notes: `Payment via ${paymentData.paymentMethod}`
            })

            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    invoiceStatus: 'PAID'
                }
            })

            if (metadata.zohoCRMDealId) {
                await zohoCRM.updateDealStage(metadata.zohoCRMDealId, 'Closed Won')
            }

            const contact = await prisma.contact.findUnique({ where: { id: booking.contactId } })
            if (contact) {
                await mailchimp.updateMemberForBookingStage(
                    contact.email,
                    contact.firstName,
                    contact.lastName,
                    'paid'
                )
            }
        } catch (error) {
            console.error('Payment recording failed:', error)
            throw error
        }
    }

    /**
     * Complete the booking and update all systems
     */
    async completeBooking(bookingId: string): Promise<void> {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { contact: true }
            })

            if (!booking) throw new Error('Booking not found')

            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    bookingStatus: 'COMPLETED'
                }
            })

            const metadata = JSON.parse(booking.notes || '{}')
            if (metadata.zohoCRMDealId) {
                await zohoCRM.updateDealStage(metadata.zohoCRMDealId, 'Closed Won')
            }

            if (booking.contact) {
                await mailchimp.updateMemberForBookingStage(
                    booking.contact.email,
                    booking.contact.firstName,
                    booking.contact.lastName,
                    'completed'
                )
            }
        } catch (error) {
            console.error('Booking completion failed:', error)
            throw error
        }
    }
}

export const integrationOrchestrator = new IntegrationOrchestrator()
