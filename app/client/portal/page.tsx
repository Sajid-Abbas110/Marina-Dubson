'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import {
    Calendar,
    FileText,
    MessageSquare,
    User,
    LogOut,
    Plus,
    Clock,
    ShieldCheck,
    CreditCard,
    Download,
    TrendingUp,
    ChevronRight,
    Search,
    Bell,
    Settings,
    LayoutDashboard,
    Upload,
    Send,
    Layout,
    Cpu,
    Copy,
    CheckCircle2,
    Mail,
    Phone,
    Hash,
    KeyRound,
    Loader2
} from 'lucide-react'
import ClientCalendar from '../components/ClientCalendar'
import BookingRequest from '../components/BookingRequest'
import ProfileUpload from '@/app/components/ui/ProfileUpload'
import LoadingOverlay from '@/app/components/ui/LoadingOverlay'
import CommMatrix from '@/app/components/messages/CommMatrix'

export default function ClientPortal() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'overview'
    const [isPending, setIsPending] = useState(false)

    // Helper to switch tabs via URL
    const navigateTab = (tab: string) => {
        if (tab === activeTab) return
        setIsPending(true)
        setTimeout(() => {
            router.push(`/client/portal?tab=${tab}`)
            setIsPending(false)
        }, 500)
    }

    const [user, setUser] = useState<any>(null)
    // const [activeTab, setActiveTab] = useState('overview') // Removed local state
    const [bookings, setBookings] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [documents, setDocuments] = useState<any[]>([])
    const [invoices, setInvoices] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [stats, setStats] = useState({ active: 0, unpaid: 0, files: 0 })
    const [loading, setLoading] = useState(true)
    const [messageContent, setMessageContent] = useState('')
    const [sendingMessage, setSendingMessage] = useState(false)
    const [docSearchQuery, setDocSearchQuery] = useState('')

    const [scrolled, setScrolled] = useState(false)

    // Auto-scroll ref
    const msgScrollRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = () => msgScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    useEffect(() => { if (activeTab === 'messages') scrollToBottom() }, [messages, activeTab])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const fetchAllData = useCallback(async (isPoll = false) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                if (!isPoll) router.push('/login')
                return
            }

            const [userRes, bookingsRes, servicesRes, docsRes, invoicesRes, messagesRes] = await Promise.all([
                fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/documents', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/invoices', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } })
            ])

            const userData = await userRes.json()
            const bookingsData = await bookingsRes.json()
            const servicesData = await servicesRes.json()
            const docsData = await docsRes.json()
            const invoicesData = await invoicesRes.json()
            const messagesData = await messagesRes.json()

            if (userData.user) setUser(userData.user)

            const userBookings = Array.isArray(bookingsData.bookings) ? bookingsData.bookings : []
            setBookings(userBookings)
            setServices(Array.isArray(servicesData.services) ? servicesData.services : [])
            setDocuments(Array.isArray(docsData.documents) ? docsData.documents : [])
            setInvoices(Array.isArray(invoicesData.invoices) ? invoicesData.invoices : [])
            setMessages(Array.isArray(messagesData.messages) ? messagesData.messages : [])

            // Calculate stats
            const active = userBookings.filter((b: any) => ['SUBMITTED', 'ACCEPTED', 'CONFIRMED'].includes(b.bookingStatus)).length
            const unpaid = (invoicesData.invoices || [])
                .filter((i: any) => i.status !== 'PAID')
                .length

            setStats({
                active,
                unpaid,
                files: docsData.documents?.length || 0
            })
        } catch (error) {
            console.error('Failed to fetch portal data:', error)
        } finally {
            if (!isPoll) setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchAllData()
        const interval = setInterval(() => fetchAllData(true), 60000)
        return () => clearInterval(interval)
    }, [fetchAllData])

    const handleSendMessage = async () => {
        if (!messageContent.trim()) return
        setSendingMessage(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: messageContent })
            })
            if (res.ok) {
                const newMessage = await res.json()
                setMessages([...messages, newMessage]) // Append to bottom
                setMessageContent('')
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setSendingMessage(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Keep rememberMe email so it's still pre-filled on next login
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

    const handleDeleteBooking = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this assignment protocol? This action is irreversible.')) return
        setIsPending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/bookings?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                setBookings(bookings.filter(b => b.id !== id))
            } else {
                const err = await res.json()
                alert(`Cancellation Failed: ${err.error}`)
            }
        } catch (error) {
            console.error('Delete booking failed:', error)
        } finally {
            setIsPending(false)
        }
    }

    const [contactMessage, setContactMessage] = useState('')
    const [contactSending, setContactSending] = useState(false)
    const [contactSent, setContactSent] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key)
            setTimeout(() => setCopied(null), 2000)
        })
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

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">Loading your portal…</p>
            </div>
        </div>
    )

    if (!user) return null



    return (
        <div className="px-2 sm:px-4 py-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in relative">
            {isPending && <LoadingOverlay />}
            {/* Client Profile Hero */}
            <div className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0 w-full md:w-auto">
                        <ProfileUpload
                            currentImage={user.avatar}
                            onUploadComplete={handleAvatarUpdate}
                        />
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-5xl lg:text-5xl font-black text-foreground tracking-tighter uppercase leading-[0.8]">
                            Welcome back, <span className="text-primary italic">{user.firstName}</span>
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px]">Direct Client • Law Firm Professional</p>
                            <span className="hidden md:block h-1 w-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5 text-blue-500 font-bold text-[9px] uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                <ShieldCheck className="h-3 w-3" /> Priority Status
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/client/bookings/new" className="luxury-button flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em]">
                        <Plus className="h-4 w-4" /> <span>New Assignment</span>
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
                            <button onClick={() => navigateTab('bookings')} className="p-6 rounded-2xl bg-card border border-border/50 text-left hover:border-primary/40 transition-all hover:bg-primary/[0.02]">
                                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 shadow-lg shadow-primary/10">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Bookings</p>
                                <p className="text-3xl font-black text-primary tracking-tighter uppercase">{stats.active}</p>
                            </button>

                            <button onClick={() => navigateTab('financials')} className="p-6 rounded-2xl bg-card border border-border/50 text-left hover:border-amber-500/40 transition-all hover:bg-amber-500/[0.02]">
                                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-lg shadow-amber-500/10">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Outstanding Balance</p>
                                <p className="text-3xl font-black text-amber-500 tracking-tighter uppercase">${stats.unpaid.toLocaleString()}</p>
                            </button>

                            <button onClick={() => navigateTab('transcripts')} className="p-6 rounded-2xl bg-card border border-border/50 text-left hover:border-violet-500/40 transition-all hover:bg-violet-500/[0.02]">
                                <div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-500 mb-4 shadow-lg shadow-violet-500/10">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Documents</p>
                                <p className="text-3xl font-black text-violet-500 tracking-tighter uppercase">{stats.files}</p>
                            </button>
                        </div>

                        {/* Recent bookings */}
                        <div className="md-card overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                <h3 className="font-semibold text-foreground">Recent Bookings</h3>
                                <button onClick={() => navigateTab('bookings')}
                                    className="text-sm text-primary hover:underline font-medium">View all</button>
                            </div>
                            <div className="divide-y divide-border">
                                {bookings.length > 0 ? (
                                    bookings.slice(0, 5).map(booking => (
                                        <ActivityRow
                                            key={booking.id}
                                            id={booking.bookingNumber}
                                            title={`${booking.proceedingType} — ${booking.service?.serviceName ?? ''}`}
                                            date={format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                                            status={booking.bookingStatus}
                                            reporter={booking.reporter}
                                            onClick={() => booking.bookingStatus === 'ACCEPTED' && router.push(`/client/confirm/${booking.id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="py-16 text-center">
                                        <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">No bookings yet.</p>
                                        <Link href="/client/bookings/new" className="btn-primary mt-4 inline-flex text-sm">
                                            Schedule your first booking
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact card */}
                        <div className="md-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/20">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-0.5">Need assistance?</h4>
                                <p className="text-sm text-muted-foreground">Contact our team directly for any questions about scheduling or transcripts.</p>
                            </div>
                            <button onClick={() => navigateTab('messages')} className="btn-secondary text-sm flex-shrink-0">
                                Send a message
                            </button>
                        </div>
                    </>
                )}

                {activeTab === 'bookings' && (
                    <div className="md-card overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">My Bookings</h3>
                            <Link href="/client/bookings/new" className="btn-primary text-sm">
                                <Plus className="h-4 w-4" /> New Booking
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(booking => (
                                <div key={booking.id} className={`p-5 md:p-8 rounded-3xl border transition-all group ${booking.bookingStatus === 'SUBMITTED' ? 'bg-amber-500/5 border-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-card border-border hover:border-primary/20 hover:shadow-2xl'}`}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${booking.bookingStatus === 'SUBMITTED' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted/50 text-primary'}`}>
                                                <Calendar className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{booking.bookingNumber}</p>
                                                <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                                                    {booking.proceedingType}
                                                </h4>
                                                <p className="text-xs font-medium text-muted-foreground">{format(new Date(booking.bookingDate), 'EEEE, MMMM dd, yyyy')}</p>
                                                {booking.reporter && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-2.5 w-2.5 text-primary" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                            Reporter: {booking.reporter.firstName} {booking.reporter.lastName}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 shrink-0">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors
                                                                ${booking.bookingStatus === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                        booking.bookingStatus === 'ACCEPTED' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                                                            booking.bookingStatus === 'CONFIRMED' ? 'bg-primary/5 text-primary border-primary/10' :
                                                                booking.bookingStatus === 'SUBMITTED' ? 'bg-amber-500 text-white border-amber-600' :
                                                                    'bg-muted text-muted-foreground border-border'}`}>
                                                    {booking.bookingStatus}
                                                </span>
                                                {booking.bookingStatus === 'SUBMITTED' && (
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                                        title="Cancel Assignment"
                                                    >
                                                        <Clock className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            {booking.bookingStatus === 'ACCEPTED' && (
                                                <Link href={`/client/confirm/${booking.id}`} className="text-[10px] font-black text-rose-600 uppercase underline tracking-widest">
                                                    Confirm Now
                                                </Link>
                                            )}
                                            {booking.bookingStatus === 'SUBMITTED' && (
                                                <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest animate-pulse">Awaiting Activation</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
                }

                {
                    activeTab === 'scheduler' && (
                        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2.5rem] px-3 py-6 sm:p-10">
                            {user.role === 'CLIENT' ? (
                                <BookingRequest
                                    services={services}
                                    onBookingCreated={() => {
                                        const token = localStorage.getItem('token')
                                        fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } })
                                            .then(res => res.json())
                                            .then(data => setBookings(Array.isArray(data.bookings) ? data.bookings : []))
                                    }}
                                />
                            ) : (
                                <ClientCalendar
                                    bookings={bookings}
                                    services={services}
                                    onBookingCreated={() => {
                                        const token = localStorage.getItem('token')
                                        fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } })
                                            .then(res => res.json())
                                            .then(data => setBookings(Array.isArray(data.bookings) ? data.bookings : []))
                                    }}
                                />
                            )}
                        </div>
                    )
                }


                {
                    activeTab === 'transcripts' && (
                        <div className="glass-panel rounded-[2.5rem] p-5 md:p-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Vault Storage</h3>
                                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
                                    <div className="relative flex-1 min-w-0">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                                            placeholder="Search Vault..."
                                            value={docSearchQuery}
                                            onChange={(e) => setDocSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <label className="h-10 px-5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-colors shrink-0">
                                        <Upload className="h-4 w-4" /> Upload
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0]
                                                if (!file) return
                                                const formData = new FormData()
                                                formData.append('file', file)
                                                formData.append('category', 'CLIENT_UPLOAD')
                                                const token = localStorage.getItem('token')
                                                const res = await fetch('/api/documents', {
                                                    method: 'POST',
                                                    headers: { 'Authorization': `Bearer ${token}` },
                                                    body: formData
                                                })
                                                if (res.ok) {
                                                    const newDoc = await res.json()
                                                    setDocuments([newDoc, ...documents])
                                                    setStats(s => ({ ...s, files: s.files + 1 }))
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.filter(d => !docSearchQuery || d.fileName.toLowerCase().includes(docSearchQuery.toLowerCase())).length > 0 ? documents.filter(d => !docSearchQuery || d.fileName.toLowerCase().includes(docSearchQuery.toLowerCase())).map(doc => (
                                    <div key={doc.id} className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between hover:shadow-xl hover:border-primary/10 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${doc.fileType.includes('pdf') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors uppercase">{doc.fileName}</p>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase mt-1">
                                                    {doc.category.replace('_', ' ')} • {format(new Date(doc.createdAt), 'MMM dd')}
                                                </p>
                                            </div>
                                        </div>
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                                        </a>
                                    </div>
                                )) : (
                                    <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                                        <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Vault is currently empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'financials' && (
                        <div className="glass-panel rounded-[2.5rem] p-5 md:p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Financial Ledger</h3>
                                <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/20">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Outstanding:</span>
                                    <span className="text-lg font-black text-primary">${stats.unpaid.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {invoices.length > 0 ? invoices.map(invoice => (
                                    <div key={invoice.id} className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <CreditCard className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{invoice.invoiceNumber}</p>
                                                    <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                                                        {invoice.booking?.proceedingType || 'Services Rendering'}
                                                    </h4>
                                                    <p className="text-xs font-medium text-muted-foreground">Issued: {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Total Due</p>
                                                    <p className="text-xl font-black text-foreground">${invoice.total.toLocaleString()}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                                            ${invoice.status === 'PAID' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                        {invoice.status}
                                                    </span>
                                                    {invoice.status !== 'PAID' && (
                                                        <button className="text-[10px] font-black text-primary uppercase underline tracking-widest">Pay Invoice</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                                        <CreditCard className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No invoices found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'messages' && (
                        <div className="glass-panel rounded-[2.5rem] h-[700px] flex flex-col overflow-hidden bg-card border border-border">
                            <CommMatrix />
                        </div>
                    )
                }

                {
                    activeTab === 'services' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {services.filter(s => s.active).map(service => (
                                    <div key={service.id} className="glass-panel rounded-[2.5rem] p-8 border border-border hover:shadow-2xl hover:border-primary/10 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-12 w-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Cpu className="h-6 w-6" />
                                            </div>
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-100">Operational</span>
                                        </div>
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{service.serviceName}</h3>
                                        <p className="text-xs text-muted-foreground font-medium mb-8 leading-relaxed line-clamp-2">{service.description || 'Enterprise-grade stenographic data processing service.'}</p>

                                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Base Rate</p>
                                                <p className="text-[10px] font-black text-foreground uppercase">Upon Approval</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Remote</p>
                                                <p className="text-[10px] font-black text-foreground uppercase">Per Quote</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">On-Site</p>
                                                <p className="text-[10px] font-black text-foreground uppercase">Authorized</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                {
                    activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                            {/* ── User Identity Card ── */}
                            <div className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-border">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Identity Management</h3>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Biometric & system credentials</p>
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

                                {/* Profile hero */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-muted/40 border border-border mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg flex-shrink-0">
                                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-black text-foreground uppercase tracking-tight">{user.firstName} {user.lastName}</h4>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                        <span className="mt-1 inline-flex px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">{user.role}</span>
                                    </div>
                                </div>

                                {/* Credentials Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* User ID */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Hash className="h-3 w-3" /> Your User ID
                                        </label>
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border group">
                                            <code className="flex-1 text-xs font-mono text-foreground truncate select-all">{user.id}</code>
                                            <button
                                                onClick={() => copyToClipboard(user.id, 'id')}
                                                className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex-shrink-0"
                                                title="Copy User ID"
                                            >
                                                {copied === 'id' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail className="h-3 w-3" /> Login Email
                                        </label>
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                                            <code className="flex-1 text-xs font-mono text-foreground truncate select-all">{user.email}</code>
                                            <button
                                                onClick={() => copyToClipboard(user.email, 'email')}
                                                className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex-shrink-0"
                                                title="Copy Email"
                                            >
                                                {copied === 'email' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                            <ShieldCheck className="h-3 w-3" /> Account Role
                                        </label>
                                        <div className="flex items-center p-3 rounded-xl bg-muted border border-border">
                                            <span className="text-xs font-black text-foreground uppercase tracking-wide">{user.role}</span>
                                        </div>
                                    </div>

                                    {/* Password placeholder */}
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

                                {/* Info note */}
                                <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
                                    <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                        To update your credentials or reset your password, please contact the admin team using the form below. For security, credentials cannot be self-modified.
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
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">For ID updates, password resets, or billing queries</p>
                                    </div>
                                </div>

                                {/* Contact channels */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                    {[
                                        { icon: <MessageSquare className="h-4 w-4" />, label: 'Portal Message', desc: 'Fastest — avg 2h response', action: () => navigateTab('messages'), color: 'text-primary bg-primary/10 border-primary/20' },
                                        { icon: <Mail className="h-4 w-4" />, label: 'Email Admin', desc: 'admin@marinadubson.com', action: () => window.open('mailto:admin@marinadubson.com'), color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
                                        { icon: <Phone className="h-4 w-4" />, label: 'Phone Support', desc: '(212) 555-0100', action: () => window.open('tel:+12125550100'), color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
                                    ].map((ch, i) => (
                                        <button
                                            key={i}
                                            onClick={ch.action}
                                            className={`flex flex-col items-start gap-2 p-4 rounded-2xl border hover:shadow-lg transition-all group text-left ${ch.color}`}
                                        >
                                            <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                                {ch.icon} {ch.label}
                                            </div>
                                            <p className="text-[9px] text-muted-foreground font-medium">{ch.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Quick message form */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Quick Message to Admin</label>
                                    <textarea
                                        className="w-full p-4 rounded-2xl bg-muted/50 border border-border text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                                        placeholder="Describe your request — e.g. 'Please reset my password' or 'I need to update my billing email to...' or 'My User ID access has changed...'"
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                    />

                                    {contactSent && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 animate-in fade-in duration-300">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Message sent! The admin team will respond shortly.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleContactAdmin}
                                        disabled={contactSending || !contactMessage.trim()}
                                        className="btn-primary w-full justify-center py-3 disabled:opacity-50"
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
                    )
                }

            </div>
        </div>
    )
}

function StatsCard({ label, value, icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-card p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-xl transition-all group outline-none focus:ring-2 focus:ring-primary/20"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
            </div>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{label}</h3>
            <p className="text-3xl font-black text-foreground tracking-tighter uppercase">{value}</p>
        </button>
    )
}

function ActivityRow({ id, title, date, status, reporter, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/10 cursor-pointer gap-4"
        >
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <div className="flex-shrink-0 h-14 w-12 rounded-xl bg-card border border-border flex flex-col items-center justify-center shadow-sm overflow-hidden">
                    <span className="text-[8px] font-black text-muted-foreground uppercase leading-none mb-0.5">{date.split(' ')[0]}</span>
                    <span className="text-[14px] font-black text-foreground leading-none">{date.split(' ')[1].replace(',', '')}</span>
                    <span className="text-[8px] font-bold text-muted-foreground/60 leading-none mt-0.5">{date.split(' ')[2]}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate">{title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">{id} • Global Record</p>
                        {reporter && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">
                                <User className="h-3 w-3 text-primary" />
                                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Professional Assigned: {reporter.firstName} {reporter.lastName}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/10">
                {status === 'ACCEPTED' && (
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Action Required</span>
                )}
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors shrink-0
                    ${status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        status === 'ACCEPTED' ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/20' :
                            status === 'CONFIRMED' ? 'bg-primary/20 text-primary border-primary/30' :
                                'bg-muted/30 text-muted-foreground border-border/10'
                    }`}>
                    {status === 'ACCEPTED' ? 'Confirm' : status}
                </span>
            </div>
        </div>
    )
}
