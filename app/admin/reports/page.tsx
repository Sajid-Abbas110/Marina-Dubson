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

    if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-gray-400">Genereating Intelligence Report...</div>

    const cancellations = bookings.filter(b => b.bookingStatus === 'CANCELLED').length
    const agencyRevenue = invoices.filter(i => i.contact?.companyName?.toLowerCase().includes('agency')).reduce((s, i) => s + i.total, 0)
    const directRevenue = invoices.reduce((s, i) => s + i.total, 0) - agencyRevenue

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                        Operations <span className="text-primary italic">Intelligence</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Strategic reporting and logistics analytics.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleExport('EXCEL')} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Export XLSX</span>
                    </button>
                    <button onClick={() => handleExport('PDF')} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-900 text-white shadow-xl hover:scale-105 transition-all group">
                        <Download className="h-4 w-4 text-white" />
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
                        { label: 'Direct Channel', value: `$${directRevenue.toLocaleString()}`, color: 'text-emerald-500' }
                    ]}
                />
                <ReportCard
                    title="Logistics Health"
                    icon={<BarChart3 className="text-purple-500" />}
                    stats={[
                        { label: 'Total Deployments', value: bookings.length, color: 'text-gray-900' },
                        { label: 'Cancellation Rate', value: `${((cancellations / (bookings.length || 1)) * 100).toFixed(1)}%`, color: 'text-rose-500' }
                    ]}
                />
                <ReportCard
                    title="Market Capture"
                    icon={<TrendingUp className="text-amber-500" />}
                    stats={[
                        { label: 'Active Clients', value: new Set(bookings.map(b => b.contactId)).size, color: 'text-gray-900' },
                        { label: 'Node Utilization', value: '84.2%', color: 'text-primary' }
                    ]}
                />
            </div>

            <div className="glass-panel rounded-[2.5rem] p-10">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Client Activity Matrix</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input className="pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase outline-none" placeholder="Filter by client..." />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Client</th>
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Bookings</th>
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Revenue</th>
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Last Op</th>
                                <th className="text-right py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {Array.from(new Set(bookings.map(b => b.contactId))).slice(0, 10).map(cid => {
                                const clientBookings = bookings.filter(b => b.contactId === cid)
                                const b = clientBookings[0]
                                const revenue = invoices.filter(i => i.contactId === cid).reduce((s, i) => s + i.total, 0)
                                return (
                                    <tr key={cid} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black">
                                                    {b?.contact?.firstName?.[0] || '?'}{b?.contact?.lastName?.[0] || '?'}
                                                </div>
                                                <span className="text-sm font-black text-gray-900 uppercase">
                                                    {b?.contact?.companyName || (b?.contact ? `${b.contact.firstName} ${b.contact.lastName}` : 'Anonymous Client')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-sm font-bold text-gray-500">{clientBookings.length}</td>
                                        <td className="py-6 px-4 text-sm font-black text-gray-900">${revenue.toLocaleString()}</td>
                                        <td className="py-6 px-4 text-xs font-semibold text-gray-400 uppercase">
                                            {b?.bookingDate ? format(new Date(b.bookingDate), 'MMM dd') : 'N/A'}
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-full">Elite</span>
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
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
            <div className="flex justify-between items-start mb-8">
                <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />
            </div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{title}</h4>
            <div className="space-y-6">
                {stats.map((s: any) => (
                    <div key={s.label}>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color} tracking-tight`}>{s.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
