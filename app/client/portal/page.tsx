'use client'

import { useState, useEffect, useRef } from 'react'
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
    Cpu
} from 'lucide-react'
import ClientCalendar from '../components/ClientCalendar'
import BookingRequest from '../components/BookingRequest'

export default function ClientPortal() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'overview'

    // Helper to switch tabs via URL
    const navigateTab = (tab: string) => router.push(`/client/portal?tab=${tab}`)

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

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
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

                // Ensure messages are chronological (Oldest -> Newest)
                setMessages(Array.isArray(messagesData.messages) ? messagesData.messages : [])

                // Calculate stats
                const active = userBookings.filter((b: any) => ['SUBMITTED', 'ACCEPTED', 'CONFIRMED'].includes(b.bookingStatus)).length
                const unpaid = (invoicesData.invoices || [])
                    .filter((i: any) => i.status !== 'PAID')
                    .reduce((sum: number, i: any) => sum + i.total, 0)

                setStats({
                    active,
                    unpaid,
                    files: docsData.documents?.length || 0
                })
            } catch (error) {
                console.error('Failed to fetch portal data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllData()
    }, [router])

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
        router.push('/login')
    }

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialising Elite Portal...</p>
            </div>
        </div>
    )

    if (!user) return null



    return (
        <div className="animate-in fade-in duration-500">
            {/* Header removed - provided by layout */}

            {/* Welcome Hero - Simplifed */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                        Welcome, <span className="text-primary">{user.firstName}</span>
                    </h2>
                    <p className="text-muted-foreground font-medium text-sm">Manage your legal transcripts and reporting schedules.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/client/bookings/new" className="luxury-button py-3 px-6 shadow-xl shadow-primary/20 flex items-center gap-2 rounded-xl text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                        <Plus className="h-4 w-4" /> New Booking
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                {activeTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsCard
                                label="Active Cases"
                                value={String(stats.active).padStart(2, '0')}
                                icon={<TrendingUp className="text-primary" />}
                                onClick={() => navigateTab('bookings')}
                            />
                            <StatsCard
                                label="Unpaid Ledger"
                                value={`$${stats.unpaid.toLocaleString()}`}
                                icon={<CreditCard className="text-primary" />}
                                onClick={() => navigateTab('invoices')}
                            />
                            <StatsCard
                                label="Vault Files"
                                value={String(stats.files).padStart(2, '0')}
                                icon={<FileText className="text-purple-500" />}
                                onClick={() => navigateTab('documents')}
                            />
                        </div>
                        <div className="glass-panel rounded-[2.5rem] p-10 overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Recent Activity Feed</h3>
                                <button
                                    onClick={() => {
                                        const allBookings = bookings.map(b => `${b.bookingNumber}: ${b.proceedingType} - ${format(new Date(b.bookingDate), 'MMM dd, yyyy')}`).join('\n');
                                        alert(`Historical Archive\n\nAll Bookings:\n${allBookings || 'No bookings found'}`);
                                    }}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all"
                                >
                                    Historical Archive
                                </button>
                            </div>
                            <div className="space-y-2">
                                {bookings.length > 0 ? (
                                    bookings.slice(0, 5).map(booking => (
                                        <ActivityRow
                                            key={booking.id}
                                            id={booking.bookingNumber}
                                            title={`${booking.proceedingType} - ${booking.service.serviceName}`}
                                            date={format(new Date(booking.bookingDate), 'MMM dd, yyyy').toUpperCase()}
                                            status={booking.bookingStatus}
                                            reporter={booking.reporter}
                                            onClick={() => booking.bookingStatus === 'ACCEPTED' && router.push(`/client/confirm/${booking.id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                                        <Clock className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No recent activity detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-[#001a12] rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/10 mt-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/10">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tight mb-1">Priority Support Channel</h4>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-lg">Direct escalation path to Marina for critical case management.</p>
                                </div>
                                <button
                                    onClick={() => alert('Priority Support Activated\n\nConnecting you to Marina Dubson\'s direct line...\n\nPhone: (555) 123-4567\nEmail: marina@marinadubson.com')}
                                    className="ml-auto px-6 py-3 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg"
                                >
                                    Secure Call
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'bookings' && (
                    <div className="glass-panel rounded-[2.5rem] p-10">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Booking Registry</h3>
                            <Link href="/client/bookings/new" className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl flex items-center gap-2">
                                <Plus className="h-4 w-4" /> New Request
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {bookings.map(booking => (
                                <div key={booking.id} className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 hover:shadow-2xl transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Calendar className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{booking.bookingNumber}</p>
                                                <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">
                                                    {booking.proceedingType}
                                                </h4>
                                                <p className="text-xs font-medium text-muted-foreground">{format(new Date(booking.bookingDate), 'EEEE, MMMM dd, yyyy')}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors
                                                        ${booking.bookingStatus === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    booking.bookingStatus === 'ACCEPTED' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                                                        booking.bookingStatus === 'CONFIRMED' ? 'bg-primary/5 text-primary border-primary/10' :
                                                            'bg-muted text-muted-foreground border-border'}`}>
                                                {booking.bookingStatus}
                                            </span>
                                            {booking.bookingStatus === 'ACCEPTED' && (
                                                <Link href={`/client/confirm/${booking.id}`} className="text-[10px] font-black text-rose-600 uppercase underline tracking-widest">
                                                    Confirm Now
                                                </Link>
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
                        <div className="glass-panel rounded-[2.5rem] p-10">
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
                        <div className="glass-panel rounded-[2.5rem] p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Vault Storage</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input className="pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/10" placeholder="Search Vault..." />
                                    </div>
                                    <label className="h-10 px-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 cursor-pointer hover:bg-black transition-colors">
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
                                {documents.length > 0 ? documents.map(doc => (
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
                        <div className="glass-panel rounded-[2.5rem] p-10">
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
                        <div className="glass-panel rounded-[2.5rem] h-[700px] flex flex-col overflow-hidden">
                            <div className="p-8 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">M</div>
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase">Marina Dubson Support</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active Channels Open</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] font-black text-muted-foreground uppercase hover:text-foreground transition-colors">Search History</button>
                                    <div className="h-4 w-px bg-muted mx-2"></div>
                                    <button className="text-[10px] font-black text-muted-foreground uppercase hover:text-foreground transition-colors">Settings</button>
                                </div>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-muted/10">
                                {messages.length > 0 ? (
                                    messages.map(msg => {
                                        const isMe = msg.senderId === user?.id || msg.senderId === user?.userId;
                                        return (
                                            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-6 py-4 rounded-[1.8rem] shadow-sm border ${isMe
                                                        ? 'bg-gradient-to-br from-gray-900 to-indigo-900 border-white/10 text-white rounded-tr-none'
                                                        : 'bg-slate-800 border-slate-700 text-slate-100 rounded-tl-none'
                                                        }`}>
                                                        <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                                                        <div className={`flex items-center gap-2 mt-3 opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white">
                                                                {format(new Date(msg.createdAt), 'HH:mm • MMM dd')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1.5 px-2">
                                                        {isMe ? 'CLIENT TRANSMISSION' : 'MARINA DUBSON SUPPORT'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="h-full flex flex-col justify-center items-center text-muted-foreground/30">
                                        <MessageSquare className="h-16 w-16 mb-6 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Tactical Comms...</p>
                                    </div>
                                )}
                                <div ref={msgScrollRef} />
                            </div>
                            <div className="p-8 border-t border-border bg-card">
                                <div className="flex gap-4 p-2 pl-6 pr-2 rounded-2xl bg-muted/50 border border-border focus-within:border-primary/20 transition-all">
                                    <input
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="flex-1 bg-transparent border-none text-xs font-medium outline-none placeholder:text-muted-foreground text-foreground"
                                        placeholder="Type your secure message..."
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={sendingMessage || !messageContent.trim()}
                                        className="h-12 w-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'nodes' && (
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
                                        <p className="text-xs text-muted-foreground font-medium mb-8 leading-relaxed line-clamp-2">{service.description || 'Enterprise-grade stenographic data processing node.'}</p>

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

                {activeTab === 'transcripts' && (
                    <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                        <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Transcript Vault Offline</p>
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                        <CreditCard className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Financial Ledger Offline</p>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden h-[600px] flex flex-col relative">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Marina Dubson</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Secure Line Active
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gray-50/30">
                            {messages.length > 0 ? (
                                messages.map(msg => {
                                    const isMe = msg.senderId === user?.id || msg.senderId === user?.userId;
                                    return (
                                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                            <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-6 py-4 rounded-[1.8rem] shadow-sm border ${isMe
                                                    ? 'bg-gradient-to-br from-gray-900 to-indigo-900 border-white/10 text-white rounded-tr-none'
                                                    : 'bg-slate-800 border-slate-700 text-slate-100 rounded-tl-none'
                                                    }`}>
                                                    <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                                                    <div className={`flex items-center gap-2 mt-3 opacity-40 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white">
                                                            {format(new Date(msg.createdAt), 'HH:mm • MMM dd')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mt-1.5 px-2">
                                                    {isMe ? 'CLIENT TRANSMISSION' : 'MARINA DUBSON SUPPORT'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-gray-300">
                                    <MessageSquare className="h-16 w-16 mb-6 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Tactical Comms...</p>
                                </div>
                            )}
                            <div ref={msgScrollRef} />
                        </div>
                        <div className="p-8 border-t border-gray-100 bg-white">
                            <div className="flex gap-4 p-2 pl-6 pr-2 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-primary/20 transition-all">
                                <input
                                    type="text"
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                    placeholder="Type your secure message..."
                                    className="flex-1 bg-transparent text-xs font-medium outline-none text-gray-900 placeholder:text-gray-400"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageContent.trim() || sendingMessage}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-900 text-white shadow-lg hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingMessage ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                        <Settings className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Settings Module Offline</p>
                    </div>
                )}

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
            className="group flex items-center justify-between p-6 hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/10 cursor-pointer"
        >
            <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-card border border-border flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] font-black text-muted-foreground">{date.split(' ')[0]}</span>
                    <span className="text-[10px] font-black text-foreground">{date.split(' ')[1]} {date.split(' ')[2]}</span>
                </div>
                <div>
                    <h4 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{id} • Processed via Global Node</p>
                        {reporter && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">
                                <User className="h-3 w-3 text-indigo-600" />
                                <span className="text-[8px] font-black text-indigo-600 uppercase">Assigned: {reporter.firstName} {reporter.lastName}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {status === 'ACCEPTED' && (
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest animate-pulse">Action Required</span>
                )}
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors
                    ${status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        status === 'ACCEPTED' ? 'bg-rose-600 text-white border-rose-600' :
                            status === 'CONFIRMED' ? 'bg-primary/5 text-primary border-primary/10' :
                                'bg-muted text-muted-foreground border-border'
                    }`}>
                    {status === 'ACCEPTED' ? 'Confirm' : status}
                </span>
            </div>
        </div>
    )
}
