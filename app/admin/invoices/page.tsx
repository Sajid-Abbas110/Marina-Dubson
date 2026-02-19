'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
    CreditCard,
    DollarSign,
    Download,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Search,
    Filter,
    Printer,
    ExternalLink,
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
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage billing, payment status, and generate payment links.</p>
                </div>
                <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm self-start">
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                    label="Revenue Collected"
                    value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
                    sub={`${invoices.filter(i => i.status === 'PAID').length} paid invoices`}
                    accent="emerald"
                />
                <StatCard
                    label="Outstanding Balance"
                    value={`$${outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    icon={<Clock className="h-5 w-5 text-amber-600" />}
                    sub={`${outstandingCount} unpaid invoice${outstandingCount !== 1 ? 's' : ''}`}
                    accent="amber"
                />
                <StatCard
                    label="Total Invoices"
                    value={invoices.length.toString()}
                    icon={<TrendingUp className="h-5 w-5 text-primary" />}
                    sub="All time"
                    accent="primary"
                />
            </div>

            {/* Filter + Search */}
            <div className="md-card">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Search by invoice #, client name, or company…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Status filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {['ALL', 'SENT', 'PAID', 'OVERDUE', 'DRAFT'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${filter === s
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                                    }`}
                            >
                                {s === 'ALL' ? 'All' : statusConfig[s]?.label || s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground">Invoice</th>
                                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground">Client</th>
                                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Service</th>
                                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                                <th className="text-right pb-3 text-xs font-semibold text-muted-foreground">Amount</th>
                                <th className="text-center pb-3 text-xs font-semibold text-muted-foreground">Status</th>
                                <th className="text-right pb-3 text-xs font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="py-4 pr-4">
                                                <div className="h-4 bg-muted animate-pulse rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">No invoices found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(inv => {
                                    const sc = statusConfig[inv.status] || statusConfig.DRAFT
                                    return (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-muted/50 transition-colors cursor-pointer group"
                                            onClick={() => router.push(`/admin/invoices/${inv.id}`)}
                                        >
                                            <td className="py-3.5 pr-4">
                                                <div>
                                                    <p className="font-semibold text-foreground">{inv.invoiceNumber}</p>
                                                    {inv.jobNumber && <p className="text-xs text-muted-foreground">Job #{inv.jobNumber}</p>}
                                                </div>
                                            </td>
                                            <td className="py-3.5 pr-4">
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {inv.contact?.companyName || `${inv.contact?.firstName} ${inv.contact?.lastName}`}
                                                    </p>
                                                    {inv.contact?.companyName && (
                                                        <p className="text-xs text-muted-foreground">{inv.contact?.firstName} {inv.contact?.lastName}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 pr-4 hidden md:table-cell">
                                                <p className="text-sm text-muted-foreground">{inv.booking?.service?.serviceName || '—'}</p>
                                            </td>
                                            <td className="py-3.5 pr-4 hidden lg:table-cell">
                                                <p className="text-sm text-muted-foreground">
                                                    {inv.invoiceDate ? format(new Date(inv.invoiceDate), 'MMM d, yyyy') : '—'}
                                                </p>
                                                {inv.dueDate && (
                                                    <p className="text-xs text-muted-foreground/70">
                                                        Due {format(new Date(inv.dueDate), 'MMM d')}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3.5 pr-4 text-right">
                                                <span className="font-bold text-foreground">${inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            </td>
                                            <td className="py-3.5 pr-4">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.color}`}>
                                                        <sc.icon className="h-3 w-3" />
                                                        {sc.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="h-7 w-7 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-sm transition-all"
                                                        title="View / Print"
                                                        onClick={e => { e.stopPropagation(); router.push(`/admin/invoices/${inv.id}`) }}
                                                    >
                                                        <Printer className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon, sub, accent }: { label: string; value: string; icon: React.ReactNode; sub: string; accent: string }) {
    const accents: Record<string, string> = {
        emerald: 'border-l-emerald-500',
        amber: 'border-l-amber-500',
        primary: 'border-l-primary',
    }
    return (
        <div className={`md-card border-l-4 ${accents[accent] || 'border-l-primary'} flex items-center gap-4`}>
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
        </div>
    )
}
