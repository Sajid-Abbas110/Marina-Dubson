import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)

    // EventSource cannot send Authorization headers, so we accept token via query param
    const tokenParam = searchParams.get('token')
    const authHeader = request.headers.get('Authorization')
    const rawToken = tokenParam ?? (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null)

    const payload = rawToken ? verifyToken(rawToken) : null

    if (!payload) {
        return new Response('data: {"type":"error","message":"Unauthorized"}\n\n', {
            status: 200, // Must be 200 for SSE; client handles error type
            headers: { 'Content-Type': 'text/event-stream' }
        })
    }

    const userId = payload.userId || (payload as any).id
    const recipientId = searchParams.get('recipientId')

    if (!userId) {
        return new Response('data: {"type":"error","message":"Invalid token"}\n\n', {
            status: 200,
            headers: { 'Content-Type': 'text/event-stream' }
        })
    }

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        start(controller) {
            let closed = false
            let lastChecked = Date.now() - 500 // small overlap on connect

            const send = (data: string) => {
                if (closed) return
                try {
                    controller.enqueue(encoder.encode(data))
                } catch {
                    closed = true
                }
            }

            // Confirm connection immediately
            send(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`)

            const poll = async () => {
                if (closed) return
                try {
                    const since = new Date(lastChecked)
                    lastChecked = Date.now()

                    const where: any = recipientId
                        ? {
                            OR: [
                                { senderId: userId, recipientId },
                                { senderId: recipientId, recipientId: userId },
                            ],
                            createdAt: { gte: since }
                        }
                        : {
                            OR: [
                                { senderId: userId },
                                { recipientId: userId }
                            ],
                            createdAt: { gte: since }
                        }

                    const newMessages = await prisma.message.findMany({
                        where,
                        include: {
                            sender: { select: { id: true, firstName: true, lastName: true, role: true } },
                            recipient: { select: { id: true, firstName: true, lastName: true, role: true } }
                        },
                        orderBy: { createdAt: 'asc' }
                    })

                    if (newMessages.length > 0) {
                        send(`data: ${JSON.stringify({ type: 'messages', messages: newMessages })}\n\n`)
                    }
                } catch (e: any) {
                    console.error('[SSE poll error]', e?.message)
                }
            }

            // Poll every 1.5 seconds - fast enough to feel instant, light on DB
            const pollInterval = setInterval(poll, 1500)

            // Keep-alive heartbeat every 20 seconds
            const heartbeatInterval = setInterval(() => {
                send(': heartbeat\n\n')
            }, 20000)

            // Clean up when client disconnects
            request.signal.addEventListener('abort', () => {
                closed = true
                clearInterval(pollInterval)
                clearInterval(heartbeatInterval)
                try { controller.close() } catch { }
            })
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
            'Access-Control-Allow-Origin': '*',
        }
    })
}
