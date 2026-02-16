import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        // Authenticate admin
        // const session = await getServerSession(authOptions)
        // if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const invoices = await prisma.invoice.findMany({
            include: {
                contact: true,
                booking: true
            },
            orderBy: {
                invoiceDate: 'desc'
            }
        })

        return NextResponse.json(invoices)
    } catch (error: any) {
        console.error('Fetch invoices error:', error)
        return NextResponse.json({ error: error.message || 'Failed to fetch invoices' }, { status: 500 })
    }
}
