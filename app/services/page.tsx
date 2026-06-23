'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Accessibility, ClipboardList } from 'lucide-react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import { MarinaCTA } from '../components/landing/MarinaHomepage'

const serviceTags = {
    reporting: ['Depositions', 'Arbitrations', 'Hearings', 'Trials'],
    cart: ['Remote', 'Hybrid', 'On-Site'],
}

const workflowSteps = [
    {
        number: '01',
        title: 'Select',
        text: 'Choose the proceeding type that aligns with your matter.',
    },
    {
        number: '02',
        title: 'Define',
        text: 'If it is unique, choose Other and provide the context, so our system opens a guided notes field automatically.',
    },
    {
        number: '03',
        title: 'Confirm',
        text: 'Our concierge team reviews your notes, matches precise professional expertise, and locks in your resources.',
    },
]

const addOns = [
    {
        title: 'Remote monitoring',
        text: 'Real-time status oversight with secure, instant alerts throughout your proceeding.',
    },
    {
        title: 'Expedited delivery',
        text: 'Certified transcripts and PDFs delivered within 24 hours of proceedings close.',
    },
    {
        title: 'Glossary support',
        text: 'Expert-managed terminology files ensuring perfect speaker and subject accuracy.',
    },
]

const addonTags = ['Confidential', 'Court-Ready', 'ADA Compliant']

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[#f4f6fa] font-sans text-gray-900">
            <PublicHeader />

            <main>
                <section className="relative flex min-h-[720px] lg:min-h-[860px] items-center overflow-hidden bg-[#101820]">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/services-hero-bg.png"
                            alt="Marina Dubson arriving for professional reporting services"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/20" />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 md:px-8">
                        <div className="ml-auto max-w-3xl text-white lg:pr-8">
                            <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-[76px]">
                                Precision-
                                <br />
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Engineered</span>
                                <br />
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Reporting And</span>
                                <br />
                                Accessibility.
                            </h1>
                            <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
                                Trusted legal intelligence and real-time communication access, customized to your specific proceedings and compliance standards.
                            </p>
                            <div className="mt-9">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md border border-white/70 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#0051a8]"
                                >
                                    Contact Marina
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/services-hero-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#f4f6fa] pb-24 pt-20 md:pb-32 md:pt-28">
                    <div className="mx-auto max-w-7xl px-4 md:px-8">
                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-px w-24 bg-[#0051a8]" />
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0051a8]">Our Services</p>
                        </div>

                        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
                            <article>
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-[#0051a8] text-[#0051a8]">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#0051a8]">
                                    Stenographic Reporting
                                </p>
                                <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                                    Certified & Court-Ready
                                </h2>
                                <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-gray-600">
                                    We eliminate the margin for error. Certified high-speed stenographers paired with a dedicated secondary editorial layer ensure your transcripts arrive ready for the record.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {serviceTags.reporting.map((tag) => (
                                        <span key={tag} className="rounded-md border border-[#0051a8] px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </article>

                            <article>
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-[#0051a8] text-[#0051a8]">
                                    <Accessibility className="h-6 w-6" />
                                </div>
                                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#0051a8]">
                                    ADA-Compliant CART
                                </p>
                                <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                                    Live Captioning & Access
                                </h2>
                                <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-gray-600">
                                    Precision-engineered accessibility. Remote, hybrid, or on-site communication access backed by specialized terminology management and secure high-fidelity delivery.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {serviceTags.cart.map((tag) => (
                                        <span key={tag} className="rounded-md border border-[#0051a8] px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/our-mission-services-area-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="overflow-hidden bg-[#0051a8] text-white">
                    <div className="relative mx-auto grid min-h-[640px] w-[90%] max-w-7xl grid-cols-1 overflow-hidden py-20 md:grid-cols-2 lg:min-h-[680px] lg:py-24">
                        <div className="relative z-10">
                            <div className="max-w-[440px]">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="h-px w-24 bg-white/50" />
                                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/75">Intelligent Assignment Routing</p>
                            </div>
                            <h2 className="mb-6 text-[40px] font-black uppercase leading-[0.95] tracking-tight md:text-[48px] lg:text-[54px]">
                                Smart-Book Workflow
                            </h2>
                            <p className="mb-5 text-[14px] font-medium leading-relaxed text-white/90">
                                No two matters are the same. Our Smart-Booking logic ensures you are never forced into a silo.
                            </p>

                            <div className="mb-7 space-y-4">
                                {workflowSteps.map((step) => (
                                    <div key={step.number} className="flex gap-3">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/80 text-sm font-black">
                                            {step.number}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black">{step.title}</h3>
                                            <p className="mt-1 text-[13px] font-medium leading-relaxed text-white/80">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="mb-3 text-base font-black">Proceeding type</p>
                            <div className="flex flex-wrap gap-3">
                                {['Depositions', 'Arbitration', 'Trial', 'Other'].map((type) => (
                                    <span key={type} className="rounded-md border border-white/80 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.22em] text-white/90">
                                        {type}
                                    </span>
                                ))}
                            </div>
                            </div>
                        </div>

                        <div className="relative z-10 hidden items-end justify-center md:flex" aria-hidden="true">
                            <Image
                                src="/intelligent-services.png"
                                alt=""
                                width={1105}
                                height={1435}
                                className="h-auto w-full max-w-[437px] -translate-y-[8%] object-contain lg:max-w-[479px] lg:-translate-y-[10%]"
                                sizes="(max-width: 768px) 0px, (max-width: 1280px) 32vw, 479px"
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/3 bg-gradient-to-t from-[#0051a8] to-transparent" />
                    </div>

                    <div className="relative min-h-[760px] w-full overflow-hidden bg-[#0051a8] md:min-h-[823px]">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/optimized-services.png"
                                alt="Premium legal reporting add-ons"
                                fill
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0051a8]/10 via-[#0051a8]/5 to-[#0051a8]/20" />
                        </div>

                        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-start justify-end px-4 pt-10 md:min-h-[823px] md:px-8 md:pt-14">
                            <div className="w-full max-w-xl text-white md:w-1/2">
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-px w-24 bg-white/50" />
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Optimized Workflows</p>
                            </div>
                            <h2 className="mb-8 text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                                Premium Add-Ons
                            </h2>
                            <div className="space-y-5">
                                {addOns.map((addon) => (
                                    <div key={addon.title}>
                                        <h3 className="text-base font-black">{addon.title}</h3>
                                        <p className="mt-1 max-w-xl text-sm font-medium leading-relaxed text-white/80">{addon.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
                                {addonTags.map((tag) => (
                                    <span key={tag} className="text-sm font-bold underline underline-offset-4">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-[#f4f6fa] pb-16 pt-20">
                    <MarinaCTA />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
