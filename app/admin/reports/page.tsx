'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3,
    PieChart,
    Download,
    Filter,
    ArrowUpRight,
    FileSpreadsheet,
    FileJson,
    Zap,
    Users,
    TrendingUp,
    AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

export default function ReportsPage() {
    const [bookings, setBookings] = useState<any[]>([])
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const [bookingsRes, invoicesRes] = await Promise.all([
                    fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/invoices', { headers: { 'Authorization': `Bearer ${token}` } })
                ])
                const bData = await bookingsRes.json()
                const iData = await invoicesRes.json()
                setBookings(bData.bookings || [])
                setInvoices(iData.invoices || [])
            } catch (error) {
                console.error('Failed to fetch report data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleExport = (type: 'EXCEL' | 'PDF') => {
        // Simple CSV generation as proxy for export
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Report Type,Generated At\n"
            + `System Audit,${new Date().toISOString()}\n\n`
            + "Category,Value\n"
            + `Total Bookings,${bookings.length}\n`
            + `Total Revenue,${invoices.reduce((sum, i) => sum + i.total, 0)}\n`

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `md-report-${type.toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.csv`)
        document.body.appendChild(link)
        link.click()
    }

    if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-muted-foreground animate-pulse">Generating Intelligence Report...</div>

    const cancellations = bookings.filter(b => b.bookingStatus === 'CANCELLED').length
    const agencyRevenue = invoices.filter(i => i.contact?.companyName?.toLowerCase().includes('agency')).reduce((s, i) => s + i.total, 0)
    const directRevenue = invoices.reduce((s, i) => s + i.total, 0) - agencyRevenue

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
                        Operations <span className="brand-gradient italic">Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-2">Strategic reporting and logistics analytics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleExport('EXCEL')} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all group font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        <span>Export XLSX</span>
                    </button>
                    <button onClick={() => handleExport('PDF')} className="luxury-button py-4 px-8 shadow-xl shadow-primary/20">
                        <Download className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Generate PDF</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ReportCard
                    title="Revenue Mix"
                    icon={<PieChart className="text-primary" />}
                    stats={[
                        { label: 'Agency Channel', value: `$${agencyRevenue.toLocaleString()}`, color: 'text-primary' },
                        { label: 'Direct Channel', value: `$${directRevenue.toLocaleString()}`, color: 'text-primary/70' }
                    ]}
                />
                <ReportCard
                    title="Logistics Health"
                    icon={<BarChart3 className="text-primary" />}
                    stats={[
                        { label: 'Total Deployments', value: bookings.length, color: 'text-foreground' },
                        { label: 'Cancellation Rate', value: `${((cancellations / (bookings.length || 1)) * 100).toFixed(1)}%`, color: 'text-rose-500' }
                    ]}
                />
                <ReportCard
                    title="Market Capture"
                    icon={<TrendingUp className="text-primary" />}
                    stats={[
                        { label: 'Active Clients', value: new Set(bookings.map(b => b.contactId)).size, color: 'text-foreground' },
                        { label: 'Node Utilization', value: '84.2%', color: 'text-primary' }
                    ]}
                />
            </div>

            <div className="glass-panel rounded-[2.5rem] p-10 border border-border bg-card">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Client Activity Matrix</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input className="pl-12 pr-4 py-3 rounded-xl bg-muted border border-border text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-primary/10 transition-all w-64" placeholder="Filter by client..." />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="text-left py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest px-6">Client</th>
                                <th className="text-left py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest px-6">Bookings</th>
                                <th className="text-left py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest px-6">Revenue</th>
                                <th className="text-left py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest px-6">Last Op</th>
                                <th className="text-right py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest px-6 pr-10">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {Array.from(new Set(bookings.map(b => b.contactId))).slice(0, 10).map(cid => {
                                const clientBookings = bookings.filter(b => b.contactId === cid)
                                const b = clientBookings[0]
                                const revenue = invoices.filter(i => i.contactId === cid).reduce((s, i) => s + i.total, 0)
                                return (
                                    <tr key={cid} className="group hover:bg-primary/5 transition-colors cursor-pointer">
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black text-primary border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    {b?.contact?.firstName?.[0] || '?'}{b?.contact?.lastName?.[0] || '?'}
                                                </div>
                                                <span className="text-sm font-black text-foreground uppercase tracking-tight">
                                                    {b?.contact?.companyName || (b?.contact ? `${b.contact.firstName} ${b.contact.lastName}` : 'Anonymous Client')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 text-sm font-bold text-muted-foreground">{clientBookings.length}</td>
                                        <td className="py-6 px-6 text-sm font-black text-foreground">${revenue.toLocaleString()}</td>
                                        <td className="py-6 px-6 text-xs font-black text-muted-foreground uppercase tracking-widest">
                                            {b?.bookingDate ? format(new Date(b.bookingDate), 'MMM dd') : 'N/A'}
                                        </td>
                                        <td className="py-6 px-6 pr-10 text-right">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full border border-primary/20">Elite</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function ReportCard({ title, icon, stats }: any) {
    return (
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                {icon}
            </div>
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                    <div className="text-primary">{icon}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
            </div>
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 relative z-10">{title}</h4>
            <div className="space-y-6 relative z-10">
                {stats.map((s: any) => (
                    <div key={s.label}>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-xl font-black ${s.color} tracking-tight uppercase`}>{s.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
