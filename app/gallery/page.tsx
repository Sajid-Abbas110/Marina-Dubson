import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PublicHeader, PublicFooter } from '@/app/components/landing/PublicLayout'
import { MarinaCTA } from '@/app/components/landing/MarinaHomepage'

const imageFiles = [
    'JCP_MARINA-2675-20250508-Edit.jpg',
    'JCP_MARINA-2685-20250508-Edit.jpg',
    'JCP_MARINA-2750-20250508-Edit.jpg',
    'JCP_MARINA-2756-20250508-Edit.jpg',
    'JCP_MARINA-2758-20250508-Edit.jpg',
    'JCP_MARINA-2811-20250508.jpg',
    'JCP_MARINA-2815-20250508.jpg',
    'JCP_MARINA-2819-20250508.jpg',
    'JCP_MARINA-2833-20250508.jpg',
    'JCP_MARINA-2861-20250508.jpg',
    'JCP_MARINA-2882-20250508-Edit.jpg',
    'JCP_MARINA-2891-20250508.jpg',
    'JCP_MARINA-2905-20250508.jpg',
    'JCP_MARINA-2919-20250508.jpg',
    'JCP_MARINA-2957-20250508.jpg',
    'JCP_MARINA-2984-20250508.jpg',
    'JCP_MARINA-2987-20250508.jpg',
    'JCP_MARINA-2991-20250508.jpg',
    'JCP_MARINA-2997-20250508.jpg',
    'JCP_MARINA-3015-20250508.jpg',
    'JCP_MARINA-3049-20250508.jpg',
    'JCP_MARINA-3085-20250508.jpg',
    'JCP_MARINA-3087-20250508.jpg',
    'JCP_MARINA-3093-20250508.jpg',
]

const focusPositions = [
    'object-[50%_18%]',
    'object-[50%_18%]',
    'object-[52%_18%]',
    'object-[50%_12%]',
    'object-[50%_12%]',
    'object-[52%_35%]',
    'object-[50%_35%]',
    'object-[52%_42%]',
    'object-[48%_40%]',
    'object-[50%_42%]',
    'object-[50%_45%]',
    'object-[52%_45%]',
    'object-[50%_45%]',
    'object-[48%_45%]',
    'object-[52%_45%]',
    'object-[50%_40%]',
    'object-[48%_40%]',
    'object-[50%_40%]',
    'object-[50%_42%]',
    'object-[50%_40%]',
    'object-[50%_36%]',
    'object-[52%_36%]',
    'object-[48%_36%]',
    'object-[50%_36%]',
]

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-[#f4f6fa] font-sans text-gray-900">
            <PublicHeader />

            <main>
                <section className="relative flex min-h-[720px] lg:min-h-[860px] items-center overflow-hidden bg-[#101820]">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/gallery-hero.png"
                            alt="Marina Dubson professional gallery"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/30 to-black/65" />
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 md:px-8">
                        <div className="ml-auto max-w-2xl text-white">
                            <h1 className="text-4xl font-black uppercase leading-[0.98] tracking-tight md:text-6xl lg:text-[72px]">
                                Proof{' '}
                                <span className="text-transparent [-webkit-text-stroke:1.5px_white]">Of</span>
                                <br />
                                Precision.
                            </h1>
                            <p className="mt-7 max-w-xl text-base font-medium leading-relaxed text-white/90">
                                A visual look at how our Systems Control Room and professional teams execute high-stakes reporting and accessibility services in the field.
                            </p>
                            <div className="mt-9">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md border border-white/70 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[#0051a8]"
                                >
                                    Contact Marina
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-px leading-none">
                        <Image src="/gallery-her-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                    </div>
                </section>

                <section className="relative overflow-hidden bg-[#0051a8] pb-28 pt-20 md:pb-36 md:pt-28">
                    <div className="mx-auto max-w-7xl px-4 md:px-8">
                        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4 lg:gap-8">
                            {imageFiles.map((image, index) => (
                                <div
                                    key={image}
                                    className="group relative aspect-square overflow-hidden rounded-md bg-[#00458f] shadow-md"
                                >
                                    <Image
                                        src={`/${image}`}
                                        alt={`Marina Dubson gallery image ${index + 1}`}
                                        fill
                                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${focusPositions[index] || 'object-center'}`}
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        priority={index < 8}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="bg-[#f4f6fa] leading-none">
                    <Image src="/gallery-section-svg.png" alt="" width={1440} height={104} className="h-auto w-full object-cover" />
                </div>

                <div className="bg-[#f4f6fa] pb-16 pt-20">
                    <MarinaCTA />
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
