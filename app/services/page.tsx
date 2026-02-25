'use client'

import React from 'react'
import { PublicTopBar, PublicHeader, PublicFooter } from '../components/landing/PublicLayout'

export default function ServicesPage() {
    const services = [
        {
            title: 'Court Reporting',
            desc: 'Certified court reporters for depositions, hearings, and examinations with precise record capture.',
            img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Certified Transcript Delivery',
            desc: 'Fast, secure transcript production with reliable formatting standards and delivery timelines.',
            img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80'
        },
        {
            title: 'Remote Depositions',
            desc: 'Hybrid and remote deposition support with stable communication protocols and exhibit coordination.',
            img: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80'
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

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-y-16">
                    {[1, 2, 3].map((row) => (
                        services.map((s, i) => (
                            <div key={`${row}-${i}`} className="space-y-6">
                                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                                    <img
                                        src={s.img}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={s.title}
                                    />
                                </div>
                                <div className="text-center space-y-2">
                                    <h4 className="text-xl font-black text-[#1a1a1a] uppercase italic">{s.title}</h4>
                                    <p className="text-gray-500 text-xs italic font-medium px-4">
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))
                    ))}
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
