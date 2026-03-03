/**
 * Seed two sample contacts + users: one PRIVATE and one AGENCY.
 * Run with: npx ts-node scripts/seed-clients.ts
 */

import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

async function main() {
    const entries = [
        {
            email: 'client@marinadubson.com',
            password: 'Client!234',
            role: 'CLIENT',
            firstName: 'Private',
            lastName: 'Client',
            clientType: 'PRIVATE',
            companyName: 'Private Test Co.'
        },
        {
            email: 'agency@marinadubson.com',
            password: 'Agency!234',
            role: 'CLIENT',
            firstName: 'Agency',
            lastName: 'Coordinator',
            clientType: 'AGENCY',
            companyName: 'Agency Test Co.'
        }
    ]

    for (const entry of entries) {
        const hashed = await hashPassword(entry.password)
        const user = await prisma.user.upsert({
            where: { email: entry.email },
            update: {
                password: hashed,
                firstName: entry.firstName,
                lastName: entry.lastName,
                role: entry.role,
                company: entry.companyName
            },
            create: {
                email: entry.email,
                password: hashed,
                firstName: entry.firstName,
                lastName: entry.lastName,
                role: entry.role,
                company: entry.companyName
            }
        })

        await prisma.contact.upsert({
            where: { email: entry.email },
            update: {
                firstName: entry.firstName,
                lastName: entry.lastName,
                companyName: entry.companyName,
                clientType: entry.clientType,
                status: 'Active',
            },
            create: {
                firstName: entry.firstName,
                lastName: entry.lastName,
                companyName: entry.companyName,
                email: entry.email,
                clientType: entry.clientType,
                status: 'Active',
            }
        })

        console.log(`Seeded ${entry.clientType} user -> ${user.email}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
