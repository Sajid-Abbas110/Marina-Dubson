import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { z } from 'zod'

const serviceSchema = z.object({
    serviceName: z.string().min(1),
    category: z.enum(['COURT_REPORTING', 'LEGAL_PROCEEDINGS']),
    subService: z.enum(['DEPOSITIONS', 'HEARINGS', 'ARBITRATIONS', 'EUO', 'OTHER']),
    defaultMinimumFee: z.number().default(400),
    pageRate: z.number(),
    appearanceFeeRemote: z.number(),
    appearanceFeeInPerson: z.number(),
    realtimeFee: z.number(),
    expediteImmediate: z.number(),
    expedite1Day: z.number(),
    expedite2Day: z.number(),
    expedite3Day: z.number(),
    description: z.string().optional(),
    active: z.boolean().default(true),
})

// GET all services
export async function GET(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized access to registry rates blocked.' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const active = searchParams.get('active')

        const where: any = {}
        if (category) where.category = category
        if (active !== null) where.active = active === 'true'

        let services = await prisma.service.findMany({
            where,
            orderBy: { serviceName: 'asc' },
        })

        // Redact pricing for non-admin/staff
        if (payload.role !== 'ADMIN' && payload.role !== 'STAFF') {
            services = services.map((s: any) => ({
                id: s.id,
                serviceName: s.serviceName,
                category: s.category,
                subService: s.subService,
                description: s.description,
                active: s.active,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                // Pricing fields redacted as per Requirement 6.1
                pageRate: 'REDACTED',
                appearanceFeeRemote: 'REDACTED',
                appearanceFeeInPerson: 'REDACTED',
                defaultMinimumFee: 'REDACTED'
            }))
        }

        return NextResponse.json({ services })
    } catch (error) {
        console.error('Get services error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const data = serviceSchema.parse(body)

        const service = await prisma.service.create({
            data,
        })

        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Create service error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
