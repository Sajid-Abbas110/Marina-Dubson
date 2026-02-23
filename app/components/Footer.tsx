'use client'

import Link from 'next/link'
import { Shield, Globe, Lock, Cpu } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function DeepFooter() {
    const pathname = usePathname()

    // Hide footer on admin, client, and reporter portal routes
    const isPortal = pathname?.startsWith('/admin') ||
        pathname?.startsWith('/client') ||
        pathname?.startsWith('/reporter')

    if (isPortal) return null

    return (
        <footer className="bg-[#020617] border-t border-white/5 pt-20 pb-10 px-8 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">MD</div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Marina Dubson</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Stenographic Services v4.0</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium max-w-md leading-relaxed">
                        Deploying elite stenographic operations across the global legal landscape.
                        Precision. Velocity. Security. Transitioning the legacy of court reporting
                        into the digital-first era of litigation.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">
                            <Globe className="h-4 w-4" />
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">
                            <Cpu className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Operational Centers</h4>
                    <ul className="space-y-3">
                        <li><Link href="/login" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors">Client Portal</Link></li>
                        <li><Link href="/login" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors">Reporter Gateway</Link></li>
                        <li><Link href="/admin/dashboard" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors">Command Center</Link></li>
                        <li><Link href="/register" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors">Platform Integration</Link></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Protocol & Compliance</h4>
                    <ul className="space-y-3">
                        <li><Link href="/privacy" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"><Lock className="h-3 w-3" /> Privacy Policy</Link></li>
                        <li><Link href="/terms" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"><Shield className="h-3 w-3" /> Service Terms</Link></li>
                        <li><Link href="/gdpr" className="text-slate-500 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"><Globe className="h-3 w-3" /> GDPR Matrix</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 MARINA DUBSON STENOGRAPHIC SERVICES. ALL SIGNAL PROTECTED.</p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Main Hub: NY-01</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
