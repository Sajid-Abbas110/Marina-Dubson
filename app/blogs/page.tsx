import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { PublicHeader, PublicFooter } from '@/app/components/landing/PublicLayout'
import { MarinaCTA } from '@/app/components/landing/MarinaHomepage'

const blogCards = [
    {
        title: 'How We Accept Failure',
        slug: 'how-we-accept-failure',
        image: '/blog-1.png',
        date: 'March 3, 2024',
        excerpt: 'Practical lessons for turning operational setbacks into better litigation support systems.',
    },
    {
        title: 'Building Better Case Access',
        slug: 'building-better-case-access',
        image: '/blog-2.png',
        date: 'March 3, 2024',
        excerpt: 'How accessibility planning helps legal teams keep proceedings clear, compliant, and prepared.',
    },
    {
        title: 'Precision Under Pressure',
        slug: 'precision-under-pressure',
        image: '/blog-3.png',
        date: 'March 3, 2024',
        excerpt: 'A closer look at the habits that keep high-stakes reporting accurate when schedules move fast.',
    },
    {
        title: 'Avoiding Transcript Delays',
        slug: 'avoiding-transcript-delays',
        image: '/blog-4.png',
        date: 'March 3, 2024',
        excerpt: 'Simple coordination practices that help depositions, hearings, and trials stay on track.',
    },
    {
        title: 'Client Communication That Works',
        slug: 'client-communication-that-works',
        image: '/blog-5.png',
        date: 'March 3, 2024',
        excerpt: 'Clear intake, smart routing, and timely updates give every legal matter a steadier path.',
    },
    {
        title: 'Preparing Teams For Trial',
        slug: 'preparing-teams-for-trial',
        image: '/blog-6.png',
        date: 'March 3, 2024',
        excerpt: 'A practical checklist for aligning reporters, coordinators, and attorneys before trial day.',
    },
]

export default function BlogsPage() {
    return (
        <div className="min-h-screen bg-[#eef4fb] font-sans text-white">
            <PublicHeader />

            <main>
                <section className="relative flex min-h-[720px] items-center overflow-hidden bg-[#101820] lg:min-h-[860px]">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/blog-hero-bg.png"
                            alt="Marina Dubson legal insights"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 md:px-8">
                        <div className="ml-auto max-w-3xl text-white">
                            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl lg:text-[72px]">
                                Legal <span className="text-transparent [-webkit-text-stroke:1.4px_white]">& Access</span>
                                <br />
                                Perspectives
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm font-medium text-white/80 md:text-base">
                                Updates on accessibility laws and how they impact your clients.
                            </p>
                            <Link
                                href="/contact"
                                className="mt-16 inline-flex items-center justify-center rounded-md border border-white/80 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0051a8]"
                            >
                                Contact Marina
                            </Link>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/blog-hero-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#0051a8] pb-28 pt-16 md:pb-40 md:pt-24">
                    <div className="mx-auto max-w-7xl px-4 md:px-8">
                        <div className="mx-auto mb-12 max-w-2xl text-center">
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-white/70">Blog</p>
                            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
                                Marina Dubson
                                <br />
                                Blog
                            </h2>
                            <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-relaxed text-white/75">
                                Updates, best practices, and operational guidance for litigation teams, paralegals, and court reporting coordinators.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                            {blogCards.map((blog) => (
                                <article
                                    key={blog.slug}
                                    className="overflow-hidden rounded-lg border border-white/45 bg-[#0051a8] shadow-lg"
                                >
                                    <div className="relative aspect-[1.36] overflow-hidden bg-[#00458f]">
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover object-center"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold leading-snug text-white">{blog.title}</h3>
                                        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/45">
                                            <Clock className="h-3.5 w-3.5" />
                                            {blog.date}
                                        </div>
                                        <p className="mt-4 text-sm font-medium leading-relaxed text-white/80">
                                            {blog.excerpt}
                                        </p>
                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/70 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#0051a8]"
                                        >
                                            Learn More <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-14 text-center">
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-3 text-sm font-bold text-[#0051a8] shadow-md transition-colors hover:bg-[#eef4fb]"
                            >
                                See More <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="bg-[#eef4fb] leading-none">
                    <Image src="/blog-section-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                </div>

                <div className="bg-[#eef4fb] pb-8 pt-20">
                    <MarinaCTA />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
