'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

    const [showBidsModal, setShowBidsModal] = useState(false)
    const [selectedBookingBids, setSelectedBookingBids] = useState<any[]>([])
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

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
            }
        } catch (error) {
            console.error('Failed to complete job:', error)
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
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase leading-none">
                        Tactical <span className="brand-gradient italic">Registry</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.4em]">Bridging Clients & Reporters across the MD Global Node.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input className="w-full sm:min-w-[400px] pl-14 pr-6 py-5 rounded-2xl bg-card border border-border text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 text-foreground transition-all" placeholder="DECRYPT CASE_ID OR CLIENT_NODE..." />
                    </div>
                </div>
            </div>

            {/* Matrix Filters */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <FilterTab active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Full Matrix" count={(bookings || []).length.toString()} />
                <FilterTab active={filter === 'SUBMITTED'} onClick={() => setFilter('SUBMITTED')} label="Requires Review" count={(bookings || []).filter(b => b.bookingStatus === 'SUBMITTED').length.toString()} />
                <FilterTab active={filter === 'ACCEPTED'} onClick={() => setFilter('ACCEPTED')} label="Active Logistics" count={(bookings || []).filter(b => b.bookingStatus === 'ACCEPTED').length.toString()} />
                <div className="ml-auto h-14 w-14 rounded-2xl bg-card flex items-center justify-center border border-border shadow-sm cursor-pointer hover:bg-muted hover:border-primary/20 transition-all text-muted-foreground">
                    <Filter className="h-5 w-5" />
                </div>
            </div>

            {/* Operational Grid */}
            <div className="glass-panel rounded-[3rem] overflow-hidden bg-card border border-border shadow-2xl">
                <div className="px-10 py-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-pulse"></div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Active Logistics Table</h3>
                    </div>
                    <div className="flex items-center gap-8 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        <span className="flex items-center gap-2"><Activity className="h-3 w-3" /> Node Status: <span className="text-emerald-500">Nominal</span></span>
                        <div className="h-4 w-px bg-border"></div>
                        <span className="flex items-center gap-2"><Zap className="h-3 w-3" /> Latency: 0.2ms</span>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-32 text-center text-muted-foreground uppercase font-black text-[10px] tracking-[0.5em] animate-pulse">Synchronizing Matrix Data...</div>
                    ) : (bookings || []).filter(b => filter === 'ALL' || b.bookingStatus === filter).map(b => (
                        <div key={b.id} className="px-10 py-10 hover:bg-primary/5 transition-all cursor-pointer group flex flex-col xl:flex-row xl:items-center justify-between gap-10 border-l-4 border-transparent hover:border-primary">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 lg:gap-14">
                                {/* Date Pillar */}
                                <div className="flex flex-col items-center justify-center h-20 w-20 rounded-[1.5rem] bg-muted border border-border shadow-sm group-hover:border-primary/20 transition-all flex-shrink-0">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{new Date(b.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-black text-foreground">{new Date(b.bookingDate).getDate()}</span>
                                </div>

                                {/* Logistics Identity */}
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="px-3 py-1 rounded-xl bg-primary/10 text-[10px] font-black text-primary border border-primary/20 uppercase tracking-widest">{b.bookingNumber}</span>
                                        <h4 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{b.proceedingType}</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="h-4 w-4 text-muted-foreground/40" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{b.contact.companyName || `${b.contact.firstName} ${b.contact.lastName}`}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 text-muted-foreground/40" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{b.bookingTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:gap-20">
                                {/* Assignment Bridge */}
                                <div className="flex flex-col gap-2 sm:items-end">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Logistics Assignment</p>
                                    {b.reporter ? (
                                        <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                            <User className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{b.reporter.firstName} {b.reporter.lastName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleMarketplace(b.id, b.isMarketplace)}
                                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${b.isMarketplace ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' : 'bg-muted text-muted-foreground border-border hover:border-primary/20 hover:text-primary'}`}
                                            >
                                                {b.isMarketplace ? 'Marketplace Live' : 'Push to Market'}
                                            </button>
                                            {b.isMarketplace && (
                                                <button
                                                    onClick={() => viewBids(b.id)}
                                                    className="luxury-button px-5 py-2.5 h-auto text-[10px]"
                                                >
                                                    View Bids
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status Toggle Automation */}
                                <div className="flex items-center gap-3 p-2 rounded-2xl bg-muted border border-border">
                                    {b.bookingStatus === 'SUBMITTED' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, 'ACCEPTED')}
                                                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'MAYBE')}
                                                className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-amber-500/20"
                                            >
                                                Maybe
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'DECLINED')}
                                                className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-rose-500/20"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {b.bookingStatus === 'MAYBE' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, 'ACCEPTED')}
                                                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'DECLINED')}
                                                className="px-6 py-2.5 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-lg shadow-rose-500/20"
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
                                            className="px-6 py-2.5 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:translate-y-[-2px] transition-all shadow-xl"
                                        >
                                            Complete & Bill
                                        </button>
                                    )}
                                    <div className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-card border border-border rounded-xl">{b.bookingStatus}</div>
                                </div>

                                <button className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-2xl hover:translate-x-1 transition-all">
                                    <ArrowRight className="h-7 w-7" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bids Management Modal */}
            {showBidsModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:pl-80 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowBidsModal(false)}></div>
                    <div className="relative w-full max-w-4xl bg-card rounded-[3.5rem] p-12 shadow-3xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-8">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl">
                                    <TrendingUp className="h-9 w-9" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Marketplace Bids</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Select the most qualified node for deployment</p>
                                </div>
                            </div>
                            <button onClick={() => setShowBidsModal(false)} className="h-14 w-14 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center">
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {selectedBookingBids.length === 0 ? (
                                <div className="py-24 text-center font-black text-[10px] uppercase tracking-[0.5em] text-muted-foreground animate-pulse">No signals detected from the reporter network...</div>
                            ) : selectedBookingBids.map(bid => (
                                <div key={bid.id} className="p-8 rounded-[2.5rem] bg-muted/30 border border-border flex items-center justify-between hover:border-primary/20 transition-all group relative overflow-hidden">
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center text-xl font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                            {bid.reporter.firstName[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-foreground uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{bid.reporter.firstName} {bid.reporter.lastName}</h4>
                                            <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-lg uppercase border border-primary/20 tracking-widest">{bid.reporter.certification || 'Verified Reporter'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-16 relative z-10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Proposed Payoff</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter">${bid.amount}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Timeline</p>
                                            <p className="text-base font-black text-foreground uppercase tracking-widest">{bid.timeline}</p>
                                        </div>
                                        {bid.status === 'PENDING' ? (
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => declineBid(bid.id)}
                                                    className="h-12 px-6 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-rose-500 hover:border-rose-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Decline
                                                </button>
                                                <button
                                                    onClick={() => acceptBid(bid.id)}
                                                    className="h-12 px-8 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:scale-105 shadow-2xl transition-all"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${bid.status === 'ACCEPTED'
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
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:pl-80 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowCompleteModal(false)}></div>
                    <div className="relative w-full max-w-3xl bg-card rounded-[3.5rem] shadow-3xl border border-border flex flex-col max-h-[90vh] overflow-hidden p-12">
                        {/* Modal Header */}
                        <div className="flex items-center gap-8 mb-12 flex-shrink-0">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-foreground text-background flex items-center justify-center shadow-2xl flex-shrink-0">
                                <DollarSign className="h-9 w-9" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">Finalize & Bill Job</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Logistical data for automated invoice generation</p>
                            </div>
                            <button onClick={() => setShowCompleteModal(false)} className="ml-auto h-14 w-14 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center">
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto custom-scrollbar space-y-10 pr-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Total Pages Output</label>
                                    <input
                                        type="number"
                                        className="w-full px-6 py-5 rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.pages}
                                        onChange={(e) => setBillingData({ ...billingData, pages: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Additional Copies</label>
                                    <input
                                        type="number"
                                        className="w-full px-6 py-5 rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Afterhours (Hrs)</label>
                                    <input
                                        type="number"
                                        className="w-full px-6 py-5 rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.afterHoursCount}
                                        onChange={(e) => setBillingData({ ...billingData, afterHoursCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Wait Time (Hrs)</label>
                                    <input
                                        type="number"
                                        className="w-full px-6 py-5 rounded-2xl bg-muted/50 border border-border focus:border-primary/50 outline-none font-black text-2xl focus:ring-4 focus:ring-primary/10 transition-all text-foreground text-center tracking-tighter"
                                        value={billingData.waitTimeCount}
                                        onChange={(e) => setBillingData({ ...billingData, waitTimeCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            {/* Live Invoice Preview */}
                            <div className="bg-foreground/5 rounded-[2.5rem] p-8 border border-foreground/10 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-4 w-4 text-primary animate-pulse" />
                                        <span className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">Real-time Calculation Matrix</span>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">Draft Invoice</span>
                                </div>

                                <div className="space-y-3">
                                    {calculation.breakdown.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">{item.label}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">{item.detail}</span>
                                            </div>
                                            <span className="text-sm font-black text-foreground tracking-tighter">${item.value.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-foreground/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Unified Logistics Sum</p>
                                        <p className="text-4xl font-black text-foreground tracking-tighter leading-none">${calculation.total.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Status: Ready</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">Net 14 Protocol</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-12 pt-8 border-t border-border flex items-center gap-5 flex-shrink-0">
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="flex-1 py-5 px-8 rounded-2xl bg-muted border border-border text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em] hover:text-foreground transition-all"
                            >
                                Abort Deployment
                            </button>
                            <button
                                onClick={() => handleComplete(selectedBookingId!)}
                                className="luxury-button flex-[2] py-5 px-10 shadow-3xl"
                            >
                                <span className="uppercase tracking-[0.3em] text-[10px] font-black">Generate Unified Invoice</span>
                            </button>
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
            className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${active
                ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30 border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/20 hover:text-foreground'
                }`}
        >
            {label}
            <span className={`px-2.5 py-1 rounded-lg text-[9px] ${active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/5'}`}>{count}</span>
        </button>
    )
}

function CheckboxItem({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-4 cursor-pointer group">
            <div
                className={`h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${checked ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' : 'border-border bg-card group-hover:border-primary/50'}`}
                onClick={(e) => { e.preventDefault(); onChange(!checked); }}
            >
                {checked && <CheckCircle2 className="h-5 w-5" />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${checked ? 'text-foreground' : 'text-muted-foreground group-hover:text-primary'}`}>{label}</span>
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
