const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const services = [
        {
            serviceName: 'Premium Court Reporting',
            category: 'COURT_REPORTING',
            subService: 'DEPOSITIONS',
            defaultMinimumFee: 400,
            pageRate: 5.5,
            appearanceFeeRemote: 150,
            appearanceFeeInPerson: 250,
            realtimeFee: 2.0,
            expediteImmediate: 10.0,
            expedite1Day: 8.0,
            expedite2Day: 6.0,
            expedite3Day: 4.0,
            description: 'Elite stenographic reporting for high-stakes depositions.',
            active: true,
        },
        {
            serviceName: 'Standard Legal Proceedings',
            category: 'LEGAL_PROCEEDINGS',
            subService: 'HEARINGS',
            defaultMinimumFee: 400,
            pageRate: 4.5,
            appearanceFeeRemote: 100,
            appearanceFeeInPerson: 200,
            realtimeFee: 1.5,
            expediteImmediate: 9.0,
            expedite1Day: 7.0,
            expedite2Day: 5.0,
            expedite3Day: 3.0,
            description: 'Reliable reporting for hearings and arbitrations.',
            active: true,
        },
        {
            serviceName: 'Virtual Hearing Stream',
            category: 'LEGAL_PROCEEDINGS',
            subService: 'VIRTUAL_HEARINGS',
            defaultMinimumFee: 500,
            pageRate: 5.0,
            appearanceFeeRemote: 150,
            appearanceFeeInPerson: 250,
            realtimeFee: 2.0,
            expediteImmediate: 9.5,
            expedite1Day: 7.5,
            expedite2Day: 5.5,
            expedite3Day: 3.5,
            description: 'High-fidelity remote hearing streaming and recording.',
            active: true,
        },
        {
            serviceName: 'Arbitration Management',
            category: 'LEGAL_PROCEEDINGS',
            subService: 'ARBITRATIONS',
            defaultMinimumFee: 600,
            pageRate: 6.0,
            appearanceFeeRemote: 200,
            appearanceFeeInPerson: 300,
            realtimeFee: 2.5,
            expediteImmediate: 10.5,
            expedite1Day: 8.5,
            expedite2Day: 6.5,
            expedite3Day: 4.5,
            description: 'Comprehensive steno support for complex arbitrations.',
            active: true,
        },
        {
            serviceName: 'EUO Specialist Protocol',
            category: 'COURT_REPORTING',
            subService: 'EUO',
            defaultMinimumFee: 450,
            pageRate: 5.0,
            appearanceFeeRemote: 125,
            appearanceFeeInPerson: 225,
            realtimeFee: 1.5,
            expediteImmediate: 8.5,
            expedite1Day: 6.5,
            expedite2Day: 4.5,
            expedite3Day: 2.5,
            description: 'Specialized reporting for Examinations Under Oath.',
            active: true,
        }
    ]

    console.log('Seeding services...')
    for (const service of services) {
        try {
            const created = await prisma.service.create({
                data: service
            })
            console.log(`Created service: ${created.serviceName}`)
        } catch (e) {
            console.log(`Service ${service.serviceName} might already exist or skipped: ${e.message}`)
        }
    }
    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
