const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Creating test messages...');

    const markUser = await prisma.user.findUnique({ where: { email: 'mark.lewis@example.com' } });
    const sannUser = await prisma.user.findUnique({ where: { email: 'sann.lewis@example.com' } });
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@marinadubson.com' } });

    if (!markUser || !sannUser || !adminUser) {
        console.error('Missing required seed data (User)');
        return;
    }

    // Admin to Reporter
    await prisma.message.create({
        data: {
            senderId: adminUser.id,
            recipientId: sannUser.id,
            content: 'Hello Sann, you have a new assignment: BK-001. Please review.',
            subject: 'New Assignment'
        }
    });

    // Reporter to Admin
    await prisma.message.create({
        data: {
            senderId: sannUser.id,
            recipientId: adminUser.id,
            content: 'Received. I will be there at 10 AM.',
            subject: 'Re: New Assignment'
        }
    });

    // Admin to Client
    await prisma.message.create({
        data: {
            senderId: adminUser.id,
            recipientId: markUser.id,
            content: 'Hello Mark, your booking BK-002 has been confirmed. Sann Lewis will be your reporter.',
            subject: 'Booking Confirmation'
        }
    });

    console.log('Test messages created successfully!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
