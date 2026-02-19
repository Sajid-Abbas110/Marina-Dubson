'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
    CreditCard,
    DollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Filter,
    Search,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    ShieldCheck,
    Briefcase
} from 'lucide-react'

export default function FinancialCenterPage() {
    const router = useRouter()
    const [filter, setFilter] = useState('ALL')
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/invoices', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setInvoices(data)
            }
        } catch (error) {
            console.error('Failed to fetch invoices:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const unpaidRevenue = invoices.filter(inv => inv.status !== 'PAID').reduce((sum, inv) => sum + inv.total, 0)

    return (
        <div className="p-6 lg:p-12 space-y-10 animate-in fade-in duration-700">
            {/* Financial Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-foreground tracking-tight uppercase leading-none">
                        Financial <span className="brand-gradient italic">Nexus</span>
                    </h1>
                    <p className="text-muted-foreground font-medium font-poppins text-[9px] uppercase tracking-[0.3em]">Global Revenue Command & Tactical Settlements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-all group active:scale-95">
                        <Download className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Audit Export</span>
                    </button>
                </div>
            </div>

            {/* Cash Flow Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinanceCard label="Gross Revenue Matrix" value={`$${totalRevenue.toLocaleString()}`} sub="+18.4% vs LMTD" icon={<TrendingUp className="text-primary" />} />
                <FinanceCard label="Outstanding Ledger" value={`$${unpaidRevenue.toLocaleString()}`} sub={`${invoices.filter(inv => inv.status !== 'PAID').length} Pending Payments`} icon={<Briefcase className="text-amber-500" />} />
                <FinanceCard label="Settlement Node" value="Nominal" sub="Instant Sync Active" icon={<ShieldCheck className="text-primary" />} />
            </div>

            {/* Transaction Ledger */}
            <div className="glass-panel rounded-[2rem] overflow-hidden bg-card border border-border">
                <div className="px-6 py-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <CreditCard className="h-4 w-4" />
                        </div>
                        <h3 className="text-base font-black text-foreground uppercase tracking-tight">Financial Transaction Ledger</h3>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-5 py-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center">Reference</th>
                                <th className="px-5 py-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest">Entity / Participant</th>
                                <th className="px-5 py-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                                <th className="px-5 py-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-5 py-3 text-[8px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Synchronizing Financial Nodes...</td>
                                </tr>
                            ) : invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-muted transition-all cursor-pointer group" onClick={() => router.push(`/admin/invoices/${inv.id}`)}>
                                    <td className="px-5 py-3 text-center text-foreground">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-black uppercase tracking-tight">{inv.invoiceNumber}</span>
                                            <span className="text-[7px] font-black text-muted-foreground uppercase mt-0.5">{format(new Date(inv.invoiceDate), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                <ArrowDownLeft className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-foreground uppercase tracking-tight">{inv.contact.companyName || `${inv.contact.firstName} ${inv.contact.lastName}`}</span>
                                                <span className="text-[7px] font-bold text-muted-foreground uppercase">Case: {inv.booking.proceedingType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-sm font-black tracking-tighter text-foreground">${inv.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[7px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                            <div className={`h-1 w-1 rounded-full ${inv.status === 'PAID' ? 'bg-primary' : 'bg-destructive'}`}></div>
                                            {inv.status}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button className="h-7 w-7 rounded-lg hover:bg-background hover:shadow-sm transition-all mx-auto lg:ml-auto flex items-center justify-center text-muted-foreground hover:text-primary">
                                            <FileText className="h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet View (Card-based) */}
                <div className="lg:hidden">
                    {loading ? (
                        <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Synchronizing Financial Nodes...</div>
                    ) : (
                        <div className="divide-y divide-border">
                            {invoices.map(inv => (
                                <div key={inv.id} className="p-6 space-y-4 hover:bg-muted transition-all" onClick={() => router.push(`/admin/invoices/${inv.id}`)}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <ArrowDownLeft className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-foreground uppercase tracking-tight">{inv.contact.companyName || `${inv.contact.firstName} ${inv.contact.lastName}`}</span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">REF: {inv.invoiceNumber}</span>
                                            </div>
                                        </div>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                                            {inv.status}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</span>
                                            <span className="text-xl font-black text-foreground tracking-tighter">${inv.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</span>
                                            <span className="text-[10px] font-black text-foreground uppercase">{format(new Date(inv.invoiceDate), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.1em]">Case: {inv.booking.proceedingType}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function FinanceCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                {icon}
            </div>
            <h4 className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1.5">{label}</h4>
            <p className="text-xl font-black text-foreground tracking-tighter uppercase mb-3">{value}</p>
            <div className="flex items-center gap-1.5">
                <CheckCircle className="h-2.5 w-2.5 text-primary" />
                <span className="text-[7px] font-black text-primary uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    )
}
