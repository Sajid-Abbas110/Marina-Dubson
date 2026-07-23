'use client'

import React from 'react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import {
    MarinaHero,
    MarinaServicesGrid,
    MarinaContact,
    MarinaTestimonials,
    MarinaCTA
} from '../components/landing/MarinaHomepage'

export default function NotableExperiencePage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="flex-1">
                <MarinaHero bgImage="/notable.png" />
                <MarinaServicesGrid dark={false} />
                <MarinaContact />
                <MarinaTestimonials />
                <div className="bg-[#f4f6fa] pb-16 pt-10">
                    <MarinaCTA title="Request a Court Reporter Today" buttonLabel="Book A Consultation" href="/contact" />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
