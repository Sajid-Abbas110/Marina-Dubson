import prisma from './prisma'

export interface BookingRates {
    pageRate: number
    copyRate: number
    appearanceFeeRemote: number
    appearanceFeeInPerson: number
    congestionFee: number
    realtimeFee: number
    realtimeDeviceRate: number
    roughRate: number
    videographerRate: number
    interpreterRate: number
    expertRate: number
    afterHoursRate: number
    waitTimeRate: number
    minimumFee: number
    expediteImmediate: number
    expedite1Day: number
    expedite2Day: number
    expedite3Day: number
}

export class PricingEngine {
    static async getApplicableRates(contactId: string, serviceId: string): Promise<BookingRates> {
        const contact = await prisma.contact.findUnique({
            where: { id: contactId },
            include: {
                customPricing: {
                    where: { serviceId: serviceId },
                    orderBy: { effectiveDate: 'desc' },
                    take: 1
                }
            }
        })

        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })

        if (!service) {
            throw new Error(`Service with ID ${serviceId} not found`)
        }

        // Default rates from template - Enhanced for 'Fair Unified Formula'
        const rates: BookingRates = {
            pageRate: service.pageRate || 4.25,
            copyRate: 1.50,
            appearanceFeeRemote: service.appearanceFeeRemote || 350.00,
            appearanceFeeInPerson: service.appearanceFeeInPerson || 400.00,
            congestionFee: 15.00,
            realtimeFee: service.realtimeFee || 0,
            realtimeDeviceRate: 2.50,
            roughRate: 1.50,
            videographerRate: 1.25,
            interpreterRate: 1.25,
            expertRate: 2.00,
            afterHoursRate: 125.00,
            waitTimeRate: 100.00,
            minimumFee: service.defaultMinimumFee || 500.00,
            expediteImmediate: service.expediteImmediate || 2.0,
            expedite1Day: service.expedite1Day || 1.75,
            expedite2Day: service.expedite2Day || 1.5,
            expedite3Day: service.expedite3Day || 1.25,
        }

        // Apply custom pricing if enabled and available
        if (contact?.customPricingEnabled && contact.customPricing.length > 0) {
            const custom = contact.customPricing[0]
            if (custom.pageRate !== null) rates.pageRate = custom.pageRate
            if (custom.appearanceFeeRemote !== null) rates.appearanceFeeRemote = custom.appearanceFeeRemote
            if (custom.appearanceFeeInPerson !== null) rates.appearanceFeeInPerson = custom.appearanceFeeInPerson
            if (custom.realtimeFee !== null) rates.realtimeFee = custom.realtimeFee
            if (custom.minimumFee !== null) rates.minimumFee = custom.minimumFee
        }

        return rates
    }

    static calculateTotal(rates: BookingRates, data: {
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
        isRemote?: boolean
    }): { subtotal: number, total: number } {
        let subtotal = 0

        // 1. Original + Copies
        subtotal += (data.pages * rates.pageRate * data.originalCopies)
        subtotal += (data.pages * rates.copyRate * data.additionalCopies)

        // 2. Appearance + Congestion
        subtotal += (data.isRemote ? rates.appearanceFeeRemote : rates.appearanceFeeInPerson)
        subtotal += rates.congestionFee

        // 3. Realtime
        if (data.realtimeDevices && data.realtimeDevices > 0) {
            subtotal += (data.pages * rates.realtimeDeviceRate * data.realtimeDevices)
        }

        // 4. Rough
        if (data.hasRough) {
            subtotal += (data.pages * rates.roughRate)
        }

        // 5. Add-ons
        if (data.hasVideographer) subtotal += (data.pages * rates.videographerRate)
        if (data.hasInterpreter) subtotal += (data.pages * rates.interpreterRate)
        if (data.hasExpert) subtotal += (data.pages * rates.expertRate)

        // 6. Hourly Surcharges
        if (data.afterHoursCount) subtotal += (data.afterHoursCount * rates.afterHoursRate)
        if (data.waitTimeCount) subtotal += (data.waitTimeCount * rates.waitTimeRate)

        const total = Math.max(subtotal, rates.minimumFee)
        return { subtotal, total }
    }

    /**
     * Requirement 6.2: Provides a base estimate before final data is known
     */
    static calculateEstimate(rates: BookingRates): number {
        return rates.minimumFee
    }
}
