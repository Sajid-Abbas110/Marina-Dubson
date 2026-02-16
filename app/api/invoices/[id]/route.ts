import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                contact: true,
                booking: {
                    include: {
                        service: true
                    }
                }
            }
        })

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        return NextResponse.json(invoice)
    } catch (error) {
        console.error('Fetch invoice error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        const body = await request.json()

        const invoice = await prisma.invoice.update({
            where: { id },
            data: body
        })

        return NextResponse.json(invoice)
    } catch (error) {
        console.error('Update invoice error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
