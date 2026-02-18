import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!adminUser) {
        console.log('No admin user found')
        return
    }

    // Simulate the query in app/api/bookings/route.ts for an ADMIN
    const bookings = await prisma.booking.findMany({
        where: {}, // Admin sees all
        include: {
            contact: true,
            service: true,
            user: true,
            reporter: true,
        },
        orderBy: { bookingDate: 'desc' },
    })

    console.log(`Admin view: ${bookings.length} bookings found`)
    bookings.forEach(b => {
        console.log(`- ${b.bookingNumber}: ${b.bookingStatus} (Reporter: ${b.reporter?.firstName || 'NONE'})`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
