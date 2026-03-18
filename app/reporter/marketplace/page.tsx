'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Globe,
    Loader2,
    Bell,
    Calendar,
    Clock,
    MapPin,
    Hash,
    FileText,
    XCircle,
    CheckCircle2,
    AlertCircle,
    MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'

const STATUS_BADGE_CLASSES: Record<string, string> = {
    PENDING: 'bg-blue-50 text-blue-700 border border-blue-100',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    DECLINED: 'bg-rose-50 text-rose-700 border border-rose-100',
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-black">{label}</p>
                <p className="text-3xl font-black text-foreground">{value}</p>
            </div>
        </div>
    )
}

function JobCard({
    job,
    onClaim,
    onNotInterested,
    isClaiming,
    isDeclining
}: {
    job: any
    onClaim: () => void
    onNotInterested?: () => void
    isClaiming?: boolean
    isDeclining?: boolean
}) {
    const clientName = job.contact?.companyName || `${job.contact?.firstName ?? ''} ${job.contact?.lastName ?? ''}`.trim() || 'Client Pending'
    const bookingDate = job.bookingDate ? format(new Date(job.bookingDate), 'MMM dd, yyyy') : 'Date TBD'
    const bookingTime = job.bookingTime || 'Time TBD'
    const instruction = job.notes || job.bookingNotes || job.instructions

    return (
        <div className="bg-white border border-border rounded-[2.25rem] shadow-sm p-6 space-y-4 transition hover:shadow-xl">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-black">#{job.bookingNumber || job.id}</p>
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{job.proceedingType || 'Proceeding TBD'}</h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{clientName}</p>
                </div>
                <div className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border border-primary/30 text-primary">
                    {job.appearanceType || 'REMOTE'}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{bookingDate}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{bookingTime}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" />
                    <span>{job.service?.serviceName || job.service?.category || 'Service'}</span>
                </div>
            </div>

            {instruction && (
                <div className="p-3 rounded-2xl bg-muted/10 border border-border text-sm text-foreground/80">
                    <FileText className="inline-block h-4 w-4 mr-2 text-muted-foreground" />
                    {instruction}
                </div>
            )}

            <div className="flex flex-col gap-3">
                <button
                    onClick={onClaim}
                    disabled={isClaiming}
                    className="w-full py-3 rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isClaiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                    {isClaiming ? 'Claiming job' : 'Claim Job'}
                </button>
                {onNotInterested && (
                    <button
                        onClick={onNotInterested}
                        disabled={isDeclining || isClaiming}
                        className="w-full py-3 rounded-[1.5rem] border border-red-200 bg-rose-50 text-rose-600 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isDeclining ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        {isDeclining ? 'Removing...' : 'Not Interested'}
                    </button>
                )}
            </div>
        </div>
    )
}

function ClaimRow({ claim }: { claim: any }) {
    const badgeClasses = STATUS_BADGE_CLASSES[claim.status] || 'bg-muted text-muted-foreground border border-border'
    return (
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black">#{claim.booking?.bookingNumber || claim.bookingId}</p>
                    <h4 className="text-lg font-black text-foreground uppercase">{claim.booking?.proceedingType || 'Open Claim'}</h4>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                        {claim.booking?.bookingDate ? format(new Date(claim.booking.bookingDate), 'MMM dd, yyyy') : 'Date pending'}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border shadow-sm ${badgeClasses}`}>
                    {claim.status || 'PENDING'}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <Link href={`/reporter/portal?tab=messages&claimId=${claim.id}`} className="text-primary hover:underline">
                    Open claim chat
                </Link>
                <span className="px-2 py-1 rounded-xl border border-border text-[8px] uppercase tracking-[0.3em]">{claim.booking?.proceedingType || 'Proceeding'}</span>
            </div>
            <p className="text-sm text-foreground/80">{claim.notes || 'Awaiting admin review.'}</p>
        </div>
    )
}

export default function ReporterMarketplacePage() {
    const router = useRouter()
    const [jobs, setJobs] = useState<any[]>([])
    const [claims, setClaims] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [claimingId, setClaimingId] = useState<string | null>(null)
    const [decliningId, setDecliningId] = useState<string | null>(null)
    const [status, setStatus] = useState({ type: 'info', message: '' })
    const [error, setError] = useState('')
    const [marketplaceShowClaimCounts, setMarketplaceShowClaimCounts] = useState(true)

    const pendingClaims = useMemo(() => claims.filter(c => c.status === 'PENDING').length, [claims])
    const acceptedClaims = useMemo(() => claims.filter(c => c.status === 'ACCEPTED').length, [claims])

    useEffect(() => {
        fetchMarketplace()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                const res = await fetch('/api/system-policy', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!res.ok) return
                const data = await res.json()
                const policies = data.policies || {}
                setMarketplaceShowClaimCounts((policies.marketplace_show_claim_counts ?? 'true') === 'true')
            } catch (err) {
                console.error('Failed to load marketplace visibility policy:', err)
            }
        }
        fetchPolicy()
    }, [])

    const fetchMarketplace = async () => {
        setLoading(true)
        setError('')
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }
            const [marketRes, bidsRes] = await Promise.all([
                fetch('/api/market', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('/api/market/bids', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ])

            if (marketRes.ok) {
                const data = await marketRes.json()
                setJobs(Array.isArray(data.jobs) ? data.jobs : Array.isArray(data.bookings) ? data.bookings : [])
            }

            if (bidsRes.ok) {
                const data = await bidsRes.json()
                setClaims(Array.isArray(data.claims) ? data.claims : [])
            }
        } catch (err) {
            console.error('Marketplace fetch failed:', err)
            setError('Unable to load marketplace data. Please refresh.')
        } finally {
            setLoading(false)
        }
    }

    const handleClaimJob = async (job: any) => {
        if (!confirm('Signal interest for this assignment? Administration will be notified.')) return
        setStatus({ type: 'info', message: '' })
        setClaimingId(job.id)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }
            const res = await fetch('/api/market/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: job.id,
                    notes: 'Claimed via marketplace hub'
                })
            })
            if (res.ok) {
                setStatus({ type: 'success', message: `Interest signal sent for #${job.bookingNumber || job.id}` })
                fetchMarketplace()
            } else {
                const data = await res.json()
                setStatus({ type: 'error', message: data?.error || 'Claim request failed.' })
            }
        } catch (err) {
            console.error('Claim failed:', err)
            setStatus({ type: 'error', message: 'Claim request failed. Please try again.' })
        } finally {
            setClaimingId(null)
        }
    }

    const handleNotInterested = async (job: any) => {
        if (!confirm('Remove this job from your personal marketplace feed?')) return
        setStatus({ type: 'info', message: '' })
        setDecliningId(job.id)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }
            const res = await fetch('/api/market/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: job.id,
                    notes: 'Reporter marked job as not interested',
                    notInterested: true
                })
            })
            if (res.ok) {
                setStatus({ type: 'info', message: `We removed #${job.bookingNumber || job.id} from your queue.` })
                fetchMarketplace()
            } else {
                const data = await res.json()
                setStatus({ type: 'error', message: data?.error || 'Unable to hide this job.' })
            }
        } catch (err) {
            console.error('Mark not interested failed:', err)
            setStatus({ type: 'error', message: 'Action failed. Please try again.' })
        } finally {
            setDecliningId(null)
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <header className="space-y-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-black">Marketplace Space</p>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tight flex items-center justify-center gap-2">
                    <Globe className="h-6 w-6 text-primary" /> Reporter Job Claim Hub
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Review open proceedings, signal interest via quick claims, and access claim conversations directly from one command center.</p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard label="Open Jobs" value={jobs.length} icon={<Globe className="h-5 w-5" />} />
                {marketplaceShowClaimCounts ? (
                    <>
                        <StatCard label="Pending Claims" value={pendingClaims} icon={<Bell className="h-5 w-5" />} />
                        <StatCard label="Accepted Claims" value={acceptedClaims} icon={<CheckCircle2 className="h-5 w-5" />} />
                    </>
                ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-5 text-xs uppercase tracking-[0.3em] text-muted-foreground md:col-span-2">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        Claim totals are hidden by current system policy.
                    </div>
                )}
            </div>

            {status.message && (
                <div
                    className={`px-4 py-3 rounded-2xl border ${
                        status.type === 'success'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                            : status.type === 'error'
                                ? 'bg-rose-50 border-rose-100 text-rose-700'
                                : 'bg-muted/10 border-border text-muted-foreground'
                    } text-sm font-black uppercase tracking-[0.2em]`}
                >
                    {status.message}
                </div>
            )}

            {error && (
                <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-black uppercase tracking-[0.2em]">
                    {error}
                </div>
            )}

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Marketplace Listings</h2>
                        <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-black">Ready for Claiming</p>
                    </div>
                    <Link href="/reporter/portal?tab=jobs" className="text-xs uppercase tracking-[0.3em] text-primary font-black hover:underline">
                        View schedule
                    </Link>
                </div>

                {loading ? (
                    <div className="py-12 flex items-center justify-center text-sm text-muted-foreground uppercase tracking-[0.4em] font-black">
                        <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" /> Syncing jobs...
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="py-12 text-center border border-border rounded-2xl bg-muted/20 text-sm font-black uppercase tracking-[0.4em] text-muted-foreground">
                        No marketplace jobs available — check back soon.
                    </div>
                ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {jobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        onClaim={() => handleClaimJob(job)}
                                        isClaiming={claimingId === job.id}
                                        onNotInterested={() => handleNotInterested(job)}
                                        isDeclining={decliningId === job.id}
                                    />
                                ))}
                            </div>
                        )}
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Your Claims</h2>
                        <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-black">Per-claim communication channels</p>
                    </div>
                    <Link href="/reporter/portal?tab=messages" className="text-xs uppercase tracking-[0.3em] text-primary font-black hover:underline">
                        Open Comm Matrix
                    </Link>
                </div>
                {!marketplaceShowClaimCounts && (
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        Claim metrics are restricted for reporters.
                    </div>
                )}

                {claims.length === 0 ? (
                    <div className="py-12 text-center border border-border rounded-2xl bg-muted/20 text-sm font-black uppercase tracking-[0.4em] text-muted-foreground">
                        You have not claimed any jobs.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim: any) => (
                            <ClaimRow key={claim.id} claim={claim} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
