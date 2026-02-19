'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Calendar,
    ArrowRight,
    User,
    Clock,
    Search,
    MapPin,
    Zap,
    Globe
} from 'lucide-react'
import { format } from 'date-fns'

export default function ClientBookingsPage() {
    const router = useRouter()
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }
                const res = await fetch('/api/bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                setBookings(data.bookings || [])
            } catch (error) {
                console.error('Failed to fetch bookings:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [router])

    const filteredBookings = bookings.filter(b => {
        const q = searchQuery.toLowerCase()
        return !searchQuery ||
            b.bookingNumber?.toLowerCase().includes(q) ||
            b.proceedingType?.toLowerCase().includes(q) ||
            b.caseName?.toLowerCase().includes(q)
    })

    return (
        <div className="min-h-screen bg-background font-poppins text-foreground pb-20">
            {/* Elite Client Header */}
            <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-2xl border-b border-border px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/client/portal" className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                        MD
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2 uppercase">
                            Case <span className="text-primary italic">Registry</span>
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Operational Logistics Desk</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/client/bookings/new" className="h-12 px-6 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
                        <Zap className="h-4 w-4" /> New Request
                    </Link>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 py-16">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                            Assignment <span className="text-primary">Matrix</span>
                        </h2>
                        <p className="text-muted-foreground font-medium max-w-lg leading-relaxed uppercase tracking-widest text-[10px]">Monitoring verified stenographic deployments across the global node network.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl shadow-primary/5 min-w-[240px]">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Upcoming Jobs</p>
                            <p className="text-4xl font-black text-foreground tracking-tighter">{bookings.length}</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl shadow-primary/5 min-w-[240px]">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Sync Nodes</p>
                            <p className="text-4xl font-black text-primary tracking-tighter flex items-center gap-3">
                                <Globe className="h-8 w-8" /> Active
                            </p>
                        </div>
                    </div>
                </div>

                {/* Registry View */}
                <div className="glass-panel rounded-[3rem] overflow-hidden border border-border">
                    <div className="px-10 py-8 border-b border-border bg-muted/20 flex items-center justify-between">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Active Assignments</h3>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="pl-12 pr-6 py-3 rounded-2xl bg-muted border-none outline-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 text-foreground w-[300px]"
                                    placeholder="Search Case Matrix..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-border">
                        {loading ? (
                            <div className="p-20 text-center text-muted-foreground uppercase font-black text-xs tracking-widest">Synchronizing Registry...</div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="p-20 text-center text-muted-foreground uppercase font-black text-xs tracking-widest">No matching assignments found.</div>
                        ) : filteredBookings.map(b => (
                            <div key={b.id} className="px-10 py-10 hover:bg-primary/5 transition-all cursor-pointer group flex items-center justify-between">
                                <div className="flex items-center gap-10">
                                    <div className="h-20 w-20 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center group-hover:border-primary/20 transition-colors">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase">{format(new Date(b.bookingDate), 'MMM')}</span>
                                        <span className="text-2xl font-black text-foreground">{format(new Date(b.bookingDate), 'dd')}</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-lg">{b.bookingNumber}</span>
                                            <h4 className="text-2xl font-black text-foreground uppercase tracking-tight">{b.proceedingType}</h4>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground/60" />
                                                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{b.bookingTime}</span>
                                            </div>
                                            <div className="h-3 w-px bg-border"></div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground/60" />
                                                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{b.appearanceType} NODE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-16">
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Linked Steno</p>
                                        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${!b.reporter ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                            <User className={`h-4 w-4 ${!b.reporter ? 'text-amber-500' : 'text-emerald-500'}`} />
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${!b.reporter ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {b.reporter ? `${b.reporter.firstName} ${b.reporter.lastName}` : 'PENDING'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'
                                        }`}>
                                        {b.bookingStatus}
                                    </div>

                                    <button onClick={() => router.push(`/client/portal?tab=bookings`)} className="h-14 w-14 rounded-[1.5rem] bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-xl transition-all">
                                        <ArrowRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
