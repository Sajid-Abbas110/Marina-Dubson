import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
    try {
        const token = extractTokenFromHeader(request.headers.get('Authorization'))
        const payload = token ? verifyToken(token) : null

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { firstName, lastName, certification, company, avatar, bio, portfolio, availability } = body

        const updatedUser = await prisma.user.update({
            where: { id: payload.userId || payload.id },
            data: {
                firstName,
                lastName,
                certification,
                company,
                avatar,
                bio,
                portfolio,
                availability
            }
        })

        // Also update the linked contact if it exists
        try {
            await prisma.contact.update({
                where: { email: updatedUser.email },
                data: {
                    firstName,
                    lastName,
                    companyName: company
                }
            })
        } catch (contactError) {
            console.warn('Matching contact not found for profile update')
        }

        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
