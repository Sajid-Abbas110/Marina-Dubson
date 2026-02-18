import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Database Check ---')
    const bookings = await prisma.booking.findMany({
        include: {
            contact: true,
            reporter: true,
        },
        orderBy: { bookingDate: 'desc' },
    })
    console.log(`Total bookings found: ${bookings.length}`)
    bookings.forEach(b => {
        console.log(`[${b.bookingNumber}] Date: ${b.bookingDate.toISOString().split('T')[0]}, Status: ${b.bookingStatus}, Reporter: ${b.reporter?.firstName || 'NONE'}`)
    })

    const users = await prisma.user.findMany()
    console.log(`Total users found: ${users.length}`)
    users.forEach(u => {
        console.log(`[${u.id}] ${u.email} - Role: ${u.role}`)
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
