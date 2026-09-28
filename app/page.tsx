import type { Metadata } from 'next'
import { PublicHeader, PublicFooter } from './components/landing/PublicLayout'
import {
    MarinaHero,
    MarinaAbout,
    MarinaServicesGrid,
    MarinaWhyChoose,
    MarinaExperienceTeaser,
    MarinaContact,
    MarinaTestimonials,
    MarinaCTA
} from './components/landing/MarinaHomepage'

export const metadata: Metadata = {
    title: 'Marina Dubson | NYC Court Reporter — Realtime, Depositions & CART',
    description: 'Marina Dubson is a New York City stenographic court reporter delivering realtime reporting, deposition transcripts, arbitrations, hearings, and CART services with precision and speed.',
}

export default function HomePage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="flex-1">
                <MarinaHero />
                <MarinaAbout />
                <MarinaServicesGrid />
                <MarinaWhyChoose />
                <MarinaExperienceTeaser />
                <MarinaContact dark />
                <MarinaTestimonials dark />
                <div className="bg-[#0B0B0C] pb-16 pt-10">
                    <MarinaCTA title="Request a Court Reporter Today" buttonLabel="Request a Court Reporter" href="/contact" />
                </div>
            </main>

            <PublicFooter dark />
        </div>
    )
}
