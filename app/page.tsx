'use client'

import React from 'react'
import { PublicTopBar, PublicHeader, PublicFooter } from './components/landing/PublicLayout'
import { HomepageHero, WhoWeAre, SolutionsSection, ServiceGrid, BlogTeaser, ContactSection } from './components/landing/NewHomepage'

export default function HomePage() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <PublicTopBar />
            <PublicHeader />

            <main className="flex-1">
                <HomepageHero />
                <WhoWeAre />
                <SolutionsSection />
                <ServiceGrid />
                <BlogTeaser />
                <ContactSection />
            </main>

            <PublicFooter />
        </div>
    )
}
