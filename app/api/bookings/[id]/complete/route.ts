import { NextRequest, NextResponse } from 'next/server'
import { integrationOrchestrator } from '@/lib/integration-orchestrator'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate admin
        // const session = await getServerSession(authOptions)
        // if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
