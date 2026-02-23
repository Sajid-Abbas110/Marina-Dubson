import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const marketplaceJobs = await prisma.booking.findMany({
            where: {
                isMarketplace: true,
                bookingStatus: { notIn: ['COMPLETED', 'CANCELLED', 'DECLINED'] },
            },
            include: {
                service: true,
                bids: {
                    select: {
                        id: true,
                        reporterId: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ jobs: marketplaceJobs })
    } catch (error) {
        console.error('Fetch marketplace jobs error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
