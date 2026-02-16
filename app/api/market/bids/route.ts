import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { z } from 'zod'

const bidSchema = z.object({
    bookingId: z.string(),
    amount: z.number().min(0),
    timeline: z.string().optional(),
    notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || payload.role !== 'REPORTER') {
            return NextResponse.json({ error: 'Only reporters can bid on jobs' }, { status: 403 })
        }

        const body = await request.json()
        const data = bidSchema.parse(body)

        // Check if job exists and is in marketplace
        const job = await prisma.booking.findUnique({
            where: { id: data.bookingId }
        })

        if (!job || !job.isMarketplace) {
            return NextResponse.json({ error: 'Job not available for bidding' }, { status: 400 })
        }

        // Check for existing bid
        const existingBid = await prisma.bid.findFirst({
            where: {
                bookingId: data.bookingId,
                reporterId: payload.userId
            }
        })

        if (existingBid) {
            return NextResponse.json({ error: 'You have already bid on this job' }, { status: 409 })
        }

        const bid = await prisma.bid.create({
            data: {
                bookingId: data.bookingId,
                reporterId: payload.userId,
                amount: data.amount,
                timeline: data.timeline,
                notes: data.notes
            }
        })

        return NextResponse.json(bid, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Submit bid error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'MANAGER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const bookingId = searchParams.get('bookingId')

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
        }

        const bids = await prisma.bid.findMany({
            where: { bookingId },
            include: {
                reporter: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        certification: true
                    }
                }
            },
            orderBy: { amount: 'asc' }
        })

        return NextResponse.json({ bids })
    } catch (error) {
        console.error('Fetch bids error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'MANAGER')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { bidId, status } = await request.json()

        if (!bidId || !status) {
            return NextResponse.json({ error: 'Bid ID and status required' }, { status: 400 })
        }

        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { booking: true }
        })

        if (!bid) {
            return NextResponse.json({ error: 'Bid not found' }, { status: 404 })
        }

        if (status === 'ACCEPTED') {
            // Accept this bid and decline others
            await prisma.$transaction([
                prisma.bid.update({
                    where: { id: bidId },
                    data: { status: 'ACCEPTED' }
                }),
                prisma.bid.updateMany({
                    where: {
                        bookingId: bid.bookingId,
                        id: { not: bidId }
                    },
                    data: { status: 'DECLINED' }
                }),
                prisma.booking.update({
                    where: { id: bid.bookingId },
                    data: {
                        reporterId: bid.reporterId,
                        bookingStatus: 'ACCEPTED',
                        isMarketplace: false // Close marketplace listing
                    }
                })
            ])
        } else {
            await prisma.bid.update({
                where: { id: bidId },
                data: { status }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update bid error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
