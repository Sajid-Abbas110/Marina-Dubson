const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Team & Tasks Check ---');

    const team = await prisma.teamMember.findMany({
        include: {
            assignedTasks: true
        }
    });
    console.log(`Found ${team.length} team members:`);
    team.forEach(m => {
        console.log(`- ${m.firstName} ${m.lastName} (${m.id}) | Tasks: ${m.assignedTasks.length}`);
    });

    const tasks = await prisma.task.findMany({
        include: {
            assignedToUser: true,
            assignedToTeam: true
        }
    });
    console.log(`\nFound ${tasks.length} total tasks:`);
    tasks.forEach(t => {
        const assignee = t.assignedToTeam ? `TM:${t.assignedToTeam.firstName}` : t.assignedToUser ? `U:${t.assignedToUser.firstName}` : 'Unassigned';
        console.log(`- [${t.status}] ${t.title} | Assignee: ${assignee}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
