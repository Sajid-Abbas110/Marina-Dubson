'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
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
    ChevronRight,
    Search,
    BadgeCheck,
    MessageSquare
} from 'lucide-react'

export default function ReporterPortal() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [assignedJobs, setAssignedJobs] = useState<any[]>([])
    const [marketplaceJobs, setMarketplaceJobs] = useState<any[]>([])
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [payouts, setPayouts] = useState<any[]>([])
    const [shouldScroll, setShouldScroll] = useState(false)

    const fetchUserData = useCallback(async (isPoll = false) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                if (!isPoll) router.push('/login')
                return
            }

            const [userRes, jobsRes, marketRes, msgsRes, bidsRes] = await Promise.all([
                fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/market', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/market/bids', { headers: { 'Authorization': `Bearer ${token}` } })
            ])

            const userData = await userRes.json()
            const jobsData = await jobsRes.json()
            const marketData = await marketRes.json()
            const msgsData = await msgsRes.json()
            const bidsData = await bidsRes.json()

            if (userData.user) setUser(userData.user)
            if (jobsData.bookings) setAssignedJobs(jobsData.bookings)
            if (marketData.jobs) setMarketplaceJobs(marketData.jobs)
            if (msgsData.messages) setMessages(msgsData.messages)
            if (bidsData.bids) setPayouts(bidsData.bids)

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

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    const handleSetAvailability = () => {
        const slots = prompt("Enter your available days (e.g. Mon, Wed, Fri) or 'ALL' for full availability:");
        if (slots) {
            alert("Availability Updated: Your status has been broadcasted to the Command Center.");
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Accessing Professional Node...</p>
            </div>
        </div>
    )

    if (!user) return null

    return (
        <div className="min-h-screen bg-background text-foreground font-poppins selection:bg-primary/10 selection:text-primary">
            {/* Professional Reporter Header */}
            <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-2xl border-b border-border px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 transform -rotate-6">
                        MD
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2 uppercase">
                            Reporter <span className="brand-gradient italic">Network</span>
                        </h1>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">Professional Logistics Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 italic">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verified Expert Status</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-muted text-muted-foreground hover:text-destructive transition-all font-black text-[10px] uppercase tracking-widest border border-transparent">
                            <LogOut className="h-4 w-4" /> Exit
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-8 py-10">
                {/* Reporter Profile Hero */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-8">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-indigo-800 flex items-center justify-center text-primary-foreground font-black text-3xl shadow-2xl">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">
                                {user.firstName} <span className="text-primary">{user.lastName}</span>
                            </h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Senior Court Reporter • NY Licensed</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Professional Console Tabs */}
                    <aside className="lg:col-span-1 border-r border-border pr-8 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6">Ops Management</h3>
                            <nav className="flex flex-col gap-2">
                                <ReporterNavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp />} label="Earnings Dashboard" />
                                <ReporterNavItem active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Calendar />} label="Job Assignment Desk" />
                                <ReporterNavItem active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Upload />} label="Transcript Delivery" />
                                <ReporterNavItem active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare />} label="Secure Messaging" />
                                <ReporterNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="Network Profile" />
                            </nav>
                        </div>

                        <div className="bg-primary rounded-[2.5rem] p-8 text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20 group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <DollarSign className="h-10 w-10 text-primary-foreground/50 mb-6" />
                            <h4 className="text-xl font-black uppercase tracking-tight mb-2">Net Earnings</h4>
                            <p className="text-4xl font-black tracking-tighter mb-8">
                                ${payouts.filter(b => b.status === 'ACCEPTED').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                            </p>
                            <button className="w-full py-4 bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 hover:bg-white/30 transition-all">Request Payout</button>
                        </div>
                    </aside>

                    {/* Dashboard Detail View */}
                    <div className="lg:col-span-3 space-y-10 animate-in fade-in slide-in-from-right-4 duration-1000">
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <MetricCard
                                        label="Jobs Scheduled"
                                        value={String(assignedJobs.length).padStart(2, '0')}
                                        sub="Confirmed Assignments"
                                        color="text-primary"
                                        onClick={() => setActiveTab('jobs')}
                                    />
                                    <MetricCard
                                        label="Pending Delivery"
                                        value={String(assignedJobs.filter(j => j.bookingStatus !== 'COMPLETED').length).padStart(2, '0')}
                                        sub="Action Required"
                                        color="text-amber-500"
                                        onClick={() => setActiveTab('upload')}
                                    />
                                    <MetricCard
                                        label="Market Jobs"
                                        value={String(marketplaceJobs.length).padStart(2, '0')}
                                        sub="Open for Bidding"
                                        color="text-blue-500"
                                        onClick={() => { setActiveTab('jobs'); setShouldScroll(true); }}
                                    />
                                </div>
                                <div className="glass-panel bg-card rounded-[3rem] p-10 shadow-xl border border-border">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Active Deployments</h3>
                                        <button onClick={() => setActiveTab('jobs')} className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-xl">View Schedule</button>
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
                                            <div className="py-12 text-center text-gray-400 font-bold uppercase text-[10px]">No active assignments detected.</div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'jobs' && (
                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Confirmed Assignments</h3>
                                    <div className="space-y-3">
                                        {assignedJobs.length > 0 ? assignedJobs.map(job => (
                                            <AssignmentRow
                                                key={job.id}
                                                job={job}
                                                onClick={() => {
                                                    alert(`Assignment Details:\n\nBooking: ${job.bookingNumber}\nClient: ${job.contact.companyName || job.contact.firstName + ' ' + job.contact.lastName}\nProceeding: ${job.proceedingType}\nDate: ${format(new Date(job.bookingDate), 'MMM dd, yyyy')}\nTime: ${job.bookingTime}\nLocation: ${job.location || 'Remote'}\nStatus: ${job.bookingStatus}`);
                                                }}
                                            />
                                        )) : (
                                            <div className="py-12 text-center border-2 border-dashed border-border rounded-[2rem]">
                                                <Calendar className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">No confirmed assignments yet.</p>
                                                <button
                                                    onClick={() => document.getElementById('marketplace-section')?.scrollIntoView({ behavior: 'smooth' })}
                                                    className="mt-4 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                                >
                                                    Browse Marketplace
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section id="marketplace-section">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Marketplace Opportunities</h3>
                                        <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">{marketplaceJobs.length} Jobs Open</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {marketplaceJobs.length > 0 ? marketplaceJobs.map(job => (
                                            <MarketplaceCard key={job.id} job={job} onBid={() => handleBid(job.id)} />
                                        )) : (
                                            <div className="col-span-2 py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
                                                <Search className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                                                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">No marketplace opportunities available</p>
                                                <p className="text-[10px] text-muted-foreground/60">Check back soon for new assignments from the Command Center</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <div className="bg-card rounded-[3rem] p-12 overflow-hidden shadow-xl border border-border">
                                <div className="mb-10">
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Transcript Asset Delivery</h3>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-2">Select confirmed assignment to begin upload protocol</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Deployment</label>
                                        <select className="w-full bg-muted border border-border rounded-2xl p-5 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-primary/20 text-foreground">
                                            <option className="bg-card">Select Assignment Node...</option>
                                            {assignedJobs.map(job => (
                                                <option key={job.id} value={job.id} className="bg-card">{job.bookingNumber} - {job.proceedingType}</option>
                                            ))}
                                        </select>

                                        <div className="p-10 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center space-y-6 hover:border-primary transition-colors group cursor-pointer bg-muted/30">
                                            <Upload className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Drag and drop transcript assets</p>
                                            <button className="px-6 py-3 bg-foreground text-background rounded-xl text-[9px] font-black uppercase tracking-widest">Browse Assets</button>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-muted rounded-[2rem] space-y-6">
                                        <h4 className="text-xs font-black text-foreground uppercase">Compliance Checklist</h4>
                                        <ul className="space-y-4">
                                            <ComplianceItem label="ASCII / PDF Format Check" />
                                            <ComplianceItem label="OCR Text Recognition" />
                                            <ComplianceItem label="Exhibit Hyperlinking" />
                                            <ComplianceItem label="Legal Metadata Signature" />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="glass-panel rounded-[2.5rem] h-[600px] flex flex-col overflow-hidden bg-card">
                                <div className="p-8 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow-lg shadow-primary/20">RC</div>
                                        <div>
                                            <p className="text-sm font-black text-foreground uppercase">Reporter Command Center</p>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                                <p className="text-[9px] font-black text-primary uppercase tracking-widest">Connected to Admin Node</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-muted/10">
                                    {messages.length > 0 ? (
                                        messages.map(msg => (
                                            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-6 rounded-[1.5rem] shadow-sm ${msg.senderId === user.id
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted border border-border text-foreground rounded-tl-none'
                                                    }`}>
                                                    <p className="text-xs font-medium leading-relaxed">{msg.content}</p>
                                                    <p className={`text-[8px] font-black uppercase tracking-widest mt-3 opacity-50 ${msg.senderId === user.id ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                                        {format(new Date(msg.createdAt), 'HH:mm • MMM dd')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col justify-center items-center text-muted-foreground/20">
                                            <MessageSquare className="h-16 w-16 mb-6 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">No communications active...</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 border-t border-border bg-card">
                                    <div className="flex gap-4 p-2 pl-6 pr-2 rounded-2xl bg-muted border border-border">
                                        <input
                                            className="flex-1 bg-transparent border-none outline-none text-xs font-bold py-3 text-foreground"
                                            placeholder="Secure transmission entry..."
                                            onKeyPress={async (e) => {
                                                if (e.key === 'Enter') {
                                                    const content = e.currentTarget.value;
                                                    if (!content) return;
                                                    e.currentTarget.value = '';
                                                    const token = localStorage.getItem('token');
                                                    await fetch('/api/messages', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                        body: JSON.stringify({ content })
                                                    });
                                                    window.location.reload();
                                                }
                                            }}
                                        />
                                        <button className="h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )

    const handleBid = async (bookingId: string) => {
        const amount = prompt("Enter your bid amount ($):");
        if (!amount) return;

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
                    amount: parseFloat(amount),
                    notes: "Submitted via Reporter Portal"
                })
            });

            if (res.ok) {
                alert("Bid submitted successfully to the Command Center.");
                window.location.reload();
            } else {
                const err = await res.json();
                alert(`Bid Protocol Failed: ${err.error}`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    function ReporterNavItem({ icon, label, active, onClick }: any) {
        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-5 w-full p-5 rounded-2xl transition-all duration-500 group ${active
                    ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 translate-x-1'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-xl'
                    }`}
            >
                <div className={`transition-all duration-500 ${active ? 'text-primary-foreground' : 'text-muted-foreground/30 group-hover:text-primary group-hover:rotate-12'}`}>
                    {icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
                {active && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
            </button>
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

    function AssignmentRow({ job, onClick }: { job: any, onClick?: () => void }) {
        return (
            <button
                onClick={onClick}
                className="w-full p-6 bg-card border border-border rounded-[2rem] flex items-center justify-between hover:shadow-xl transition-all group outline-none focus:ring-2 focus:ring-primary/20"
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
                        <p className="text-[9px] font-black text-muted-foreground uppercase mt-1">{job.location || 'Remote Node'}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${job.bookingStatus === 'COMPLETED' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-primary/5 text-primary border-primary/20'
                        }`}>
                        {job.bookingStatus}
                    </div>
                </div>
            </button>
        )
    }

    function MarketplaceCard({ job, onBid }: { job: any, onBid: () => void }) {
        return (
            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase">Open Opportunity</span>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{job.service.serviceName}</p>
                        <h4 className="text-xl font-black text-foreground uppercase tracking-tighter leading-none">{job.proceedingType}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase">{format(new Date(job.bookingDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase truncate">{job.location || 'Remote'}</span>
                        </div>
                    </div>
                    <button
                        onClick={onBid}
                        className="luxury-button w-full py-4 text-[10px]"
                    >
                        Submit Deployment Bid
                    </button>
                </div>
            </div>
        )
    }

    function MetricCard({ label, value, sub, color, onClick }: any) {
        return (
            <button
                onClick={onClick}
                className="w-full text-left bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group outline-none focus:ring-2 focus:ring-primary/20"
            >
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</h4>
                <div className="flex items-end gap-3">
                    <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
                    <div className="mb-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                </div>
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase mt-4 tracking-widest">{sub}</p>
            </button>
        )
    }

    function AssignmentItem({ id, client, location, date, time, type, onClick }: any) {
        return (
            <button
                onClick={onClick}
                className="w-full group flex items-center justify-between p-6 bg-muted/20 hover:bg-card hover:shadow-2xl rounded-3xl transition-all border border-transparent hover:border-primary/20 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
            >
                <div className="flex items-center gap-8">
                    <div className="h-16 w-16 rounded-2xl bg-card border border-border flex flex-col items-center justify-center shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                        <span className="text-[10px] font-black text-primary">{date.split(' ')[0]}</span>
                        <span className="text-xl font-black text-foreground">{date.split(' ')[1]}</span>
                    </div>
                    <div className="space-y-1 text-left">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{type.split(' ')[0]}</span>
                            <h4 className="text-lg font-black text-foreground tracking-tight">{client}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-tight">{location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-tight">{time}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-foreground">{id}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Assignment Code</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/50 group-hover:shadow-lg transition-all">
                        <ChevronRight className="h-6 w-6" />
                    </div>
                </div>
            </button>
        )
    }
}
