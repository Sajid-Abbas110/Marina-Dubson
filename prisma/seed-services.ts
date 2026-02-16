import { PrismaClient } from '@prisma/client'

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
        }
    ]

    console.log('Seeding services...')
    for (const service of services) {
        const created = await prisma.service.upsert({
            where: { id: 'seed-' + service.subService.toLowerCase() },
            update: {},
            create: {
                id: 'seed-' + service.subService.toLowerCase(),
                ...service,
            },
        })
        console.log(`Created service: ${created.serviceName}`)
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
