'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, Search, Globe, User, Menu, X, Facebook, Twitter, Instagram, Briefcase, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PublicTopBar() {
    return (
        <div className="bg-[#a89100] text-white py-2 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold tracking-wider">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>Mobile: + (917) 494-1859</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>Email: MarinaDubson@gmail.com</span>
                </div>
            </div>
            <div className="flex items-center gap-6 mt-2 md:mt-0">
                <Link
                    href="/login"
                    className="flex items-center gap-2 px-5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all group"
                >
                    <LogIn className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    <span>Login</span>
                </Link>
                <div className="flex items-center gap-1 cursor-pointer">
                    <span>English</span>
                </div>
            </div>
        </div>
    )
}

export function PublicHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Contact Us', href: '/contact' },
    ]

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center bg-[#0051a8] text-white">
                        <Globe className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-black text-[#0051a8] leading-none uppercase italic">Marina Dubson</h1>
                        <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Stenographic Services</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-[#a89100] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Search Bar */}
                    <div className="flex items-center ml-4 bg-[#f8f8f8] border border-gray-200 rounded-lg overflow-hidden h-10">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent px-4 text-xs font-medium outline-none w-40"
                        />
                        <button className="bg-[#444] text-white px-4 h-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
                            Search
                        </button>
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-[#1a1a1a]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-gray-100 p-6 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}

export function PublicFooter() {
    return (
        <footer className="bg-[#020617] text-white pt-16 pb-0 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
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
                    <h4 className="text-lg font-bold border-b border-white/20 pb-2">Get In Touch</h4>
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
                    <h4 className="text-lg font-bold border-b border-white/20 pb-2">Follow Us</h4>
                    <div className="flex items-center gap-3">
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] cursor-pointer transition-all group" title="Facebook">
                            <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] cursor-pointer transition-all group" title="Twitter">
                            <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] cursor-pointer transition-all group" title="Instagram">
                            <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0071c5] hover:border-[#0071c5] cursor-pointer transition-all group" title="Indeed">
                            <Briefcase className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-bold border-b border-white/20 pb-2">Subscribe Newsletter</h4>
                    <p className="text-sm text-white/80 font-medium italic">Join our list for protocol updates and litigation trends.</p>
                    <div className="space-y-3">
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full bg-white text-black px-4 py-3 rounded text-sm outline-none"
                        />
                        <button className="w-full bg-[#a89100] hover:bg-[#c5a012] text-white py-3 rounded text-xs font-black uppercase tracking-widest transition-all">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#a89100] py-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/90">
                    Copyright © 2026 Marina Dubson. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}
