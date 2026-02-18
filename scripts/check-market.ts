import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const marketJobs = await prisma.booking.findMany({
        where: { isMarketplace: true }
    })
    console.log(`Marketplace jobs count: ${marketJobs.length}`)
    marketJobs.forEach(j => {
        console.log(`- ${j.bookingNumber}: Status ${j.bookingStatus}`)
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
