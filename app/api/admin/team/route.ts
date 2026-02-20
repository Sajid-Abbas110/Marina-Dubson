import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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
                    where: { status: { not: 'COMPLETED' } }
                }
            },
            orderBy: { createdAt: 'desc' }
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
        const { firstName, lastName, email, phone, position, department, avatar, password } = body;

        if (!firstName || !lastName || !email || !position) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if email already in use
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use by another account' }, { status: 400 });
        }

        // If a password is given, create User account so team member can log in
        let linkedUserId: string | null = null;
        if (password && password.length >= 6) {
            const hashed = await bcrypt.hash(password, 12);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashed,
                    firstName,
                    lastName,
                    role: 'STAFF',
                    avatar: avatar || null,
                }
            });
            linkedUserId = newUser.id;
        }

        // Create TeamMember — store the linked userId in bio field
        const teamMember = await prisma.teamMember.create({
            data: {
                firstName,
                lastName,
                email,
                phone: phone || null,
                position,
                department: department || 'Operations',
                status: 'ACTIVE',
                avatar: avatar || null,
                bio: linkedUserId ? `userId:${linkedUserId}` : null,
            }
        });

        return NextResponse.json({
            ...teamMember,
            hasLogin: !!linkedUserId,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating team member:', error);
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
