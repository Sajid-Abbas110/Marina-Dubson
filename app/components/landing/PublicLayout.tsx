'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, Globe, Facebook, Twitter, Instagram, Briefcase, LogIn, Menu, X } from 'lucide-react'

export function PublicTopBar() {
    return (
        <div className="hidden md:block bg-[#a89100] text-white px-4 md:px-8 py-3">
            <div className="max-w-7xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-[11px] md:text-[12px]">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6 flex-1 min-w-0">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Phone className="h-4 w-4" />
                        <span className="font-semibold tracking-[0.08em]">Mobile: + (917) 494-1859</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Mail className="h-4 w-4" />
                        <span className="font-semibold tracking-[0.08em]">Email: MarinaDubson@gmail.com</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 md:pl-4">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-[12px] font-semibold transition-all group"
                    >
                        <LogIn className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        <span>Login</span>
                    </Link>
                    <span className="text-[12px] font-semibold tracking-[0.12em] uppercase">English</span>
                </div>
            </div>
        </div>
    )
}

export function PublicHeader() {
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact Us', href: '/contact' },
    ]

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
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center justify-between gap-3 w-full md:w-auto">
                        <Link href="/" className="flex items-center gap-3 shrink-0">
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center bg-[#0051a8] text-white">
                                <Globe className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl font-black text-[#0051a8] leading-none uppercase italic">Marina Dubson</h1>
                                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Stenographic Services</p>
                            </div>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                        >
                            <span className="sr-only">Open navigation menu</span>
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="hidden md:flex flex-wrap items-center justify-center gap-4 text-[10px] md:text-[12px] font-black uppercase tracking-[0.18em] md:tracking-[0.2em] text-[#1a1a1a]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="transition-colors hover:text-[#a89100] tracking-[0.12em]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="w-full md:w-auto flex justify-center md:justify-end">
                        <div className="flex w-full max-w-[360px] items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 shadow-sm">
                            <input
                                type="text"
                                placeholder="Search"
                                className="flex-1 rounded-full border border-transparent bg-transparent px-4 py-2 text-[11px] font-medium outline-none focus:border-[#0051a8]"
                            />
                            <button className="rounded-full bg-[#0051a8] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#003f8a]">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
                        <div className="relative z-10 h-full w-full max-h-screen overflow-y-auto overscroll-y-none bg-white px-6 py-8">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-[#1a1a1a]">Navigation</p>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                                >
                                    <span className="sr-only">Close navigation menu</span>
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                                <div className="flex items-center gap-3 text-sm font-semibold text-[#1a1a1a]">
                                    <Phone className="h-4 w-4 text-[#a89100]" />
                                    <span>+ (917) 494-1859</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-semibold text-[#1a1a1a]">
                                    <Mail className="h-4 w-4 text-[#a89100]" />
                                    <span>MarinaDubson@gmail.com</span>
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                                    <Link
                                        href="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#a89100] text-[#a89100] font-black uppercase text-xs tracking-[0.3em] transition-colors hover:bg-[#a89100] hover:text-white"
                                    >
                                        <LogIn className="h-3.5 w-3.5" />
                                        Login
                                    </Link>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]">English</span>
                                </div>
                            </div>
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-base font-black uppercase tracking-[0.4em] text-[#1a1a1a] border-b border-gray-200 pb-3 transition-colors hover:text-[#a89100]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export function PublicFooter() {
    return (
        <footer className="bg-[#020617] text-white pt-8 pb-0 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center bg-[#0071c5] text-white rounded-lg">
                                <Globe className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-black uppercase italic">Marina Dubson</h2>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed font-medium">
                            Elite stenographic services for complex litigation. We provide unmatched precision and reliability for every deposition, hearing, and trial worldwide.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold border-b border-white/20 pb-2 uppercase tracking-[0.2em]">Get In Touch</h4>
                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex items-start gap-3">
                                <Globe className="h-5 w-5 text-white/60 flex-shrink-0" />
                                <span>12A Saturn Lane, Staten Island, NY</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <Mail className="h-5 w-5 text-white/60 flex-shrink-0" />
                                <a href="mailto:MarinaDubson@gmail.com" className="hover:underline transition-all">MarinaDubson@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <Phone className="h-5 w-5 text-white/60 flex-shrink-0" />
                                <span>(917) 494-1859</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-lg font-bold border-b border-white/20 pb-2 uppercase tracking-[0.2em]">Follow Us</h4>
                        <div className="flex items-center gap-3">
                            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] transition-all group" title="Facebook">
                                <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] transition-all group" title="Twitter">
                                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] transition-all group" title="Instagram">
                                <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] transition-all group" title="Indeed">
                                <Briefcase className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-inner shadow-black/40 mb-6 md:mb-8">
                    <h4 className="text-lg font-black uppercase tracking-[0.3em] text-white">Subscribe Newsletter</h4>
                    <p className="text-sm text-white/80 font-medium italic mt-2">Join our list for protocol updates and litigation trends.</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="flex-1 rounded-full border border-white/30 bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/60 focus:border-white"
                        />
                        <button className="w-full sm:w-auto flex-shrink-0 rounded-full bg-[#a89100] px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#c5a012]">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#a89100] py-4 text-center mt-3 ">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/90">
                    Copyright © 2026 Marina Dubson. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
