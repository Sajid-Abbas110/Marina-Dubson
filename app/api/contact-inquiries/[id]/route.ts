export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
    status: z.enum(['NEW', 'READ', 'RESPONDED', 'ARCHIVED']),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const data = updateSchema.parse(body)

        const inquiry = await prisma.contactInquiry.update({
            where: { id: params.id },
            data: { status: data.status },
        })

        return NextResponse.json(inquiry)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Update contact inquiry error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
