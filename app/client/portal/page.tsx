'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
    Cpu,
    Activity,
    Upload,
    Send
} from 'lucide-react'

export default function ClientPortal() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [bookings, setBookings] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [documents, setDocuments] = useState<any[]>([])
    const [invoices, setInvoices] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [stats, setStats] = useState({ active: 0, unpaid: 0, files: 0 })
    const [loading, setLoading] = useState(true)
    const [messageContent, setMessageContent] = useState('')
    const [sendingMessage, setSendingMessage] = useState(false)

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
                setMessages([newMessage, ...messages])
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
        <div className="min-h-screen bg-[#fcfdfc] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialising Elite Portal...</p>
            </div>
        </div>
    )

    if (!user) return null

    const needsConfirmation = bookings.filter(b => b.bookingStatus === 'ACCEPTED' && !b.confirmation)

    return (
        <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#00120d] dark:text-gray-100 font-poppins selection:bg-primary/10 selection:text-primary pb-24">
            {/* Elite Client Header */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
                        MD
                    </div>
                    <div>
                        <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                            Client <span className="text-primary italic hidden xs:inline">Portal</span>
                        </h1>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Stenographic Solutions</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enterprise Connection Active</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 h-9 md:h-10 px-3 md:px-4 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest border border-transparent hover:border-red-100">
                            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Exit</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-8 py-10">
                {/* Global Alert System */}
                {needsConfirmation.length > 0 && (
                    <div className="mb-12 p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-top-4">
                        <div className="flex items-center gap-6">
                            <div className="h-14 w-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight">Legal Confirmation Required</h3>
                                <p className="text-sm text-rose-600 font-medium">You have {needsConfirmation.length} booking(s) awaiting your final authorization.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {needsConfirmation.map(b => (
                                <Link
                                    key={b.id}
                                    href={`/client/confirm/${b.id}`}
                                    className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 flex items-center gap-3"
                                >
                                    Confirm BK-{b.bookingNumber.slice(-4)}
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Welcome Hero */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                            Welcome, <span className="text-primary">{user.firstName}</span>
                        </h2>
                        <p className="text-gray-500 font-medium">Manage your legal transcripts and reporting schedules with precision.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/client/bookings/new" className="luxury-btn py-4 shadow-xl shadow-primary/20">
                            <Plus className="h-5 w-5" /> Request New Booking
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <aside className="lg:col-span-1 space-y-4">
                        <nav className="flex flex-col gap-2">
                            <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard />} label="Intelligence Overview" />
                            <NavItem active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<Calendar />} label="My Booking Registry" />
                            <NavItem active={activeTab === 'nodes'} onClick={() => setActiveTab('nodes')} icon={<Cpu />} label="Service Node Network" />
                            <NavItem active={activeTab === 'transcripts'} onClick={() => setActiveTab('transcripts')} icon={<FileText />} label="Transcript Vault" />
                            <NavItem active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} icon={<CreditCard />} label="Financial Ledger" />
                            <NavItem active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare />} label="Direct Secure Messaging" />
                        </nav>

                        <div className="bg-gradient-to-br from-gray-900 to-[#001a12] rounded-[2rem] p-6 text-white relative overflow-hidden group mt-10">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
                            <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                            <h4 className="text-sm font-black uppercase tracking-widest mb-2">Priority Support</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed mb-6 tracking-tight">Access direct escalation path to Marina for critical case management.</p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Secure Call</button>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatsCard label="Active Cases" value={String(stats.active).padStart(2, '0')} icon={<TrendingUp className="text-emerald-500" />} />
                                    <StatsCard label="Unpaid Ledger" value={`$${stats.unpaid.toLocaleString()}`} icon={<CreditCard className="text-primary" />} />
                                    <StatsCard label="Vault Files" value={String(stats.files).padStart(2, '0')} icon={<FileText className="text-purple-500" />} />
                                </div>
                                <div className="glass-panel rounded-[2.5rem] p-10 overflow-hidden">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Activity Feed</h3>
                                        <button className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl">Historical Archive</button>
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
                                                    onClick={() => booking.bookingStatus === 'ACCEPTED' && router.push(`/client/confirm/${booking.id}`)}
                                                />
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                                <Clock className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No recent activity detected.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="glass-panel rounded-[2.5rem] p-10">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Booking Registry</h3>
                                    <Link href="/client/bookings/new" className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl flex items-center gap-2">
                                        <Plus className="h-4 w-4" /> New Request
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl transition-all group">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Calendar className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{booking.bookingNumber}</p>
                                                        <h4 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {booking.proceedingType}
                                                        </h4>
                                                        <p className="text-xs font-medium text-gray-500">{format(new Date(booking.bookingDate), 'EEEE, MMMM dd, yyyy')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors
                                                        ${booking.bookingStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            booking.bookingStatus === 'ACCEPTED' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                                                                booking.bookingStatus === 'CONFIRMED' ? 'bg-primary/5 text-primary border-primary/10' :
                                                                    'bg-gray-50 text-gray-500 border-gray-100'}`}>
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
                        )}

                        {activeTab === 'transcripts' && (
                            <div className="glass-panel rounded-[2.5rem] p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Vault Storage</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input className="pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-primary/10" placeholder="Search Vault..." />
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
                                        <div key={doc.id} className="p-6 rounded-2xl bg-white border border-gray-100 flex items-center justify-between hover:shadow-xl hover:border-primary/10 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${doc.fileType.includes('pdf') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-gray-900 group-hover:text-primary transition-colors uppercase">{doc.fileName}</p>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase mt-1">
                                                        {doc.category.replace('_', ' ')} • {format(new Date(doc.createdAt), 'MMM dd')}
                                                    </p>
                                                </div>
                                            </div>
                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-5 w-5 text-gray-300 group-hover:text-gray-900" />
                                            </a>
                                        </div>
                                    )) : (
                                        <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                            <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Vault is currently empty.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'financials' && (
                            <div className="glass-panel rounded-[2.5rem] p-10">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Financial Ledger</h3>
                                    <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Outstanding:</span>
                                        <span className="text-lg font-black text-primary">${stats.unpaid.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {invoices.length > 0 ? invoices.map(invoice => (
                                        <div key={invoice.id} className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl transition-all group">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <CreditCard className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{invoice.invoiceNumber}</p>
                                                        <h4 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight">
                                                            {invoice.booking?.proceedingType || 'Services Rendering'}
                                                        </h4>
                                                        <p className="text-xs font-medium text-gray-500">Issued: {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Due</p>
                                                        <p className="text-xl font-black text-gray-900">${invoice.total.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-3">
                                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                                            ${invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
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
                                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                                            <CreditCard className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No financial records found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="glass-panel rounded-[2.5rem] h-[700px] flex flex-col overflow-hidden">
                                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">M</div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase">Marina Dubson Support</p>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Channels Open</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-900 transition-colors">Search History</button>
                                        <div className="h-4 w-px bg-gray-200 mx-2"></div>
                                        <button className="text-[10px] font-black text-gray-400 uppercase hover:text-gray-900 transition-colors">Settings</button>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gray-50/30">
                                    {messages.length > 0 ? (
                                        [...messages].reverse().map(msg => (
                                            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-6 rounded-[1.5rem] shadow-sm ${msg.senderId === user.id
                                                    ? 'bg-gray-900 text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-100 text-gray-900 rounded-tl-none'
                                                    }`}>
                                                    <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-3 opacity-50 ${msg.senderId === user.id ? 'text-white' : 'text-gray-400'
                                                        }`}>
                                                        {format(new Date(msg.createdAt), 'HH:mm • MMM dd')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col justify-center items-center text-gray-300">
                                            <MessageSquare className="h-16 w-16 mb-6 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Tactical Comms...</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 border-t border-gray-100 bg-white">
                                    <div className="flex gap-4 p-2 pl-6 pr-2 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-primary/20 transition-all">
                                        <input
                                            value={messageContent}
                                            onChange={(e) => setMessageContent(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            className="flex-1 bg-transparent border-none text-xs font-medium outline-none placeholder:text-gray-400"
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
                        )}

                        {activeTab === 'nodes' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {services.filter(s => s.active).map(service => (
                                        <div key={service.id} className="glass-panel rounded-[2.5rem] p-8 border border-gray-100 hover:shadow-2xl hover:border-primary/10 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="h-12 w-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Cpu className="h-6 w-6" />
                                                </div>
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Operational</span>
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{service.serviceName}</h3>
                                            <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed line-clamp-2">{service.description || 'Enterprise-grade stenographic data processing node.'}</p>

                                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-50">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Rate</p>
                                                    <p className="text-[10px] font-black text-gray-900 uppercase">Upon Approval</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Remote</p>
                                                    <p className="text-[10px] font-black text-gray-900 uppercase">Per Quote</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">On-Site</p>
                                                    <p className="text-[10px] font-black text-gray-900 uppercase">Authorized</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

function NavItem({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group ${active
                ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                }`}
        >
            <div className={`transition-transform duration-500 group-hover:scale-110 ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`}>
                {icon}
            </div>
            <span className="text-xs font-black uppercase tracking-tight">{label}</span>
            {active && <ChevronRight className="ml-auto h-4 w-4" />}
        </button>
    )
}

function StatsCard({ label, value, icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
            </div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{value}</p>
        </div>
    )
}

function ActivityRow({ id, title, date, status, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="group flex items-center justify-between p-6 hover:bg-primary/5 rounded-2xl transition-all border border-transparent hover:border-primary/10 cursor-pointer"
        >
            <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] font-black text-gray-400">{date.split(' ')[0]}</span>
                    <span className="text-[10px] font-black text-gray-900">{date.split(' ')[1]} {date.split(' ')[2]}</span>
                </div>
                <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{id} • Processed via Global Node</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {status === 'ACCEPTED' && (
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest animate-pulse">Action Required</span>
                )}
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors
                    ${status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        status === 'ACCEPTED' ? 'bg-rose-600 text-white border-rose-600' :
                            status === 'CONFIRMED' ? 'bg-primary/5 text-primary border-primary/10' :
                                'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                    {status === 'ACCEPTED' ? 'Confirm' : status}
                </span>
            </div>
        </div>
    )
}
