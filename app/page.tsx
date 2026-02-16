'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Shield,
    Zap,
    Globe,
    Briefcase,
    ArrowRight,
    ChevronRight,
    Sparkles,
    Fingerprint,
    Command,
    Terminal,
    Menu,
    X
} from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#00120d] text-white selection:bg-primary/30 font-poppins relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute top-0 left-0 w-full h-full dark-mesh opacity-40"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse-soft"></div>

            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 md:py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl px-6 py-3">
                    <div className="flex items-center gap-3 group">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white font-black text-lg md:text-xl shadow-2xl border border-white/20 transform group-hover:rotate-12 transition-transform duration-500">
                            MD
                        </div>
                        <span className="text-lg md:text-xl font-black tracking-widest text-white mt-1 hidden xs:block">MARINA DUBSON</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login" className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Login</Link>
                        <Link href="/register" className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20">Enroll Now</Link>
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Login</Link>
                        <button
                            className="p-2 text-white bg-white/10 rounded-lg"
                            onClick={() => {
                                const menu = document.getElementById('mobile-menu');
                                if (menu) menu.classList.toggle('hidden');
                            }}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div id="mobile-menu" className="hidden fixed inset-0 z-[60] bg-[#00120d]/98 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col h-full p-12">
                        <div className="flex justify-between items-center mb-12">
                            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl">MD</div>
                            <button
                                className="p-3 text-white bg-white/10 rounded-2xl"
                                onClick={() => {
                                    const menu = document.getElementById('mobile-menu');
                                    if (menu) menu.classList.add('hidden');
                                }}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-8">
                            <Link href="/" onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')} className="text-4xl font-black uppercase tracking-tighter text-white">Home</Link>
                            <Link href="/login" onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')} className="text-4xl font-black uppercase tracking-tighter text-gray-500 hover:text-white transition-colors">Login</Link>
                            <Link href="/register/client" onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')} className="text-4xl font-black uppercase tracking-tighter text-gray-500 hover:text-white transition-colors">For Firms</Link>
                            <Link href="/register/reporter" onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')} className="text-4xl font-black uppercase tracking-tighter text-gray-500 hover:text-white transition-colors">For Reporters</Link>
                        </div>
                        <div className="mt-auto">
                            <Link href="/register" onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')} className="block w-full py-6 bg-primary text-white text-center rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/30">Get Started Now</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 pt-40 pb-20 px-8 flex flex-col items-center">
                <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                        <Sparkles className="h-4 w-4" /> Next-Gen Stenographic Ecosystem
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight uppercase">
                        Precision <span className="text-primary italic block">Redefined</span>
                    </h1>

                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        The world&apos;s most advanced portal for legal professionals and stenographers. Experience zero-latency bookings and AI-augmented transcript workflows.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12">
                        <Link
                            href="/register/client"
                            className="group relative w-full md:w-[320px] p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-emerald-800 border border-white/20 shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <Globe className="h-10 w-10 text-white mb-6 transform group-hover:rotate-12 transition-transform" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight text-left">The Firm</h3>
                            <p className="text-emerald-100 text-xs font-bold text-left mt-2 uppercase tracking-widest">Client Registration</p>
                            <div className="mt-8 flex items-center justify-between">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Apply Now</span>
                                <ArrowRight className="h-5 w-5 text-white" />
                            </div>
                        </Link>

                        <Link
                            href="/register/reporter"
                            className="group relative w-full md:w-[320px] p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <Briefcase className="h-10 w-10 text-primary mb-6 transform group-hover:-rotate-12 transition-transform" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight text-left">The Reporter</h3>
                            <p className="text-gray-500 text-xs font-bold text-left mt-2 uppercase tracking-widest">Stenographer Portal</p>
                            <div className="mt-8 flex items-center justify-between">
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Join Registry</span>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Cyber Features Bar */}
                <div className="mt-40 grid grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl">
                    <FeatureItem icon={<Shield className="text-primary" />} title="Military-Grade" desc="AES-256 Transcript Encryption" />
                    <FeatureItem icon={<Terminal className="text-emerald-400" />} title="Smart Bookings" desc="Automated Conflict Checks" />
                    <FeatureItem icon={<Zap className="text-yellow-400" />} title="Real-Time" desc="Instant Digital Synchronization" />
                    <FeatureItem icon={<Command className="text-purple-400" />} title="Enterprise" desc="Centralized Firm Management" />
                </div>
            </main>

            {/* Footer Snippet */}
            <footer className="mt-40 border-t border-white/5 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">© 2026 Maria Dubson Global Intelligence. All Rights Reserved.</p>
                    <div className="flex gap-10">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2 underline underline-offset-4 decoration-white/10">Security Protocols</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2 underline underline-offset-4 decoration-white/10">Compliance</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureItem({ icon, title, desc }: any) {
    return (
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 group">
            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-all duration-500 transform group-hover:scale-110">
                {icon}
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest">{title}</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed tracking-wider">{desc}</p>
        </div>
    )
}
