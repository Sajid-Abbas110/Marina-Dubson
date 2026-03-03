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
        if (clientType) {
            where.contact = { clientType }
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                contact: {
                    select: {
                        clientType: true,
                        companyName: true
                    }
                }
            },
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Fetch users error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
