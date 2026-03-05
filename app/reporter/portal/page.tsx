'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isToday as isTodayFn
} from 'date-fns'
import {
    Calendar,
    FileText,
    User,
    LogOut,
    CheckCircle,
    Clock,
    Zap,
    TrendingUp,
    DollarSign,
    Upload,
    Bell,
    Settings,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Search,
    BadgeCheck,
    MessageSquare,
    ShieldCheck,
    Copy,
    CheckCircle2,
    Mail,
    Phone,
    Hash,
    KeyRound,
    Loader2,
    Send,
    Plus,
    Trash2,
    Edit3,
    Save,
    AlertCircle,

} from 'lucide-react'
import ProfileUpload from '@/app/components/ui/ProfileUpload'
import LoadingOverlay from '@/app/components/ui/LoadingOverlay'
import CommMatrix from '@/app/components/messages/CommMatrix'

export default function ReporterPortal() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'overview'
    const [isPending, setIsPending] = useState(false)

    // Helper to switch tabs via URL
    const navigateTab = (tab: string) => {
        if (tab === activeTab) return
        setIsPending(true)
        setTimeout(() => {
            router.push(`/reporter/portal?tab=${tab}`)
            setIsPending(false)
        }, 500) // Artificial delay for "buffering" effect as requested
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    const handleAvatarUpdate = async (url: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar: url })
            })
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
                window.dispatchEvent(new Event('user-profile-updated'))
            }
        } catch (error) {
            console.error('Failed to update avatar:', error)
        }
    }

    const [user, setUser] = useState<any>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    // const [activeTab, setActiveTab] = useState('overview') // Removed local state
    const [assignedJobs, setAssignedJobs] = useState<any[]>([])
    const [marketplaceJobs, setMarketplaceJobs] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [payouts, setPayouts] = useState<any[]>([])
    const [reporterInvoices, setReporterInvoices] = useState<any[]>([])
    const [shouldScroll, setShouldScroll] = useState(false)
    const [bidAlertCount, setBidAlertCount] = useState(0)

    // Auto-scroll for messages
    const msgScrollRef = useRef<HTMLDivElement>(null)
    const prevMarketplaceCount = useRef(0)
    const marketBootstrapped = useRef(false)
    useEffect(() => { if (activeTab === 'messages') msgScrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, activeTab])

    const fetchUserData = useCallback(async (isPoll = false) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                if (!isPoll) router.push('/login')
                return
            }

            const [userRes, jobsRes, marketRes, msgsRes, bidsRes, invRes] = await Promise.all([
                fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/market', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/market/bids', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/reporter/invoices', { headers: { 'Authorization': `Bearer ${token}` } })
            ])

            if (userRes.ok) {
                const userData = await userRes.json()
                if (userData.user) setUser(userData.user)
            }

            if (jobsRes.ok) {
                const jobsData = await jobsRes.json()
                if (jobsData.bookings) setAssignedJobs(jobsData.bookings)
            }

            if (marketRes.ok) {
                const marketData = await marketRes.json()
                if (marketData.jobs) {
                    setMarketplaceJobs(marketData.jobs)

                    const jobCount = marketData.jobs.length
                    if (marketBootstrapped.current && jobCount > prevMarketplaceCount.current) {
                        setBidAlertCount(jobCount - prevMarketplaceCount.current)
                    }
                    if (!marketBootstrapped.current) marketBootstrapped.current = true
                    prevMarketplaceCount.current = jobCount
                }
            }

            if (msgsRes.ok) {
                const msgsData = await msgsRes.json()
                if (msgsData.messages) setMessages(msgsData.messages)
            }

            if (bidsRes.ok) {
                const bidsData = await bidsRes.json()
                if (bidsData.claims) setPayouts(bidsData.claims)
            }

            if (invRes.ok) {
                const invData = await invRes.json()
                setReporterInvoices(Array.isArray(invData) ? invData : [])
            }

        } catch (error) {
            console.error('Failed to fetch reporter data:', error)
        } finally {
            if (!isPoll) setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchUserData()
        // Establish real-time pulse for marketplace jobs
        const interval = setInterval(() => fetchUserData(true), 15000)
        return () => clearInterval(interval)
    }, [fetchUserData])

    useEffect(() => {
        if (shouldScroll && activeTab === 'jobs') {
            const el = document.getElementById('marketplace-section')
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
                setShouldScroll(false)
            }
        }
    }, [activeTab, shouldScroll])

    useEffect(() => {
        if (activeTab === 'market') setBidAlertCount(0)
    }, [activeTab])

    const [contactMessage, setContactMessage] = useState('')
    const [contactSending, setContactSending] = useState(false)
    const [contactSent, setContactSent] = useState(false)
    const [bidding, setBidding] = useState(false)
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [updatingAvailability, setUpdatingAvailability] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key)
            setTimeout(() => setCopied(null), 2000)
        })
    }

    const formatCurrency = (value?: number | null) => {
        if (value === undefined || value === null || Number.isNaN(value)) return null
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
    }

    const getMinimumBid = (job: any) => {
        if (!job) return undefined
        return job.lockedMinimumFee
            ?? job.minimumFee
            ?? job.service?.lockedMinimumFee
            ?? job.service?.minimumFee
            ?? job.service?.defaultMinimumFee
    }

    const handleContactAdmin = async () => {
        if (!contactMessage.trim()) return
        setContactSending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: `[ADMIN REQUEST] ${contactMessage}` })
            })
            if (res.ok) {
                setContactSent(true)
                setContactMessage('')
                setTimeout(() => setContactSent(false), 4000)
            }
        } catch (err) {
            console.error('Failed to contact admin:', err)
        } finally {
            setContactSending(false)
        }
    }


    const handleActionInvoice = async (invoiceId: string, status: 'ACCEPTED' | 'DECLINED') => {
        setIsPending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/reporter/invoices/${invoiceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            })
            if (res.ok) fetchUserData(true)
            else alert('Protocol update failed')
        } catch (err) {
            console.error(err)
        } finally {
            setIsPending(false)
        }
    }

    const handleClaimJob = async (bookingId: string) => {
        if (!confirm('Signal interest for this assignment? This will notify administration.')) return

        setBidding(true)
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/market/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId,
                    notes: "Job Claimed via Reporter Portal"
                })
            });

            if (res.ok) {
                alert("Interest signaled. Administrative team notified.");
                fetchUserData(true)
            } else {
                const err = await res.json();
                alert(`Claim Protocol Failed: ${err.error}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setBidding(false)
        }
    }

    const handleAcceptAssignment = async (bookingId: string) => {
        setIsPending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ bookingStatus: 'ACCEPTED' })
            })
            if (res.ok) fetchUserData(true)
            else alert('Failed to accept assignment')
        } catch (err) {
            console.error(err)
        } finally {
            setIsPending(false)
        }
    }

    const handleDeclineAssignment = async (bookingId: string) => {
        if (!confirm('Are you sure you want to decline this assignment? It will be sent back to the jobs board.')) return
        setIsPending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ reporterId: null, isMarketplace: true, bookingStatus: 'SUBMITTED' })
            })
            if (res.ok) fetchUserData(true)
            else alert('Failed to decline assignment')
        } catch (err) {
            console.error(err)
        } finally {
            setIsPending(false)
        }
    }

    const handleSetAvailability = async () => {
        const slots = prompt("Enter your available days (e.g. Mon, Wed, Fri) or 'ALL' for full availability:");
        if (slots) {
            handleSetAvailabilityUI(slots);
        }
    }

    const handleSetAvailabilityUI = async (slots: string) => {
        setUpdatingAvailability(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ availability: slots })
            });
            if (res.ok) {
                fetchUserData(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUpdatingAvailability(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Accessing Professional System...</p>
            </div>
        </div>
    )

    if (!user) return null

    return (
        <div className="animate-in fade-in duration-500 px-4 py-6 md:p-8">
            {(marketplaceJobs.length > 0 || bidAlertCount > 0) && (
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 md:p-5 rounded-2xl border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Job Notifications</p>
                            <p className="text-sm font-semibold text-foreground">
                                {bidAlertCount > 0
                                    ? `${bidAlertCount} new job${bidAlertCount > 1 ? 's' : ''} added since your last view`
                                    : `${marketplaceJobs.length} open job${marketplaceJobs.length === 1 ? '' : 's'} ready to claim`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigateTab('market')}
                        className="self-start md:self-auto px-5 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                        Review Jobs
                    </button>
                </div>
            )}

            {/* Reporter Profile Hero */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <ProfileUpload
                            currentImage={user.avatar}
                            onUploadComplete={handleAvatarUpdate}
                        />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-5xl lg:text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.8]">
                            {user.firstName} <span className="text-primary italic">{user.lastName}</span>
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-xs">Senior Court Reporter • NY Licensed</p>
                            <span className="hidden md:block h-1 w-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                <BadgeCheck className="h-3 w-3" /> Fully Vetted
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSetAvailability}
                        className="luxury-button flex items-center gap-3 px-8 py-4 px-8 py-4 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em]"
                    >
                        <Zap className="h-4 w-4" /> <span>Set Availability</span>
                    </button>
                </div>
            </div>

            {/* Dashboard Detail View */}
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-1000">
                {activeTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MetricCard
                                label="Jobs Scheduled"
                                value={String(assignedJobs.length).padStart(2, '0')}
                                sub="Confirmed Assignments"
                                color="text-primary"
                                onClick={() => navigateTab('jobs')}
                            />
                            <MetricCard
                                label="Pending Delivery"
                                value={String(assignedJobs.filter(j => j.bookingStatus !== 'COMPLETED').length).padStart(2, '0')}
                                sub="Action Required"
                                color="text-amber-500"
                                onClick={() => navigateTab('upload')}
                            />
                            <MetricCard
                                label="Open Jobs"
                                value={String(marketplaceJobs.length).padStart(2, '0')}
                                sub="Ready to Claim"
                                color="text-blue-500"
                                onClick={() => navigateTab('market')}
                            />
                        </div>
                        <div className="glass-panel bg-card rounded-[3rem] p-6 md:p-10 shadow-xl border border-border">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Active Deployments</h3>
                                <button onClick={() => navigateTab('jobs')} className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl">View Schedule</button>
                            </div>
                            <div className="space-y-3">
                                {assignedJobs.length > 0 ? assignedJobs.slice(0, 5).map(job => (
                                    <AssignmentItem
                                        key={job.id}
                                        id={job.bookingNumber}
                                        client={job.contact.companyName || `${job.contact.firstName} ${job.contact.lastName}`}
                                        location={job.location || 'Remote'}
                                        date={format(new Date(job.bookingDate), 'MMM dd').toUpperCase()}
                                        time={job.bookingTime}
                                        type={job.service.serviceName}
                                        onClick={() => {
                                            alert(`Job Details:\n\nBooking: ${job.bookingNumber}\nClient: ${job.contact.companyName || job.contact.firstName + ' ' + job.contact.lastName}\nDate: ${format(new Date(job.bookingDate), 'MMM dd, yyyy')}\nTime: ${job.bookingTime}\nLocation: ${job.location || 'Remote'}\nStatus: ${job.bookingStatus}`);
                                        }}
                                    />
                                )) : (
                                    <div className="py-12 text-center text-muted-foreground font-bold uppercase text-[10px]">No active assignments detected.</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="glass-panel bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                    <DollarSign className="h-24 w-24" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Net Earnings</p>
                                    <h3 className="text-4xl font-black tracking-tighter mb-4">$8,420.50</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-bold bg-white/20 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>+12.5% this month</span>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-panel bg-card rounded-[2.5rem] p-8 border border-border shadow-lg">
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" /> Recent Communications
                                </h3>
                                <div className="space-y-4">
                                    {messages.slice(-3).reverse().map(msg => (
                                        <div key={msg.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                            <p className="text-[10px] font-bold text-foreground line-clamp-2">{msg.content}</p>
                                            <p className="text-[8px] font-black text-primary uppercase mt-2 tracking-widest">{format(new Date(msg.createdAt), 'MMM dd | HH:mm')}</p>
                                        </div>
                                    ))}
                                    {messages.length === 0 && <p className="text-[10px] text-muted-foreground uppercase py-4">No recent messages.</p>}
                                </div>
                            </div>
                            <div className="glass-panel bg-card rounded-[2.5rem] p-8 border border-border shadow-lg">
                                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" /> Operational Efficiency
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span>Transcript Delivery Rate</span>
                                            <span>98%</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[98%]"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span>Claim Success Rate</span>
                                            <span>72%</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[72%]"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span>On-Site Reliability</span>
                                            <span>100%</span>
                                        </div>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'jobs' && (
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-8">Confirmed Assignments</h3>
                            <div className="space-y-3">
                                {assignedJobs.length > 0 ? assignedJobs.map(job => (
                                    <AssignmentRow
                                        key={job.id}
                                        job={job}
                                        onClick={() => {
                                            alert(`Assignment Details:\n\nBooking: ${job.bookingNumber}\nClient: ${job.contact.companyName || job.contact.firstName + ' ' + job.contact.lastName}\nProceeding: ${job.proceedingType}\nDate: ${format(new Date(job.bookingDate), 'MMM dd, yyyy')}\nTime: ${job.bookingTime}\nLocation: ${job.location || 'Remote'}\nStatus: ${job.bookingStatus}`);
                                        }}
                                        onAccept={() => handleAcceptAssignment(job.id)}
                                        onDecline={() => handleDeclineAssignment(job.id)}
                                        isPending={isPending}
                                    />
                                )) : (
                                    <div className="py-12 text-center border-2 border-dashed border-border rounded-[2rem]">
                                        <Calendar className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No confirmed assignments yet.</p>
                                        <button
                                            onClick={() => navigateTab('market')}
                                            className="mt-4 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                        >
                                            Browse Jobs
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>




                    </div>
                )}

                {activeTab === 'market' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        <section id="marketplace-section">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Jobs Board</h3>
                                    <p className="text-sm font-semibold text-foreground/80">Review available jobs below and click Claim Job to signal interest. Multiple reporters may claim a single job; admin selects once finalized.</p>
                                </div>
                                <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">{marketplaceJobs.length} Jobs Open</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {marketplaceJobs.length > 0 ? marketplaceJobs.map(job => (
                                    <MarketplaceCard
                                        key={job.id}
                                        job={job}
                                        onBid={() => handleClaimJob(job.id)}
                                        isBidding={bidding}
                                    />
                                )) : (
                                    <div className="col-span-2 py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                                        <Search className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">No open jobs available</p>
                                        <p className="text-[10px] text-muted-foreground/60">Check back soon for new assignments from the Command Center</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
                {activeTab === 'calendar' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Deployment Matrix</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Operational calendar and availability protocol</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                    className="p-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <h4 className="text-lg font-black text-foreground uppercase italic min-w-[180px] text-center">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </h4>
                                <button
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                    className="p-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-primary transition-all"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-3 space-y-6">
                                {/* Calendar Grid */}
                                <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-xl">
                                    <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                            <div key={d} className="py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 bg-border gap-px">
                                        {eachDayOfInterval({
                                            start: startOfWeek(startOfMonth(currentMonth)),
                                            end: endOfWeek(endOfMonth(currentMonth))
                                        }).map((day, i) => {
                                            const isSelected = isSameDay(day, selectedDate);
                                            const isCurrentMonth = isSameMonth(day, currentMonth);
                                            const isToday = isTodayFn(day);
                                            const dayBookings = assignedJobs.filter(j => isSameDay(new Date(j.bookingDate), day));

                                            // Availability slots
                                            const daySlots = (user.availability || "").split('|').filter((s: string) => {
                                                const [d] = s.trim().split(': ');
                                                return d === format(day, 'yyyy-MM-dd');
                                            });

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => setSelectedDate(day)}
                                                    className={`min-h-[120px] p-3 transition-all cursor-pointer group relative
                                                        ${isCurrentMonth ? 'bg-card' : 'bg-muted/10 opacity-30'}
                                                        ${isSelected ? 'ring-2 ring-primary ring-inset z-10' : 'hover:bg-primary/[0.02]'}
                                                    `}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`text-[10px] font-black
                                                            ${isToday ? 'bg-primary text-white h-5 w-5 rounded-lg flex items-center justify-center' : 'text-muted-foreground'}
                                                        `}>
                                                            {format(day, 'd')}
                                                        </span>
                                                        {dayBookings.length > 0 && (
                                                            <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1">
                                                        {dayBookings.map(j => (
                                                            <div key={j.id} className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-500 uppercase truncate">
                                                                {j.bookingTime?.split(' ')[0]} {j.proceedingType}
                                                            </div>
                                                        ))}
                                                        {daySlots.map((s: string, idx: number) => {
                                                            const [, status] = s.trim().split(': ');
                                                            return (
                                                                <div key={idx} className={`px-2 py-1 rounded-md border text-[8px] font-black uppercase truncate
                                                                    ${status === 'Available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}
                                                                `}>
                                                                    {status}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{format(selectedDate, 'MMMM d')}</h4>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{format(selectedDate, 'EEEE')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protocol Action</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                <button
                                                    onClick={() => {
                                                        const status = 'Available';
                                                        const dateStr = format(selectedDate, 'yyyy-MM-dd');
                                                        const current = user.availability || "";
                                                        const updated = current ? `${current} | ${dateStr}: ${status}` : `${dateStr}: ${status}`;
                                                        handleSetAvailabilityUI(updated);
                                                    }}
                                                    disabled={updatingAvailability}
                                                    className="w-full py-3 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 transition-all flex items-center justify-between disabled:opacity-50"
                                                >
                                                    Available {updatingAvailability && <Loader2 className="h-3 w-3 animate-spin" />} <Plus className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const status = 'Busy';
                                                        const dateStr = format(selectedDate, 'yyyy-MM-dd');
                                                        const current = user.availability || "";
                                                        const updated = current ? `${current} | ${dateStr}: ${status}` : `${dateStr}: ${status}`;
                                                        handleSetAvailabilityUI(updated);
                                                    }}
                                                    disabled={updatingAvailability}
                                                    className="w-full py-3 px-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/10 transition-all flex items-center justify-between disabled:opacity-50"
                                                >
                                                    Booked {updatingAvailability && <Loader2 className="h-3 w-3 animate-spin" />} <Clock className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const dateStr = format(selectedDate, 'yyyy-MM-dd');
                                                        const updated = (user.availability || "").split('|').filter((s: string) => !s.trim().startsWith(dateStr)).join('|');
                                                        handleSetAvailabilityUI(updated);
                                                    }}
                                                    className="w-full py-3 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center justify-between"
                                                >
                                                    Clear Markers <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Duty</p>
                                            {assignedJobs.filter(j => isSameDay(new Date(j.bookingDate), selectedDate)).length > 0 ? (
                                                assignedJobs.filter(j => isSameDay(new Date(j.bookingDate), selectedDate)).map(j => (
                                                    <div key={j.id} className="p-4 rounded-2xl bg-muted border border-border group hover:border-primary/30 transition-all">
                                                        <p className="text-[10px] font-black uppercase text-primary mb-1">{j.bookingTime}</p>
                                                        <p className="text-xs font-black text-foreground uppercase tracking-tight line-clamp-1">{j.proceedingType}</p>
                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase mt-2">{j.location || 'Remote'}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-8 text-center border border-dashed border-border rounded-2xl">
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">No deployments scheduled</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">

                        {/* ── Section 1: Pending Payout Offers ── */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Payout Offers</h3>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Offers from admin awaiting your response</p>
                                </div>
                                {reporterInvoices.filter(i => i.status === 'PENDING').length > 0 && (
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 animate-pulse">
                                        {reporterInvoices.filter(i => i.status === 'PENDING').length} Action Required
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {reporterInvoices.filter(i => i.status === 'PENDING').length > 0 ? (
                                    reporterInvoices.filter(i => i.status === 'PENDING').map(inv => (
                                        <div key={inv.id} className="glass-panel bg-card p-8 rounded-[2.5rem] border border-amber-500/20 shadow-lg flex flex-col xl:flex-row xl:items-center justify-between gap-8 group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-inner flex-shrink-0">
                                                    <Zap className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-[9px] font-black text-primary border border-primary/20 uppercase tracking-widest leading-none">{inv.invoiceNumber}</span>
                                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">#{inv.booking?.bookingNumber}</span>
                                                    </div>
                                                    <h4 className="text-xl font-black text-foreground uppercase tracking-tight">{inv.booking?.proceedingType}</h4>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Appearance: <span className="text-foreground">${inv.appearanceFee}</span></p>
                                                        <div className="h-1 w-1 rounded-full bg-border" />
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Page Rate: <span className="text-foreground">${inv.pageRate}/pg</span></p>
                                                        <div className="h-1 w-1 rounded-full bg-border" />
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Min Fee: <span className="text-foreground">${inv.minimumFee}</span></p>
                                                    </div>
                                                    {inv.notes && (
                                                        <p className="mt-2 text-[9px] font-bold text-muted-foreground italic">&quot;{inv.notes}&quot;</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-row items-center justify-between xl:justify-end gap-8 border-t xl:border-t-0 pt-6 xl:pt-0">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Offered</p>
                                                    <p className="text-3xl font-black text-foreground tracking-tighter">${inv.total?.toFixed(2) || inv.appearanceFee}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleActionInvoice(inv.id, 'DECLINED')}
                                                        disabled={isPending}
                                                        className="px-6 py-3 rounded-xl bg-muted border border-border text-muted-foreground hover:bg-rose-500 hover:text-white hover:border-rose-600 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionInvoice(inv.id, 'ACCEPTED')}
                                                        disabled={isPending}
                                                        className="px-8 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                                                    >
                                                        Accept Offer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10">
                                        <Zap className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No pending payout offers.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="h-px bg-border w-full opacity-50" />

                        {/* ── Section 2: Accepted/Paid Invoices ── */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">My Invoices</h3>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Accepted offers & settled payouts</p>
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    {reporterInvoices.filter(i => i.status === 'ACCEPTED' || i.status === 'PAID').length} Records
                                </span>
                            </div>

                            {reporterInvoices.filter(i => i.status === 'ACCEPTED' || i.status === 'PAID').length > 0 ? (
                                <div className="space-y-4">
                                    {reporterInvoices.filter(i => i.status === 'ACCEPTED' || i.status === 'PAID').map(inv => (
                                        <div key={inv.id} className="bg-card p-6 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                                    <DollarSign className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-[8px] font-black text-primary border border-primary/20 uppercase tracking-widest">{inv.invoiceNumber}</span>
                                                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">#{inv.booking?.bookingNumber}</span>
                                                    </div>
                                                    <p className="text-xs font-black text-foreground uppercase tracking-tight">{inv.booking?.proceedingType}</p>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                                                        {inv.invoiceDate ? format(new Date(inv.invoiceDate), 'MMM d, yyyy') : '—'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Payout</p>
                                                    <p className="text-xl font-black text-foreground tracking-tighter">${inv.total?.toFixed(2) || inv.appearanceFee}</p>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                    {inv.status === 'PAID' ? 'Settled' : 'Confirmed'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10">
                                    <DollarSign className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No accepted invoices yet.</p>
                                    <p className="text-[9px] text-muted-foreground/60 mt-2">Accept a payout offer above to see it here.</p>
                                </div>
                            )}
                        </section>

                        <div className="h-px bg-border w-full opacity-50" />

                        {/* ── Section 3: Job Claims ── */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Job Claim Status</h3>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Your submitted claims on open jobs</p>
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Claims</span>
                            </div>

                            {payouts.length > 0 ? (
                                <div className="space-y-4">
                                    {payouts.map(bid => (
                                        <div key={bid.id} className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between hover:border-primary/20 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                                    <Clock className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-foreground">{bid.booking?.proceedingType}</p>
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">#{bid.booking?.bookingNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-lg font-black text-primary tracking-tighter">{bid.status}</p>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${bid.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    bid.status === 'DECLINED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                        'bg-muted text-muted-foreground border-border'
                                                    }`}>
                                                    {bid.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10">
                                    <Clock className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No job claims submitted.</p>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="bg-card rounded-[3rem] p-12 overflow-hidden shadow-xl border border-border animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="mb-10 text-center md:text-left">
                            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Transcript Asset Delivery</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2 px-1 py-1 rounded bg-muted inline-block">Upload Protocol v1.42.0</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Target Assignment</label>
                                    <select
                                        id="assignment-target"
                                        className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
                                    >
                                        <option className="bg-card">Select Assigned Case...</option>
                                        {assignedJobs.filter(j => j.bookingStatus !== 'COMPLETED').map(job => (
                                            <option key={job.id} value={job.id} className="bg-card font-black">
                                                {job.bookingNumber} — {job.proceedingType.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div
                                    onClick={() => document.getElementById('transcript-file')?.click()}
                                    className="p-12 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer"
                                >
                                    <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <Upload className="h-10 w-10" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Global Asset Dropzone</p>
                                        <p className="text-[9px] text-muted-foreground mt-2 uppercase font-bold tracking-tighter">Drag and drop transcript assets or click to browse</p>
                                    </div>
                                    <button className="px-8 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Browse Secure Drive</button>
                                    <input
                                        type="file"
                                        id="transcript-file"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            const bookingId = (document.getElementById('assignment-target') as HTMLSelectElement).value;
                                            if (!file || !bookingId || bookingId.startsWith('Select')) {
                                                alert('Target Assignment or File data missing for transmission');
                                                return;
                                            }
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            formData.append('category', 'TRANSCRIPT');
                                            formData.append('bookingId', bookingId);
                                            const token = localStorage.getItem('token');
                                            const res = await fetch('/api/documents', {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${token}` },
                                                body: formData
                                            });
                                            if (res.ok) alert('Asset Transmitted Successfully to Client Vault');
                                            else alert('Transmission Refused by Server');
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="p-10 bg-muted/50 border border-border rounded-[2.5rem] space-y-8 flex flex-col">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Compliance Checklist</h4>
                                </div>
                                <ul className="space-y-6 flex-1">
                                    <ComplianceItem label="ASCII / PDF Structure Verification" />
                                    <ComplianceItem label="AI-Aided OCR Integrity Check" />
                                    <ComplianceItem label="Dynamic Exhibit Relinking" />
                                    <ComplianceItem label="HSA-256 Metadata Signing" />
                                </ul>
                                <div className="pt-6 border-t border-border/50">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase leading-relaxed italic">
                                        All uploads are automatically processed through our legal-validation engine before being flagged for client review.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="glass-panel rounded-[2.5rem] h-[700px] flex flex-col overflow-hidden bg-card border border-border">
                        <CommMatrix />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* ── Profile (editable fields) ── */}
                        <div className="bg-card rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-border">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-8">Network Profile Configuration</h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={async (e) => {
                                e.preventDefault();
                                setUpdatingProfile(true);
                                try {
                                    const formData = new FormData(e.currentTarget);
                                    const update = {
                                        firstName: formData.get('firstName'),
                                        lastName: formData.get('lastName'),
                                        certification: formData.get('certification'),
                                        company: formData.get('company'),
                                        bio: formData.get('bio'),
                                        portfolio: formData.get('portfolio'),
                                        availability: formData.get('availability'),
                                    };
                                    const token = localStorage.getItem('token');
                                    const res = await fetch('/api/profile', {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify(update)
                                    });
                                    if (res.ok) {
                                        alert('Profile Protocol Updated Successfully');
                                        fetchUserData(true);
                                    }
                                } finally {
                                    setUpdatingProfile(false);
                                }
                            }}>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Security ID (First Name)</label>
                                        <input name="firstName" defaultValue={user.firstName} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Asset Code (Last Name)</label>
                                        <input name="lastName" defaultValue={user.lastName} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Certification ID</label>
                                        <input name="certification" defaultValue={user.certification} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Professional Bio</label>
                                        <textarea name="bio" defaultValue={user.bio} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground min-h-[100px]" />
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Portfolio / Link</label>
                                        <input name="portfolio" defaultValue={user.portfolio} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Current Availability</label>
                                        <input name="availability" defaultValue={user.availability} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground" placeholder="e.g. Mon-Fri" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Associated Corporation</label>
                                        <input name="company" defaultValue={user.company} className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Authorized Official Email</label>
                                        <input disabled value={user.email} className="w-full bg-muted/50 border border-border rounded-2xl p-5 text-xs font-bold outline-none opacity-50 cursor-not-allowed text-foreground" />
                                    </div>
                                    <div className="pt-2">
                                        <button type="submit" disabled={updatingProfile} className="luxury-button w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50">
                                            {updatingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                                            {updatingProfile ? 'Updating Protocol...' : 'Commit Configuration'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* ── Account Identity & Credentials ── */}
                        <div className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-border">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Identity Management</h3>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Biometric &amp; system credentials</p>
                                </div>
                            </div>

                            {/* Profile Pic Upload */}
                            <div className="mb-8">
                                <ProfileUpload
                                    label="Your Digital Avatar"
                                    currentImage={user.avatar}
                                    onUploadComplete={handleAvatarUpdate}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <Hash className="h-3 w-3" /> Your User ID
                                    </label>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                                        <code className="flex-1 text-xs font-mono text-foreground truncate select-all">{user.id}</code>
                                        <button
                                            onClick={() => copyToClipboard(user.id, 'id')}
                                            className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all flex-shrink-0"
                                        >
                                            {copied === 'id' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <Mail className="h-3 w-3" /> Login Email
                                    </label>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                                        <code className="flex-1 text-xs font-mono text-foreground truncate select-all">{user.email}</code>
                                        <button
                                            onClick={() => copyToClipboard(user.email, 'email')}
                                            className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all flex-shrink-0"
                                        >
                                            {copied === 'email' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <ShieldCheck className="h-3 w-3" /> Account Role
                                    </label>
                                    <div className="p-3 rounded-xl bg-muted border border-border">
                                        <span className="text-xs font-black text-foreground uppercase">{user.role}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <KeyRound className="h-3 w-3" /> Password
                                    </label>
                                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-muted border border-border">
                                        <span className="text-sm text-muted-foreground tracking-widest">••••••••••••</span>
                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline" onClick={() => navigateTab('messages')}>Reset via Admin</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
                                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                    Contact the admin to update credentials or reset your password. For security, credentials cannot be self-modified.
                                </p>
                            </div>
                        </div>

                        {/* ── Contact Admin ── */}
                        <div className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-border">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Contact Admin</h3>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">For credential changes, ID updates, or account support</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                {[
                                    { icon: <MessageSquare className="h-4 w-4" />, label: 'Portal Message', desc: 'Fastest — avg 2h response', action: () => navigateTab('messages'), color: 'text-primary bg-primary/10 border-primary/20' },
                                    { icon: <Mail className="h-4 w-4" />, label: 'Email Admin', desc: 'admin@marinadubson.com', action: () => window.open('mailto:admin@marinadubson.com'), color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
                                    { icon: <Phone className="h-4 w-4" />, label: 'Phone Support', desc: '(212) 555-0100', action: () => window.open('tel:+12125550100'), color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
                                ].map((ch, i) => (
                                    <button
                                        key={i}
                                        onClick={ch.action}
                                        className={`flex flex-col items-start gap-2 p-4 rounded-2xl border hover:shadow-lg transition-all text-left ${ch.color}`}
                                    >
                                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                            {ch.icon} {ch.label}
                                        </div>
                                        <p className="text-[9px] text-muted-foreground font-medium">{ch.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Quick Message to Admin</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl bg-muted/50 border border-border text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 min-h-[110px] resize-none"
                                    placeholder="Describe your request..."
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                />
                                {contactSent && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 animate-in fade-in duration-300">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Message sent! Admin team will respond shortly.</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleContactAdmin}
                                    disabled={contactSending || !contactMessage.trim()}
                                    className="luxury-button w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {contactSending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> Send to Admin</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sign Out */}
                        <div className="glass-panel rounded-[2rem] p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-black text-foreground uppercase">Sign Out</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">You will be redirected to the login page.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-destructive/30 text-destructive text-xs font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all flex-shrink-0"
                            >
                                <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ComplianceItem({ label }: { label: string }) {
    return (
        <li className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
        </li>
    )
}

function AssignmentRow({ job, onClick, onAccept, onDecline, isPending }: { job: any, onClick?: () => void, onAccept?: () => void, onDecline?: () => void, isPending?: boolean }) {
    const requiresConfirmation = job.bookingStatus === 'SUBMITTED' || job.bookingStatus === 'PENDING' || job.bookingStatus === 'ASSIGNED';

    return (
        <div className="w-full p-6 bg-card border border-border rounded-[2rem] flex flex-col hover:shadow-xl transition-all group">
            <button
                onClick={onClick}
                className="flex items-center justify-between outline-none focus:ring-2 focus:ring-primary/20 bg-transparent text-left w-full"
            >
                <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-primary font-black text-sm">
                        {format(new Date(job.bookingDate), 'dd')}
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{job.proceedingType}</h4>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mt-1">{job.bookingNumber} • {job.contact?.companyName || 'Private Client'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-xs font-black text-foreground uppercase">{job.bookingTime}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase mt-1">{job.location || 'Remote Session'}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${job.bookingStatus === 'COMPLETED' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-primary/5 text-primary border-primary/20'
                        }`}>
                        {job.bookingStatus}
                    </div>
                </div>
            </button>
            {requiresConfirmation && onAccept && onDecline && (
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
                    <button
                        onClick={onDecline}
                        disabled={isPending}
                        className="px-4 py-2 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl text-[9px] font-black tracking-widest uppercase disabled:opacity-50 transition-all"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={isPending}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        Confirm Assignment
                    </button>
                </div>
            )}
        </div>
    )
}

function MarketplaceCard({ job, onBid, isBidding }: { job: any, onBid: () => void, isBidding?: boolean }) {
    const clientName = (job?.contact?.companyName || `${job?.contact?.firstName ?? ''} ${job?.contact?.lastName ?? ''}`.trim()) || 'Client pending'
    const instructions = job?.notes || job?.bookingNotes || job?.instructions
    const [dismissed, setDismissed] = useState(false)

    if (dismissed) return null

    return (
        <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[8px] font-black uppercase border border-blue-500/20">Open Job</span>
            </div>
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{job?.service?.serviceName || 'Service pending'}</p>
                        <h4 className="text-xl font-black text-foreground uppercase tracking-tighter leading-none">{job?.proceedingType || 'Proceeding TBD'}</h4>
                        <p className="text-sm font-semibold text-foreground/80 mt-2">#{job?.bookingNumber || job?.id} • {clientName}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{job?.bookingDate ? format(new Date(job.bookingDate), 'MMM dd, yyyy') : 'Date TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{job?.bookingTime || 'Time TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{job?.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{job?.service?.subService || job?.service?.category || 'Service detail'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span>{job?.bookingNumber || job?.id}</span>
                    </div>
                </div>
                {instructions && (
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Job Details</p>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{instructions}</p>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setDismissed(true)}
                        className="px-6 py-4 rounded-2xl border border-border bg-card text-muted-foreground font-black text-[9px] uppercase tracking-widest hover:bg-muted transition-all"
                    >
                        Not Interested
                    </button>
                    <button
                        onClick={onBid}
                        disabled={isBidding}
                        className="luxury-button py-4 text-[9px] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isBidding ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                        {isBidding ? 'Signaling Interest...' : 'Claim Job'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ label, value, sub, color, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-card p-6 md:p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group outline-none focus:ring-2 focus:ring-primary/20"
        >
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</h4>
            <div className="flex items-end gap-3">
                <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
                <div className="mb-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
            </div>
            <p className="text-[9px] font-black text-muted-foreground/70 uppercase mt-4 tracking-widest">{sub}</p>
        </button>
    )
}

function AssignmentItem({ id, client, location, date, time, type, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full group flex items-center justify-between p-4 md:p-6 bg-muted/20 hover:bg-card hover:shadow-2xl rounded-3xl transition-all border border-transparent hover:border-primary/20 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
        >
            <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-card border border-border flex flex-shrink-0 flex-col items-center justify-center shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                    <span className="text-[10px] font-black text-primary">{date.split(' ')[0]}</span>
                    <span className="text-base md:text-xl font-black text-foreground">{date.split(' ')[1]}</span>
                </div>
                <div className="space-y-1 text-left min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg w-max">{type.split(' ')[0]}</span>
                        <h4 className="text-base md:text-lg font-black text-foreground tracking-tight truncate">{client}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight">{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight">{time}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 ml-2">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-foreground">{id}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Assignment Code</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 group-hover:shadow-lg transition-all">
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </div>
            </div>
        </button>
    )
}


