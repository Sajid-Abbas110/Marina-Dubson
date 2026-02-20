const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to database...');
        const userCount = await prisma.user.count();
        console.log('Connection successful!');
        console.log(`User count: ${userCount}`);

        const firstUser = await prisma.user.findFirst();
        console.log('First user:', firstUser ? firstUser.email : 'NONE');

    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
