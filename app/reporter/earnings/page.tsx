'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    CreditCard,
    Calendar,
    FileText,
    Download,
    ArrowUpRight,
    Search,
    Filter,
    CheckCircle,
    Clock,
    Zap,
    ShieldCheck,
    Building2,
    Briefcase,
    DollarSign,
    ChevronRight,
    TrendingUp,
    Globe,
    ArrowRight,
    User
} from 'lucide-react'

export default function ReporterEarningsPage() {
    const earnings = [
        { id: 'PAY-882', case: 'Smith v. Jones', date: 'FEB 15, 2026', amount: '$725.00', status: 'PROCESSED', method: 'BANK NODE' },
        { id: 'PAY-879', case: 'Patent Infringement', date: 'FEB 14, 2026', amount: '$450.00', status: 'SCHEDULED', method: 'ESCROW' },
        { id: 'PAY-872', case: 'Estate Audit', date: 'FEB 10, 2026', amount: '$980.00', status: 'PAID', method: 'INTERNAL' }
    ]

    return (
        <div className="min-h-screen bg-[#fafafa] font-poppins text-gray-900 pb-20">
            {/* Professional Reporter Header */}
            <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-2xl border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/reporter/portal" className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white transform -rotate-6 shadow-lg shadow-emerald-500/20">
                        MD
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                            Financial <span className="text-emerald-600 italic">Ledger</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Network Earnings Node</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 italic">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Verified Payout Channel</span>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 py-16">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Revenue <span className="text-emerald-600">Nexus</span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">Tracking Professional Compensation & Taxable Asset Distributions.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-emerald-500/5 min-w-[280px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Net Balance (MTD)</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">$12,450.00</p>
                            <div className="mt-4 flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">+12.4% vs Last Month</span>
                            </div>
                        </div>
                        <button className="luxury-btn py-12 px-12 h-full shadow-2xl shadow-emerald-600/20 bg-emerald-600 group">
                            <DollarSign className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Request Payout</span>
                        </button>
                    </div>
                </div>

                {/* Ledger View */}
                <div className="glass-panel rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-emerald-500/5">
                    <div className="px-10 py-8 border-b border-gray-100 bg-white/50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Compensation History</h3>
                        <div className="flex items-center gap-4">
                            <Download className="h-5 w-5 text-gray-300 hover:text-emerald-600 cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {earnings.map(earn => (
                            <div key={earn.id} className="px-10 py-10 hover:bg-emerald-50/20 transition-all cursor-pointer group flex items-center justify-between">
                                <div className="flex items-center gap-10">
                                    <div className="h-16 w-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                                        <DollarSign className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{earn.id}</span>
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{earn.case}</h4>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Settled: {earn.date}</span>
                                            <div className="h-3 w-px bg-gray-200"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Via: {earn.method}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-16">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Value</p>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">{earn.amount}</p>
                                    </div>

                                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${earn.status === 'PAID' || earn.status === 'PROCESSED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                        {earn.status}
                                    </div>

                                    <button className="h-14 w-14 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-xl transition-all">
                                        <ArrowRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <EarningsFeature title="Tax Documentation" desc="Download your annual 1099-NEC and earnings summaries." icon={<FileText />} />
                    <EarningsFeature title="Bank Synchronization" desc="Manage direct deposit nodes and settlement timing." icon={<Globe />} />
                </div>
            </main>
        </div>
    )
}

function EarningsFeature({ title, desc, icon }: any) {
    return (
        <div className="flex items-center justify-between p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {icon}
                </div>
                <div>
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{desc}</p>
                </div>
            </div>
            <button className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 hover:text-emerald-600 transition-colors">
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}
