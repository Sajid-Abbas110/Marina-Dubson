
'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import { MarinaCTA } from '../components/landing/MarinaHomepage'
import { Phone, Mail } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    })
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const res = await fetch('/api/contact-inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, source: '/contact' }),
            })
            if (!res.ok) throw new Error('Request failed')
            setStatus('sent')
            setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
            setTimeout(() => setStatus('idle'), 4000)
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <PublicHeader />

            <main>

                {/* ══════════════════════════════════════════════════════════
                    HERO — full-bleed image, text on left only
                ══════════════════════════════════════════════════════════ */}
                <section className="relative w-full h-[1024px] flex items-center overflow-hidden">
                    {/* background — same treatment as home hero */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/contact-us-hero.png"
                            alt="Marina Dubson at her desk"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent w-full md:w-2/3" />
                    </div>

                    {/* left-side text content */}
                    <div className="relative z-10 w-full mx-auto max-w-6xl px-4 md:px-8 pt-32 pb-28 md:pt-44 md:pb-36">
                        <div className="max-w-md">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1] text-white mb-6">
                                Request a{' '}
                                <span
                                    className="text-transparent"
                                    style={{ WebkitTextStroke: '2px white' }}
                                >
                                    Court
                                </span>
                                <br />
                                <span className="text-white">Reporter</span>
                            </h1>
                            <p className="text-sm md:text-base font-medium text-white/80 mb-10 leading-relaxed">
                                Whether you need Realtime reporting for tomorrow morning&apos;s deposition, CART services for an event, or long-term support for a series of hearings, Marina welcomes inquiries from attorneys, agencies, institutions, and schools. Every assignment is handled personally, and every inquiry receives a prompt response.
                            </p>
                            <a
                                href="#contact-form"
                                className="inline-flex items-center justify-center border border-white text-white px-7 py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-[#B8860B] transition-colors"
                            >
                                Request Coverage
                            </a>
                        </div>
                    </div>

                    {/* SVG divider — pinned to bottom of hero, z-10 (BEHIND the form card) */}
                    <div className="absolute bottom-0 left-0 w-full z-10">
                        <Image
                            src="/about-us-svg.png"
                            alt=""
                            width={1440}
                            height={80}
                            className="w-full h-auto block"
                            aria-hidden="true"
                        />
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    GOLD SECTION — Contact Info (left) + Form card (right, floated up)
                ══════════════════════════════════════════════════════════ */}
                <section id="contact-form" className="relative bg-[#D9C035]">
                    <div className="mx-auto max-w-6xl px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                            {/* LEFT — Contact Info (normal flow, starts after SVG) */}
                            <div className="pt-12 pb-12 text-gray-900">
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-10">
                                    Contact Info
                                </h2>
                                <div className="space-y-7">
                                    {/* Phone */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full border-2 border-gray-900/40 flex items-center justify-center shrink-0">
                                            <Phone className="h-4 w-4 text-gray-900" />
                                        </div>
                                        <a href="tel:+19174941858" className="text-base font-semibold text-gray-900 hover:underline">
                                            +1 (917) 494-1858
                                        </a>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full border-2 border-gray-900/40 flex items-center justify-center shrink-0">
                                            <Mail className="h-4 w-4 text-gray-900" />
                                        </div>
                                        <a href="mailto:MarinaDubson@gmail.com" className="text-base font-semibold text-gray-900 hover:underline break-all">
                                            MarinaDubson@gmail.com
                                        </a>
                                    </div>

                                </div>
                            </div>

                            {/* RIGHT — Form card floated UP over the SVG divider */}
                            <div className="relative z-20 lg:-mt-64 pb-12">
                                <form
                                    onSubmit={handleSubmit}
                                    className="bg-white rounded-2xl shadow-2xl p-7 md:p-9"
                                >
                                    <h3 className="text-lg font-black uppercase text-gray-900 mb-6">
                                        Get In Touch
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Name row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                className="w-full bg-white border border-[#B8860B] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30 text-gray-800 placeholder:text-gray-400 font-medium transition-all"
                                            />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Last Name"
                                                className="w-full bg-white border border-[#B8860B] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30 text-gray-800 placeholder:text-gray-400 font-medium transition-all"
                                            />
                                        </div>

                                        {/* Email + Phone row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full bg-white border border-[#B8860B] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30 text-gray-800 placeholder:text-gray-400 font-medium transition-all"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Num"
                                                className="w-full bg-white border border-[#B8860B] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30 text-gray-800 placeholder:text-gray-400 font-medium transition-all"
                                            />
                                        </div>

                                        {/* Message */}
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            placeholder="Message"
                                            className="w-full bg-white border border-[#B8860B] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#B8860B]/30 text-gray-800 placeholder:text-gray-400 font-medium transition-all resize-none"
                                        />

                                        {/* Submit */}
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={status === 'sending'}
                                                className="bg-[#D9C035] hover:bg-[#B8860B] text-gray-900 px-8 py-3 rounded-lg text-sm font-semibold transition-colors shadow-md disabled:opacity-60"
                                            >
                                                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : status === 'error' ? 'Try Again' : 'Submit'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    LOGO BANNER — replaces the previous map/home-address block
                ══════════════════════════════════════════════════════════ */}
                <section className="bg-[#D9C035] px-4 md:px-8 pb-16">
                    <div className="max-w-6xl mx-auto mb-10">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                            Need a Court Reporter for Your Next Proceeding?
                        </h2>
                    </div>
                    <div className="max-w-6xl mx-auto">
                        <div className="rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-black flex items-center justify-center p-10" style={{ height: 280 }}>
                            <Image
                                src="/latest-logo.png"
                                alt="Marina Dubson, Stenographer"
                                width={2286}
                                height={594}
                                className="h-auto w-full max-w-[420px] object-contain"
                            />
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                    SVG TRANSITION — blue → CTA
                ══════════════════════════════════════════════════════════ */}
                <div className="bg-[#f4f6fa] leading-none w-full">
                    <Image
                        src="/about-us-svg-inverted.png"
                        alt=""
                        width={1440}
                        height={80}
                        className="w-full h-auto block"
                        aria-hidden="true"
                    />
                </div>

                {/* ─── CTA BANNER ─────────────────────────────────────────── */}
                <div className="bg-[#f4f6fa] pb-16 pt-10">
                    <MarinaCTA title="Request a Court Reporter Today" buttonLabel="Request a Court Reporter" href="#contact-form" />
                </div>

            </main>

            <PublicFooter />
        </div>
    )
}
