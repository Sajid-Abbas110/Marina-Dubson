'use client'

import React from 'react'
import { PublicTopBar, PublicHeader, PublicFooter } from '../components/landing/PublicLayout'

export default function ServicesPage() {
    const services = [
        {
            title: 'Premium Court Reporting',
            desc: 'Dedicated realtime stenographers for complex matters with exhibits and remote coordination. Proceeding coverage: Deposition, Arbitration / Mediation, Examination Under Oath.',
            bullets: ['Deposition', 'Arbitration / Mediation', 'Examination Under Oath'],
            img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=960&q=80'
        },
        {
            title: 'CART Services (Communication Access Real-Time Translation)',
            desc: 'Live verbatim captions delivered in real time so Deaf and hard-of-hearing participants can fully participate in any proceeding.',
            bullets: ['Remote or on-site captioning', 'Secure viewer links', 'Speaker-identification ready'],
            img: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2c?auto=format&fit=crop&w=960&q=80'
        }
    ]

    return (
        <div className="bg-white min-h-screen">
            <PublicTopBar />
            <PublicHeader />

            <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
                        alt="Services Hero"
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-black text-white uppercase italic">Services</h1>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {services.map((s) => (
                        <div key={s.title} className="space-y-6">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                                    <img
                                        src={s.img}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={s.title}
                                    />
                                </div>
                                <div className="space-y-3 text-center">
                                    <h4 className="text-xl font-black text-[#1a1a1a] uppercase italic">{s.title}</h4>
                                    <p className="text-gray-600 text-sm font-medium px-6 leading-relaxed">{s.desc}</p>
                                    {s.bullets && (
                                        <ul className="text-gray-500 text-xs font-semibold uppercase tracking-widest space-y-1">
                                            {s.bullets.map((b) => <li key={b}>• {b}</li>)}
                                        </ul>
                                    )}
                                </div>
                        </div>
                    ))}
                </div>

                <section className="max-w-5xl mx-auto bg-gray-50 rounded-[2rem] p-10 border border-gray-100">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-6">FAQ</h2>
                    <div className="space-y-4">
                        <h3 className="text-lg font-black uppercase tracking-tight">What is CART?</h3>
                        <p className="text-gray-600 leading-relaxed">
                            CART (Communication Access Real-Time Translation) delivers live, verbatim captions produced by a trained captioner. It lets Deaf and hard-of-hearing participants follow every spoken word during depositions, hearings, mediations, or meetings—on-site or remotely.
                        </p>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    )
}
