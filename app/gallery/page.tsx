import React from 'react'
import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { PublicTopBar, PublicHeader, PublicFooter } from '@/app/components/landing/PublicLayout'

export const dynamic = 'force-dynamic';

export default function GalleryPage() {
    // Read the images from the public folder
    const publicDir = path.join(process.cwd(), 'public')
    const files = fs.readdirSync(publicDir)
    
    // Filter for common image formats
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <PublicTopBar />
            <PublicHeader />

            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-[#0051a8] uppercase italic tracking-tight">Image Gallery</h1>
                        <div className="mt-4 h-1 w-20 bg-[#a89100] mx-auto rounded-full" />
                        <p className="text-gray-500 mt-6 max-w-2xl mx-auto font-medium text-lg">
                            Explore our latest professional moments and visual assets.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {imageFiles.map((image, index) => (
                            <div key={index} className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <Image
                                    src={`/${image}`}
                                    alt={`Gallery visual ${index + 1}`}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    priority={index < 8}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0051a8]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        ))}
                    </div>

                    {imageFiles.length === 0 && (
                        <div className="text-center py-24 text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📸</span>
                            </div>
                            <p className="text-lg font-medium">No images uploaded yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
