import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const tasks = await prisma.task.findMany({
            include: {
                assignedToUser: true,
                assignedToTeam: true,
                createdBy: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, priority, dueDate, assignedToId } = body;

        if (!title || !assignedToId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Determine if assignedToId is a TeamMember or User
        const [teamMember, user] = await Promise.all([
            prisma.teamMember.findUnique({ where: { id: assignedToId } }),
            prisma.user.findUnique({ where: { id: assignedToId } })
        ]);

        let assignedToType = user ? 'USER' : teamMember ? 'TEAM_MEMBER' : null;

        if (!assignedToType) {
            return NextResponse.json({ error: 'Assignee not found' }, { status: 404 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                assignedToUserId: user ? assignedToId : null,
                assignedToTeamId: teamMember ? assignedToId : null,
                assignedToType,
                createdById: payload.userId,
                status: 'PENDING'
            }
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
