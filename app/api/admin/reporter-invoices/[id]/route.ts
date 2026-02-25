import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(payload.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const invoice = await prisma.reporterInvoice.findUnique({
            where: { id: params.id },
            include: {
                reporter: true,
                booking: {
                    include: { service: true, contact: true }
                }
            }
        })

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        return NextResponse.json(invoice)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(payload.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { pageRate, appearanceFee, minimumFee, notes, status, paidAt } = body

        const updateData: any = {}
        if (pageRate !== undefined) updateData.pageRate = pageRate
        if (appearanceFee !== undefined) {
            updateData.appearanceFee = appearanceFee
            updateData.total = appearanceFee // recalculate total
        }
        if (minimumFee !== undefined) updateData.minimumFee = minimumFee
        if (notes !== undefined) updateData.notes = notes
        if (status !== undefined) updateData.status = status
        if (paidAt !== undefined) updateData.paidAt = new Date(paidAt)

        const updated = await prisma.reporterInvoice.update({
            where: { id: params.id },
            data: updateData,
            include: {
                reporter: true,
                booking: {
                    include: { service: true, contact: true }
                }
            }
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || !['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(payload.role || '')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.reporterInvoice.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
