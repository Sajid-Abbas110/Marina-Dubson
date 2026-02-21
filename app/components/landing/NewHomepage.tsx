'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Globe, Clock, ShieldCheck, Newspaper } from 'lucide-react'
import Image from 'next/image'

export function HomepageHero() {
    return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
                    alt="Courthouse Hero"
                    fill
                    className="object-cover brightness-[0.4]"
                    priority
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none italic">
                    Court Reporting for<br />Complex Litigation
                </h1>
                <p className="text-sm md:text-lg font-medium max-w-2xl mx-auto text-white/90">
                    Precision. Speed. Reliability. We provide unmatched stenographic services for the legal community worldwide, ensuring every word is captured with absolute accuracy.
                </p>
                <div className="pt-4">
                    <Link href="/services" className="bg-[#0071c5] hover:bg-[#0051a8] text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest text-xs transition-all shadow-xl">
                        Learn How We Help
                    </Link>
                </div>
            </div>
        </section>
    )
}

export function WhoWeAre() {
    const cards = [
        {
            title: 'Our Vision',
            desc: 'To set the gold standard in legal transcription services through technological innovation.',
            img: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Our Mission',
            desc: 'Providing law firms and government agencies with surgical accuracy and elite service protocols.',
            img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80'
        },
        {
            title: 'Our Stories',
            desc: 'A legacy of excellence covering thousands of high-stakes proceedings across North America.',
            img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80'
        }
    ]

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                <h2 className="text-[#a89100] text-xs font-black uppercase tracking-[0.4em] mb-4">About Us</h2>
                <h3 className="text-3xl md:text-4xl font-black text-[#1a1a1a] uppercase italic mb-16">Who We Are</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {cards.map((card, i) => (
                        <div key={i} className="space-y-6 group">
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg border border-gray-100 relative">
                                <Image
                                    src={card.img}
                                    alt={card.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h4 className="text-2xl font-black text-[#1a1a1a] uppercase italic">{card.title}</h4>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed italic">{card.desc}</p>
                            <Link href="/about" className="inline-block border-2 border-gray-200 px-8 py-3 rounded font-black text-[10px] uppercase tracking-widest hover:bg-[#a89100] hover:text-white hover:border-[#a89100] transition-all">
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function SolutionsSection() {
    return (
        <section className="relative py-32 overflow-hidden flex items-center">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=1920&q=80"
                    alt="Solutions BG"
                    fill
                    className="object-cover brightness-[0.3]"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-6">
                <h2 className="text-[#a89100] text-xs font-black uppercase tracking-[0.4em]">Our Services</h2>
                <h3 className="text-4xl md:text-5xl font-black uppercase leading-none italic">
                    Court Reporting Solutions
                </h3>
                <p className="text-sm md:text-lg font-medium max-w-2xl mx-auto text-white/80 italic">
                    Certified stenographic nodes deployed for mission-critical legal contexts. We handle everything from standard depositions to complex arbitrations.
                </p>
                <div className="pt-4">
                    <button className="bg-[#0071c5] hover:bg-[#0051a8] text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest text-xs transition-all">
                        Read More
                    </button>
                </div>
            </div>
        </section>
    )
}

export function ServiceGrid() {
    const services = [
        {
            title: 'Court Reporting',
            img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Certified Transcript Delivery',
            img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80'
        },
        {
            title: 'Remote Depositions',
            img: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80'
        }
    ]

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="relative aspect-[3/4] group overflow-hidden rounded-3xl shadow-2xl">
                            <Image
                                src={s.img}
                                alt={s.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 text-white">
                                <h4 className="text-2xl font-black uppercase italic mb-4">{s.title}</h4>
                                <p className="text-xs text-white/70 italic mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
                                <ArrowRight className="h-6 w-6 text-[#0071c5] group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function BlogTeaser() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                    <div className="aspect-video overflow-hidden rounded-3xl shadow-xl relative">
                        <Image
                            src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80"
                            className="object-cover"
                            alt="Main Article"
                            fill
                        />
                    </div>
                    <h3 className="text-3xl font-black text-[#1a1a1a] uppercase italic leading-tight">
                        The Shift to Virtual Litigative Support Nodes: Best Practices for 2026.
                    </h3>
                    <p className="text-gray-500 font-medium italic leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>

                <div className="space-y-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-6 items-center group cursor-pointer">
                            <div className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-md relative">
                                <Image
                                    src={`https://images.unsplash.com/photo-${i === 1 ? '1589829545856-d10d557cf95f' : i === 2 ? '1505664194779-8beaceb93744' : '1450101499163-c8848c66ca85'}?auto=format&fit=crop&w=300&q=80`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-all duration-500"
                                    alt="Side Article"
                                />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-black text-[#1a1a1a] uppercase italic leading-tight transition-colors group-hover:text-[#0071c5]">
                                    Court Documentation Trends and Advanced Reporting Protocols.
                                </h4>
                                <p className="text-[#a89100] text-[10px] font-black uppercase tracking-widest">
                                    {20 + i} March, 2026
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function ContactSection() {
    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <h2 className="text-[#0071c5] text-xs font-black uppercase tracking-[0.4em] mb-4">Contact Us</h2>
                    <h3 className="text-5xl font-black text-[#1a1a1a] uppercase italic mb-16">Contact Us</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative">
                        <Image
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                            fill
                            className="object-cover"
                            alt="Contact"
                        />
                        <div className="absolute inset-0 bg-blue-900/10"></div>
                    </div>

                    <form className="space-y-8 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">First Name</label>
                                <input className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0071c5]/20 text-gray-900" placeholder="First Name" />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Last Name</label>
                                <input className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0071c5]/20 text-gray-900" placeholder="Last Name" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Email</label>
                                <input className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0071c5]/20 text-gray-900" placeholder="Your Email" />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Phone Number</label>
                                <input className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0071c5]/20 text-gray-900" placeholder="Phone Number" />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Zip Code</label>
                            <select className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0071c5]/20 text-gray-900 appearance-none">
                                <option>Select Your Zip Code</option>
                                <option>10001</option>
                                <option>10301</option>
                            </select>
                        </div>
                        <button className="w-full bg-[#0071c5] hover:bg-[#0051a8] text-white py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">
                            Join Now
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
