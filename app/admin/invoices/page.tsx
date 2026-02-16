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
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Financial Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Financial <span className="text-primary italic">Nexus</span>
                    </h1>
                    <p className="text-gray-500 font-medium font-poppins text-xs uppercase tracking-widest">Global Revenue Command & Tactical Settlements.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group active:scale-95">
                        <Download className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Audit Export</span>
                    </button>
                </div>
            </div>

            {/* Cash Flow Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FinanceCard label="Gross Revenue Matrix" value={`$${totalRevenue.toLocaleString()}`} sub="+18.4% vs LMTD" icon={<TrendingUp className="text-primary" />} />
                <FinanceCard label="Outstanding Ledger" value={`$${unpaidRevenue.toLocaleString()}`} sub={`${invoices.filter(inv => inv.status !== 'PAID').length} Pending Payments`} icon={<Briefcase className="text-amber-500" />} />
                <FinanceCard label="Settlement Node" value="Nominal" sub="Instant Sync Active" icon={<ShieldCheck className="text-emerald-500" />} />
            </div>

            {/* Transaction Ledger */}
            <div className="glass-panel rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5">
                <div className="px-10 py-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Financial Transaction Ledger</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Reference</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entity / Participant</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Matrix</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Financial Nodes...</td>
                                </tr>
                            ) : invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-primary/5 transition-all cursor-pointer group" onClick={() => router.push(`/client/invoices/${inv.id}`)}>
                                    <td className="px-10 py-8 text-center text-gray-900 dark:text-white">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[11px] font-black uppercase tracking-tight">{inv.invoiceNumber}</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase mt-1">{format(new Date(inv.invoiceDate), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                                <ArrowDownLeft className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{inv.contact.companyName || `${inv.contact.firstName} ${inv.contact.lastName}`}</span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase">Case: {inv.booking.proceedingType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white">${inv.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${inv.status === 'PAID' ? 'bg-emerald-500' : 'bg-current opacity-40'}`}></div>
                                            {inv.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all flex items-center justify-center text-gray-300 hover:text-primary">
                                            <FileText className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function FinanceCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-white dark:bg-white/5 p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                {icon}
            </div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{label}</h4>
            <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6">{value}</p>
            <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    )
}
