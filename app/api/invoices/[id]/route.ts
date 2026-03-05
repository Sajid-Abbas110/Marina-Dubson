import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'

const updateSchema = z.object({
    pages: z.number().optional(),
    originalCopies: z.number().optional(),
    additionalCopies: z.number().optional(),
    realtimeDevices: z.number().optional(),
    afterHoursCount: z.number().optional(),
    waitTimeCount: z.number().optional(),
    hasRough: z.boolean().optional(),
    hasVideographer: z.boolean().optional(),
    hasInterpreter: z.boolean().optional(),
    hasExpert: z.boolean().optional(),
    notes: z.string().optional(),
    status: z.string().optional()
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || !['ADMIN', 'MANAGER', 'SUPER_ADMIN', 'STAFF'].includes((payload.role || '').toUpperCase())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const invoiceId = params.id
        const body = await request.json()
        const data = updateSchema.parse(body)

        const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        const updated = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                ...data
            }
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Update invoice error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
