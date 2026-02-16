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

    const totalDue = invoices.filter(i => i.status === 'UNPAID').reduce((acc, curr) => acc + curr.total, 0)

    return (
        <div className="min-h-screen bg-[#f8fafc] font-poppins text-gray-900 pb-20">
            {/* Elite Client Header */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/client/portal" className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
                        MD
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                            Financial <span className="text-primary italic">Ledger</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Enterprise Billing Node</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 italic">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">PCI-DSS Compliant Channel</span>
                    </div>
                    <button className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all font-black text-[10px] uppercase tracking-widest">
                        Profile Sync
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 py-16">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Account <span className="text-blue-600">Balance</span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">Managing Professional Service Disbursements & Case Billing.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-primary/5 min-w-[280px]">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Payables</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">${totalDue.toFixed(2)}</p>
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
                <div className="glass-panel rounded-[3rem] overflow-hidden border border-gray-100">
                    <div className="px-10 py-8 border-b border-gray-100 bg-white/50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Invoice History</h3>
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input className="pl-12 pr-6 py-3 rounded-2xl bg-gray-50 border-none outline-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 w-[240px]" placeholder="Search Voucher ID..." />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <div className="p-20 text-center text-gray-400 uppercase font-black text-xs tracking-widest">Synchronizing Ledger...</div>
                        ) : invoices.map(inv => (
                            <div
                                key={inv.id}
                                onClick={() => router.push(`/client/invoices/${inv.id}`)}
                                className="px-10 py-10 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div className="flex items-center gap-10">
                                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                        <DollarSign className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{inv.invoiceNumber}</span>
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">{inv.booking.proceedingType}</h4>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issued: {new Date(inv.invoiceDate).toLocaleDateString()}</span>
                                            <div className="h-3 w-px bg-gray-200"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job: {inv.jobNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-16">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Amout Due</p>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">${inv.total.toFixed(2)}</p>
                                    </div>

                                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                        {inv.status}
                                    </div>

                                    <button className="h-14 w-14 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all">
                                        <Download className="h-6 w-6" />
                                    </button>
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
        <div className="flex items-start gap-4 p-8 rounded-[2rem] bg-white border border-gray-100">
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600">
                {icon}
            </div>
            <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
