export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import prisma from '@/lib/prisma'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import { MarinaCTA } from '../components/landing/MarinaHomepage'

export const metadata: Metadata = {
    title: "Marina Dubson's Résumé | NYC Court Reporter Credentials",
    description: "View Marina Dubson's professional résumé — court reporting experience, credentials, and background as a New York City stenographic court reporter.",
}

export default async function ResumePage() {
    let resume = null
    try {
        resume = await prisma.document.findFirst({
            where: { category: 'RESUME' },
            orderBy: { createdAt: 'desc' },
        })
    } catch (error) {
        console.error('Failed to load resume document:', error)
    }

    return (
        <div className="min-h-screen bg-[#f4f6fa] font-sans text-gray-900">
            <PublicHeader />

            <main>
                <section className="bg-[#0B0B0C] pb-16 pt-32 md:pt-40">
                    <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#D9C035]">Marina Dubson</p>
                        <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
                            Résumé
                        </h1>
                    </div>
                </section>

                <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
                    {resume ? (
                        <div className="overflow-hidden rounded-2xl border border-[#D9C035]/30 bg-white shadow-lg">
                            <div className="flex flex-col items-center gap-6 p-10 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D9C035]/10 text-[#B8860B]">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <p className="text-sm font-medium text-gray-600">
                                    Marina&apos;s current résumé is available below.
                                </p>
                                <a
                                    href={resume.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center rounded-md bg-[#D9C035] px-8 py-4 text-sm font-bold uppercase tracking-widest text-black shadow-md transition-colors hover:bg-[#B8860B]"
                                >
                                    View / Download Résumé
                                </a>
                            </div>
                            {resume.fileType?.includes('pdf') && (
                                <iframe src={resume.fileUrl} className="h-[80vh] w-full border-t border-gray-100" title="Marina Dubson Résumé" />
                            )}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                            <p className="text-sm font-medium text-gray-500">
                                Marina&apos;s résumé isn&apos;t available for download just yet — please reach out directly and she&apos;ll be happy to send it over.
                            </p>
                        </div>
                    )}
                </section>

                <div className="bg-[#f4f6fa] pb-16 pt-4">
                    <MarinaCTA />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
