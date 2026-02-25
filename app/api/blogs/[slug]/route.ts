import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const blog = await prisma.blogPost.findUnique({
            where: { slug: params.slug },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        })

        if (!blog || !blog.published) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
        }

        return NextResponse.json(blog)
    } catch (error: any) {
        console.error('Error fetching blog by slug:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
