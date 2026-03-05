import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        const token = extractTokenFromHeader(authHeader)
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            console.error('[Market API] Unauthorized access attempt')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const marketplaceJobs = await prisma.booking.findMany({
            where: {
                isMarketplace: true,
                bookingStatus: { notIn: ['COMPLETED', 'CANCELLED', 'DECLINED'] },
            },
            include: {
                service: true,
                contact: {
                    select: {
                        companyName: true,
                        firstName: true,
                        lastName: true
                    }
                },
            },
            orderBy: { createdAt: 'desc' }
        })

        console.log(`[Market API] Found ${marketplaceJobs.length} marketplace jobs for ${payload.email}`)

        return NextResponse.json({
            success: true,
            jobs: marketplaceJobs,
            bookings: marketplaceJobs
        })
    } catch (error) {
        console.error('Fetch marketplace jobs error:', error)
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
