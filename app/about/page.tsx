'use client'

import React from 'react'
import { PublicTopBar, PublicHeader, PublicFooter } from '../components/landing/PublicLayout'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <PublicTopBar />
            <PublicHeader />

            <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
                        alt="About Hero"
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-black text-white uppercase italic">About Us</h1>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-32">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-black text-[#1a1a1a] uppercase italic">Our Stories</h2>
                            <p className="text-gray-500 font-medium italic leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
                                <img
                                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80`}
                                    className="w-full h-full object-cover"
                                    alt="Story"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <PublicFooter />
        </div>
    )
}
