'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Globe, Linkedin, Menu, X } from 'lucide-react'

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
        { name: 'Notable Experience', href: '/notable-experience' },
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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0B0C] shadow-lg py-4' : 'py-6'}`} style={!scrolled ? {backgroundColor: '#00000033'} : {}}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-auto">
                        <Link href="/" className="flex items-center shrink-0">
                            <Image
                                src="/latest-logo.png"
                                alt="Marina Dubson, Stenographer"
                                width={2286}
                                height={594}
                                priority
                                className="h-9 md:h-11 w-auto object-contain"
                            />
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
                        <Link href="/contact" className="bg-[#D9C035] text-gray-900 px-6 py-2.5 rounded-md text-sm font-bold hover:bg-[#B8860B] transition-colors shadow-md">
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
                        <div className="relative z-10 h-full w-full max-w-[300px] ml-auto overflow-y-auto bg-[#0B0B0C] px-6 py-8 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                                <Image
                                    src="/latest-logo.png"
                                    alt="Marina Dubson, Stenographer"
                                    width={2286}
                                    height={594}
                                    className="h-8 w-auto object-contain"
                                />
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
                                <Link href="/contact" onClick={() => setMenuOpen(false)} className="block w-full bg-[#D9C035] text-gray-900 px-6 py-4 rounded-md text-sm font-bold hover:bg-[#B8860B] transition-colors text-center shadow-md">
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

export function PublicFooter({ dark = false }: { dark?: boolean }) {
    const heading = dark ? 'text-white' : 'text-gray-900'
    const linkCol = dark ? 'text-gray-400' : 'text-gray-600'
    return (
        <footer className={`pt-16 pb-0 ${dark ? 'bg-[#0B0B0C] text-white' : 'bg-[#eef1f6] text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                <div className="flex justify-center mb-12">
                    <div className="text-center">
                        <Image
                            src="/latest-logo.png"
                            alt="Marina Dubson, Stenographer"
                            width={2286}
                            height={594}
                            className="h-14 md:h-16 w-auto object-contain mx-auto mb-4"
                        />
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Certified stenographic court reporting for attorneys, agencies, and institutions across New York and nationwide.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-12">
                    <div className="space-y-6">
                        <h4 className={`text-lg font-black uppercase tracking-widest ${heading}`}>Pages</h4>
                        <div className={`flex flex-col gap-3 text-sm font-bold ${linkCol}`}>
                            <Link href="/" className="hover:text-[#D9C035] transition-colors">Home</Link>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">Services</Link>
                            <Link href="/gallery" className="hover:text-[#D9C035] transition-colors">Gallery</Link>
                            <Link href="/blogs" className="hover:text-[#D9C035] transition-colors">Blogs</Link>
                            <Link href="/contact" className="hover:text-[#D9C035] transition-colors">Contact Us</Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className={`text-lg font-black uppercase tracking-widest ${heading}`}>Services</h4>
                        <div className={`flex flex-col gap-3 text-sm font-bold ${linkCol}`}>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">Realtime Reporting</Link>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">Depositions</Link>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">Arbitrations &amp; Hearings</Link>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">CART Services</Link>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">Transcript Production</Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className={`text-lg font-black uppercase tracking-widest ${heading}`}>Social Links</h4>
                        <div className={`flex flex-col gap-3 text-sm font-bold ${linkCol}`}>
                            <a href="https://www.linkedin.com/in/marina-dubson-45a56323" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#D9C035] transition-colors group">
                                <div className="h-8 w-8 rounded-full bg-[#D9C035] text-gray-900 flex items-center justify-center group-hover:bg-[#B8860B]">
                                    <Linkedin className="h-4 w-4" />
                                </div>
                                <span>LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className={`text-lg font-black uppercase tracking-widest ${heading}`}>Pages</h4>
                        <div className={`flex flex-col gap-3 text-sm font-bold ${linkCol}`}>
                            <Link href="/" className="hover:text-[#D9C035] transition-colors">Home</Link>
                            <Link href="/services" className="hover:text-[#D9C035] transition-colors">Services</Link>
                            <Link href="/gallery" className="hover:text-[#D9C035] transition-colors">Gallery</Link>
                            <Link href="/blogs" className="hover:text-[#D9C035] transition-colors">Blogs</Link>
                            <Link href="/contact" className="hover:text-[#D9C035] transition-colors">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`border-t py-6 text-center ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Copyright © 2026 Marina Dubson. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
