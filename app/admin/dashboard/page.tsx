'use client'

import { useState, useEffect } from 'react'
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
    Smartphone
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

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token')

            // Fetch bookings
            const bookingsRes = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await bookingsRes.json()
            const allBookings = Array.isArray(data.bookings) ? data.bookings : []
            setRecentBookings(allBookings.slice(0, 5))

            // Fetch invoices
            const invoicesRes = await fetch('/api/invoices', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await invoicesRes.json()
            const allInvoices = Array.isArray(data.invoices) ? data.invoices : []

            // Calculate stats
            const totalRevenue = allInvoices
                .filter((i: any) => i && i.status === 'PAID')
                .reduce((sum: number, i: any) => sum + (i.total || 0), 0)

            const unpaidRevenue = allInvoices
                .filter((i: any) => i && i.status !== 'PAID')
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
                activeReporters: 0, // Will update below
                reviewQueue: pendingApprovals,
                unpaidRevenue // Added new stat internally
            } as any)

            // Fetch users to count reporters
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
    }

    const handleExportAnalytics = () => {
        // Generate CSV export
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
        // Handle both "HH:MM" and "HH:MM AM/PM" formats
        if (timeString.includes('AM') || timeString.includes('PM')) {
            return timeString
        }
        const [hours, minutes] = timeString.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-1000">
            {/* Elite Welcome & Actions */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        System Operational
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        COMMAND <span className="text-primary italic">CENTER</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">Monitoring Marina Dubson Stenographic Infrastructure</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleExportAnalytics}
                        className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl dark:shadow-none hover:border-primary/20 dark:hover:border-primary/50 transition-all group active:scale-95"
                    >
                        <Download className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Export Analytics</span>
                    </button>
                    <Link
                        href="/admin/bookings"
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Initiate Booking
                    </Link>
                </div>
            </div>

            {/* High-Impact KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign />}
                    trend="+12.5%"
                    trendUp={true}
                    grad="from-emerald-500 to-teal-700"
                    onClick={() => router.push('/admin/analytics')}
                />
                <KPICard
                    title="Upcoming Jobs"
                    value={stats.upcomingJobs}
                    icon={<Calendar />}
                    trend={`+${stats.upcomingJobs} New`}
                    trendUp={true}
                    grad="from-primary to-emerald-800"
                    onClick={() => router.push('/admin/bookings')}
                />
                <KPICard
                    title="Active Reporters"
                    value={stats.activeReporters}
                    icon={<Users />}
                    trend="Stable"
                    trendUp={true}
                    grad="from-purple-600 to-pink-700"
                    onClick={() => router.push('/admin/team')}
                />
                <KPICard
                    title="Review Queue"
                    value={stats.reviewQueue}
                    icon={<Clock />}
                    trend={`${stats.reviewQueue} Ready`}
                    trendUp={false}
                    grad="from-orange-500 to-rose-600"
                    onClick={() => router.push('/admin/bookings?status=SUBMITTED')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden">
                        <div className="px-6 lg:px-8 py-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-white/[0.02]">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent Assignments</h3>
                            <Link href="/admin/bookings" className="text-[10px] font-black text-primary hover:text-emerald-600 uppercase tracking-widest">View All Operations →</Link>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/5">
                            {loading ? (
                                <div className="px-6 py-12 text-center text-gray-400 text-sm">Loading assignments...</div>
                            ) : recentBookings.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-400 text-sm">No recent assignments</div>
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

                {/* Cyber Sidebar Widgets */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-gray-900 via-primary/20 to-emerald-900 dark:from-black dark:via-primary/10 dark:to-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                        <div className="relative z-10">
                            <Zap className="h-10 w-10 text-yellow-400 mb-6 animate-float" />
                            <h4 className="text-2xl font-black tracking-tight leading-tight mb-2">PREMIUM SUPPORT</h4>
                            <p className="text-emerald-100 text-sm font-medium mb-8 leading-relaxed">Direct line to Marina for immediate case escalations and elite adjustments.</p>
                            <Link
                                href="/admin/messages"
                                className="block w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 hover:shadow-2xl transition-all text-center"
                            >
                                Connect Now
                            </Link>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2.5rem] p-8 space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">System Resources</h4>
                                <Shield className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="space-y-6">
                                <ResourceStat label="Storage Capacity" used="78" color="bg-primary" />
                                <ResourceStat label="Server Load" used="32" color="bg-emerald-500" />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                                    <Smartphone className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase">Mobile App Sync</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-0.5">Last Sync: 2m ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ title, value, icon, trend, trendUp, grad, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="glass-panel rounded-[2.5rem] p-8 group relative overflow-hidden cursor-pointer hover:shadow-xl transition-all"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${grad} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}></div>
            <div className="flex justify-between items-start relative z-10">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trendUp ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {trend}
                </div>
            </div>
            <div className="mt-8 relative z-10">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-2">{title}</h3>
                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
            </div>
        </div>
    )
}

function JobRow({ id, client, types, time, date, status, bookingId }: any) {
    const router = useRouter()

    return (
        <div className="px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/5 transition-all cursor-pointer group gap-6">
            <div className="flex items-center gap-6 lg:gap-8">
                <div className="flex flex-col items-center justify-center px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm group-hover:border-primary/20 dark:group-hover:border-primary/50 transition-colors flex-shrink-0">
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{date.split(' ')[0]}</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">{date.split(' ')[1]}</span>
                </div>
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{id}</span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">{client}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {types.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-white/5 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 lg:gap-8">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-gray-900 dark:text-white">{time}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Start Time</p>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${status === 'Confirmed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                    status === 'Pending' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20' :
                        'bg-gray-50 dark:bg-white/10 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10'
                    }`}>
                    {status}
                </div>
                <button
                    onClick={() => router.push(`/admin/bookings`)}
                    className="h-10 w-10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                    <ArrowUpRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

function ResourceStat({ label, used, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-400 dark:text-gray-500">{label}</span>
                <span className="text-gray-900 dark:text-white">{used}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${used}%` }}></div>
            </div>
        </div>
    )
}
