'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import { MarinaContact, MarinaCTA } from '../components/landing/MarinaHomepage'

const practiceAreas = [
    'Civil Litigation',
    'Legal Consultation',
    'Family Law',
    'Contract Matters',
    'Business Law',
    'Dispute Resolution',
]

const principles = [
    'Clear communication from consultation through resolution',
    'Personal attention for every client and every matter',
    'Practical strategies grounded in preparation and care',
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f4f6fa] font-sans text-gray-900">
            <PublicHeader />

            <main>
                <section className="relative flex min-h-[720px] lg:min-h-[860px] items-center overflow-hidden bg-[#101820]">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/about-hero.png"
                            alt="Marina Dubson preparing legal documents"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 md:px-8">
                        <div className="ml-auto max-w-3xl text-white lg:pr-8">
                            <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-[76px]">
                                Dedicated{' '}
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Legal</span>
                                <br />
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Representation</span>
                                <br />
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Built On</span>{' '}
                                Trust & Integrity
                            </h1>
                            <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-white/90 md:text-lg">
                                Marina Dubson is committed to providing thoughtful legal guidance, strong advocacy, and personalized solutions for individuals, families, and businesses.
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
                                    Marina Dubson is a dedicated legal professional focused on helping clients navigate complex legal matters with confidence and clarity. Known for her client-centered approach, Marina works closely with every client to understand their unique situation, provide practical guidance, and develop strategies tailored to their goals.
                                </p>
                                <p>
                                    With a strong commitment to professionalism, integrity, and results, Marina believes every client deserves honest communication, personal attention, and dependable representation throughout every stage of the legal process.
                                </p>
                                <p>
                                    Her practice is built on trust, responsiveness, and a genuine commitment to protecting the interests of those she represents.
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
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Our Mission</p>
                            </div>
                            <h2 className="mb-7 max-w-2xl text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                                A Commitment To Advocacy & Client Success
                            </h2>
                            <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-white/90 md:text-base">
                                Marina&apos;s mission is to deliver high-quality legal representation while building lasting relationships based on trust, transparency, and respect. She is dedicated to helping clients make informed decisions and achieve the best possible outcomes with confidence and peace of mind.
                            </p>
                            <div className="space-y-4">
                                {principles.map((principle) => (
                                    <div key={principle} className="flex items-start gap-3 text-sm font-semibold text-white/95 md:text-base">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                        <span>{principle}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/contact"
                                className="mt-10 inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#0051a8] shadow-md transition-colors hover:bg-gray-100"
                            >
                                Get Legal Guidance
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#0051a8] pb-24 pt-12 text-white md:pb-32 md:pt-20">
                    <div className="relative z-20 mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:gap-20">
                        <div>
                            <div className="mb-4 flex items-center gap-4">
                                <div className="h-px w-24 bg-white/50" />
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Practice Areas</p>
                            </div>
                            <h2 className="mb-7 text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                                Legal Services Tailored To Your Needs
                            </h2>
                            <p className="mb-8 max-w-xl text-[15px] font-medium leading-relaxed text-white/90 md:text-base">
                                Marina Dubson offers professional legal support across a range of practice areas, helping clients resolve disputes, protect their interests, and move forward with confidence.
                            </p>
                            <div className="mb-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 text-sm font-bold sm:grid-cols-2 lg:grid-cols-3">
                                {practiceAreas.map((area) => (
                                    <Link
                                        key={area}
                                        href="/services"
                                        className="underline underline-offset-4 transition-colors hover:text-white/70"
                                    >
                                        {area}
                                    </Link>
                                ))}
                            </div>
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
                                alt="Marina Dubson traveling for legal representation"
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

                <MarinaContact />

                <div className="bg-[#f4f6fa] pb-16 pt-10">
                    <MarinaCTA />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
