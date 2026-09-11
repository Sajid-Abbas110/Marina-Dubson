'use client'

import { useEffect, useMemo, useState } from 'react'
import { Mail, Phone, Loader2, Inbox, CheckCircle2, Archive } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_LABELS: Record<string, string> = {
    NEW: 'New',
    READ: 'Read',
    RESPONDED: 'Responded',
    ARCHIVED: 'Archived',
}

interface Inquiry {
    id: string
    firstName: string
    lastName: string | null
    email: string
    phone: string | null
    message: string
    source: string | null
    status: string
    createdAt: string
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')
    const [error, setError] = useState<string | null>(null)

    const fetchInquiries = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/contact-inquiries', {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error('Unable to load inquiries.')
            const data = await res.json()
            setInquiries(Array.isArray(data.inquiries) ? data.inquiries : [])
        } catch (err) {
            console.error('Fetch inquiries failed:', err)
            setError('Failed to load website inquiries.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInquiries()
    }, [])

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/contact-inquiries/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error('Update failed')
            setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
        } catch (err) {
            console.error('Update inquiry status failed:', err)
        }
    }

    const visibleInquiries = useMemo(() => {
        return statusFilter ? inquiries.filter((i) => i.status === statusFilter) : inquiries
    }, [inquiries, statusFilter])

    const newCount = inquiries.filter((i) => i.status === 'NEW').length

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <header className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-black">Website</p>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                    <Inbox className="h-6 w-6 text-primary" /> Website Inquiries
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                    Submissions from the public site&apos;s Contact, Request Coverage, and Request a Court Reporter forms land here.
                </p>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border p-4 bg-card">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Total</p>
                        <p className="text-2xl font-black">{inquiries.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border p-4 bg-card">
                    <Inbox className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">New</p>
                        <p className="text-2xl font-black">{newCount}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-2xl border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] outline-none w-full"
                    >
                        <option value="">All statuses</option>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="glass-panel rounded-[2.5rem] p-6 border border-border space-y-4">
                {error && (
                    <div className="px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-rose-50 border border-rose-100 text-rose-700">
                        {error}
                    </div>
                )}
                {loading ? (
                    <div className="py-12 flex items-center justify-center gap-3 text-sm text-muted-foreground uppercase tracking-[0.3em] font-black">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        Loading inquiries...
                    </div>
                ) : visibleInquiries.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground uppercase tracking-[0.3em] font-black border border-dashed border-border rounded-[2rem]">
                        No inquiries yet.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {visibleInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="flex flex-col gap-4 bg-card border border-border rounded-2xl p-5">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase tracking-tight">
                                            {inquiry.firstName} {inquiry.lastName || ''}
                                        </p>
                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                                            <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:underline">
                                                <Mail className="h-3.5 w-3.5" /> {inquiry.email}
                                            </a>
                                            {inquiry.phone && (
                                                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:underline">
                                                    <Phone className="h-3.5 w-3.5" /> {inquiry.phone}
                                                </a>
                                            )}
                                            <span>{format(new Date(inquiry.createdAt), 'MMM dd, yyyy h:mm a')}</span>
                                            {inquiry.source && <span>via {inquiry.source}</span>}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full ${inquiry.status === 'NEW' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-muted/40 text-muted-foreground'}`}>
                                        {STATUS_LABELS[inquiry.status] || inquiry.status}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                                <div className="flex flex-wrap gap-2">
                                    {inquiry.status !== 'READ' && (
                                        <button onClick={() => updateStatus(inquiry.id, 'READ')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-2 rounded-xl border border-border hover:bg-muted/40">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Read
                                        </button>
                                    )}
                                    {inquiry.status !== 'RESPONDED' && (
                                        <button onClick={() => updateStatus(inquiry.id, 'RESPONDED')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-2 rounded-xl border border-border hover:bg-muted/40">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Responded
                                        </button>
                                    )}
                                    {inquiry.status !== 'ARCHIVED' && (
                                        <button onClick={() => updateStatus(inquiry.id, 'ARCHIVED')} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-2 rounded-xl border border-border hover:bg-muted/40">
                                            <Archive className="h-3.5 w-3.5" /> Archive
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
