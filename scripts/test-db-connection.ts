import { PrismaClient } from '@prisma/client'

async function main() {
    const prisma = new PrismaClient()
    try {
        await prisma.$connect()
        console.log('✅ Successfully connected to the database.')
        const userCount = await prisma.user.count()
        console.log(`📊 Current User Count: ${userCount}`)
    } catch (error) {
        console.error('❌ Failed to connect to the database:')
        console.error(error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
