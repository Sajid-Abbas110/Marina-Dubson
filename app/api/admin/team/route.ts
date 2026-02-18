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

        const teamMembers = await prisma.teamMember.findMany({
            include: {
                assignedTasks: {
                    where: {
                        status: { not: 'COMPLETED' }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(teamMembers);
    } catch (error) {
        console.error('Error fetching team members:', error);
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
        const { firstName, lastName, email, phone, position, department } = body;

        if (!firstName || !lastName || !email || !position) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const teamMember = await prisma.teamMember.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                position,
                department,
                status: 'ACTIVE'
            }
        });

        return NextResponse.json(teamMember, { status: 201 });
    } catch (error) {
        console.error('Error creating team member:', error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
