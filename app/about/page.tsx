'use client'

import React from 'react'
import { PublicTopBar, PublicHeader, PublicFooter } from '../components/landing/PublicLayout'

export default function AboutPage() {
    const stories = [
        {
            title: 'Our Story',
            text: 'Marina Dubson Stenographic Services was built to deliver dependable court reporting for law firms handling complex matters. Our team combines technical precision with responsive service so attorneys can focus on strategy, not transcript uncertainty.',
            img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Our Process',
            text: 'Every assignment follows a disciplined workflow: confirmation, scheduling checks, proceedings support, and secure transcript delivery. This structure helps clients reduce rework, improve timeline predictability, and maintain clean records.',
            img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Our Commitment',
            text: 'We partner with legal teams as an operations extension. From single depositions to high-volume calendars, we prioritize communication, consistency, and accuracy across every stage of the engagement.',
            img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80'
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
                        alt="About Hero"
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-black text-white uppercase italic">About Us</h1>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-32">
                {stories.map((story, i) => (
                    <div key={story.title} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-black text-[#1a1a1a] uppercase italic">{story.title}</h2>
                            <p className="text-gray-500 font-medium italic leading-relaxed">
                                {story.text}
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
                                <img
                                    src={story.img}
                                    className="w-full h-full object-cover"
                                    alt={story.title}
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
