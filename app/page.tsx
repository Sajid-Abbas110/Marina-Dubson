'use client'

import React from 'react'
import { PublicHeader, PublicFooter } from './components/landing/PublicLayout'
import { 
    MarinaHero, 
    MarinaAbout, 
    MarinaWhyChoose, 
    MarinaPracticeAreas, 
    MarinaContact, 
    MarinaTestimonials, 
    MarinaCTA 
} from './components/landing/MarinaHomepage'

export default function HomePage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="flex-1">
                <MarinaHero />
                <MarinaAbout />
                <MarinaWhyChoose />
                <MarinaPracticeAreas />
                <MarinaContact />
                <MarinaTestimonials />
                <MarinaCTA />
            </main>

            <PublicFooter />
        </div>
    )
}
