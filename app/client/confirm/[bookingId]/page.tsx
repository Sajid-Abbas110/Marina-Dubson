'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Clock,
    Calendar,
    DollarSign,
    MapPin,
    ArrowRight,
    Loader2
} from 'lucide-react'

export default function BookingConfirmationPage() {
    const params = useParams()
    const router = useRouter()
    const bookingId = params.bookingId as string

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [data, setData] = useState<any>(null)

    // Checkbox states
    const [confirmedScheduling, setConfirmedScheduling] = useState(false)
    const [confirmedCancellation, setConfirmedCancellation] = useState(false)
    const [confirmedFinancial, setConfirmedFinancial] = useState(false)

    useEffect(() => {
        const fetchConfirmationDetails = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }

                const res = await fetch(`/api/confirmations?bookingId=${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || 'Failed to fetch details')
                }

                const result = await res.json()
                setData(result)

                // If already confirmed, show success
                if (result.confirmation) {
                    setSuccess(true)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchConfirmationDetails()
    }, [bookingId, router])

    const handleSubmit = async () => {
        if (!confirmedScheduling || !confirmedCancellation || !confirmedFinancial) {
            setError('Please check all boxes to proceed.')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/confirmations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookingId,
                    confirmedScheduling,
                    confirmedCancellation,
                    confirmedFinancial
                })
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to submit confirmation')
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading Legal Terms...</p>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-card rounded-[3rem] p-12 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500 border border-border">
                    <div className="h-24 w-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">Booking Confirmed</h2>
                        <p className="text-muted-foreground font-medium">Your legal confirmation has been recorded successfully.</p>
                    </div>
                    <div className="p-6 bg-muted/50 rounded-2xl text-left space-y-4">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                            <span>Booking Number</span>
                            <span className="text-foreground">{data?.booking?.bookingNumber}</span>
                        </div>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                            <span>Confirmation ID</span>
                            <span className="text-foreground">{data?.confirmation?.id || 'Recorded'}</span>
                        </div>
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                            <span>Status</span>
                            <span className="text-emerald-600">CONFIRMED</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/client/portal')}
                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl"
                    >
                        Back to Portal
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#00120d] p-6 lg:p-12 font-poppins">
            <div className="max-w-4xl mx-auto space-y-12 pb-24">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
                        MD
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                            Legal <span className="text-primary">Confirmation</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-2">Action Required • Finalize Booking</p>
                    </div>
                </div>

                {error && (
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-in slide-in-from-top-4">
                        <AlertCircle className="h-6 w-6 flex-shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Terms */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 1. Scheduling Details */}
                        <TermSection
                            icon={<Calendar className="h-6 w-6" />}
                            title="1. Scheduling Details"
                            content={data.terms.schedulingTerms}
                            checked={confirmedScheduling}
                            onChange={setConfirmedScheduling}
                            label="I confirm the scheduling details are accurate"
                        />

                        {/* 2. Cancellation Policy */}
                        <TermSection
                            icon={<Clock className="h-6 w-6" />}
                            title="2. Cancellation Policy"
                            content={data.terms.cancellationTerms}
                            checked={confirmedCancellation}
                            onChange={setConfirmedCancellation}
                            label="I acknowledge the cancellation policy"
                            highlight
                        />

                        {/* 3. Financial Responsibility */}
                        <TermSection
                            icon={<ShieldCheck className="h-6 w-6" />}
                            title="3. Financial Responsibility"
                            content={data.terms.financialTerms}
                            checked={confirmedFinancial}
                            onChange={setConfirmedFinancial}
                            label="I confirm financial responsibility under penalty of perjury"
                        />
                    </div>

                    {/* Right Column: Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-12 space-y-8">
                            <div className="glass-panel rounded-[3rem] p-10 space-y-8 border-primary/20 bg-primary/5">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Final Summary</h3>

                                <div className="space-y-6">
                                    <SummaryItem icon={<DollarSign />} label="Estimated Total" value={`$${data.booking.service.defaultMinimumFee.toFixed(2)}`} />
                                    <SummaryItem icon={<MapPin />} label="Venue" value={data.booking.location || 'Remote Node'} />
                                    <SummaryItem icon={<Clock />} label="Start Time" value={data.booking.bookingTime} />
                                </div>

                                <div className="pt-8 border-t border-primary/10 space-y-6">
                                    <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-primary/10">
                                        <AlertCircle className="h-5 w-5 text-primary mt-1" />
                                        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase leading-snug">
                                            Minimum booking fee of $400.00 will be applied to final invoice.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !confirmedScheduling || !confirmedCancellation || !confirmedFinancial}
                                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-2xl
                                            ${submitting || !confirmedScheduling || !confirmedCancellation || !confirmedFinancial
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-primary/30'
                                            }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Finalize Booking
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                Timestamped Legal Record will be generated upon submission
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TermSection({ icon, title, content, checked, onChange, label, highlight }: any) {
    return (
        <div className={`glass-panel rounded-[2.5rem] p-10 space-y-8 border-2 transition-all ${checked ? 'border-primary shadow-2xl shadow-primary/5 bg-primary/[0.01]' : 'border-transparent hover:border-gray-200'}`}>
            <div className="flex items-center gap-6">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${checked ? 'bg-primary text-white shadow-lg shadow-primary/20 rotate-12' : 'bg-muted text-muted-foreground'}`}>
                    {icon}
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h2>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-medium font-mono border border-gray-100 dark:border-white/5">
                {content}
            </div>

            <label className="flex items-center gap-4 cursor-pointer group">
                <div
                    className={`h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all ${checked ? 'bg-primary border-primary rotate-12 shadow-lg shadow-primary/30' : 'border-gray-200 group-hover:border-primary'}`}
                >
                    {checked && <CheckCircle2 className="h-4 w-4 text-white" />}
                </div>
                <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${checked ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {label}
                </span>
            </label>
        </div>
    )
}

function SummaryItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center text-primary shadow-sm border border-primary/5 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight truncate max-w-[150px]">{value}</p>
            </div>
        </div>
    )
}
