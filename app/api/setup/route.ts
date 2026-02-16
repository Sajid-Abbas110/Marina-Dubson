import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        // Find or create admin
        const adminEmail = 'admin@marinadubson.com'
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        })

        if (!existingAdmin) {
            const hashedPassword = await hashPassword('SecurePassword123!')
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    firstName: 'Marina',
                    lastName: 'Dubson',
                    role: 'ADMIN'
                }
            })
            return NextResponse.json({ message: 'Admin portal login initialized successfully.', email: adminEmail })
        }

        return NextResponse.json({ message: 'Admin portal is active.', email: adminEmail })
    } catch (error) {
        console.error('Setup error:', error)
        return NextResponse.json({ error: 'System busy. Please ensure your database is connected.', details: String(error) }, { status: 500 })
    }
}
