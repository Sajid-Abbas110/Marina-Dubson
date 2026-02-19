'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
    AlertCircle,
    TrendingUp,
    Search,
    Filter,
    Printer,
    ExternalLink,
    Zap,
    Activity,
    CreditCard as CreditCardIcon,
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    Download,
} from 'lucide-react'

export default function InvoicesPage() {
    const router = useRouter()
    const [filter, setFilter] = useState('ALL')
    const [search, setSearch] = useState('')
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('/api/invoices', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (res.ok) {
                    const data = await res.json()
                    setInvoices(data.invoices || [])
                }
            } catch (error) {
                console.error('Failed to fetch invoices:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [])

    const filtered = invoices.filter(inv => {
        const matchesFilter = filter === 'ALL' ? true : inv.status === filter
        const q = search.toLowerCase()
        const matchesSearch = !search
            || inv.invoiceNumber?.toLowerCase().includes(q)
            || inv.contact?.firstName?.toLowerCase().includes(q)
            || inv.contact?.lastName?.toLowerCase().includes(q)
            || inv.contact?.companyName?.toLowerCase().includes(q)
        return matchesFilter && matchesSearch
    })

    const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0)
    const outstandingAmount = invoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + i.total, 0)
    const outstandingCount = invoices.filter(i => i.status !== 'PAID').length

    const handleExport = () => {
        const rows = [
            ['Invoice #', 'Job #', 'Client', 'Company', 'Service', 'Date', 'Due Date', 'Status', 'Pages', 'Total'],
            ...invoices.map(inv => [
                inv.invoiceNumber,
                inv.jobNumber || '',
                `${inv.contact?.firstName || ''} ${inv.contact?.lastName || ''}`.trim(),
                inv.contact?.companyName || '',
                inv.booking?.service?.serviceName || '',
                inv.invoiceDate ? format(new Date(inv.invoiceDate), 'yyyy-MM-dd') : '',
                inv.dueDate ? format(new Date(inv.dueDate), 'yyyy-MM-dd') : '',
                inv.status,
                inv.pages || 0,
                inv.total.toFixed(2),
            ])
        ]
        const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoices-${format(new Date(), 'yyyy-MM-dd')}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
        SENT: { label: 'Sent', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
        DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: FileText },
        OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    }

    return (
        <div className="max-w-full w-full sm:w-[98%] mx-auto px-3 py-6 sm:p-6 lg:p-12 space-y-8 sm:space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Intelligence Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight uppercase leading-none">
                        Revenue <span className="brand-gradient italic">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em]">Operational readout of the MD Global billing matrix.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExport} className="luxury-button flex items-center gap-2 px-6 py-2.5 h-10">
                        <Download className="h-3.5 w-3.5" />
                        <span className="uppercase tracking-widest text-[9px] font-black">Export Matrix Data</span>
                    </button>
                </div>
            </div>

            {/* Data Pulse Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <PulseStatCard
                    label="Revenue Collected"
                    value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                    sub={`${invoices.filter(i => i.status === 'PAID').length} paid nodes`}
                    color="text-emerald-500"
                    icon={<CheckCircle className="h-5 w-5" />}
                    loading={loading}
                />
                <PulseStatCard
                    label="Outstanding Flux"
                    value={`$${outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                    sub={`${outstandingCount} pending cycles`}
                    color="text-amber-500"
                    icon={<Clock className="h-5 w-5" />}
                    loading={loading}
                />
                <PulseStatCard
                    label="Network Velocity"
                    value={invoices.length.toString()}
                    sub="Total Invoices Tracked"
                    color="text-primary"
                    icon={<TrendingUp className="h-5 w-5" />}
                    loading={loading}
                />
            </div>

            {/* Operational Tiers */}
            <div className="glass-panel rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-card border border-border shadow-2xl">
                <div className="px-4 sm:px-8 py-6 border-b border-border bg-muted/20 space-y-6">
                    <div className="flex flex-col xl:flex-row justify-between gap-6">
                        <div className="relative group w-full xl:w-auto">
                            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                className="w-full xl:min-w-[450px] pl-11 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-xl bg-card border border-border text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] outline-none focus:ring-4 focus:ring-primary/10 text-foreground transition-all shadow-inner"
                                placeholder="DECRYPT INVOICE_ID OR CLIENT..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border overflow-x-auto no-scrollbar">
                            {['ALL', 'SENT', 'PAID', 'OVERDUE', 'DRAFT'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-4 sm:px-6 py-2 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 ${filter === s
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {s === 'ALL' ? 'Total Yield' : statusConfig[s]?.label || s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="p-8 animate-pulse flex items-center gap-8">
                                <div className="h-12 w-12 rounded-xl bg-muted" />
                                <div className="space-y-2 flex-1"><div className="h-4 w-1/4 bg-muted rounded" /><div className="h-3 w-1/6 bg-muted rounded" /></div>
                            </div>
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="py-24 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">No yield signals detected in this spectrum</p>
                        </div>
                    ) : (
                        filtered.map(inv => {
                            const sc = statusConfig[inv.status] || statusConfig.DRAFT
                            return (
                                <div
                                    key={inv.id}
                                    className="px-4 sm:px-8 py-5 sm:py-6 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-l-4 border-transparent hover:border-primary"
                                    onClick={() => router.push(`/admin/invoices/${inv.id}`)}
                                >
                                    <div className="flex flex-row items-center gap-4 sm:gap-10">
                                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-1.5 py-0.5 rounded-lg bg-primary/10 text-[7px] sm:text-[9px] font-black text-primary border border-primary/20 uppercase tracking-widest leading-none">{inv.invoiceNumber}</span>
                                                {inv.jobNumber && <span className="text-[7px] sm:text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">#BK{inv.jobNumber}</span>}
                                            </div>
                                            <h4 className="text-sm sm:text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                                                {inv.contact?.companyName || `${inv.contact?.firstName} ${inv.contact?.lastName}`}
                                            </h4>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">{inv.booking?.service?.serviceName || 'Standard Protocol'}</p>
                                                <div className="h-1 w-1 rounded-full bg-border" />
                                                <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                                                    {inv.invoiceDate ? format(new Date(inv.invoiceDate), 'MMM d, yyyy') : '—'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row items-center justify-between xl:justify-end gap-6 sm:gap-12 px-2 sm:px-0">
                                        <div className="text-right">
                                            <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 sm:mb-1">Total Yield</p>
                                            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tighter">${inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                        </div>

                                        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all ${sc.color}`}>
                                            {sc.label}
                                        </div>

                                        <button className="flex h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-card border border-border items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex-shrink-0">
                                            <ArrowRight className="h-4 sm:h-6 w-4 sm:w-6" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

function PulseStatCard({ label, value, sub, color, icon, loading }: any) {
    return (
        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] bg-card border border-border shadow-md hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity group-hover:rotate-12 duration-700`}>
                {icon}
            </div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">{label}</p>
            <div className={`text-2xl sm:text-3xl font-black tracking-tighter uppercase ${color} mb-4`}>
                {loading ? <Activity className="h-8 w-8 animate-pulse" /> : value}
            </div>
            <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    )
}


