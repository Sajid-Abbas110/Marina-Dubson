import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, hashPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const ADMIN_EMAIL = 'admin@marinadubson.com'
const ADMIN_PASSWORD = 'SecurePassword123!'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = loginSchema.parse(body)

        // ─── Admin Bootstrap ────────────────────────────────────────────────────
        // If logging in with the default admin credentials, ensure the admin user
        // actually exists in the database so foreign keys work across the app.
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Try to find existing admin user
            let adminUser = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })

            if (!adminUser) {
                // First time: create the admin user in DB so all FK references resolve
                console.log('[AUTH] Admin user not found in DB — creating bootstrap admin...')
                adminUser = await prisma.user.create({
                    data: {
                        email: ADMIN_EMAIL,
                        password: await hashPassword(ADMIN_PASSWORD),
                        firstName: 'Marina',
                        lastName: 'Dubson',
                        role: 'ADMIN',
                    }
                })
                console.log('[AUTH] Bootstrap admin created with ID:', adminUser.id)
            }

            const token = generateToken({
                userId: adminUser.id,
                id: adminUser.id,
                email: adminUser.email,
                role: adminUser.role,
                firstName: adminUser.firstName
            })

            return NextResponse.json({
                token,
                user: {
                    id: adminUser.id,
                    email: adminUser.email,
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                    role: adminUser.role,
                    avatar: adminUser.avatar,
                },
            })
        }

        // ─── Standard DB Authentication ─────────────────────────────────────────
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json({ error: 'Auth failed' }, { status: 401 })
        }

        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: 'Auth failed' }, { status: 401 })
        }

        const token = generateToken({
            userId: user.id,
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName
        })

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'System busy. Please try again.' }, { status: 500 })
    }
}
