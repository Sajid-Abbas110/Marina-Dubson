import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { zohoCRM } from '@/lib/zoho-crm'
import { z } from 'zod'

const messageSchema = z.object({
    content: z.string().min(1),
    recipientId: z.string().optional(),
    bookingId: z.string().optional(),
    contactId: z.string().optional(),
})

export async function GET(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: payload.id },
                    { recipientId: payload.id }
                ]
            },
            include: {
                sender: {
                    select: { firstName: true, lastName: true, role: true }
                },
                recipient: {
                    select: { firstName: true, lastName: true, role: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error('Fetch messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const data = messageSchema.parse(body)

        // If client or reporter is sending, find an admin if recipientId not provided
        let recipientId = data.recipientId
        if (!recipientId && (payload.role === 'CLIENT' || payload.role === 'REPORTER')) {
            const admin = await prisma.user.findFirst({
                where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }
            })
            recipientId = admin?.id
        }

        if (!recipientId) {
            return NextResponse.json({ error: 'Recipent not found' }, { status: 400 })
        }

        const message = await prisma.message.create({
            data: {
                senderId: payload.id,
                recipientId: recipientId,
                content: data.content,
                contactId: data.contactId || (payload.role === 'CLIENT' ? undefined : undefined), // Set if known
                // subject can be added if needed
            }
        })

        // Requirement 8.2: Log message in CRM
        try {
            // Find the contact associated with this client
            const user = await prisma.user.findUnique({
                where: { id: payload.id }
            })

            if (user) {
                // Look up contact by email since User and Contact share the email field
                const contact = await prisma.contact.findUnique({
                    where: { email: user.email }
                })

                if (contact) {
                    const contactIdInCRM = JSON.parse(contact.notes || '{}').zohoCRMContactId
                    if (contactIdInCRM) {
                        await zohoCRM.addNote(contactIdInCRM, 'Contacts', `[Portal Message] ${payload.firstName || 'User'}: ${data.content}`)
                    }
                }
            }
        } catch (crmError) {
            console.error('Failed to log message to CRM:', crmError)
            // Don't fail the message creation if CRM logging fails
        }

        return NextResponse.json(message, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Send message error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
