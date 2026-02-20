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

        // Default rates from template - Updated to match User Fee Schedule
        const rates: BookingRates = {
            pageRate: service.pageRate || 4.00,
            copyRate: 1.00,
            appearanceFeeRemote: service.appearanceFeeRemote || 300.00,
            appearanceFeeInPerson: service.appearanceFeeInPerson || 300.00,
            congestionFee: 9.00,
            realtimeFee: service.realtimeFee || 0,
            realtimeDeviceRate: 1.50,
            roughRate: 1.25,
            videographerRate: 0.30,
            interpreterRate: 0.30,
            expertRate: 0.50,
            afterHoursRate: 100.00,
            waitTimeRate: 100.00,
            minimumFee: service.defaultMinimumFee || 400.00,
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
        // BASE CHARGES: Appearance, Congestion, Pages, Copies
        let baseSubtotal = 0
        baseSubtotal += (data.pages * rates.pageRate * data.originalCopies)
        baseSubtotal += (data.pages * rates.copyRate * data.additionalCopies)
        baseSubtotal += (data.isRemote ? rates.appearanceFeeRemote : rates.appearanceFeeInPerson)
        baseSubtotal += rates.congestionFee

        // Apply Minimum Fee only to base charges
        const baseTotal = Math.max(baseSubtotal, rates.minimumFee)

        // PREMIUM EXTRAS: These add ON TOP of the base coverage
        let extrasTotal = 0

        // 1. Realtime
        if (data.realtimeDevices && data.realtimeDevices > 0) {
            extrasTotal += (data.pages * rates.realtimeDeviceRate * data.realtimeDevices)
        }

        // 2. Rough
        if (data.hasRough) {
            extrasTotal += (data.pages * rates.roughRate)
        }

        // 3. Specialized Components
        if (data.hasVideographer) extrasTotal += (data.pages * rates.videographerRate)
        if (data.hasInterpreter) extrasTotal += (data.pages * rates.interpreterRate)
        if (data.hasExpert) extrasTotal += (data.pages * rates.expertRate)

        // 4. Hourly Surcharges
        if (data.afterHoursCount) extrasTotal += (data.afterHoursCount * rates.afterHoursRate)
        if (data.waitTimeCount) extrasTotal += (data.waitTimeCount * rates.waitTimeRate)

        const total = baseTotal + extrasTotal
        const subtotal = baseSubtotal + extrasTotal

        return { subtotal, total }
    }

    /**
     * Requirement 6.2: Provides a base estimate before final data is known
     */
    static calculateEstimate(rates: BookingRates): number {
        return rates.minimumFee
    }
}
