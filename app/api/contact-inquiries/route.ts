export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { z } from 'zod'

const inquirySchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(1),
    source: z.string().optional(),
})

// Public endpoint: anyone submitting the site's contact / request-coverage forms lands here.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = inquirySchema.parse(body)

        const inquiry = await prisma.contactInquiry.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName || null,
                email: data.email,
                phone: data.phone || null,
                message: data.message,
                source: data.source || null,
            },
        })

        return NextResponse.json({ id: inquiry.id }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Create contact inquiry error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Admin-only endpoint: list submitted inquiries for the admin inbox.
export async function GET(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        const inquiries = await prisma.contactInquiry.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ inquiries })
    } catch (error) {
        console.error('Fetch contact inquiries error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
