import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { taskId: string } }
) {
    try {
        const id = params.taskId
        const { title, description, priority, status, dueDate } = await request.json()

        const updateData: any = {
            title,
            description,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        }

        // Only add completedAt if the status is COMPLETED
        if (status === 'COMPLETED') {
            updateData.completedAt = new Date()
        }

        const task = await prisma.task.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error('Update task error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { taskId: string } }
) {
    try {
        const id = params.taskId
        await prisma.task.delete({ where: { id } })
        return NextResponse.json({ message: 'Task deleted successfully' })
    } catch (error) {
        console.error('Delete task error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
