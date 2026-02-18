import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🚀 INITIALIZING NETWORK PROTOCOL TEST...')

    // 1. Ensure Admin exists
    const admin = await prisma.user.upsert({
        where: { email: 'admin@marinadubson.com' },
        update: {},
        create: {
            email: 'admin@marinadubson.com',
            password: await bcrypt.hash('admin123', 12),
            firstName: 'Marina',
            lastName: 'Dubson',
            role: 'ADMIN',
        },
    })
    console.log('✅ Admin Node Synchronized')

    // 2. Ensure Mark Lewis (Client) exists
    const markLewis = await prisma.user.upsert({
        where: { email: 'mark.lewis@legal.com' },
        update: {},
        create: {
            email: 'mark.lewis@legal.com',
            password: await bcrypt.hash('client123', 12),
            firstName: 'Mark',
            lastName: 'Lewis',
            role: 'CLIENT',
        },
    })

    const markContact = await prisma.contact.upsert({
        where: { email: 'mark.lewis@legal.com' },
        update: {},
        create: {
            firstName: 'Mark',
            lastName: 'Lewis',
            email: 'mark.lewis@legal.com',
            clientType: 'ATTORNEY',
            companyName: 'Lewis & Associates',
        }
    })
    console.log('✅ Client Node Synchronized: Mark Lewis')

    // 3. Ensure Reporter exists
    const reporter = await prisma.user.upsert({
        where: { email: 'reporter@hub.com' },
        update: {},
        create: {
            email: 'reporter@hub.com',
            password: await bcrypt.hash('reporter123', 12),
            firstName: 'Sarah',
            lastName: 'Stenographer',
            role: 'REPORTER',
            certification: 'CSR-9822',
        },
    })
    console.log('✅ Reporter Node Synchronized')

    // 4. Create a Test Booking Request from Client
    const booking = await prisma.booking.create({
        data: {
            bookingNumber: 'BK-TEST-' + Math.floor(Math.random() * 10000),
            contactId: markContact.id,
            serviceId: 'seed-depositions', // From our service seed
            userId: admin.id,
            proceedingType: 'High-Stakes Deposition',
            bookingDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
            bookingTime: '10:00 AM',
            location: 'Manhattan Civil Court',
            appearanceType: 'IN_PERSON',
            bookingStatus: 'SUBMITTED',
            isMarketplace: true, // Push to marketplace immediately
        }
    })
    console.log(`✅ Test Booking Created: ${booking.bookingNumber}`)

    // 5. Simulate Reporter Bidding
    const bid = await prisma.bid.create({
        data: {
            bookingId: booking.id,
            reporterId: reporter.id,
            amount: 450.00,
            timeline: 'I am available and have clear transcripts ready within 24 hours.',
            status: 'PENDING'
        }
    })
    console.log(`✅ Reporter Bid Received for ${booking.bookingNumber}`)

    // 6. Admin accepts the bid -> Connection Made
    await prisma.$transaction([
        prisma.bid.update({
            where: { id: bid.id },
            data: { status: 'ACCEPTED' }
        }),
        prisma.booking.update({
            where: { id: booking.id },
            data: {
                reporterId: reporter.id,
                bookingStatus: 'ACCEPTED',
                isMarketplace: false
            }
        })
    ])
    console.log('🔗 NETWORK CONNECTION SOLVED: Reporter Sarah Stenographer assigned to Client Mark Lewis')

    // 7. Send initial transmission (Admin to Reporter)
    await prisma.message.create({
        data: {
            senderId: admin.id,
            recipientId: reporter.id,
            content: `Assignment confirmed for BK-${booking.bookingNumber.slice(-4)}. Client is expecting delivery by EOD after proceeding.`,
        }
    })
    console.log('📨 Communication Channel Initialized')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
