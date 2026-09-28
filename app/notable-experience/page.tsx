import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import { PublicHeader, PublicFooter } from '../components/landing/PublicLayout'
import {
    MarinaHero,
    MarinaContact,
    MarinaTestimonials,
    MarinaCTA
} from '../components/landing/MarinaHomepage'

export const metadata: Metadata = {
    title: 'Notable Experience | Marina Dubson Court Reporter',
    description: "A look at Marina Dubson's notable public-record proceedings, including SEC enforcement actions, state ethics hearings, and high-profile civil rights and employment litigation.",
}

type CaseCard = {
    title: string
    dateRange?: string
    description: string
    parties?: string
    sourceLabel?: string
    sourceHref?: string
    note?: string
}

type CaseCategory = {
    name: string
    cases: CaseCard[]
}

const publicRecordCategories: CaseCategory[] = [
    {
        name: 'Financial & Regulatory',
        cases: [
            {
                title: 'SEC v. Genesis Global Capital & Gemini Trust Company',
                dateRange: '2023–2026',
                description: 'Federal enforcement action over the Gemini Earn crypto-lending program; dismissed with prejudice in January 2026 following full investor recovery.',
                parties: 'SEC, Genesis Global Capital, Gemini Trust Company · U.S. District Court, S.D.N.Y.',
                sourceLabel: 'SEC press release',
                sourceHref: 'https://www.sec.gov/newsroom/press-releases/2023-7',
            },
            {
                title: 'New York State Commission on Ethics and Lobbying in Government (COELIG) — Annual Public Hearings',
                description: 'State ethics and lobbying oversight hearings before COELIG.',
                sourceLabel: 'COELIG official records',
                sourceHref: 'https://ethics.ny.gov/about-commission-ethics-and-lobbying-government-coelig',
            },
        ],
    },
    {
        name: 'Civil Rights & Employment Litigation',
        cases: [
            {
                title: 'Workplace Discrimination & Harassment Litigation',
                description: 'Civil and federal employment matters involving workplace discrimination and harassment claims, reported at the deposition and pre-trial stage.',
                sourceLabel: 'Background: EEOC overview of workplace discrimination litigation',
                sourceHref: 'https://www.eeoc.gov/',
            },
            {
                title: 'Workplace Misconduct Litigation Tied to the #MeToo Movement',
                dateRange: '2023–2024',
                description: 'Civil litigation involving workplace conduct claims at major media organizations, part of the broader wave of #MeToo-related litigation beginning in 2017.',
                sourceLabel: 'Background: news coverage of #MeToo-era litigation',
                sourceHref: 'https://www.cbsnews.com/news/fox-news-lawsuit-12-million-settlement-abby-grossberg-tucker-carlson-producer/',
            },
            {
                title: 'New York Child Victims Act Litigation',
                dateRange: 'Filed under NY CVA, effective 2019',
                description: "Civil litigation brought under New York's Child Victims Act (2019), which opened a one-year window for survivors of childhood sexual abuse to file suit against institutions, including religious and educational organizations.",
                sourceLabel: 'Background: overview of Child Victims Act litigation in New York',
                sourceHref: 'https://lawandcrime.com/rreed',
            },
        ],
    },
    {
        name: 'Financial Services Employment Litigation',
        cases: [
            {
                title: 'Financial Services Industry Employment Litigation',
                dateRange: '2012',
                description: 'Employment-related litigation involving financial services firms.',
                note: 'No public docket located under the originally supplied case name — listed as general category per client guidance.',
            },
        ],
    },
    {
        name: 'Immigration & Investment Litigation',
        cases: [
            {
                title: 'EB-5 Immigrant Investor Program Litigation',
                dateRange: '2025–2026',
                description: 'Class action litigation involving investors in the federal EB-5 Immigrant Investor Program.',
                note: 'Listed as general category — specific matter not yet confirmed by client.',
            },
        ],
    },
    {
        name: 'Fashion & Design Arbitrations',
        cases: [
            {
                title: 'Fashion & Retail Industry Arbitrations',
                description: 'Arbitration proceedings involving fashion and retail brands, including Norma Kamali, Danielle Nicole, and J. Crew.',
                note: 'Arbitrations are confidential by nature and generate no public docket — named only, no source link.',
            },
        ],
    },
]

const confidentialPracticeAreas = [
    'Complex commercial litigation — breach-of-contract, fraud, business disputes',
    'Intellectual property & patent matters — infringement and licensing disputes',
    'Personal injury & medical malpractice matters',
    'Wrongful termination and additional employment-related disputes',
    'Complex mass-litigation and class action matters',
]

function CaseCardItem({ item }: { item: CaseCard }) {
    return (
        <div className="rounded-2xl border border-[#D9C035]/30 bg-white p-6 flex flex-col gap-3">
            <div>
                <h4 className="text-base font-black uppercase tracking-tight text-gray-950 leading-snug">{item.title}</h4>
                {item.dateRange && (
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#B8860B]">{item.dateRange}</p>
                )}
            </div>
            <p className="text-[15px] font-medium leading-relaxed text-gray-600">{item.description}</p>
            {item.parties && (
                <p className="text-sm font-medium text-gray-500">{item.parties}</p>
            )}
            {item.sourceHref && (
                <a
                    href={item.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B8860B] hover:text-[#D9C035] transition-colors"
                >
                    {item.sourceLabel} <ExternalLink className="h-3.5 w-3.5" />
                </a>
            )}
            {item.note && (
                <p className="text-sm italic text-gray-400">{item.note}</p>
            )}
        </div>
    )
}

export default function NotableExperiencePage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <PublicHeader />

            <main className="flex-1">
                <MarinaHero bgImage="/notable.png" dividerImage="/services-hero-svg.png" />

                <section className="relative overflow-hidden bg-[#f4f6fa] py-20 md:py-28">
                    <div className="mx-auto max-w-6xl px-4 md:px-8">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="h-px w-24 bg-[#D9C035]" />
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B]">Notable Experience</p>
                        </div>
                        <h2 className="mb-7 text-4xl uppercase leading-none tracking-tight text-gray-950 md:text-5xl">
                            <span className="font-normal">A Career Built on </span>
                            <span className="font-bold">Trust &amp; Precision</span>
                        </h2>
                        <p className="mb-16 max-w-3xl text-[15px] font-medium leading-relaxed text-gray-600 md:text-base">
                            Since 2011, Marina has reported depositions, arbitrations, trials, and hearings across nearly every area of the legal field. Select high-profile matters that are part of the public record are referenced below; confidential assignments are described only by practice area.
                        </p>

                        <h3 className="mb-8 text-2xl font-black uppercase tracking-tight text-gray-950">Public Record Proceedings</h3>
                        <div className="space-y-12 mb-16">
                            {publicRecordCategories.map((category) => (
                                <div key={category.name}>
                                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">{category.name}</p>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {category.cases.map((item) => (
                                            <CaseCardItem key={item.title} item={item} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-[#D9C035]/30 bg-white p-8">
                            <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-gray-950">Private &amp; Confidential Matters</h3>
                            <p className="mb-6 text-[15px] font-medium leading-relaxed text-gray-600">
                                Many of Marina&apos;s assignments remain confidential. In keeping with that confidentiality, these are described only by practice area, without identifying the parties involved.
                            </p>
                            <ul className="grid grid-cols-1 gap-x-8 gap-y-2 text-base font-medium leading-relaxed text-gray-700 sm:grid-cols-2">
                                {confidentialPracticeAreas.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9C035]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <MarinaContact />
                <MarinaTestimonials />
                <div className="bg-[#f4f6fa] pb-16 pt-10">
                    <MarinaCTA title="Request a Court Reporter Today" buttonLabel="Request a Court Reporter" href="/contact" />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
