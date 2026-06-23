'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, Globe, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react'

export function PublicTopBar() {
    return null; // Removed as per new design
}

export function PublicHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Blogs', href: '/blogs' },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (!menuOpen || typeof window === 'undefined') return

        const scrollY = window.scrollY
        const originalBodyOverflow = document.body.style.overflow
        const originalHtmlOverflow = document.documentElement.style.overflow
        const originalBodyPosition = document.body.style.position
        const originalBodyTop = document.body.style.top
        const originalHtmlHeight = document.documentElement.style.height

        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.documentElement.style.height = '100%'

        return () => {
            document.body.style.overflow = originalBodyOverflow
            document.documentElement.style.overflow = originalHtmlOverflow
            document.body.style.position = originalBodyPosition
            document.body.style.top = originalBodyTop
            document.documentElement.style.height = originalHtmlHeight
            window.scrollTo(0, scrollY)
        }
    }, [menuOpen])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617] shadow-lg py-4' : 'py-6'}`} style={!scrolled ? {backgroundColor: '#00000033'} : {}}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-auto">
                        <Link href="/" className="flex items-center shrink-0">
                            <h1 className="text-xl md:text-2xl font-black text-white leading-none uppercase tracking-wide">
                                Marina <span className="font-light italic">Dubson</span>
                            </h1>
                        </Link>
                    </div>

                    <nav className="hidden md:flex flex-wrap items-center justify-center gap-8 text-[13px] font-semibold text-white/90">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="transition-colors hover:text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center justify-end w-auto gap-4">
                        <Link href="/login" className="border border-white/30 text-white hover:border-white/80 hover:bg-white/5 px-5 py-2.5 rounded-md text-sm font-bold transition-all">
                            Login
                        </Link>
                        <Link href="/contact" className="bg-[#0051a8] text-white px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#003f8a] transition-colors shadow-md">
                            Contact us
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className="h-10 w-10 flex items-center justify-center text-white"
                        >
                            <span className="sr-only">Open navigation menu</span>
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
                        <div className="relative z-10 h-full w-full max-w-[300px] ml-auto overflow-y-auto bg-[#020617] px-6 py-8 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                                <h1 className="text-lg font-black text-white uppercase tracking-wide">
                                    Marina <span className="font-light italic">Dubson</span>
                               </h1>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                                >
                                    <span className="sr-only">Close navigation menu</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <nav className="flex flex-col gap-6 flex-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-sm font-bold uppercase tracking-widest text-white/90 transition-colors hover:text-white"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                            
                            <div className="pt-8 border-t border-white/10 flex flex-col gap-3">
                                <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full border border-white/20 text-white px-6 py-4 rounded-md text-sm font-bold hover:bg-white/5 transition-colors text-center">
                                    Login
                                </Link>
                                <Link href="/contact" onClick={() => setMenuOpen(false)} className="block w-full bg-[#0051a8] text-white px-6 py-4 rounded-md text-sm font-bold hover:bg-[#003f8a] transition-colors text-center shadow-md">
                                    Contact us
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export function PublicFooter() {
    return (
        <footer className="bg-[#eef1f6] text-gray-900 pt-16 pb-0">
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <div className="flex justify-center mb-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-black uppercase text-[#0051a8] italic tracking-tight mb-4">Marina Dubson</h2>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 max-w-lg mx-auto leading-relaxed">
                            A dedicated legal professional. We provide unmatched precision and reliability for every deposition, hearing, and trial worldwide.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-12">
                    <div className="space-y-6">
                        <h4 className="text-lg font-black uppercase tracking-widest text-gray-900">Pages</h4>
                        <div className="flex flex-col gap-3 text-sm font-bold text-gray-600">
                            <Link href="/" className="hover:text-[#0051a8] transition-colors">Home</Link>
                            <Link href="/services" className="hover:text-[#0051a8] transition-colors">Services</Link>
                            <Link href="/gallery" className="hover:text-[#0051a8] transition-colors">Gallery</Link>
                            <Link href="/blogs" className="hover:text-[#0051a8] transition-colors">Blogs</Link>
                            <Link href="/contact" className="hover:text-[#0051a8] transition-colors">Contact Us</Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-black uppercase tracking-widest text-gray-900">Services</h4>
                        <div className="flex flex-col gap-3 text-sm font-bold text-gray-600">
                            <Link href="/services" className="hover:text-[#0051a8] transition-colors">Service</Link>
                            <Link href="/gallery" className="hover:text-[#0051a8] transition-colors">Gallery</Link>
                            <Link href="/contact" className="hover:text-[#0051a8] transition-colors">Contact Us</Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-black uppercase tracking-widest text-gray-900">Social Links</h4>
                        <div className="flex flex-col gap-3 text-sm font-bold text-gray-600">
                            <a href="#" className="flex items-center gap-3 hover:text-[#0051a8] transition-colors group">
                                <div className="h-8 w-8 rounded-full bg-[#0051a8] text-white flex items-center justify-center group-hover:bg-[#003f8a]">
                                    <Facebook className="h-4 w-4" />
                                </div>
                                <span>Facebook</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 hover:text-[#0051a8] transition-colors group">
                                <div className="h-8 w-8 rounded-full bg-[#0051a8] text-white flex items-center justify-center group-hover:bg-[#003f8a]">
                                    <Twitter className="h-4 w-4" />
                                </div>
                                <span>Twitter</span>
                            </a>
                            <a href="#" className="flex items-center gap-3 hover:text-[#0051a8] transition-colors group">
                                <div className="h-8 w-8 rounded-full bg-[#0051a8] text-white flex items-center justify-center group-hover:bg-[#003f8a]">
                                    <Instagram className="h-4 w-4" />
                                </div>
                                <span>Instagram</span>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-black uppercase tracking-widest text-gray-900">Pages</h4>
                        <div className="flex flex-col gap-3 text-sm font-bold text-gray-600">
                            <Link href="/" className="hover:text-[#0051a8] transition-colors">Home</Link>
                            <Link href="/services" className="hover:text-[#0051a8] transition-colors">Services</Link>
                            <Link href="/gallery" className="hover:text-[#0051a8] transition-colors">Gallery</Link>
                            <Link href="/blogs" className="hover:text-[#0051a8] transition-colors">Blogs</Link>
                            <Link href="/contact" className="hover:text-[#0051a8] transition-colors">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 py-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Copyright © 2026 Marina Dubson. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
