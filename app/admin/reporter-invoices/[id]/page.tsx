'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
    ArrowLeft, CheckCircle, Clock, AlertCircle, Zap, Edit3,
    Save, X, DollarSign, FileText, User, CalendarDays, Activity
} from 'lucide-react'

export default function ReporterInvoiceDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editData, setEditData] = useState({
        pageRate: 0,
        appearanceFee: 0,
        minimumFee: 0,
        notes: '',
    })

    const fetchInvoice = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/reporter-invoices/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const data = await res.json()
                setInvoice(data)
                setEditData({
                    pageRate: data.pageRate,
                    appearanceFee: data.appearanceFee,
                    minimumFee: data.minimumFee,
                    notes: data.notes || '',
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchInvoice() }, [id])

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/reporter-invoices/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editData),
            })
            if (res.ok) {
                const updated = await res.json()
                setInvoice(updated)
                setEditing(false)
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to save')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleMarkPaid = async () => {
        if (!confirm('Mark this payout offer as PAID?')) return
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/admin/reporter-invoices/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: 'PAID', paidAt: new Date().toISOString() }),
        })
        if (res.ok) fetchInvoice()
    }

    const handleDelete = async () => {
        if (!confirm('Delete this payout offer permanently?')) return
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/admin/reporter-invoices/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) router.push('/admin/invoices')
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
        ACCEPTED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
        DECLINED: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
        PAID: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="h-10 w-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    )

    if (!invoice) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-3">
                <p className="text-lg font-bold text-foreground">Offer not found</p>
                <button onClick={() => router.back()} className="px-4 py-2 rounded-xl bg-muted text-sm font-black uppercase">Go Back</button>
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700 pb-24">
            {/* Top Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all"
                >
                    <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Revenue Intelligence
                </button>
                <div className="flex items-center gap-3">
                    {!editing && invoice.status !== 'PAID' && invoice.status !== 'DECLINED' && (
                        <>
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-[9px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all"
                            >
                                <Edit3 className="h-3.5 w-3.5" /> Adjust Rates
                            </button>
                            {invoice.status === 'ACCEPTED' && (
                                <button
                                    onClick={handleMarkPaid}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                                </button>
                            )}
                        </>
                    )}
                    {editing && (
                        <>
                            <button
                                onClick={() => { setEditing(false); setEditData({ pageRate: invoice.pageRate, appearanceFee: invoice.appearanceFee, minimumFee: invoice.minimumFee, notes: invoice.notes || '' }) }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-muted-foreground text-[9px] font-black uppercase tracking-widest hover:text-foreground transition-all"
                            >
                                <X className="h-3.5 w-3.5" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                <Save className="h-3.5 w-3.5" />
                                {saving ? 'Saving...' : 'Save Offer'}
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                    >
                        <X className="h-3.5 w-3.5" /> Delete
                    </button>
                </div>
            </div>

            {/* Header Card */}
            <div className="glass-panel bg-card rounded-[2.5rem] p-10 border border-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.04]">
                    <Activity className="h-48 w-48 text-primary" />
                </div>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 relative z-10">
                    <div className="flex items-start gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest">{invoice.invoiceNumber}</span>
                            <h1 className="text-3xl font-black text-foreground uppercase tracking-tight mt-2">
                                {invoice.booking?.proceedingType || 'Payout Offer'}
                            </h1>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                                #{invoice.booking?.bookingNumber}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${statusColors[invoice.status] || statusColors.PENDING}`}>
                            {invoice.status}
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Offering</p>
                            <p className="text-4xl font-black text-foreground tracking-tighter">${invoice.total?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reporter Info */}
                <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reporter</h3>
                    </div>
                    <p className="text-lg font-black text-foreground uppercase tracking-tight">
                        {invoice.reporter?.firstName} {invoice.reporter?.lastName}
                    </p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 truncate">{invoice.reporter?.email}</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-3">{invoice.reporter?.role}</p>
                </div>

                {/* Booking Info */}
                <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                            <CalendarDays className="h-5 w-5 text-violet-500" />
                        </div>
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Booking</h3>
                    </div>
                    <p className="text-lg font-black text-foreground uppercase tracking-tight">#{invoice.booking?.bookingNumber}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{invoice.booking?.service?.serviceName}</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-3">
                        {invoice.booking?.bookingDate ? format(new Date(invoice.booking.bookingDate), 'MMM d, yyyy') : '—'} • {invoice.booking?.bookingTime}
                    </p>
                </div>

                {/* Dates */}
                <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Timeline</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Offer Created</p>
                            <p className="text-sm font-black text-foreground uppercase">{format(new Date(invoice.createdAt), 'MMM d, yyyy')}</p>
                        </div>
                        {invoice.paidAt && (
                            <div>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Paid At</p>
                                <p className="text-sm font-black text-emerald-500 uppercase">{format(new Date(invoice.paidAt), 'MMM d, yyyy')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rate Breakdown + Editing */}
            <div className="bg-card rounded-[2.5rem] p-10 border border-border shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Payout Rate Structure</h3>
                    {editing && <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 animate-pulse">Editing Mode</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Page Rate */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Page Rate ($/pg)</label>
                        {editing ? (
                            <input
                                type="number"
                                step="0.25"
                                className="w-full px-5 py-4 rounded-xl bg-muted/50 border border-border outline-none focus:ring-4 focus:ring-primary/10 text-foreground font-black text-sm"
                                value={editData.pageRate}
                                onChange={(e) => setEditData({ ...editData, pageRate: parseFloat(e.target.value) || 0 })}
                            />
                        ) : (
                            <div className="px-5 py-4 rounded-xl bg-muted/30 border border-border">
                                <p className="text-2xl font-black text-foreground tracking-tighter">${invoice.pageRate?.toFixed(2)}</p>
                            </div>
                        )}
                    </div>

                    {/* Appearance Fee */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Appearance Fee ($)</label>
                        {editing ? (
                            <input
                                type="number"
                                step="25"
                                className="w-full px-5 py-4 rounded-xl bg-muted/50 border border-border outline-none focus:ring-4 focus:ring-primary/10 text-foreground font-black text-sm"
                                value={editData.appearanceFee}
                                onChange={(e) => setEditData({ ...editData, appearanceFee: parseFloat(e.target.value) || 0 })}
                            />
                        ) : (
                            <div className="px-5 py-4 rounded-xl bg-muted/30 border border-border">
                                <p className="text-2xl font-black text-foreground tracking-tighter">${invoice.appearanceFee?.toFixed(2)}</p>
                            </div>
                        )}
                    </div>

                    {/* Minimum Fee */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Minimum Fee ($)</label>
                        {editing ? (
                            <input
                                type="number"
                                step="25"
                                className="w-full px-5 py-4 rounded-xl bg-muted/50 border border-border outline-none focus:ring-4 focus:ring-primary/10 text-foreground font-black text-sm"
                                value={editData.minimumFee}
                                onChange={(e) => setEditData({ ...editData, minimumFee: parseFloat(e.target.value) || 0 })}
                            />
                        ) : (
                            <div className="px-5 py-4 rounded-xl bg-muted/30 border border-border">
                                <p className="text-2xl font-black text-foreground tracking-tighter">${invoice.minimumFee?.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-6 space-y-3">
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Admin Notes</label>
                    {editing ? (
                        <textarea
                            className="w-full px-5 py-4 rounded-xl bg-muted/50 border border-border outline-none focus:ring-4 focus:ring-primary/10 text-foreground font-black text-[10px] uppercase tracking-widest min-h-[100px]"
                            placeholder="Add notes for this reporter offer..."
                            value={editData.notes}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        />
                    ) : (
                        <div className="px-5 py-4 rounded-xl bg-muted/30 border border-border min-h-[80px]">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
                                {invoice.notes || 'No notes added.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="mt-8 pt-8 border-t border-border flex justify-between items-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Effective Total Offering</p>
                    <p className="text-3xl font-black text-foreground tracking-tighter">
                        ${editing ? editData.appearanceFee?.toFixed(2) : invoice.total?.toFixed(2)}
                    </p>
                </div>

                {editing && (
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-3">
                        ⚠ Total is set to Appearance Fee. Adjust if needed after saving.
                    </p>
                )}
            </div>
        </div>
    )
}
