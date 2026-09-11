'use client'

import React from 'react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import {
    MarinaHero,
    MarinaContact,
    MarinaTestimonials,
    MarinaCTA
} from '../components/landing/MarinaHomepage'

const practiceAreas = [
    'Personal injury',
    'Medical malpractice',
    'Fraud',
    'Breach-of-contract disputes',
    'Intellectual property lawsuits & patents',
    'Workplace harassment, discrimination & EEOC-related lawsuits',
    'Wrongful termination',
    'Complex litigation',
    'Government ethics & oversight hearings',
    'Financial-sector disputes',
    'Fashion & design arbitrations',
]

export default function NotableExperiencePage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="flex-1">
                <MarinaHero bgImage="/notable.png" />

                <section className="relative overflow-hidden bg-[#f4f6fa] py-20 md:py-28">
                    <div className="mx-auto max-w-5xl px-4 md:px-8">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="h-px w-24 bg-[#D4AF37]" />
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B]">Notable Experience</p>
                        </div>
                        <h2 className="mb-7 text-4xl uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                            <span className="font-normal">A Career Built on </span>
                            <span className="font-bold">Trust &amp; Precision</span>
                        </h2>
                        <p className="mb-6 text-[15px] font-medium leading-relaxed text-gray-600 md:text-base">
                            Since 2011, Marina has reported depositions, arbitrations, trials, and hearings across nearly every area of the legal field, including but not limited to:
                        </p>
                        <ul className="mb-12 grid grid-cols-1 gap-x-8 gap-y-2 text-base font-medium leading-relaxed text-gray-700 sm:grid-cols-2">
                            {practiceAreas.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-8">
                                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-gray-950">Public Record Proceedings</h3>
                                <p className="text-[15px] font-medium leading-relaxed text-gray-600">
                                    Select high-profile matters that are part of the public record — government ethics hearings, closely watched civil trials, and landmark workplace-discrimination cases — can be referenced and linked here on request.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#D4AF37]/30 bg-white p-8">
                                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-gray-950">Private &amp; Confidential Matters</h3>
                                <p className="text-[15px] font-medium leading-relaxed text-gray-600">
                                    Many of Marina&apos;s assignments — including complex mass-litigation and arbitration matters — remain confidential. In keeping with that confidentiality, these are described only in general terms, without identifying the parties involved.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <MarinaContact />
                <MarinaTestimonials />
                <div className="bg-[#f4f6fa] pb-16 pt-10">
                    <MarinaCTA title="Request a Court Reporter Today" buttonLabel="Request a Court Reporter" href="/contact" />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
