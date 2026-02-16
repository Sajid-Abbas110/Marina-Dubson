'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Briefcase,
    Calendar,
    MessageSquare,
    TrendingUp,
    Globe,
    Zap,
    Clock,
    MapPin,
    Filter,
    Search,
    ArrowRight,
    Star,
    ShieldCheck,
    Terminal,
    Sparkles,
    ChevronRight,
    SearchIcon,
    BadgeCheck
} from 'lucide-react'

export default function DeepReporterJobsPortal() {
    const [filter, setFilter] = useState('ALL')
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showBidModal, setShowBidModal] = useState(false)
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [bidData, setBidData] = useState({
        amount: '',
        timeline: 'Standard',
        notes: ''
    })

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/market', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setJobs(data.jobs || [])
        } catch (error) {
            console.error('Failed to fetch jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleBidSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/market/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: selectedJob.id,
                    amount: parseFloat(bidData.amount),
                    timeline: bidData.timeline,
                    notes: bidData.notes
                })
            })

            if (res.ok) {
                setShowBidModal(false)
                fetchJobs()
                alert('Bid deployed successfully to the matrix.')
            } else {
                const err = await res.json()
                alert(err.error || 'Bid synchronization failed.')
            }
        } catch (error) {
            console.error('Bid submission failed:', error)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-poppins selection:bg-blue-500/30 selection:text-white">
            {/* 2026 Mesh Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-float"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <header className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600 blur-lg opacity-40 group-hover:opacity-100 transition-opacity"></div>
                        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black relative z-10 shadow-2xl">
                            MD
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                            Job <span className="text-blue-500 italic">Market</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></div>
                        </h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mt-1">Live Assignment Matrix v4.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/reporter/portal" className="h-12 px-6 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all">
                            Console <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-8 py-16 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Sparkles className="h-3 w-3" /> Opportunities Found: {jobs.length}
                        </div>
                        <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                            Find Your Next <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Elite Project</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                className="w-[400px] h-20 bg-white/5 border border-white/10 rounded-[2.5rem] px-16 text-sm font-medium outline-none focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
                                placeholder="Search by Project Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    {/* Perspective Filters */}
                    <aside className="xl:col-span-1 space-y-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8">Node Categories</h3>
                            <div className="flex flex-col gap-3">
                                <SidebarFilter active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="The Full Matrix" icon={<Globe />} count={jobs.length} />
                                <SidebarFilter active={filter === 'REMOTE'} onClick={() => setFilter('REMOTE')} label="Digital Nodes" icon={<Zap />} count={jobs.filter(j => j.appearanceType === 'REMOTE').length} />
                                <SidebarFilter active={filter === 'LOCAL'} onClick={() => setFilter('LOCAL')} label="Metro In-Person" icon={<MapPin />} count={jobs.filter(j => j.appearanceType === 'IN_PERSON').length} />
                            </div>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <Terminal className="h-10 w-10 text-blue-200 mb-6 group-hover:rotate-12 transition-transform" />
                            <h4 className="text-2xl font-black uppercase tracking-tight leading-tight mb-4">Elite <br />Certification</h4>
                            <p className="text-blue-100/60 text-xs font-medium leading-relaxed mb-8 uppercase tracking-widest">Complete your RPR verification to unlock daily assignments.</p>
                            <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all">Verify Now</button>
                        </div>
                    </aside>

                    {/* Infinite Job Stream */}
                    <div className="xl:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
                        {loading ? (
                            <div className="p-20 text-center font-black text-xs uppercase tracking-[0.5em] text-slate-500">Scanning Signal for Available Nodes...</div>
                        ) : jobs.length === 0 ? (
                            <div className="p-20 text-center font-black text-xs uppercase tracking-[0.5em] text-slate-500">The Matrix is currently clear of open assignments.</div>
                        ) : jobs.filter(j =>
                            (filter === 'ALL' || (filter === 'REMOTE' && j.appearanceType === 'REMOTE') || (filter === 'LOCAL' && j.appearanceType === 'IN_PERSON')) &&
                            (j.proceedingType.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).map((job) => (
                            <div key={job.id} className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
                                <div className="relative bg-[#020617] border border-white/10 rounded-[3.5rem] p-12 hover:bg-white/[0.02] transition-all flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
                                    <div className="flex items-center gap-10 relative z-10 w-full md:w-auto">
                                        <div className="h-24 w-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">{new Date(job.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-3xl font-black text-white">{new Date(job.bookingDate).getDate()}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">{job.appearanceType}</span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{job.bookingNumber}</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-white hover:text-blue-400 transition-colors uppercase tracking-tighter">{job.proceedingType}</h3>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <span className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{job.service?.serviceName}</span>
                                                <span className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{(job.bids?.length || 0)} Bids Linked</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-16 relative z-10 w-full md:w-auto justify-between md:justify-end">
                                        <div className="hidden lg:block space-y-4 text-right">
                                            <div className="flex items-center gap-3 justify-end text-slate-400">
                                                <span className="text-[11px] font-black uppercase tracking-widest">{job.jurisdiction || 'Confidential Venue'}</span>
                                                <Globe className="h-4 w-4" />
                                            </div>
                                            <div className="flex items-center gap-3 justify-end text-slate-500">
                                                <span className="text-[11px] font-black uppercase tracking-widest">{job.bookingTime}</span>
                                                <Clock className="h-4 w-4 text-blue-500/50" />
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Marketplace Node</p>
                                            <p className="text-2xl font-black text-white tracking-tighter italic uppercase">Bidding Open</p>
                                        </div>

                                        <button
                                            onClick={() => { setSelectedJob(job); setShowBidModal(true); }}
                                            className="h-20 w-20 rounded-[2.5rem] bg-white text-black flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-2xl group/btn"
                                        >
                                            <Zap className="h-8 w-8 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bidding Protocol Modal */}
            {showBidModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setShowBidModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-[#020617] rounded-[4rem] p-16 shadow-2xl border border-white/10 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

                        <div className="flex items-center gap-8 mb-12">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-blue-500 flex items-center justify-center text-white">
                                <Zap className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Deploy Marketplace bid</h2>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Assignment: {selectedJob?.bookingNumber}</p>
                            </div>
                        </div>

                        <form onSubmit={handleBidSubmit} className="space-y-8 text-left">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Bid Amount ($)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 text-sm font-black text-white focus:bg-blue-500/5 focus:border-blue-500 outline-none transition-all"
                                        placeholder="0.00"
                                        value={bidData.amount}
                                        onChange={(e) => setBidData({ ...bidData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Timeline commitment</label>
                                    <select
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 text-sm font-black text-white focus:bg-blue-500/5 focus:border-blue-500 outline-none transition-all"
                                        value={bidData.timeline}
                                        onChange={(e) => setBidData({ ...bidData, timeline: e.target.value })}
                                    >
                                        <option value="Standard">Standard (10 Business Days)</option>
                                        <option value="Expedited">Expedited (3 Business Days)</option>
                                        <option value="Elite">Realtime / Daily Copy</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Proposal / Tactical Notes</label>
                                <textarea
                                    className="w-full min-h-[160px] bg-white/5 border border-white/10 rounded-3xl p-8 text-xs font-medium text-white focus:bg-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Outline your case strategy..."
                                    value={bidData.notes}
                                    onChange={(e) => setBidData({ ...bidData, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-6 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowBidModal(false)}
                                    className="flex-1 h-16 rounded-3xl bg-white/5 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] h-16 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    Authorize Submission
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function SidebarFilter({ label, active, onClick, icon, count }: any) {
    return (
        <button onClick={onClick} className={`w-full p-6 rounded-3xl flex items-center justify-between transition-all group ${active ? 'bg-white/10 text-white shadow-2xl' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'}`}>
            <div className="flex items-center gap-4">
                <div className={`transition-transform duration-500 group-hover:scale-110 ${active ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400'}`}>
                    {icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${active ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}>{count}</span>
        </button>
    )
}
