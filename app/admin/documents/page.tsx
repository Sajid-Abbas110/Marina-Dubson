'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    Upload,
    Search,
    FileText,
    Download,
    Loader2,
    Calendar,
    FolderOpen
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const CATEGORY_LABELS: Record<string, string> = {
    RATE_SHEET: 'Rate Sheet',
    CONTRACT: 'Contract',
    INVOICE: 'Invoice',
    CLIENT_UPLOAD: 'Client Upload',
    TRANSCRIPT: 'Transcript',
    DOCUMENT: 'General Document'
}

const ALLOWED_FILE_TYPES = '.pdf,.doc,.docx,.txt'

export default function AdminDocumentVaultPage() {
    const [documents, setDocuments] = useState<any[]>([])
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [bookingFilter, setBookingFilter] = useState('')
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadCategory, setUploadCategory] = useState('DOCUMENT')
    const [uploadBookingId, setUploadBookingId] = useState('')
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        fetchDocuments()
        fetchBookings()
    }, [])

    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/documents', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Unable to load documents.')
            const data = await res.json()
            setDocuments(Array.isArray(data.documents) ? data.documents : [])
        } catch (err) {
            console.error('Fetch documents failed:', err)
            setStatusMessage({ type: 'error', text: 'Failed to load document vault.' })
        } finally {
            setLoading(false)
        }
    }

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) return
            const data = await res.json()
            setBookings(Array.isArray(data.bookings) ? data.bookings : [])
        } catch (err) {
            console.error('Fetch bookings failed:', err)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setStatusMessage({ type: 'error', text: 'Select a file to upload.' })
            return
        }
        setUploading(true)
        setStatusMessage(null)
        try {
            const token = localStorage.getItem('token')
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('category', uploadCategory)
            if (uploadBookingId) formData.append('bookingId', uploadBookingId)

            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error || 'Upload failed.')
            }

            await fetchDocuments()
            setSelectedFile(null)
            setUploadBookingId('')
            setStatusMessage({ type: 'success', text: 'Document uploaded successfully.' })
        } catch (err: any) {
            console.error('Upload error:', err)
            setStatusMessage({ type: 'error', text: err.message || 'Document upload failed.' })
        } finally {
            setUploading(false)
        }
    }

    const visibleDocuments = useMemo(() => {
        return documents.filter((doc) => {
            const matchesCategory = categoryFilter ? doc.category === categoryFilter : true
            const matchesBooking = bookingFilter ? doc.booking?.id === bookingFilter : true
            const matchesSearch = searchQuery
                ? doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
                : true
            return matchesCategory && matchesBooking && matchesSearch
        })
    }, [documents, categoryFilter, bookingFilter, searchQuery])

    const groupedCounts = useMemo(() => {
        return documents.reduce<Record<string, number>>((acc, doc) => {
            acc[doc.category] = (acc[doc.category] || 0) + 1
            return acc
        }, {})
    }, [documents])

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <header className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-black">Vault Operations</p>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                    <FolderOpen className="h-6 w-6 text-primary" /> Document Management
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                    Upload, categorize, and distribute PDF, DOC, DOCX, or TXT assets for court reporters, clients, and internal stakeholders.
                </p>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border p-4 bg-card">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Total Files</p>
                        <p className="text-2xl font-black">{documents.length}</p>
                    </div>
                </div>
                {['RATE_SHEET', 'CONTRACT', 'TRANSCRIPT'].map((cat) => (
                    <div key={cat} className="flex items-center gap-3 rounded-2xl border border-border p-4 bg-card">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">{CATEGORY_LABELS[cat]}</p>
                            <p className="text-2xl font-black">{groupedCounts[cat] || 0}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="glass-panel rounded-[2.5rem] p-6 border border-border space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Upload New Document</h2>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">PDF, DOC/DOCX, or TXT files only</p>
                    </div>
                    <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        <span>Attach to booking (optional)</span>
                        <select
                            value={uploadBookingId}
                            onChange={(e) => setUploadBookingId(e.target.value)}
                            className="rounded-xl border border-border bg-background px-3 py-2 text-[9px] font-black uppercase outline-none"
                        >
                            <option value="">General</option>
                            {bookings.map((booking) => (
                                <option key={booking.id} value={booking.id}>
                                    #{booking.bookingNumber} • {booking.proceedingType}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="luxury-input"
                    >
                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer bg-muted/40">
                        <Upload className="h-4 w-4" />
                        <span>{selectedFile ? selectedFile.name : 'Select file'}</span>
                        <input
                            type="file"
                            accept={ALLOWED_FILE_TYPES}
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0]
                                if (file) setSelectedFile(file)
                            }}
                        />
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={uploading || !selectedFile}
                            onClick={handleUpload}
                            className="luxury-button flex-1 py-3 rounded-2xl uppercase tracking-[0.3em] text-[10px]"
                        >
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-3 rounded-2xl border border-border text-[10px] font-black uppercase tracking-[0.3em]"
                            onClick={() => setSelectedFile(null)}
                        >
                            Reset
                        </button>
                    </div>
                </div>
                {statusMessage && (
                    <div className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] ${statusMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-rose-50 border border-rose-100 text-rose-700'}`}>
                        {statusMessage.text}
                    </div>
                )}
                <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground">Allowed types: PDF, DOC, DOCX, TXT</p>
            </section>

            <section className="glass-panel rounded-[2.5rem] p-6 border border-border space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Document Vault</h2>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Search, filter, and download portal assets</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by filename"
                                className="bg-transparent focus:outline-none text-xs"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="rounded-2xl border border-border bg-background px-3 py-2 text-[9px] font-black uppercase tracking-tight outline-none"
                        >
                            <option value="">All categories</option>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <select
                            value={bookingFilter}
                            onChange={(e) => setBookingFilter(e.target.value)}
                            className="rounded-2xl border border-border bg-background px-3 py-2 text-[9px] font-black uppercase tracking-tight outline-none"
                        >
                            <option value="">All bookings</option>
                            {bookings.map((booking) => (
                                <option key={booking.id} value={booking.id}>
                                    #{booking.bookingNumber} • {booking.proceedingType}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex items-center justify-center gap-3 text-sm text-muted-foreground uppercase tracking-[0.3em] font-black">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        Loading documents...
                    </div>
                ) : visibleDocuments.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground uppercase tracking-[0.3em] font-black border border-dashed border-border rounded-[2rem]">
                        No documents match your filters.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {visibleDocuments.map((doc) => (
                            <div key={doc.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card border border-border rounded-2xl p-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-muted/40 flex items-center justify-center text-primary">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase tracking-tight">{doc.fileName}</p>
                                        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                                            {CATEGORY_LABELS[doc.category] || doc.category} • {doc.fileType || 'Unknown format'}
                                        </p>
                                        {doc.booking && (
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                                                #{doc.booking.bookingNumber} • {doc.booking.proceedingType}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                        {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                    <Link href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:underline">
                                        Download
                                        <Download className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
