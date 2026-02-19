'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    DollarSign,
    Users,
    Calendar,
    Clock,
    ArrowUpRight,
    Download,
    Plus,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    TrendingUp,
    BarChart3
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

            const [bookingsRes, invoicesRes, usersRes] = await Promise.allSettled([
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/invoices', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
            ])

            // Bookings
            let allBookings: any[] = []
            if (bookingsRes.status === 'fulfilled' && bookingsRes.value.ok) {
                const d = await bookingsRes.value.json()
                allBookings = Array.isArray(d.bookings) ? d.bookings : []
            }
            setRecentBookings(allBookings.slice(0, 6))
            const upcoming = allBookings.filter((b: any) =>
                ['SUBMITTED', 'ACCEPTED', 'CONFIRMED'].includes(b.bookingStatus)
            ).length
            const pendingApprovals = allBookings.filter((b: any) => b.bookingStatus === 'SUBMITTED').length

            // Invoices
            let totalRevenue = 0
            if (invoicesRes.status === 'fulfilled' && invoicesRes.value.ok) {
                const d = await invoicesRes.value.json()
                const allInvoices = Array.isArray(d.invoices) ? d.invoices : []
                totalRevenue = allInvoices
                    .filter((i: any) => i.status === 'PAID')
                    .reduce((sum: number, i: any) => sum + (i.total || 0), 0)
            }

            // Users
            let reporters = 0
            if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
                const d = await usersRes.value.json()
                reporters = d.users?.filter((u: any) => u.role === 'REPORTER').length || 0
            }

            setStats({ totalRevenue, upcomingJobs: upcoming, activeReporters: reporters, reviewQueue: pendingApprovals })
        } catch (err) {
            console.error('Dashboard fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchDashboardData() }, [fetchDashboardData])

    const handleExport = () => {
        const csv = [
            'Metric,Value',
            `Total Revenue,$${stats.totalRevenue.toLocaleString()}`,
            `Upcoming Bookings,${stats.upcomingJobs}`,
            `Active Reporters,${stats.activeReporters}`,
            `Pending Review,${stats.reviewQueue}`,
        ].join('\n')
        const a = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
            download: `dashboard-${new Date().toISOString().slice(0, 10)}.csv`
        })
        a.click()
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'badge-success'
            case 'ACCEPTED': return 'badge-info'
            case 'SUBMITTED': return 'badge-warning'
            case 'COMPLETED': return 'badge-neutral'
            default: return 'badge-neutral'
        }
    }

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            SUBMITTED: 'Pending Review',
            ACCEPTED: 'Accepted',
            CONFIRMED: 'Confirmed',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled',
        }
        return map[status] ?? status
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const formatTime = (t: string) => {
        if (!t) return ''
        if (t.includes('AM') || t.includes('PM')) return t
        const [h, m] = t.split(':').map(Number)
        const ampm = h >= 12 ? 'PM' : 'AM'
        return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
    }

    const kpiCards = [
        {
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="h-5 w-5" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
            href: '/admin/analytics',
        },
        {
            label: 'Active Bookings',
            value: stats.upcomingJobs,
            icon: <Calendar className="h-5 w-5" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
            href: '/admin/calendar',
        },
        {
            label: 'Active Reporters',
            value: stats.activeReporters,
            icon: <Users className="h-5 w-5" />,
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-950/30',
            href: '/admin/reporters',
        },
        {
            label: 'Pending Review',
            value: stats.reviewQueue,
            icon: <Clock className="h-5 w-5" />,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
            href: '/admin/bookings?status=SUBMITTED',
            alert: stats.reviewQueue > 0,
        },
    ]

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6 lg:p-8 space-y-8 animate-fade-in">
            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Here&apos;s what&apos;s happening at Marina Dubson Stenographic today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExport}
                        className="btn-secondary flex items-center gap-2 text-sm">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <Link href="/admin/bookings" className="btn-primary text-sm">
                        <Plus className="h-4 w-4" />
                        New Booking
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
                {kpiCards.map((kpi) => (
                    <button
                        key={kpi.label}
                        onClick={() => router.push(kpi.href)}
                        className="stat-card text-left group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                                {kpi.icon}
                            </div>
                            {kpi.alert && (
                                <span className="badge badge-warning text-xs">
                                    <AlertCircle className="h-3 w-3" />
                                    Action needed
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                        <p className="text-2xl font-bold text-foreground">{loading ? '—' : kpi.value}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1
                                      opacity-0 group-hover:opacity-100 transition-opacity">
                            View details <ArrowUpRight className="h-3 w-3" />
                        </p>
                    </button>
                ))}
            </div>

            {/* ── Main content ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent bookings table */}
                <div className="lg:col-span-2 md-card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h3 className="font-semibold text-foreground">Recent Bookings</h3>
                        <Link href="/admin/bookings"
                            className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                            View all <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="divide-y divide-border">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="px-6 py-4 flex items-center gap-4">
                                    <div className="skeleton h-9 w-9 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="skeleton h-3.5 w-1/3 rounded" />
                                        <div className="skeleton h-3 w-1/2 rounded" />
                                    </div>
                                    <div className="skeleton h-6 w-20 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="py-16 text-center">
                            <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">No bookings yet</p>
                            <Link href="/admin/bookings" className="btn-primary mt-4 inline-flex text-sm">
                                Create first booking
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentBookings.map((b) => (
                                <div
                                    key={b.id}
                                    onClick={() => router.push('/admin/bookings')}
                                    className="px-6 py-4 flex items-center gap-4 hover:bg-muted/40 cursor-pointer transition-colors group"
                                >
                                    {/* Date chip */}
                                    <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-muted border border-border flex-shrink-0">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                                            {formatDate(b.bookingDate).split(' ')[0]}
                                        </span>
                                        <span className="text-base font-bold text-foreground leading-none">
                                            {formatDate(b.bookingDate).split(' ')[1].replace(',', '')}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-xs text-muted-foreground font-mono">{b.bookingNumber}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {b.contact?.companyName
                                                || `${b.contact?.firstName ?? ''} ${b.contact?.lastName ?? ''}`.trim()
                                                || 'Unknown Client'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {b.proceedingType} · {formatTime(b.bookingTime)}
                                        </p>
                                    </div>

                                    {/* Status & action */}
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`badge ${getStatusStyle(b.bookingStatus)} text-xs`}>
                                            {getStatusLabel(b.bookingStatus)}
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side column */}
                <div className="space-y-5">
                    {/* Quick actions */}
                    <div className="md-card p-5">
                        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Schedule booking', href: '/admin/bookings', icon: <Calendar className="h-4 w-4" /> },
                                { label: 'Post a job', href: '/admin/jobs', icon: <Briefcase className="h-4 w-4" /> },
                                { label: 'Send email campaign', href: '/admin/email-campaigns', icon: <BarChart3 className="h-4 w-4" /> },
                                { label: 'View reports', href: '/admin/reports', icon: <TrendingUp className="h-4 w-4" /> },
                            ].map((action) => (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                                >
                                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                        {action.icon}
                                    </span>
                                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Status overview */}
                    <div className="md-card p-5">
                        <h3 className="font-semibold text-foreground mb-4">Platform Status</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Booking system', ok: true },
                                { label: 'Message service', ok: true },
                                { label: 'Email delivery', ok: true },
                                { label: 'File storage', ok: true },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${item.ok ? 'text-emerald-600' : 'text-red-600'}`}>
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Operational
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
