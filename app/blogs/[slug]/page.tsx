import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import prisma from '@/lib/prisma'
import { PublicTopBar, PublicHeader, PublicFooter } from '@/app/components/landing/PublicLayout'

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const blog = await prisma.blogPost.findUnique({
        where: { slug: params.slug },
        include: {
            author: {
                select: { firstName: true, lastName: true }
            }
        }
    })

    if (!blog || !blog.published) {
        notFound()
    }

    return (
        <div className="bg-white min-h-screen">
            <PublicTopBar />
            <PublicHeader />
            <main>
                <article className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-20">
                <Link href="/blogs" className="text-[10px] font-black uppercase tracking-widest text-[#0071c5] hover:text-[#0051a8]">
                    Back to Blogs
                </Link>

                <header className="mt-6 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic text-[#1a1a1a] leading-tight">
                        {blog.title}
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        {(blog.author?.firstName || '').trim()} {(blog.author?.lastName || '').trim()}
                    </p>
                    {blog.excerpt && (
                        <p className="text-base text-slate-600 leading-relaxed">{blog.excerpt}</p>
                    )}
                </header>

                <div
                    className="prose prose-slate max-w-none mt-10 prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-p:text-slate-700 prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                </article>
            </main>
            <PublicFooter />
        </div>
    )
}
