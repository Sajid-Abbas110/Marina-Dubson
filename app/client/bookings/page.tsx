'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Calendar,
    Link as LinkIcon,
    ArrowRight,
    User,
    CheckCircle,
    Clock,
    Search,
    Briefcase,
    Filter,
    ChevronDown,
    MapPin,
    Building2,
    DollarSign,
    Zap,
    Shield,
    ChevronLeft,
    Globe
} from 'lucide-react'

export default function ClientBookingsPage() {
    const bookings = [
        { id: 'BK-9831', case: 'Smith v. Jones', date: 'FEB 24', time: '10:00 AM', status: 'CONFIRMED', type: 'REMOTE', reporter: 'Sarah Jenkins' },
        { id: 'BK-9844', case: 'Patent Infringement', date: 'FEB 25', time: '01:30 PM', status: 'CONFIRMED', type: 'IN-PERSON', reporter: 'Michael Chen' },
        { id: 'BK-9852', case: 'Estate Hearing', date: 'FEB 27', time: '09:00 AM', status: 'PENDING', type: 'REMOTE', reporter: 'PENDING' }
    ]

    return (
        <div className="min-h-screen bg-[#f8fafc] font-poppins text-gray-900 pb-20">
            {/* Elite Client Header */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/client/portal" className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                        MD
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                            Case <span className="text-blue-600 italic">Registry</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Operational Logistics Desk</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/client/bookings/new" className="h-12 px-6 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
                        <Zap className="h-4 w-4" /> New Request
                    </Link>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 py-16">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Assignment <span className="text-blue-600">Matrix</span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">Monitoring verified stenographic deployments across the global node network.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-blue-500/5 min-w-[240px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Upcoming Jobs</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">03</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-blue-500/5 min-w-[240px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sync Nodes</p>
                            <p className="text-4xl font-black text-blue-600 tracking-tighter flex items-center gap-3">
                                <Globe className="h-8 w-8" /> Active
                            </p>
                        </div>
                    </div>
                </div>

                {/* Registry View */}
                <div className="glass-panel rounded-[3rem] overflow-hidden border border-gray-100">
                    <div className="px-10 py-8 border-b border-gray-100 bg-white/50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Assignments</h3>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 transition-all">Filter Matrix</button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {bookings.map(b => (
                            <div key={b.id} className="px-10 py-10 hover:bg-blue-50/20 transition-all cursor-pointer group flex items-center justify-between">
                                <div className="flex items-center gap-10">
                                    <div className="h-20 w-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center group-hover:border-blue-200 transition-colors">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">{b.date.split(' ')[0]}</span>
                                        <span className="text-2xl font-black text-gray-900">{b.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">{b.id}</span>
                                            <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{b.case}</h4>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-300" />
                                                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{b.time}</span>
                                            </div>
                                            <div className="h-3 w-px bg-gray-200"></div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-300" />
                                                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{b.type} NODE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-16">
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Linked Steno</p>
                                        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${b.reporter === 'PENDING' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                            <User className={`h-4 w-4 ${b.reporter === 'PENDING' ? 'text-amber-600' : 'text-emerald-600'}`} />
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${b.reporter === 'PENDING' ? 'text-amber-700' : 'text-emerald-700'}`}>{b.reporter}</span>
                                        </div>
                                    </div>

                                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {b.status}
                                    </div>

                                    <button className="h-14 w-14 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-blue-600 hover:border-blue-200 hover:shadow-xl transition-all">
                                        <ArrowRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
