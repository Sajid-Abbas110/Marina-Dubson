'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    DollarSign,
    Users,
    Calendar,
    Clock,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Download,
    Plus,
    Filter,
    FileText,
    Zap,
    Shield,
    Smartphone,
    Activity
} from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [stats, setStats] = useState({
        totalRevenue: 0,
        upcomingJobs: 0,
        activeReporters: 0,
        reviewQueue: 0,
    })
    const [recentBookings, setRecentBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDashboardData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')

            const bookingsRes = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const bookingsData = await bookingsRes.json()
            const allBookings = Array.isArray(bookingsData.bookings) ? bookingsData.bookings : []
            setRecentBookings(allBookings.slice(0, 5))

            const invoicesRes = await fetch('/api/invoices', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const invoicesData = await invoicesRes.json()
            const allInvoices = Array.isArray(invoicesData.invoices) ? invoicesData.invoices : []

            const totalRevenue = allInvoices
                .filter((i: any) => i && i.status === 'PAID')
                .reduce((sum: number, i: any) => sum + (i.total || 0), 0)

            const upcoming = allBookings.filter((b: any) =>
                ['SUBMITTED', 'ACCEPTED', 'CONFIRMED'].includes(b.bookingStatus)
            ).length

            const pendingApprovals = allBookings.filter((b: any) =>
                b.bookingStatus === 'SUBMITTED'
            ).length

            setStats({
                totalRevenue,
                upcomingJobs: upcoming,
                activeReporters: 0,
                reviewQueue: pendingApprovals,
            } as any)

            const usersRes = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (usersRes.ok) {
                const usersData = await usersRes.json()
                const reporters = usersData.users?.filter((u: any) => u.role === 'REPORTER').length || 0
                setStats(prev => ({ ...prev, activeReporters: reporters }))
            }

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDashboardData()
    }, [fetchDashboardData])

    const handleExportAnalytics = () => {
        const csvData = `Dashboard Analytics Export
Generated: ${new Date().toLocaleString()}

Metric,Value
Total Revenue,$${stats.totalRevenue.toLocaleString()}
Upcoming Jobs,${stats.upcomingJobs}
Active Reporters,${stats.activeReporters}
Review Queue,${stats.reviewQueue}
`
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `dashboard-analytics-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase()
        const day = date.getDate()
        return `${month} ${day}`
    }

    const formatTime = (timeString: string) => {
        if (timeString.includes('AM') || timeString.includes('PM')) return timeString
        const [hours, minutes] = timeString.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                        <Activity className="h-3 w-3" /> System Operational
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase leading-none">
                        COMMAND <span className="brand-gradient italic">CENTER</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.4em]">Monitoring Marina Dubson Stenographic Infrastructure</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleExportAnalytics}
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:translate-y-[-2px] group"
                    >
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Export Analytics</span>
                    </button>
                    <Link
                        href="/admin/bookings"
                        className="luxury-button flex items-center gap-3 px-10 py-4"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="uppercase tracking-widest text-[10px] font-black">Initiate Booking</span>
                    </Link>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Revenue Performance"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign />}
                    trend="+12.5%"
                    trendUp={true}
                    onClick={() => router.push('/admin/analytics')}
                />
                <KPICard
                    title="Operational Load"
                    value={stats.upcomingJobs}
                    icon={<Calendar />}
                    trend={`+${stats.upcomingJobs} New`}
                    trendUp={true}
                    onClick={() => router.push('/admin/calendar')}
                />
                <KPICard
                    title="Active Reporters"
                    value={stats.activeReporters}
                    icon={<Users />}
                    trend="Verified"
                    trendUp={true}
                    onClick={() => router.push('/admin/team')}
                />
                <KPICard
                    title="Review Queue"
                    value={stats.reviewQueue}
                    icon={<Clock />}
                    trend={`${stats.reviewQueue} Ready`}
                    trendUp={false}
                    onClick={() => router.push('/admin/bookings?status=SUBMITTED')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="glass-panel rounded-[3rem] overflow-hidden bg-card border border-border shadow-2xl">
                        <div className="px-10 py-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Recent Assignments</h3>
                            <Link href="/admin/bookings" className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-all hover:translate-x-1">View All Operations →</Link>
                        </div>
                        <div className="divide-y divide-border">
                            {loading ? (
                                <div className="px-6 py-20 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Assignments Matrix...</div>
                            ) : recentBookings.length === 0 ? (
                                <div className="px-6 py-20 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">No recent assignments found</div>
                            ) : (
                                recentBookings.map((booking) => (
                                    <JobRow
                                        key={booking.id}
                                        id={booking.bookingNumber}
                                        client={booking.contact?.companyName || `${booking.contact?.firstName} ${booking.contact?.lastName}`}
                                        types={[booking.appearanceType === 'REMOTE' ? 'Remote' : 'In-Person', booking.proceedingType]}
                                        time={formatTime(booking.bookingTime)}
                                        date={formatDate(booking.bookingDate)}
                                        status={booking.bookingStatus === 'ACCEPTED' ? 'Confirmed' : booking.bookingStatus === 'SUBMITTED' ? 'Pending' : 'Draft'}
                                        bookingId={booking.id}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <div className="bg-primary rounded-[3rem] p-10 text-primary-foreground relative overflow-hidden group shadow-2xl shadow-primary/30">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Zap className="h-40 w-40" />
                        </div>
                        <div className="relative z-10">
                            <Zap className="h-10 w-10 text-yellow-400 mb-6 animate-pulse" />
                            <h4 className="text-2xl font-black tracking-tight leading-tight mb-4 uppercase">Elite Concierge</h4>
                            <p className="text-primary-foreground/90 text-sm font-medium mb-10 leading-relaxed uppercase tracking-tight">Direct channel for immediate case escalations and priority logistical adjustments.</p>
                            <Link
                                href="/admin/messages"
                                className="block w-full py-5 bg-background text-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-muted transition-all text-center shadow-2xl"
                            >
                                Connect Now
                            </Link>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 space-y-10 border border-border bg-card shadow-xl">
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.3em]">Node Integrity</h4>
                                <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-8">
                                <ResourceStat label="Storage Cluster" used={78} color="bg-primary" />
                                <ResourceStat label="Network Traffic" used={32} color="bg-primary/60" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-border">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                    <Smartphone className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Mobile Device Sync</p>
                                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter italic">Last Pulse: 2m ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ title, value, icon, trend, trendUp, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="bg-card p-10 rounded-[2.5rem] border border-border hover:border-primary/20 transition-all duration-500 cursor-pointer group hover:shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-700">
                {icon}
            </div>
            <div className="flex justify-between items-start relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <div className="scale-125">{icon}</div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${trendUp ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                    {trend}
                </div>
            </div>
            <div className="mt-10 relative z-10">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">{title}</h3>
                <p className="text-4xl font-black text-foreground tracking-tighter uppercase">{value}</p>
            </div>
        </div>
    )
}

function JobRow({ id, client, types, time, date, status, bookingId }: any) {
    const router = useRouter()

    return (
        <div
            onClick={() => router.push(`/admin/bookings`)}
            className="px-10 py-7 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-primary/5 transition-all cursor-pointer group gap-8 border-l-4 border-transparent hover:border-primary"
        >
            <div className="flex items-center gap-8 lg:gap-10">
                <div className="flex flex-col items-center justify-center px-5 py-4 rounded-2xl bg-muted border border-border shadow-sm group-hover:border-primary/20 transition-all flex-shrink-0">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{date.split(' ')[0]}</span>
                    <span className="text-xl font-black text-foreground">{date.split(' ')[1]}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{id}</span>
                        <h4 className="text-base font-black text-foreground uppercase tracking-tight">{client}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {types.map((t: string) => (
                            <span key={t} className="px-3 py-1 rounded-lg bg-muted border border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-8 lg:gap-12">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-foreground">{time}</p>
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Operational Start</p>
                </div>
                <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-muted text-muted-foreground border-border'
                    }`}>
                    {status}
                </div>
                <button
                    className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-card transition-all"
                >
                    <ArrowUpRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    )
}

function ResourceStat({ label, used, color }: any) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{used}%</span>
            </div>
            <div className="h-2 w-full bg-muted border border-border rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${used}%` }}></div>
            </div>
        </div>
    )
}
