'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Radio, ClipboardList, Gavel, Accessibility, FileCheck } from 'lucide-react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import { MarinaCTA } from '../components/landing/MarinaHomepage'

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
                            <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-[68px]">
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Court Reporting</span>{' '}
                                <span className="text-white">Services</span>{' '}
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">in New York</span>{' '}
                                <span className="text-white">City</span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
                                Marina Dubson provides a complete range of stenographic court reporting and Realtime services to attorneys, agencies, schools, and institutions throughout New York and nationwide. Every assignment is handled personally, start to finish.
                            </p>
                            <div className="mt-9">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md border border-white/70 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#0051a8]"
                                >
                                    Request a Court Reporter
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
                                    <Radio className="h-6 w-6" />
                                </div>
                                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#0051a8]">
                                    Realtime Reporting
                                </p>
                                <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                                    Instant Realtime Reporting for Legal Proceedings
                                </h2>
                                <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-gray-600">
                                    Read the testimony as it happens. Marina&apos;s Realtime court reporting streams an instant, scrolling transcript to your laptop or tablet during depositions, arbitrations, and trials — so you can mark, annotate, and build your case in the moment. Ideal for complex litigation where you can&apos;t wait for a transcript to catch a key admission.
                                </p>
                            </article>

                            <article>
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-[#0051a8] text-[#0051a8]">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#0051a8]">
                                    Deposition Reporting
                                </p>
                                <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                                    Certified Deposition Transcripts with Fast Turnaround
                                </h2>
                                <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-gray-600">
                                    Clean, certified deposition transcripts for civil and federal matters — personal injury, medical malpractice, fraud, breach of contract, intellectual property, employment and discrimination disputes, and complex litigation. Verbatim coverage with fast turnaround, including daily and immediate delivery.
                                </p>
                            </article>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/our-mission-services-area-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="overflow-hidden bg-[#0051a8] text-white">
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/services-attributions-and-hearings-bg.png"
                                alt=""
                                fill
                                className="object-cover object-right"
                            />
                        </div>
                        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 md:px-8 md:py-40 lg:py-48">
                            <div className="w-full md:w-3/5 lg:w-1/2">
                                <div className="mb-4 flex items-center gap-3">
                                    <Gavel className="h-6 w-6" />
                                    <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/75">Arbitrations &amp; Hearings</p>
                                </div>
                                <h2 className="mb-6 text-[32px] font-black uppercase leading-[0.95] tracking-tight md:text-[42px]">
                                    Reliable Coverage for Hearings &amp; Legal Proceedings
                                </h2>
                                <p className="text-[15px] font-medium leading-relaxed text-white/90">
                                    Dependable coverage for arbitrations, administrative hearings, and legal proceedings, including government and ethics hearings. Marina&apos;s courtroom background means she&apos;s comfortable with the pace and formality these settings demand.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 lg:gap-20 lg:py-28">
                        <div className="relative mx-auto w-full max-w-[480px] h-[420px] rounded-2xl overflow-hidden">
                            <Image
                                src="/services-cart-background.png"
                                alt="CART live captioning setup"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        <div>
                            <div className="mb-4 flex items-center gap-3">
                                <Accessibility className="h-6 w-6" />
                                <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-white/75">CART Services</p>
                            </div>
                            <h2 className="mb-6 text-[32px] font-black uppercase leading-[0.95] tracking-tight md:text-[42px]">
                                Realtime Captioning for Accessible Communication
                            </h2>
                            <p className="text-[15px] font-medium leading-relaxed text-white/90">
                                Communication Access Realtime Translation (CART) for schools, universities, and live events — providing instant on-screen captioning that makes spoken content accessible. A natural extension of Marina&apos;s Realtime expertise.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="relative bg-[#f4f6fa] pb-16 md:pb-24">
                    <div className="h-[220px] bg-[#0051a8]" />
                    <div className="relative z-10 mx-auto w-[90%] max-w-6xl -mt-[220px]">
                        <div className="relative min-h-[480px] overflow-hidden rounded-2xl flex items-center justify-center">
                            <Image
                                src="/services-transcript-banner.png"
                                alt="Certified transcript production"
                                fill
                                className="object-cover object-center"
                                sizes="90vw"
                            />
                            <div className="absolute inset-0 bg-[#0051a8]/80" />

                            <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 md:py-20 text-center text-white">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="h-px w-14 bg-white/60" />
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Transcript Production</p>
                                    <FileCheck className="h-5 w-5" />
                                </div>
                                <h2 className="mb-6 text-3xl md:text-4xl lg:text-[42px] uppercase leading-tight tracking-tight lg:tracking-[-0.02em]">
                                    <span className="font-bold">Certified </span>
                                    <span className="font-normal">Transcript Production from</span>
                                    <span className="font-bold"> Start </span>
                                    <span className="font-normal">to</span>
                                    <span className="font-bold"> Finish</span>
                                </h2>
                                <p className="mb-8 leading-relaxed font-medium text-[15px] text-white/90">
                                    Need more than coverage? Marina offers end-to-end transcript production — from rough draft through certified, formatted final transcript — when you want a single point of accountability for the whole record.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#0051a8] shadow-md transition-colors hover:bg-gray-100"
                                >
                                    Request a Court Reporter
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-[#f4f6fa] pb-16 pt-20">
                    <MarinaCTA title="Request a Court Reporter" buttonLabel="Request a Court Reporter" href="/contact" />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
