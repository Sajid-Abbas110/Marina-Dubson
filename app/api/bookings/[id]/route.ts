import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
    specialRequirements: z.string().optional(),
    reporterId: z.string().optional(),
    bookingStatus: z.string().optional(),
    isMarketplace: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookingId = params?.id
        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID missing' }, { status: 400 })
        }

        const body = await request.json()
        const data = updateSchema.parse(body)

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                invoice: true,
                contact: true,
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Lock edits once an invoice is finalized/paid
        const invoiceStatus = booking.invoice?.status?.toUpperCase()
        if (invoiceStatus === 'PAID' || invoiceStatus === 'FINALIZED') {
            return NextResponse.json({ error: 'Add-ons can no longer be edited after final invoice.' }, { status: 403 })
        }

        // Authorization: client contact owner or admin/staff
        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'STAFF', 'MANAGER'].includes((payload.role || '').toUpperCase())
        const isOwner = booking.contact?.email === payload.email
        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                specialRequirements: data.specialRequirements ?? booking.specialRequirements,
                reporterId: data.reporterId ?? booking.reporterId,
                bookingStatus: data.bookingStatus ?? booking.bookingStatus,
                isMarketplace: data.isMarketplace ?? booking.isMarketplace,
            },
            include: {
                reporter: true,
                service: true,
                invoice: true,
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Update booking error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
