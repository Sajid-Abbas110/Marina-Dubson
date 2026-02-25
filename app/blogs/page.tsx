import Link from 'next/link'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { PublicTopBar, PublicHeader, PublicFooter } from '@/app/components/landing/PublicLayout'

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, '').trim()
}

export default async function BlogsPage() {
    const blogs = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: { firstName: true, lastName: true }
            }
        }
    })

    return (
        <div className="bg-white min-h-screen">
            <PublicTopBar />
            <PublicHeader />
            <main>
                <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
                <div className="mb-12">
                    <p className="text-[#0071c5] text-xs font-black uppercase tracking-[0.3em] mb-4">Insights</p>
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic text-[#1a1a1a] leading-tight">
                        Marina Dubson Blog
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm md:text-base text-slate-600 font-medium">
                        Updates, best practices, and operational guidance for litigation teams, paralegals, and court reporting coordinators.
                    </p>
                </div>

                {blogs.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No published blogs yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <article key={blog.id} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                <div className="p-6 space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0071c5]">
                                        {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                                    </p>
                                    <h2 className="text-xl font-black uppercase italic text-[#1a1a1a] leading-tight">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {blog.excerpt || stripHtml(blog.content).slice(0, 140)}
                                    </p>
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            {(blog.author?.firstName || '').trim()} {(blog.author?.lastName || '').trim()}
                                        </span>
                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#0071c5] hover:text-[#0051a8]"
                                        >
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                </section>
            </main>
            <PublicFooter />
        </div>
    )
}
