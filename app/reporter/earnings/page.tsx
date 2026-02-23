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
        { id: 'PAY-882', case: 'Smith v. Jones', date: 'FEB 15, 2026', amount: '$725.00', status: 'PROCESSED', method: 'BANK TRANSFER' },
        { id: 'PAY-879', case: 'Patent Infringement', date: 'FEB 14, 2026', amount: '$450.00', status: 'SCHEDULED', method: 'ESCROW' },
        { id: 'PAY-872', case: 'Estate Audit', date: 'FEB 10, 2026', amount: '$980.00', status: 'PAID', method: 'INTERNAL' }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
            {/* Professional Reporter Header */}
            <header className="sticky top-0 z-40 w-full bg-card/90 backdrop-blur-md border-b border-border px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/reporter/portal" className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transform -rotate-6 shadow-lg shadow-primary/20">
                        MD
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2 uppercase">
                            Financial <span className="text-primary italic">Ledger</span>
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Network Earnings Record</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 italic">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Verified Payout Channel</span>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-16">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                            Revenue <span className="text-primary">Nexus</span>
                        </h2>
                        <p className="text-muted-foreground font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">Tracking Professional Compensation & Taxable Asset Distributions.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl min-w-[280px]">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Net Balance (MTD)</p>
                            <p className="text-4xl font-black text-foreground tracking-tighter">$12,450.00</p>
                            <div className="mt-4 flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-primary" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">+12.4% vs Last Month</span>
                            </div>
                        </div>
                        <button className="luxury-button py-12 px-12 h-full shadow-2xl shadow-primary/20 bg-primary group">
                            <DollarSign className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Request Payout</span>
                        </button>
                    </div>
                </div>

                {/* Ledger View */}
                <div className="glass-panel rounded-[3rem] overflow-hidden border border-border shadow-xl bg-card">
                    <div className="px-10 py-8 border-b border-border bg-card flex items-center justify-between">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Compensation History</h3>
                        <div className="flex items-center gap-4">
                            <Download className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div className="divide-y divide-border/50">
                        {earnings.map(earn => (
                            <div key={earn.id} className="px-10 py-10 hover:bg-primary/5 transition-all cursor-pointer group flex items-center justify-between">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                                    <div className="h-16 w-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                                        <DollarSign className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{earn.id}</span>
                                            <h4 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">{earn.case}</h4>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Settled: {earn.date}</span>
                                            <div className="hidden sm:block h-3 w-px bg-border/40"></div>
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Via: {earn.method}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 sm:gap-16 pt-6 sm:pt-0 border-t border-border/20 sm:border-t-0 mt-6 sm:mt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Payment Value</p>
                                        <p className="text-xl sm:text-2xl font-black text-foreground tracking-tighter">{earn.amount}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${earn.status === 'PAID' || earn.status === 'PROCESSED' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {earn.status}
                                        </div>

                                        <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-[1.5rem] bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-xl transition-all">
                                            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <EarningsFeature title="Tax Documentation" desc="Download your annual 1099-NEC and earnings summaries." icon={<FileText />} />
                    <EarningsFeature title="Bank Synchronization" desc="Manage direct deposit accounts and settlement timing." icon={<Globe />} />
                </div>
            </main>
        </div>
    )
}

function EarningsFeature({ title, desc, icon }: any) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-10 rounded-[2.5rem] bg-card border border-border hover:shadow-xl transition-all group gap-6">
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-muted/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {icon}
                </div>
                <div>
                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{title}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{desc}</p>
                </div>
            </div>
            <button className="h-12 w-12 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}
