export const dynamic = 'force-dynamic'

import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { z } from 'zod'

const askSchema = z.object({
    question: z.string().min(1).max(1000),
    page: z.string().optional(),
})

type Bucket = 'admin' | 'private' | 'agency' | 'reporter'

type KbIntent = { id: string; roles: string[]; kw: string[]; a: string }
type Kb = { KB: KbIntent[]; OOS: string[]; ROLE_LABEL: Record<string, string> }

function bucketForRole(role: string, clientType?: string): Bucket {
    const r = (role || '').toUpperCase()
    if (['ADMIN', 'MANAGER', 'SUPER_ADMIN', 'STAFF'].includes(r)) return 'admin'
    if (r === 'REPORTER') return 'reporter'
    return clientType === 'AGENCY' ? 'agency' : 'private'
}

function normalize(t: string) {
    return ' ' + String(t).toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim() + ' '
}

// Reads the SAME file the client widget loads (public/technical-support/technical-support-kb.js)
// so there's only one place — the content team's KB file — that ever needs editing.
function loadKb(): Kb {
    const filePath = path.join(process.cwd(), 'public', 'technical-support', 'technical-support-kb.js')
    const code = fs.readFileSync(filePath, 'utf-8')
    const sandboxModule: { exports: Partial<Kb> } = { exports: {} }
    const context = vm.createContext({ module: sandboxModule, window: undefined })
    vm.runInContext(code, context, { filename: filePath })
    return sandboxModule.exports as Kb
}

async function answerDataOwn(email?: string | null): Promise<string> {
    if (!email) return 'I couldn\'t find your account record — try <span class="ts-ref">Dashboard</span> instead.'

    const contact = await prisma.contact.findUnique({ where: { email } })
    if (!contact) return 'I couldn\'t find your account record — try <span class="ts-ref">Dashboard</span> instead.'

    const [nextBooking, unpaidInvoices, documentCount] = await Promise.all([
        prisma.booking.findFirst({
            where: { contactId: contact.id, bookingDate: { gte: new Date() } },
            orderBy: { bookingDate: 'asc' },
        }),
        prisma.invoice.findMany({
            where: { contactId: contact.id, status: { not: 'PAID' } },
            select: { total: true },
        }),
        prisma.document.count({ where: { contactId: contact.id } }),
    ])

    const balance = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0)

    const nextLine = nextBooking
        ? `Your next booking is on <strong>${nextBooking.bookingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong> (status: <strong>${nextBooking.bookingStatus}</strong>).`
        : "You don't have any upcoming bookings right now."
    const balanceLine = balance > 0
        ? `You have <strong>$${balance.toFixed(2)}</strong> outstanding across ${unpaidInvoices.length} invoice${unpaidInvoices.length === 1 ? '' : 's'}.`
        : "You're all paid up — no outstanding balance."
    const docsLine = `You have <strong>${documentCount}</strong> document${documentCount === 1 ? '' : 's'} on file.`

    return `${nextLine} ${balanceLine} ${docsLine} See <span class="ts-ref">My Bookings</span>, <span class="ts-ref">Rates</span> and <span class="ts-ref">My Documents</span> for details.`
}

async function logAsk(userId: string, result: 'ok' | 'declined' | 'none', intent: string | null) {
    try {
        await prisma.dataAccessLog.create({
            data: {
                userId,
                resource: 'ASSISTANT_QUERY',
                resourceId: intent || result,
                action: 'ASK',
                success: result !== 'declined',
                failureReason: result === 'declined' ? 'out_of_scope' : undefined,
            },
        })
    } catch (e) {
        console.error('[assistant] failed to write audit log', e)
    }
}

export async function POST(request: NextRequest) {
    try {
        // The security boundary: role is re-derived here from the verified session,
        // never trusted from the client (the widget deliberately doesn't send it).
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { question, page } = askSchema.parse(body)

        const role = bucketForRole(payload.role, payload.clientType)
        const { KB, OOS, ROLE_LABEL } = loadKb()
        const q = normalize(question)

        // 1) out-of-scope guardrail (non-admin)
        if (role !== 'admin') {
            const hit = OOS.some((phrase) => q.indexOf(' ' + phrase + ' ') !== -1 || q.indexOf(phrase) !== -1)
            if (hit) {
                await logAsk(payload.userId, 'declined', null)
                return NextResponse.json({
                    answer: `I can only help with your own <strong>${ROLE_LABEL[role]}</strong> account and records — I can't share other clients', agencies' or system-wide data. If you need that, the admin can help via <span class="ts-ref">Messages</span>.`,
                    declined: true,
                    intent: null,
                })
            }
        }

        // 2) score role-eligible intents — same algorithm as the client's scriptedAnswer()
        let best: KbIntent | null = null
        let bestScore = 0
        const pk = (page || '').toLowerCase()
        for (const it of KB) {
            if (!it.roles.includes(role)) continue
            let sc = 0
            for (const w of it.kw) {
                if (q.indexOf(' ' + w + ' ') !== -1 || q.indexOf(w) !== -1) sc += w.split(' ').length > 1 ? 2 : 1
            }
            if (sc > 0 && pk && it.id.indexOf(pk.replace(/\s+/g, '')) !== -1) sc += 0.5
            if (sc > bestScore) { bestScore = sc; best = it }
        }

        if (!best || bestScore < 1) {
            await logAsk(payload.userId, 'none', null)
            return NextResponse.json({
                answer: "I can only answer questions about the Marina Dubson portal, and only from your own records — so I don't have that one. Try a suggestion below, or reach a person via <span class=\"ts-ref\">Messages</span>.",
                declined: false,
                intent: null,
            })
        }

        // 3) data-aware upgrade: the KB's own placeholder for "my next booking / my balance /
        // my documents" — answer it for real, scoped to the caller's own Contact record.
        let answer = best.a
        if (best.id === 'data-own' && (role === 'private' || role === 'agency')) {
            answer = await answerDataOwn(payload.email)
        }

        await logAsk(payload.userId, 'ok', best.id)
        return NextResponse.json({ answer, declined: false, intent: best.id })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('Assistant ask error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
