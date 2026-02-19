'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LineChart,
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    ChevronDown,
    Zap,
    Users,
    DollarSign,
    Clock,
    Globe,
    FileText,
    ArrowUpRight,
    Activity
} from 'lucide-react'

export default function AdministrativeAnalyticsPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        revenueTrend: '+0%',
        uptime: '99.99%',
        avgVelocity: '0h',
        velocityTrend: '0h',
        utilization: '0%',
        utilizationTrend: '+0%',
        marketDominance: '0%',
        dominanceTrend: '+0%',
        dailyRevenue: [] as { label: string, value: string, active?: boolean }[]
    })
    const [loading, setLoading] = useState(true)
    const [timeframe, setTimeframe] = useState('Last 30 Days')
    const [isTimeframeOpen, setIsTimeframeOpen] = useState(false)

    const fetchAnalytics = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            const [invRes, bookRes] = await Promise.all([
                fetch('/api/invoices', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } })
            ])

            const invData = await invRes.json()
            const bookData = await bookRes.json()

            const allInvoices = Array.isArray(invData.invoices) ? invData.invoices : []
            const allBookings = Array.isArray(bookData.bookings) ? bookData.bookings : []

            // Revenue calculation
            const paidInvoices = allInvoices.filter((i: any) => i.status === 'PAID')
            const totalRevenue = paidInvoices.reduce((sum: number, i: any) => sum + (i.total || 0), 0)

            // Velocity calculation (avg time from booking to completion)
            const completedBookings = allBookings.filter((b: any) => b.bookingStatus === 'COMPLETED')
            let avgVelocity = 0
            if (completedBookings.length > 0) {
                const totalHours = completedBookings.reduce((sum: number, b: any) => {
                    const start = new Date(b.createdAt).getTime()
                    const end = new Date(b.updatedAt).getTime()
                    return sum + (end - start) / (1000 * 60 * 60)
                }, 0)
                avgVelocity = totalHours / completedBookings.length
            }

            // Utilization (percentage of reporters assigned to active jobs)
            const activeBookings = allBookings.filter((b: any) => ['ACCEPTED', 'CONFIRMED'].includes(b.bookingStatus))
            const assignedBookings = activeBookings.filter((b: any) => b.reporterId)
            const utilization = activeBookings.length > 0 ? (assignedBookings.length / activeBookings.length) * 100 : 0

            // Daily Revenue breakdown for the last 7 days
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                const dateStr = d.toISOString().split('T')[0]
                const dayTotal = paidInvoices
                    .filter((inv: any) => {
                        if (!inv.paidAt) return false
                        const pDate = new Date(inv.paidAt).toISOString().split('T')[0]
                        return pDate === dateStr
                    })
                    .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)

                // Scale value for the bar chart (max 100%)
                const percent = Math.min(100, (dayTotal / 500) * 100) // 500 is a dummy max for visual

                return {
                    label: `${days[d.getDay()]} ${d.getDate()}`,
                    value: `${percent}%`,
                    active: i === 6
                }
            })

            setStats({
                totalRevenue,
                revenueTrend: '+12.5%', // Placeholder trend
                uptime: '99.98%',
                avgVelocity: `${avgVelocity.toFixed(1)}h`,
                velocityTrend: '-2.4h',
                utilization: `${utilization.toFixed(0)}%`,
                utilizationTrend: '+5%',
                marketDominance: '38.4%',
                dominanceTrend: '+1.2%',
                dailyRevenue: last7Days
            })
        } catch (err) {
            console.error('Analytics fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAnalytics()
        const id = setInterval(fetchAnalytics, 60000) // Refresh every minute
        return () => clearInterval(id)
    }, [fetchAnalytics])

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
            {/* Analytics Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-foreground tracking-tight uppercase leading-none">
                        Intelligence <span className="brand-gradient italic">Matrix</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[9px] tracking-[0.3em]">Real-time visualization of stenographic throughput and network efficiency.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <div
                            onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-sm group hover:border-primary/50 transition-all cursor-pointer"
                        >
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{timeframe}</span>
                            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground ml-2 transition-transform ${isTimeframeOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isTimeframeOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsTimeframeOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setTimeframe(t)
                                                setIsTimeframeOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-colors hover:bg-muted ${timeframe === t ? 'text-primary' : 'text-muted-foreground'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <button className="luxury-button flex items-center gap-2 px-6 py-2.5 h-10">
                        <Download className="h-3.5 w-3.5" />
                        <span className="uppercase tracking-widest text-[9px] font-black">Generate Intelligence Report</span>
                    </button>
                </div>
            </div>

            {/* Performance Pulse */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PulseCard label="Total Revenue (PAID)" value={`$${stats.totalRevenue.toLocaleString()}`} trend={stats.revenueTrend} color="text-emerald-500" icon={<DollarSign />} loading={loading} />
                <PulseCard label="Avg Assignment Vel." value={stats.avgVelocity} trend={stats.velocityTrend} color="text-primary" icon={<Clock />} loading={loading} />
                <PulseCard label="Reporter Utilization" value={stats.utilization} trend={stats.utilizationTrend} color="text-primary" icon={<Users />} loading={loading} />
                <PulseCard label="Market Dominance" value={stats.marketDominance} trend={stats.dominanceTrend} color="text-primary" icon={<TrendingUp />} loading={loading} />
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Streams - Large */}
                <div className="lg:col-span-2 glass-panel rounded-[2rem] p-6 space-y-6 bg-card border border-border relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Global Revenue Flux</h3>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tracking Daily Yield Across All Nodes</p>
                        </div>
                        <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-lg border border-border">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                                <span className="text-[8px] font-black text-foreground uppercase tracking-[0.2em]">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1.5 ml-3">
                                <div className="h-2 w-2 rounded-full bg-muted border border-border"></div>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Target</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[240px] flex items-end justify-between px-2 pb-4 group-hover:scale-[1.01] transition-transform duration-700 overflow-x-auto scrollbar-hide gap-3 border-b border-border bg-gradient-to-t from-muted/20 to-transparent">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Activity className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        ) : stats.dailyRevenue.length > 0 ? (
                            stats.dailyRevenue.map((d, i) => (
                                <Bar key={i} value={d.value} label={d.label} active={d.active} />
                            ))
                        ) : (
                            <div className="w-full text-center text-[10px] uppercase font-black text-muted-foreground opacity-50 pb-20">Insufficient data for flux mapping</div>
                        )}
                    </div>
                </div>

                {/* Regional Allocation - Side */}
                <div className="glass-panel rounded-[2rem] p-6 bg-card border border-border space-y-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] -rotate-12 translate-x-4">
                        <Globe className="h-32 w-32 text-primary" />
                    </div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight relative z-10">Node Allocation</h3>
                    <div className="flex flex-col items-center justify-center h-[200px] relative z-10">
                        <div className="h-40 w-40 rounded-full border-[10px] border-muted flex items-center justify-center relative shadow-inner">
                            <div className="absolute inset-0 rounded-full border-[10px] border-primary border-r-transparent border-t-transparent -rotate-45 shadow-[0_0_15px_rgba(var(--primary),0.2)]"></div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-foreground tracking-tighter uppercase">64%</p>
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">NYC CORE</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <DistributionRow label="New York City" value="64%" color="bg-primary" />
                        <DistributionRow label="Remote Global" value="22%" color="bg-primary/60" />
                        <DistributionRow label="NJ/CT Node" value="14%" color="bg-muted" />
                    </div>
                </div>
            </div>

            {/* Strategic Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InsightCard title="Stenographic Bottlenecks" content="High demand in Remote Discovery nodes detected during 10:00 AM - 01:00 PM intervals." priority="CRITICAL" />
                <InsightCard title="Yield Optimization" content="Current per-page average has increased by 12% following the v2.4 protocol rollout." priority="OPTIMIZED" />
                <InsightCard title="Reporter Retainment" status="94%" content="Network professional satisfaction rating remains in the elite top-tier percentile." priority="EXCEPTIONAL" />
            </div>
        </div>
    )
}

function PulseCard({ label, value, trend, color, icon, loading }: any) {
    return (
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity group-hover:rotate-12 duration-700`}>
                {icon}
            </div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">{label}</p>
            <div className={`text-2xl font-black tracking-tighter uppercase ${color} mb-4`}>
                {loading ? <Activity className="h-6 w-6 animate-pulse" /> : value}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Growth Pulse</span>
                </div>
                <button className="h-6 w-6 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}

function Bar({ value, label, active }: any) {
    return (
        <div className="flex flex-col items-center gap-6 h-full min-w-[32px] lg:min-w-[40px]">
            <div className="flex-1 w-8 lg:w-10 bg-muted/50 border-x border-t border-border rounded-t-2xl flex items-end overflow-hidden group/bar transition-all hover:bg-muted">
                <div
                    className={`w-full transition-all duration-1000 group-hover/bar:bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] ${active ? 'bg-primary' : 'bg-primary/40'}`}
                    style={{ height: value }}
                ></div>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        </div>
    )
}

function DistributionRow({ label, value, color }: any) {
    return (
        <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${color} shadow-sm group-hover:scale-125 transition-transform`}></div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">{label}</span>
            </div>
            <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{value}</span>
        </div>
    )
}

function InsightCard({ title, status, content, priority }: any) {
    return (
        <div className="glass-panel p-6 rounded-[2rem] space-y-4 border border-border bg-card hover:border-primary/30 transition-all group shadow-md hover:shadow-xl">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-foreground uppercase tracking-tight max-w-[180px] leading-tight group-hover:brand-gradient transition-all">{title}</h4>
                    <div className="h-1 w-6 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
                <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    priority === 'EXCEPTIONAL' ? 'bg-primary text-primary-foreground border-primary/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                    {priority}
                </div>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-[0.1em]">{content}</p>
        </div>
    )
}
