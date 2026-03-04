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
    BadgeCheck,
    Loader2,
    CheckCircle2,
    XCircle
} from 'lucide-react'

export default function DeepReporterJobsPortal() {
    const [filter, setFilter] = useState('ALL')
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [claimingId, setClaimingId] = useState<string | null>(null)
    const [dismissedIds, setDismissedIds] = useState<string[]>([])
    const [claimedIds, setClaimedIds] = useState<string[]>([])

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

    const handleClaimJob = async (jobId: string) => {
        setClaimingId(jobId)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/market/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: jobId,
                    amount: 0,
                    notes: 'Claim submitted via Reporter Portal'
                })
            })

            if (res.ok) {
                setClaimedIds(prev => [...prev, jobId])
                fetchJobs()
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to claim job. Please try again.')
            }
        } catch (error) {
            console.error('Claim submission failed:', error)
        } finally {
            setClaimingId(null)
        }
    }

    const handleNotInterested = (jobId: string) => {
        setDismissedIds(prev => [...prev, jobId])
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-poppins selection:bg-blue-100 selection:text-blue-900">
            <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 sm:px-12 py-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        MD
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            Job Market
                        </h1>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-1">Available Assignments Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/reporter/portal" className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        Dashboard <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 relative z-10">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                        <Briefcase className="h-3 w-3" /> Opportunities Found: {jobs.filter(j => !dismissedIds.includes(j.id)).length}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                        View Available <span className="text-blue-600">Assignments</span>
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mb-8">Click <strong>Claim Job</strong> to express your interest. Admin will review and assign.</p>

                    <div className="max-w-xl relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            className="w-full h-14 bg-white border-2 border-slate-200 rounded-xl px-12 text-base font-medium outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all placeholder:text-slate-400 shadow-sm"
                            placeholder="Search by proceeding type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Filters */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Categories</h3>
                            <div className="flex flex-col gap-2">
                                <SidebarFilter active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="All Jobs" icon={<Globe className="h-4 w-4" />} count={jobs.filter(j => !dismissedIds.includes(j.id)).length} />
                                <SidebarFilter active={filter === 'REMOTE'} onClick={() => setFilter('REMOTE')} label="Remote" icon={<Zap className="h-4 w-4" />} count={jobs.filter(j => j.appearanceType === 'REMOTE' && !dismissedIds.includes(j.id)).length} />
                                <SidebarFilter active={filter === 'LOCAL'} onClick={() => setFilter('LOCAL')} label="In-Person" icon={<MapPin className="h-4 w-4" />} count={jobs.filter(j => j.appearanceType === 'IN_PERSON' && !dismissedIds.includes(j.id)).length} />
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                            <ShieldCheck className="h-8 w-8 text-blue-400 mb-4" />
                            <h4 className="text-xl font-bold mb-2">Verification</h4>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6">Complete your professional credentials to unlock premium jobs.</p>
                            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Verify Now</button>
                        </div>
                    </aside>

                    {/* Job Stream */}
                    <div className="lg:col-span-3 space-y-4">
                        {loading ? (
                            <div className="p-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                                <p className="font-bold text-sm text-slate-500 uppercase tracking-widest">Searching for assignments...</p>
                            </div>
                        ) : jobs.filter(j =>
                            !dismissedIds.includes(j.id) &&
                            (filter === 'ALL' || (filter === 'REMOTE' && j.appearanceType === 'REMOTE') || (filter === 'LOCAL' && j.appearanceType === 'IN_PERSON')) &&
                            (j.proceedingType.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).length === 0 ? (
                            <div className="p-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <p className="font-bold text-sm text-slate-400 uppercase tracking-widest">No active assignments found.</p>
                            </div>
                        ) : jobs.filter(j =>
                            !dismissedIds.includes(j.id) &&
                            (filter === 'ALL' || (filter === 'REMOTE' && j.appearanceType === 'REMOTE') || (filter === 'LOCAL' && j.appearanceType === 'IN_PERSON')) &&
                            (j.proceedingType.toLowerCase().includes(searchQuery.toLowerCase()))
                        ).map((job) => {
                            const claimed = claimedIds.includes(job.id)
                            const isClaiming = claimingId === job.id
                            return (
                                <div key={job.id} className={`bg-white border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all flex flex-col sm:row items-start gap-6 shadow-sm group ${claimed ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-200'}`}>
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(job.bookingDate).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-xl font-black text-slate-800">{new Date(job.bookingDate).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-wider border border-blue-100">{job.appearanceType}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">{job.bookingNumber}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{job.proceedingType}</h3>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> {job.service?.serviceName}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1.5"><Globe className="h-3 w-3" /> {job.jurisdiction || 'Direct Venue'}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 flex-shrink-0 hidden md:flex">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Status</span>
                                            <span className="text-lg font-extrabold text-slate-800 uppercase italic">Open</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto">
                                        {claimed ? (
                                            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest border border-emerald-200">
                                                <CheckCircle2 className="h-4 w-4" /> Claimed
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleNotInterested(job.id)}
                                                    disabled={isClaiming}
                                                    className="h-12 px-5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 hover:text-slate-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" /> Not Interested
                                                </button>
                                                <button
                                                    onClick={() => handleClaimJob(job.id)}
                                                    disabled={isClaiming}
                                                    className="h-12 px-6 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {isClaiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                    Claim Job
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}

function SidebarFilter({ label, active, onClick, icon, count }: any) {
    return (
        <button onClick={onClick} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <div className="flex items-center gap-3">
                <div className={`transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
        </button>
    )
}
