import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
            include: {
                contact: true,
                service: true,
                reporter: true,
                user: true,
                invoice: true,
            }
        })

        if (!booking) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Booking detail error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Update a booking (status, marketplace toggle, reporter assignment, open state)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { bookingStatus, isMarketplace, reporterId, isOpened } = body || {}

        // Build update payload only for allowed fields
        const updateData: any = {}
        if (bookingStatus) updateData.bookingStatus = bookingStatus
        if (typeof isMarketplace === 'boolean') updateData.isMarketplace = isMarketplace
        if (typeof isOpened === 'boolean') updateData.isOpened = isOpened
        if (reporterId) updateData.reporterId = reporterId

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
        }

        // Authorization: Admin-like roles can edit any; others only their own bookings
        const adminRoles = ['ADMIN', 'MANAGER', 'STAFF', 'SUPER_ADMIN']
        const isAdmin = adminRoles.includes((payload.role || '').toUpperCase())

        if (!isAdmin) {
            const owns = await prisma.booking.findFirst({
                where: {
                    id: params.id,
                    OR: [{ userId: payload.userId }, { reporterId: payload.userId }]
                },
                select: { id: true }
            })

            if (!owns) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }
        }

        const updated = await prisma.booking.update({
            where: { id: params.id },
            data: updateData,
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Booking update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
