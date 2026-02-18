import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Database Integrity Check ---')

    const userCount = await prisma.user.count()
    console.log(`Users: ${userCount}`)

    const contactCount = await prisma.contact.count()
    console.log(`Contacts: ${contactCount}`)

    const bookingCount = await prisma.booking.count()
    console.log(`Bookings: ${bookingCount}`)

    const invoiceCount = await prisma.invoice.count()
    console.log(`Invoices: ${invoiceCount}`)

    const teamMemberCount = await prisma.teamMember.count()
    console.log(`Team Members: ${teamMemberCount}`)

    const taskCount = await prisma.task.count()
    console.log(`Tasks: ${taskCount}`)

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    console.log(`Admin User: ${admin ? admin.email : 'NOT FOUND'}`)

    if (admin) {
        console.log(`Admin ID: ${admin.id}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
