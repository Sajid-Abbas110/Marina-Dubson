const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding team members...');

    const teamMembers = [
        {
            firstName: 'James',
            lastName: 'Logan',
            email: 'j.logan@md-elite.com',
            position: 'Operations Lead',
            department: 'Operations',
            status: 'ACTIVE'
        },
        {
            firstName: 'Sarah',
            lastName: 'Connor',
            email: 's.connor@md-elite.com',
            position: 'Client Relations',
            department: 'Client Relations',
            status: 'ACTIVE'
        }
    ];

    for (const m of teamMembers) {
        await prisma.teamMember.upsert({
            where: { email: m.email },
            update: m,
            create: m
        });
    }

    console.log('Seeding tasks...');
    const firstAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const firstTeam = await prisma.teamMember.findFirst({ where: { email: 'j.logan@md-elite.com' } });

    if (firstAdmin && firstTeam) {
        await prisma.task.create({
            data: {
                title: 'Review New Bookings',
                description: 'Check the queue for any urgent submissions.',
                priority: 'HIGH',
                status: 'PENDING',
                createdById: firstAdmin.id,
                assignedToTeamId: firstTeam.id,
                assignedToType: 'TEAM_MEMBER'
            }
        });
    }

    console.log('Seed complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
