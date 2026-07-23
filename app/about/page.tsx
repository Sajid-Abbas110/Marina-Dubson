'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import { MarinaContact, MarinaCTA } from '../components/landing/MarinaHomepage'

const notableExperience = [
    'Government ethics & oversight',
    'High-profile civil litigation',
    'Landmark workplace-discrimination cases',
    'Financial-sector disputes',
    'Fashion & design arbitrations',
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f4f6fa] font-sans text-gray-900">
            <PublicHeader />

            <main>
                <section className="relative flex min-h-[720px] lg:min-h-[860px] items-center overflow-hidden bg-[#101820]">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/about-us-hero-bg.png"
                            alt="Marina Dubson preparing legal documents"
                            fill
                            priority
                            className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/30 to-black/60" />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 md:px-8">
                        <div className="ml-auto max-w-3xl text-white lg:pr-8">
                            <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-[64px]">
                                <span className="text-white">New York </span>
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Court Reporter</span>{' '}
                                <span className="text-white">Specializing</span>{' '}
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">in Realtime,</span>{' '}
                                <span className="text-white">Depositions &amp; CART</span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
                                Meet Marina Dubson, a New York City stenographic court reporter specializing in Realtime, depositions, and CART. Former English educator, NYSCRA board member, trusted on high-profile cases.
                            </p>
                            <div className="mt-9">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md border border-white/70 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#0051a8]"
                                >
                                    Request Coverage
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/about-her-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#f4f6fa] pt-20 md:pt-28">
                    <div className="relative z-10 mx-auto grid max-w-7xl items-end gap-10 px-4 md:grid-cols-2 md:px-8">
                        <div className="pb-16 md:pb-28">
                            <div className="mb-3 flex items-center gap-4">
                                <div className="h-px w-24 bg-[#0051a8]" />
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0051a8]">About Us</p>
                            </div>
                            <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-tight text-gray-950 md:text-6xl">
                                Marina Dubson
                            </h2>
                            <div className="space-y-5 text-[15px] font-medium leading-relaxed text-gray-600 md:text-base">
                                <p>
                                    Marina Dubson is a stenographic court reporter based in New York City, specializing in Realtime reporting, arbitrations, depositions, and hearings. A former English Literature major and educator, Marina brought her exceptional command of English grammar, syntax, and phraseology into the legal world and never looked back.
                                </p>
                                <p>
                                    With years of experience in both courtroom and freelance court reporting settings, she delivers accurate verbatim transcripts across a wide spectrum of legal transcription services in New York. Marina has been a proud board member of the New York State Court Reporters Association (NYSCRA) since 2021.
                                </p>
                                <p>
                                    Accuracy, professionalism, and timeliness are the cornerstones of every assignment. Marina currently partners with court reporting agencies across the United States, and new requests are always welcome.
                                </p>
                            </div>
                            <Link
                                href="/services"
                                className="mt-9 inline-flex items-center justify-center rounded-md bg-[#0051a8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-[#003f8a]"
                            >
                                View Practice Areas
                            </Link>
                        </div>

                        <div className="relative mx-auto flex w-full max-w-[560px] justify-center self-end">
                            <Image
                                src="/about-us-section.png"
                                alt="Marina Dubson"
                                width={505}
                                height={636}
                                className="h-auto w-full object-contain object-bottom"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/about-us-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#0051a8] py-24 text-white md:py-32">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8 lg:gap-20">
                        <div className="relative order-2 mx-auto flex w-full max-w-[500px] justify-center md:order-1">
                            <Image
                                src="/our-mission.png"
                                alt="Marina Dubson seated in consultation"
                                width={432}
                                height={621}
                                className="h-auto w-full object-contain"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0051a8] to-transparent" />
                        </div>

                        <div className="order-1 md:order-2">
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-px w-24 bg-white/50" />
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Who I Am</p>
                            </div>
                            <h2 className="mb-7 max-w-2xl text-4xl uppercase leading-none tracking-tight md:text-6xl">
                                <span className="font-normal">A Commitment To </span>
                                <span className="font-bold">Advocacy </span>
                                <span className="font-normal">&amp; </span>
                                <span className="font-bold">Client Success</span>
                            </h2>
                            <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-white/90 md:text-base">
                                Marina&apos;s path to the steno machine was anything but typical — and that&apos;s exactly what sets her transcripts apart. She earned a B.A. in English and Education from Hunter College (CUNY), graduating with a 3.87 GPA alongside Phi Beta Kappa and Golden Key honors, then spent years teaching and tutoring writing before she ever sat down at a court reporting machine.
                            </p>
                            <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-white/90 md:text-base">
                                That background is her edge. Before she ever sat behind a steno machine, Marina was instructing Intermediate Expository Writing at Hunter College and tutoring grammar, comprehension, and ESL writing in the college&apos;s Reading and Writing Center. When she switched careers to court reporting, she carried that command of English grammar, syntax, and phraseology with her. It&apos;s the reason her transcripts read cleanly across the full spectrum of legal subject matter.
                            </p>
                            <Link
                                href="/notable-experience"
                                className="mt-2 inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#0051a8] shadow-md transition-colors hover:bg-gray-100"
                            >
                                View Marina&apos;s Full Résumé
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#0051a8] pb-24 pt-12 text-white md:pb-32 md:pt-20">
                    <div className="relative z-20 mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:gap-20">
                        <div>
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-px w-24 bg-white/50" />
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Professional Experience</p>
                            </div>
                            <h2 className="mb-7 text-4xl uppercase leading-none tracking-tight md:text-6xl">
                                <span className="font-bold">Experience </span>
                                <span className="font-normal">That Holds Up</span>
                                <span className="font-bold"> Under Pressure</span>
                            </h2>
                            <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-white/90 md:text-base">
                                Marina has worked in both courtroom and freelance settings. She served as a Senior Court Reporter in the Unified Court System at Manhattan Supreme Court, Criminal Term, taking down trials, hearings, and calendar calls. Before that, she spent six years as a Reporter/Stenographer at the Kings County District Attorney&apos;s Office, capturing Grand Jury testimony and submitting certified minutes — work that demands precision and discretion in equal measure.
                            </p>
                            <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-white/90 md:text-base">
                                Today she reports as an independent freelance court reporter for agencies across the country, covering depositions, arbitrations, trials, and hearings in matters that include personal injury, medical malpractice, fraud, breach of contract, intellectual property, wrongful termination, and workplace discrimination.
                            </p>
                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#0051a8] shadow-md transition-colors hover:bg-gray-100"
                            >
                                Explore Services
                            </Link>
                        </div>

                        <div className="relative mx-auto flex w-full max-w-[560px] justify-center">
                            <Image
                                src="/about-practice-area.png"
                                alt="Marina Dubson reporting in the field"
                                width={569}
                                height={709}
                                className="h-auto w-full object-contain"
                            />
                        </div>
                    </div>

                </section>

                <div className="bg-white leading-none">
                    <Image src="/practice-area-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                </div>

                <section id="notable-experience" className="relative overflow-hidden bg-[#f4f6fa] py-20 md:py-28">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8 lg:gap-20">
                        <div className="relative mx-auto flex w-full max-w-[550px] justify-center">
                            <Image
                                src="/about-notable-experience.png"
                                alt="Marina Dubson on a notable proceeding"
                                width={550}
                                height={573}
                                className="h-auto w-full rounded-2xl object-cover"
                            />
                        </div>

                        <div>
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-px w-24 bg-[#0051a8]" />
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0051a8]">Notable Experience</p>
                            </div>
                            <h2 className="mb-7 text-4xl uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                                <span className="font-normal">Trusted on </span>
                                <span className="font-bold">High-Profile </span>
                                <span className="font-normal">&amp; Sensitive </span>
                                <span className="font-bold">Proceedings</span>
                            </h2>
                            <ul className="mb-10 space-y-2 text-lg font-medium leading-relaxed text-gray-700">
                                {notableExperience.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md bg-[#0051a8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-[#003f8a]"
                                >
                                    Request Marina&apos;s Full Résumé
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md border border-[#0051a8] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#0051a8] transition-colors hover:bg-[#0051a8] hover:text-white"
                                >
                                    Request Coverage
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <MarinaContact />

                <div className="bg-[#f4f6fa] pb-16 pt-10">
                    <MarinaCTA />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
