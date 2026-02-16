import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch users the current user has chatted with
        const sentTo = await prisma.message.findMany({
            where: { senderId: payload.userId },
            select: { recipientId: true },
            distinct: ['recipientId']
        })

        const receivedFrom = await prisma.message.findMany({
            where: { recipientId: payload.userId },
            select: { senderId: true },
            distinct: ['senderId']
        })

        const userIds = Array.from(new Set([
            ...sentTo.map(m => m.recipientId),
            ...receivedFrom.map(m => m.senderId)
        ]))

        const conversations = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                // Get the last message for each
                receivedMessages: {
                    where: { senderId: payload.userId },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                sentMessages: {
                    where: { recipientId: payload.userId },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        // Format to include last message and time
        const formatted = conversations.map(c => {
            const lastSent = c.receivedMessages[0]
            const lastReceived = c.sentMessages[0]
            const lastMsg = (!lastSent || (lastReceived && lastReceived.createdAt > lastSent.createdAt))
                ? lastReceived : lastSent

            return {
                id: c.id,
                name: `${c.firstName} ${c.lastName}`,
                email: c.email,
                role: c.role,
                lastMsg: lastMsg?.content || 'No messages yet',
                time: lastMsg ? lastMsg.createdAt : null
            }
        }).sort((a, b) => (b.time?.getTime() || 0) - (a.time?.getTime() || 0))

        return NextResponse.json({ conversations: formatted })
    } catch (error) {
        console.error('Fetch conversations error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
