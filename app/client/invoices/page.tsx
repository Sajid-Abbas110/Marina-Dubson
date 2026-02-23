'use client'

import { useState, useEffect } from 'react'
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
    Search as SearchIcon
} from 'lucide-react'

export default function ClientInvoicesPage() {
    const router = useRouter()
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }
                const res = await fetch('/api/invoices', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                setInvoices(data.invoices || [])
            } catch (error) {
                console.error('Failed to fetch invoices:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [router])

    const filteredInvoices = invoices.filter(inv => {
        const q = searchQuery.toLowerCase()
        return !searchQuery ||
            inv.invoiceNumber?.toLowerCase().includes(q) ||
            inv.booking?.proceedingType?.toLowerCase().includes(q) ||
            inv.jobNumber?.toLowerCase().includes(q)
    })

    const totalDue = invoices.filter(i => i.status !== 'PAID').reduce((acc, curr) => acc + curr.total, 0)

    return (
        <div className="min-h-screen bg-background font-poppins text-foreground pb-20">
            {/* Elite Client Header */}
            <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-2xl border-b border-border px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/client/portal" className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
                        MD
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2 uppercase">
                            Financial <span className="text-primary italic">Ledger</span>
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Enterprise Billing Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 italic">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">PCI-DSS Compliant Channel</span>
                    </div>
                    <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all font-black text-[10px] uppercase tracking-widest">
                        Profile Sync
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-16">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                            Account <span className="text-primary">Balance</span>
                        </h2>
                        <p className="text-muted-foreground font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">Managing Professional Service Disbursements & Case Billing.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl shadow-primary/5 min-w-[280px]">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Current Payables</p>
                            <p className="text-4xl font-black text-foreground tracking-tighter">${totalDue.toFixed(2)}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <Clock className="h-3 w-3 text-amber-500" />
                                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Awaiting Settlement</span>
                            </div>
                        </div>
                        <button className="luxury-btn py-12 px-12 h-full shadow-2xl shadow-primary/20 bg-primary group">
                            <CreditCard className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Settle Balance</span>
                        </button>
                    </div>
                </div>

                {/* Ledger Body */}
                <div className="glass-panel rounded-[3rem] overflow-hidden border border-border">
                    <div className="px-10 py-8 border-b border-border bg-muted/20 flex items-center justify-between">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Invoice History</h3>
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                className="pl-12 pr-6 py-3 rounded-2xl bg-muted border-none outline-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 text-foreground w-[240px]"
                                placeholder="Search Voucher ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-border">
                        {loading ? (
                            <div className="p-20 text-center text-muted-foreground uppercase font-black text-xs tracking-widest">Synchronizing Ledger...</div>
                        ) : filteredInvoices.map(inv => (
                            <div
                                key={inv.id}
                                onClick={() => router.push(`/client/invoices/${inv.id}`)}
                                className="px-10 py-10 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        <DollarSign className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{inv.invoiceNumber}</span>
                                            <h4 className="text-lg sm:text-xl font-black text-foreground uppercase tracking-tight">{inv.booking.proceedingType}</h4>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Issued: {new Date(inv.invoiceDate).toLocaleDateString()}</span>
                                            <div className="hidden sm:block h-3 w-px bg-border"></div>
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Job: {inv.jobNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 sm:gap-16 pt-6 sm:pt-0 border-t border-border sm:border-t-0 mt-6 sm:mt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Amount Due</p>
                                        <p className="text-xl sm:text-2xl font-black text-foreground tracking-tighter">${inv.total.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                            }`}>
                                            {inv.status}
                                        </div>

                                        <button className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-[1.5rem] bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all">
                                            <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
                    <FeatureNode title="Auto-Pay Ready" desc="Automate high-volume legal billing cycles." icon={<Zap />} />
                    <FeatureNode title="Digital Archiving" desc="Invoices vaulted with SOC-2 compliance." icon={<ShieldCheck />} />
                    <FeatureNode title="Direct Support" desc="Immediate billing escalations available." icon={<Building2 />} />
                </div>
            </main>
        </div>
    )
}

function FeatureNode({ title, desc, icon }: any) {
    return (
        <div className="flex items-start gap-4 p-8 rounded-[2rem] bg-card border border-border">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-primary">
                {icon}
            </div>
            <div>
                <h4 className="text-xs font-black text-foreground uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
