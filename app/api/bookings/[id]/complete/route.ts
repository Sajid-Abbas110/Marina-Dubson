import { NextRequest, NextResponse } from 'next/server'
import { integrationOrchestrator } from '@/lib/integration-orchestrator'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate admin
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            console.error('Auth failed: No valid token payload')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userRole = payload.role?.toUpperCase() || ''
        if (userRole !== 'ADMIN' && userRole !== 'MANAGER' && userRole !== 'SUPER_ADMIN') {
            console.error(`Auth failed: Insufficient role '${userRole}'`)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const id = params.id
        const billingData = await request.json()

        // Trigger the Final Automation Flow
        const result = await integrationOrchestrator.generateFinalInvoice(id, billingData)

        return NextResponse.json({
            success: true,
            message: 'Job completed and invoice generated successfully.',
            invoiceId: result.localInvoice.id
        })
    } catch (error: any) {
        console.error('Job completion error:', error)
        return NextResponse.json({ error: error.message || 'Failed to complete job' }, { status: 500 })
    }
}
