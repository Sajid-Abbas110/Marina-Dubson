'use client'

import React from 'react'
import { LandingNavbar, LandingHero, LandingServices, LandingNewsletter, LandingContact, LandingChat } from './components/landing/LandingComponents'
import Footer from './components/Footer'

export default function HomePage() {
    return (
        <div className="bg-background min-h-screen">
            <LandingNavbar />

            <main>
                <LandingHero />
                <LandingServices />
                <LandingNewsletter />
                <LandingContact />
            </main>

            <Footer />
            <LandingChat />
        </div>
    )
}
