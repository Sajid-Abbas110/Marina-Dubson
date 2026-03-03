import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
                contact: true,
                service: true,
                reporter: true,
                user: true,
                invoice: true,
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Booking detail error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
