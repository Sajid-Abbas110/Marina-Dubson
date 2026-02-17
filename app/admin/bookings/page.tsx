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
    TrendingUp
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
                // Refresh bids list to show updated statuses
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

    useEffect(() => {
        fetchBookings()
    }, [])

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Tactical <span className="text-primary italic">Registry</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Bridging Clients & Reporters across the MD Global Node.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input className="w-full sm:min-w-[320px] px-12 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 dark:text-white" placeholder="Global Case Search..." />
                    </div>
                </div>
            </div>

            {/* Matrix Filters */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <FilterTab active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="Full Matrix" count={(bookings || []).length.toString()} />
                <FilterTab active={filter === 'SUBMITTED'} onClick={() => setFilter('SUBMITTED')} label="Requires Review" count={(bookings || []).filter(b => b.bookingStatus === 'SUBMITTED').length.toString()} />
                <FilterTab active={filter === 'ACCEPTED'} onClick={() => setFilter('ACCEPTED')} label="Active Logistics" count={(bookings || []).filter(b => b.bookingStatus === 'ACCEPTED').length.toString()} />
                <div className="ml-auto h-12 w-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10">
                    <Filter className="h-4 w-4 text-gray-400" />
                </div>
            </div>

            {/* Operational Grid */}
            <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5">
                <div className="px-6 lg:px-10 py-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Active Logistics Table</h3>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        <span>Node Status: Nominal</span>
                        <div className="h-4 w-px bg-gray-200 dark:bg-white/10"></div>
                        <span>Latency: 0.2ms</span>
                    </div>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-white/5">
                    {loading ? (
                        <div className="p-20 text-center text-gray-400 uppercase font-black text-xs tracking-widest">Synchronizing Matrix Data...</div>
                    ) : (bookings || []).filter(b => filter === 'ALL' || b.bookingStatus === filter).map(b => (
                        <div key={b.id} className="px-6 lg:px-10 py-8 hover:bg-primary/5 dark:hover:bg-primary/5 transition-all cursor-pointer group flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-12">
                                {/* Date Pillar */}
                                <div className="flex flex-col items-center justify-center h-16 w-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm group-hover:border-primary/20 transition-colors flex-shrink-0">
                                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase">{new Date(b.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-xl font-black text-gray-900 dark:text-white">{new Date(b.bookingDate).getDate()}</span>
                                </div>

                                {/* Logistics Identity */}
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-[10px] font-black text-primary border border-primary/20">{b.bookingNumber}</span>
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{b.proceedingType}</h4>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{b.contact.companyName || `${b.contact.firstName} ${b.contact.lastName}`}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{b.bookingTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-16">
                                {/* Assignment Bridge */}
                                <div className="flex flex-col gap-1 sm:items-end">
                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Logistics Assignment</p>
                                    {b.reporter ? (
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                                            <User className="h-4 w-4 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{b.reporter.firstName} {b.reporter.lastName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleMarketplace(b.id, b.isMarketplace)}
                                                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${b.isMarketplace ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/10 hover:border-indigo-400 hover:text-indigo-500'}`}
                                            >
                                                {b.isMarketplace ? 'Marketplace Live' : 'Push to Market'}
                                            </button>
                                            {b.isMarketplace && (
                                                <button
                                                    onClick={() => viewBids(b.id)}
                                                    className="px-3 py-2 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                                >
                                                    View Bids
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status Toggle Automation */}
                                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                    {b.bookingStatus === 'SUBMITTED' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, 'ACCEPTED')}
                                                className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'MAYBE')}
                                                className="px-3 py-2 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                                            >
                                                Maybe
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'DECLINED')}
                                                className="px-3 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-rose-500/20"
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {b.bookingStatus === 'MAYBE' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(b.id, 'ACCEPTED')}
                                                className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(b.id, 'DECLINED')}
                                                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-rose-500/20"
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
                                            className="px-4 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                                        >
                                            Complete & Bill
                                        </button>
                                    )}
                                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500">{b.bookingStatus}</div>
                                </div>

                                <button className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-300 hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all">
                                    <ArrowRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bids Management Modal */}
            {showBidsModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 lg:pl-80 lg:pr-12">
                    <div className="absolute inset-0 bg-white dark:bg-[#00120d]" onClick={() => setShowBidsModal(false)}></div>
                    <div className="relative w-full max-w-4xl bg-white dark:bg-[#001c14] rounded-[3rem] p-10 shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                                    <TrendingUp className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Marketplace Bids</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Select the most qualified node for deployment</p>
                                </div>
                            </div>
                            <button onClick={() => setShowBidsModal(false)} className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-gray-900">Close</button>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                            {selectedBookingBids.length === 0 ? (
                                <div className="py-20 text-center font-black text-xs uppercase tracking-widest text-gray-400">No signals detected from the reporter network...</div>
                            ) : selectedBookingBids.map(bid => (
                                <div key={bid.id} className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-lg font-black text-primary border border-gray-100 dark:border-white/10">
                                            {bid.reporter.firstName[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{bid.reporter.firstName} {bid.reporter.lastName}</h4>
                                            <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase border border-primary/20 mt-1 inline-block">{bid.reporter.certification || 'Verified Reporter'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Proposed Payoff</p>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${bid.amount}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{bid.timeline}</p>
                                        </div>
                                        {bid.status === 'PENDING' ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => declineBid(bid.id)}
                                                    className="h-10 px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-[9px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Decline
                                                </button>
                                                <button
                                                    onClick={() => acceptBid(bid.id)}
                                                    className="h-10 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-black uppercase tracking-widest hover:scale-105 shadow-xl transition-all"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${bid.status === 'ACCEPTED'
                                                ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                {bid.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Billing Completion Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 lg:pl-80 lg:pr-12">
                    <div className="absolute inset-0 bg-white/80 dark:bg-[#00120d]/80 backdrop-blur-md" onClick={() => setShowCompleteModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-[#001c14] rounded-[3rem] p-12 shadow-2xl border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
                                <DollarSign className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Finalize & Bill Job</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Populate logistical data for automated invoice generation</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pages</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-black text-lg focus:ring-2 focus:ring-primary/10"
                                    value={billingData.pages}
                                    onChange={(e) => setBillingData({ ...billingData, pages: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Additional Copies</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-black text-lg focus:ring-2 focus:ring-primary/10"
                                    value={billingData.additionalCopies}
                                    onChange={(e) => setBillingData({ ...billingData, additionalCopies: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Realtime Devices</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-black text-lg focus:ring-2 focus:ring-primary/10"
                                    value={billingData.realtimeDevices}
                                    onChange={(e) => setBillingData({ ...billingData, realtimeDevices: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 col-span-2">
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded-lg text-primary focus:ring-primary ring-offset-0"
                                        checked={billingData.hasRough}
                                        onChange={(e) => setBillingData({ ...billingData, hasRough: e.target.checked })}
                                    />
                                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Rough Draft Included</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded-lg text-primary focus:ring-primary ring-offset-0"
                                        checked={billingData.hasVideographer}
                                        onChange={(e) => setBillingData({ ...billingData, hasVideographer: e.target.checked })}
                                    />
                                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Videographer Included</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded-lg text-primary focus:ring-primary ring-offset-0"
                                        checked={billingData.hasInterpreter}
                                        onChange={(e) => setBillingData({ ...billingData, hasInterpreter: e.target.checked })}
                                    />
                                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Interpreter Included</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded-lg text-primary focus:ring-primary ring-offset-0"
                                        checked={billingData.hasExpert}
                                        onChange={(e) => setBillingData({ ...billingData, hasExpert: e.target.checked })}
                                    />
                                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Expert/Technical Presence</span>
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Afterhours Hours</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-black text-lg focus:ring-2 focus:ring-primary/10"
                                    value={billingData.afterHoursCount}
                                    onChange={(e) => setBillingData({ ...billingData, afterHoursCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wait Time Hours</label>
                                <input
                                    type="number"
                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none outline-none font-black text-lg focus:ring-2 focus:ring-primary/10"
                                    value={billingData.waitTimeCount}
                                    onChange={(e) => setBillingData({ ...billingData, waitTimeCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowCompleteModal(false)} className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest">Abort</button>
                            <button onClick={() => handleComplete(selectedBookingId!)} className="flex-[2] py-4 px-6 rounded-2xl bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-[1.02] transition-all">Generate & Synchronize Invoice</button>
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
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${active
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 border-gray-900 dark:bg-white dark:text-gray-900'
                : 'bg-white dark:bg-white/5 text-gray-400 border-gray-100 dark:border-white/10 hover:border-primary/20 hover:text-gray-900 dark:hover:text-white'
                }`}
        >
            {label}
            <span className={`px-2 py-0.5 rounded-md text-[8px] ${active ? 'bg-white/10 text-white dark:bg-black/10 dark:text-gray-900' : 'bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-primary/5'}`}>{count}</span>
        </button>
    )
}
