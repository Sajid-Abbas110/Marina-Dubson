'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    Calendar,
    Link as LinkIcon,
    ArrowRight,
    User,
    CheckCircle,
    Clock,
    Search,
    Briefcase,
    Filter,
    ChevronDown,
    MapPin,
    Building2,
    DollarSign,
    Zap,
    Shield,
    TrendingUp,
    X,
    CheckCircle2
} from 'lucide-react'

export default function BookingManagementPage() {
    const [filter, setFilter] = useState('ALL')
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const searchParams = useSearchParams()

    useEffect(() => {
        const q = searchParams.get('q')
        if (q) setSearchQuery(q)
    }, [searchParams])

    const [showBidsModal, setShowBidsModal] = useState(false)
    const [selectedBookingBids, setSelectedBookingBids] = useState<any[]>([])
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setBookings(Array.isArray(data.bookings) ? data.bookings : [])
        } catch (error) {
            console.error('Failed to fetch bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token')
            await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bookingStatus: status }),
            })
            fetchBookings()
        } catch (error) {
            console.error('Failed to update status:', error)
        }
    }

    const toggleMarketplace = async (id: string, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('token')
            await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isMarketplace: !currentStatus }),
            })
            fetchBookings()
        } catch (error) {
            console.error('Failed to toggle marketplace:', error)
        }
    }

    const viewBids = async (bookingId: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/market/bids?bookingId=${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setSelectedBookingBids(data.bids || [])
            setSelectedBookingId(bookingId)
            setShowBidsModal(true)
        } catch (error) {
            console.error('Failed to fetch bids:', error)
        }
    }

    const acceptBid = async (bidId: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/market/bids', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bidId, status: 'ACCEPTED' })
            })
            if (res.ok) {
                viewBids(selectedBookingId!)
                fetchBookings()
            }
        } catch (error) {
            console.error('Failed to accept bid:', error)
        }
    }

    const declineBid = async (bidId: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/market/bids', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bidId, status: 'DECLINED' })
            })
            if (res.ok) {
                viewBids(selectedBookingId!)
            }
        } catch (error) {
            console.error('Failed to decline bid:', error)
        }
    }

    const [showCompleteModal, setShowCompleteModal] = useState(false)
    const [billingData, setBillingData] = useState({
        pages: 0,
        originalCopies: 1,
        additionalCopies: 0,
        realtimeDevices: 0,
        hasRough: false,
        hasVideographer: false,
        hasInterpreter: false,
        hasExpert: false,
        afterHoursCount: 0,
        waitTimeCount: 0
    })

    const handleComplete = async (id: string) => {
        try {
            setError(null)
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/bookings/${id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(billingData),
            })
            if (res.ok) {
                setShowCompleteModal(false)
                fetchBookings()
            } else {
                const data = await res.json()
                setError(data.error || 'Automation sync failed. Please check connectivity.')
            }
        } catch (error: any) {
            console.error('Job completion error:', error)
            setError(error.message || 'An unexpected error occurred during transmission.')
        }
    }

    const getDraftCalculation = () => {
        const booking = bookings.find(b => b.id === selectedBookingId)
        if (!booking) return { subtotal: 0, total: 0, breakdown: [] as any[] }

        // Match PricingEngine defaults + locked rates
        const rates = {
            pageRate: booking.lockedPageRate || 4.25,
            copyRate: 1.50,
            appearance: booking.lockedAppearanceFee || (booking.appearanceType === 'REMOTE' ? 350 : 400),
            congestion: 15.00,
            roughRate: 1.50,
            videoRate: 1.25,
            interpreterRate: 1.25,
            expertRate: 2.00,
            afterHoursRate: 125,
            waitTimeRate: 100,
            minFee: booking.lockedMinimumFee || 500
        }

        const breakdown = []
        let currentSub = 0

        // 1. Pages Base
        const pageCharge = billingData.pages * rates.pageRate
        if (pageCharge > 0) {
            breakdown.push({ label: 'Original Transcript', value: pageCharge, detail: `${billingData.pages} pgs @ $${rates.pageRate}` })
            currentSub += pageCharge
        }

        // 2. Copies (Printing)
        if (billingData.additionalCopies > 0) {
            const copyCharge = billingData.pages * rates.copyRate * billingData.additionalCopies
            breakdown.push({ label: 'Transcript Copies (Printing)', value: copyCharge, detail: `${billingData.additionalCopies} sets @ $${rates.copyRate}/pg` })
            currentSub += copyCharge
        }

        // 3. Logistics
        breakdown.push({ label: 'Logistics & Appearance', value: rates.appearance + rates.congestion, detail: 'Base + Congestion Fee' })
        currentSub += (rates.appearance + rates.congestion)

        // 4. Components Matrix
        if (billingData.hasRough) {
            const rough = billingData.pages * rates.roughRate
            breakdown.push({ label: 'Rough Draft Premium', value: rough, detail: `+$${rates.roughRate}/pg` })
            currentSub += rough
        }
        if (billingData.hasVideographer) {
            const video = billingData.pages * rates.videoRate
            breakdown.push({ label: 'Videography Component', value: video, detail: `+$${rates.videoRate}/pg` })
            currentSub += video
        }
        if (billingData.hasInterpreter) {
            const interp = billingData.pages * rates.interpreterRate
            breakdown.push({ label: 'Interpreter Coordination', value: interp, detail: `+$${rates.interpreterRate}/pg` })
            currentSub += interp
        }
        if (billingData.hasExpert) {
            const expert = billingData.pages * rates.expertRate
            breakdown.push({ label: 'Expert Witness Logistics', value: expert, detail: `+$${rates.expertRate}/pg` })
            currentSub += expert
        }

        // 5. Hourly
        if (billingData.afterHoursCount > 0) {
            const ah = billingData.afterHoursCount * rates.afterHoursRate
            breakdown.push({ label: 'Afterhours Surcharge', value: ah, detail: `${billingData.afterHoursCount} hrs @ $${rates.afterHoursRate}` })
            currentSub += ah
        }
        if (billingData.waitTimeCount > 0) {
            const wt = billingData.waitTimeCount * rates.waitTimeRate
            breakdown.push({ label: 'Wait Time Surcharge', value: wt, detail: `${billingData.waitTimeCount} hrs @ $${rates.waitTimeRate}` })
            currentSub += wt
        }

        const total = Math.max(currentSub, rates.minFee)
        if (total > currentSub) {
            breakdown.push({ label: 'Minimum Fee Offset', value: rates.minFee - currentSub, detail: `Adjusted to $${rates.minFee}` })
        }

        return { subtotal: currentSub, total, breakdown }
    }

    const calculation = getDraftCalculation()


    useEffect(() => {
        fetchBookings()
    }, [])

    return (
        <div className="max-w-full w-full sm:w-[98%] mx-auto px-3 py-6 sm:p-6 lg:p-12 space-y-8 sm:space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight uppercase leading-none">
                        Tactical <span className="brand-gradient italic">Registry</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em]">Bridging Clients & Reporters across the MD Global Node.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group w-full xl:w-auto">
                        <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full xl:min-w-[400px] pl-11 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-4 rounded-xl bg-card border border-border text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] outline-none focus:ring-4 focus:ring-primary/10 text-foreground transition-all shadow-inner"
                            placeholder="CASE_ID OR CLIENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Matrix Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <FilterTab active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Full Matrix" count={(bookings || []).length.toString()} />
                <FilterTab active={filter === 'SUBMITTED'} onClick={() => setFilter('SUBMITTED')} label="Requires Review" count={(bookings || []).filter(b => b.bookingStatus === 'SUBMITTED').length.toString()} />
                <FilterTab active={filter === 'ACCEPTED'} onClick={() => setFilter('ACCEPTED')} label="Active Logistics" count={(bookings || []).filter(b => b.bookingStatus === 'ACCEPTED').length.toString()} />
                <div className="ml-auto h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm cursor-pointer hover:bg-muted hover:border-primary/20 transition-all text-muted-foreground">
                    <Filter className="h-3.5 w-3.5" />
                </div>
            </div>

            {/* Operational Grid */}
            <div className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-border shadow-2xl">
                <div className="px-5 sm:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 sm:h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse"></div>
                        <h3 className="text-[11px] sm:text-sm font-black text-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em] truncate">Active Logistics Matrix</h3>
                    </div>
                    <div className="flex items-center justify-start sm:justify-end gap-5 sm:gap-8 text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                        <span className="flex items-center gap-2 flex-shrink-0"><Activity className="h-3 w-3" /> Nominal</span>
                        <div className="h-4 w-px bg-border"></div>
                        <span className="flex items-center gap-2 flex-shrink-0"><Zap className="h-3 w-3" /> 0.2ms</span>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-32 text-center text-muted-foreground uppercase font-black text-[10px] tracking-[0.5em] animate-pulse">Synchronizing Matrix Data...</div>
                    ) : (bookings || []).filter(b => {
                        const matchesFilter = filter === 'ALL' || b.bookingStatus === filter
                        const q = searchQuery.toLowerCase()
                        const matchesSearch = !searchQuery ||
                            b.bookingNumber?.toLowerCase().includes(q) ||
                            b.proceedingType?.toLowerCase().includes(q) ||
                            b.contact?.companyName?.toLowerCase().includes(q) ||
                            `${b.contact?.firstName} ${b.contact?.lastName}`.toLowerCase().includes(q)
                        return matchesFilter && matchesSearch
                    }).map(b => (
                        <div key={b.id} className="px-4 sm:px-8 py-5 sm:py-6 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-l-4 border-transparent hover:border-primary">
                            <div className="flex flex-row items-center gap-4 sm:gap-6 lg:gap-10">
                                {/* Date Pillar */}
                                <div className="flex flex-col items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-muted border border-border shadow-sm group-hover:border-primary/20 transition-all flex-shrink-0">
                                    <span className="text-[7px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{new Date(b.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-base sm:text-xl font-black text-foreground">{new Date(b.bookingDate).getDate()}</span>
                                </div>

                                {/* Logistics Identity */}
                                <div className="space-y-1.5">
                                    <div className="flex flex-col gap-1 sm:gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 rounded-lg bg-primary/10 text-[7px] sm:text-[9px] font-black text-primary border border-primary/20 uppercase tracking-widest leading-none">{b.bookingNumber}</span>
                                        </div>
                                        <h4 className="text-sm sm:text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">{b.proceedingType}</h4>
                                    </div>
                                    <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-muted-foreground/40" />
                                            <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">{b.contact.companyName || `${b.contact.firstName} ${b.contact.lastName}`}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-muted-foreground/40" />
                                            <span className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em]">{b.bookingTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 lg:gap-12 px-2 sm:px-0">
                                {/* Assignment Bridge */}
                                <div className="flex flex-row sm:flex-col gap-3 items-center sm:items-end min-w-[120px]">
                                    <p className="hidden sm:block text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Assignment</p>
                                    {b.reporter ? (
                                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                            <User className="h-3 w-3" />
                                            <span className="text-[8px] sm:text-[10px] font-black uppercase">{b.reporter.firstName} {b.reporter.lastName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleMarketplace(b.id, b.isMarketplace)}
                                                className={`px-3 py-1.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest border transition-all ${b.isMarketplace ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground border-border hover:border-primary/20 hover:text-primary'}`}
                                            >
                                                {b.isMarketplace ? 'Market' : 'Push'}
                                            </button>
                                            {b.isMarketplace && (
                                                <button
                                                    onClick={() => viewBids(b.id)}
                                                    className="luxury-button px-3 py-1.5 h-auto text-[8px] sm:text-[9px]"
                                                >
                                                    Bids
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status Toggle Automation */}
                                <div className="flex flex-wrap items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-muted border border-border">
                                    {b.bookingStatus === 'SUBMITTED' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, 'ACCEPTED')}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-primary text-primary-foreground text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-md active:scale-95"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'MAYBE')}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-500 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-md active:scale-95"
                                            >
                                                Maybe
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'DECLINED')}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-500 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-md active:scale-95"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {b.bookingStatus === 'MAYBE' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, 'ACCEPTED')}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-primary text-primary-foreground text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-md active:scale-95"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'DECLINED')}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-500 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] transition-all shadow-md active:scale-95"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {b.bookingStatus === 'ACCEPTED' && (
                                        <button
                                            onClick={() => {
                                                setSelectedBookingId(b.id)
                                                setShowCompleteModal(true)
                                            }}
                                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-foreground text-background text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all shadow-xl active:scale-95"
                                        >
                                            Complete & Bill
                                        </button>
                                    )}
                                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-muted-foreground bg-card border border-border rounded-xl">{b.bookingStatus}</div>
                                </div>

                                <button className="flex h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-card border border-border items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex-shrink-0">
                                    <ArrowRight className="h-4 sm:h-6 w-4 sm:w-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bids Management Modal */}
            {showBidsModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:pl-80 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowBidsModal(false)}></div>
                    <div className="relative w-full max-w-4xl bg-card rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-3xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between mb-8 sm:mb-12">
                            <div className="flex items-center gap-4 sm:gap-8">
                                <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-xl sm:rounded-[1.5rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl">
                                    <TrendingUp className="h-5 w-5 sm:h-9 sm:w-9" />
                                </div>
                                <div className="space-y-0.5 sm:space-y-1">
                                    <h2 className="text-xl sm:text-3xl font-black text-foreground uppercase tracking-tight">Marketplace Bids</h2>
                                    <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em]">Qualified nodes for deployment</p>
                                </div>
                            </div>
                            <button onClick={() => setShowBidsModal(false)} className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center">
                                <X className="h-5 w-5 sm:h-7 sm:w-7" />
                            </button>
                        </div>

                        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {selectedBookingBids.length === 0 ? (
                                <div className="py-24 text-center font-black text-[10px] uppercase tracking-[0.5em] text-muted-foreground animate-pulse">No signals detected...</div>
                            ) : selectedBookingBids.map(bid => (
                                <div key={bid.id} className="p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] bg-muted/30 border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between hover:border-primary/20 transition-all group relative overflow-hidden gap-6">
                                    <div className="flex items-center gap-4 sm:gap-8 relative z-10">
                                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-card border border-border flex items-center justify-center text-lg font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                            {bid.reporter.firstName[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors">{bid.reporter.firstName} {bid.reporter.lastName}</h4>
                                            <span className="text-[7px] sm:text-[9px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg uppercase border border-primary/20 tracking-widest leading-none">{bid.reporter.certification || 'Verified'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between sm:justify-end gap-6 sm:gap-16 relative z-10">
                                        <div className="text-right">
                                            <p className="text-[7px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Payoff</p>
                                            <p className="text-xl sm:text-3xl font-black text-foreground tracking-tighter">${bid.amount}</p>
                                        </div>
                                        {bid.status === 'PENDING' ? (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => declineBid(bid.id)}
                                                    className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-muted border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/20 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Decline
                                                </button>
                                                <button
                                                    onClick={() => acceptBid(bid.id)}
                                                    className="h-10 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-foreground text-background text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${bid.status === 'ACCEPTED'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                {bid.status}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-700">
                                        <Zap className="h-20 w-20 text-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Billing Completion Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:pl-80 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowCompleteModal(false)}></div>
                    <div className="relative w-full max-w-3xl bg-card rounded-[2rem] sm:rounded-[3.5rem] shadow-3xl border border-border flex flex-col max-h-[90vh] overflow-hidden p-6 sm:p-12">
                        {/* Modal Header */}
                        <div className="flex items-center gap-4 sm:gap-8 mb-8 sm:mb-12 flex-shrink-0">
                            <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-xl sm:rounded-[1.5rem] bg-foreground text-background flex items-center justify-center shadow-2xl flex-shrink-0">
                                <DollarSign className="h-5 w-5 sm:h-9 sm:w-9" />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <h2 className="text-xl sm:text-3xl font-black text-foreground uppercase tracking-tight">Finalize & Bill</h2>
                                <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em]">Logistical data for invoicing</p>
                            </div>
                            <button onClick={() => setShowCompleteModal(false)} className="ml-auto h-10 w-10 sm:h-14 sm:w-14 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center">
                                <X className="h-5 w-5 sm:h-7 sm:w-7" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto custom-scrollbar space-y-6 sm:space-y-10 pr-2 sm:pr-4">
                            <div className="grid grid-cols-2 gap-4 sm:gap-8">
                                <div className="space-y-2 sm:space-y-4">
                                    <label className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.4em] ml-1 sm:ml-2">Total Pages</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-lg sm:text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.pages}
                                        onChange={(e) => setBillingData({ ...billingData, pages: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2 sm:space-y-4">
                                    <label className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.4em] ml-1 sm:ml-2">Copies</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-lg sm:text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.additionalCopies}
                                        onChange={(e) => setBillingData({ ...billingData, additionalCopies: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-[2rem] p-8 border border-border space-y-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <label className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Extended Logistics Matrix</label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <CheckboxItem label="Rough Draft" checked={billingData.hasRough} onChange={(v) => setBillingData({ ...billingData, hasRough: v })} />
                                    <CheckboxItem label="Videographer" checked={billingData.hasVideographer} onChange={(v) => setBillingData({ ...billingData, hasVideographer: v })} />
                                    <CheckboxItem label="Interpreter" checked={billingData.hasInterpreter} onChange={(v) => setBillingData({ ...billingData, hasInterpreter: v })} />
                                    <CheckboxItem label="Expert Presence" checked={billingData.hasExpert} onChange={(v) => setBillingData({ ...billingData, hasExpert: v })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:gap-8">
                                <div className="space-y-2 sm:space-y-4">
                                    <label className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.4em] ml-1 sm:ml-2">Afterhours (Hrs)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-lg sm:text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.afterHoursCount}
                                        onChange={(e) => setBillingData({ ...billingData, afterHoursCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2 sm:space-y-4">
                                    <label className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] sm:tracking-[0.4em] ml-1 sm:ml-2">Wait Time (Hrs)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 sm:px-6 py-3 sm:py-5 rounded-xl sm:rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-lg sm:text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.waitTimeCount}
                                        onChange={(e) => setBillingData({ ...billingData, waitTimeCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            {/* Live Invoice Preview */}
                            <div className="bg-foreground/5 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 border border-foreground/10 space-y-4 sm:space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Zap className="h-4 w-4 text-primary animate-pulse" />
                                        <span className="text-[8px] sm:text-[10px] font-black text-foreground uppercase tracking-[0.2em] sm:tracking-[0.4em]">Calculation Matrix</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[7px] font-black uppercase tracking-widest border border-primary/20">Draft</span>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    {calculation.breakdown.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{item.label}</span>
                                                <span className="text-[7px] sm:text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">{item.detail}</span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-black text-foreground tracking-tighter">${item.value.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 sm:pt-6 border-t border-foreground/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5 opacity-50">Logistics Sum</p>
                                        <p className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter leading-none">${calculation.total.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] leading-none">Net 14</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col gap-3 sm:gap-4 flex-shrink-0">
                            {error && (
                                <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}
                            <div className="flex flex-row items-center gap-3 sm:gap-5">
                                <button
                                    onClick={() => {
                                        setShowCompleteModal(false)
                                        setError(null)
                                    }}
                                    className="flex-1 py-3 sm:py-5 px-4 sm:px-8 rounded-xl sm:rounded-2xl bg-muted border border-border text-muted-foreground font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] hover:text-foreground transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={() => handleComplete(selectedBookingId!)}
                                    className="luxury-button flex-[2] py-3 sm:py-5 px-6 sm:px-10 shadow-3xl h-auto"
                                >
                                    <span className="uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[8px] sm:text-[10px] font-black">Generate Invoice</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function FilterTab({ label, count, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest whitespace-nowrap transition-all border ${active
                ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/20 hover:text-foreground'
                }`}
        >
            {label}
            <span className={`px-2 py-0.5 rounded-md text-[8px] ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/5'}`}>{count}</span>
        </button>
    )
}

function CheckboxItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div
                className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${checked ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'border-border bg-card group-hover:border-primary/50'}`}
                onClick={(e) => { e.preventDefault(); onChange(!checked); }}
            >
                {checked && <CheckCircle2 className="h-4 w-4" />}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${checked ? 'text-foreground' : 'text-muted-foreground group-hover:text-primary'}`}>{label}</span>
        </label>
    )
}

function Activity({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
