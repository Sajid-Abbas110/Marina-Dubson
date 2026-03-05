import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const search = searchParams.get('search')
        const clientType = searchParams.get('clientType')

        const where: any = {}
        if (role && role !== 'All Roles') {
            where.role = role.toUpperCase()
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }
        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                contact: {
                    select: {
                        clientType: true,
                        companyName: true,
                        email: true
                    }
                }
            },
        })

        // Attach contact by email for any users missing link, then filter by clientType if requested
        let hydratedUsers = users

        const missingContactEmails = users
            .filter(u => !u.contact)
            .map(u => u.email)

        if (missingContactEmails.length > 0) {
            const contacts = await prisma.contact.findMany({
                where: { email: { in: missingContactEmails } },
                select: { id: true, email: true, clientType: true, companyName: true }
            })

            hydratedUsers = users.map(u => {
                if (u.contact) return u
                const found = contacts.find(c => c.email === u.email)
                return found ? { ...u, contact: { clientType: found.clientType, companyName: found.companyName, email: found.email } } : u
            })
        }

        const filtered = clientType
            ? hydratedUsers.filter(u => u.contact?.clientType === clientType)
            : hydratedUsers

        return NextResponse.json({ users: filtered })
    } catch (error) {
        console.error('Fetch users error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
