'use client'

import { useState, useEffect } from 'react'
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    MapPin,
    Plus,
    X,
    AlertTriangle,
    CheckCircle,
    ExternalLink,
    Activity,
    Zap,
} from 'lucide-react'
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isPast,
    isToday as isTodayFn,
} from 'date-fns'
import { useRouter } from 'next/navigation'

const STATUS_COLORS: Record<string, string> = {
    SUBMITTED: 'bg-slate-100  text-slate-700  border-slate-200',
    PENDING: 'bg-amber-100  text-amber-700  border-amber-200',
    MAYBE: 'bg-purple-100 text-purple-700 border-purple-200',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CONFIRMED: 'bg-blue-100   text-blue-700   border-blue-200',
    DECLINED: 'bg-red-100    text-red-700    border-red-200',
    CANCELLED: 'bg-slate-100  text-slate-500  border-slate-200',
    COMPLETED: 'bg-teal-100   text-teal-700   border-teal-200',
}

const BLOCKED_STATUSES = ['ACCEPTED', 'CONFIRMED', 'COMPLETED']

export default function CalendarPage() {
    const router = useRouter()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [bookings, setBookings] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [conflictWarning, setConflictWarning] = useState('')
    const [formData, setFormData] = useState({
        contactId: '',
        serviceId: '',
        proceedingType: '',
        bookingDate: '',
        bookingTime: '',
        location: '',
        venue: '',
        appearanceType: 'REMOTE' as 'REMOTE' | 'IN_PERSON',
        specialRequirements: '',
    })

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings?limit=200', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setBookings(Array.isArray(data.bookings) ? data.bookings : [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const fetchSupporting = async () => {
        try {
            const token = localStorage.getItem('token')
            const [cr, sr] = await Promise.all([
                fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/services', { headers: { Authorization: `Bearer ${token}` } }),
            ])
            const cd = await cr.json()
            const sd = await sr.json()
            setContacts(cd.contacts || [])
            setServices(sd.services || [])
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchBookings()
        fetchSupporting()
    }, [])

    // Detect conflicts for a given date
    const getDateBookings = (d: Date) =>
        bookings.filter(b => b.bookingDate && isSameDay(new Date(b.bookingDate), d))

    const isDateBlocked = (d: Date) =>
        getDateBookings(d).some(b => BLOCKED_STATUSES.includes(b.bookingStatus))

    const hasConflict = (d: Date) =>
        getDateBookings(d).filter(b => BLOCKED_STATUSES.includes(b.bookingStatus)).length > 1

    // On date change in form, check for conflicts
    const handleDateChange = (dateStr: string) => {
        setFormData(f => ({ ...f, bookingDate: dateStr }))
        if (!dateStr) { setConflictWarning(''); return }
        const d = new Date(dateStr)
        const blocked = getDateBookings(d).filter(b => BLOCKED_STATUSES.includes(b.bookingStatus))
        if (blocked.length > 0) {
            setConflictWarning(
                `⚠️ This date already has ${blocked.length} accepted/confirmed booking(s). Proceeding will create an overlap.`
            )
        } else {
            setConflictWarning('')
        }
    }

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setSaveError('')
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setIsModalOpen(false)
                setConflictWarning('')
                setFormData({
                    contactId: '', serviceId: '', proceedingType: '',
                    bookingDate: '', bookingTime: '', location: '', venue: '',
                    appearanceType: 'REMOTE', specialRequirements: '',
                })
                fetchBookings()
            } else {
                const err = await res.json()
                setSaveError(err.error || 'Failed to create booking.')
            }
        } catch (e: any) {
            setSaveError(e.message || 'Server error.')
        } finally {
            setSaving(false)
        }
    }

    const allDays = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth)),
    })

    const selectedDayBookings = getDateBookings(selectedDate)

    return (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500 pb-24">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Booking Calendar</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">View and manage all scheduled court reporting engagements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setFormData(f => ({ ...f, bookingDate: format(selectedDate, 'yyyy-MM-dd') }))
                            handleDateChange(format(selectedDate, 'yyyy-MM-dd'))
                            setIsModalOpen(true)
                        }}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Schedule Booking
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3">
                {Object.entries({ ACCEPTED: 'Accepted', CONFIRMED: 'Confirmed', COMPLETED: 'Completed', PENDING: 'Pending', SUBMITTED: 'Submitted' }).map(([k, v]) => (
                    <span key={k} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[k]}`}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {v}
                    </span>
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                    🔴 = conflict (multiple accepted bookings on same day)
                </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Calendar grid */}
                <div className="xl:col-span-3 space-y-4">
                    {/* Month nav */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                            className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <h2 className="text-base font-semibold text-foreground">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <button
                            onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                            className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Days of week */}
                    <div className="grid grid-cols-7 mb-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                        ))}
                    </div>

                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-xl overflow-hidden">
                        {allDays.map((d, i) => {
                            const dayBookings = getDateBookings(d)
                            const blocked = isDateBlocked(d)
                            const conflict = hasConflict(d)
                            const isSelectedDay = isSameDay(d, selectedDate)
                            const isCurrentMonth = isSameMonth(d, currentMonth)
                            const today = isTodayFn(d)

                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(d)}
                                    className={`min-h-[90px] md:min-h-[110px] p-2 bg-card transition-all cursor-pointer
                                        ${!isCurrentMonth ? 'opacity-30' : ''}
                                        ${isSelectedDay ? 'ring-2 ring-inset ring-primary/50' : 'hover:bg-primary/5'}
                                        ${blocked ? 'border-l-2 border-l-emerald-500' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-semibold leading-none
                                            ${today ? 'bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px]' : 'text-muted-foreground'}
                                        `}>
                                            {format(d, 'd')}
                                        </span>
                                        {conflict && (
                                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Conflict: multiple accepted bookings" />
                                        )}
                                        {blocked && !conflict && (
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Date is booked" />
                                        )}
                                    </div>

                                    <div className="space-y-0.5">
                                        {dayBookings.slice(0, 3).map(b => (
                                            <div
                                                key={b.id}
                                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border truncate ${STATUS_COLORS[b.bookingStatus] || STATUS_COLORS.SUBMITTED}`}
                                            >
                                                {b.bookingTime?.split(' ')[0]} {b.proceedingType?.substring(0, 14)}
                                            </div>
                                        ))}
                                        {dayBookings.length > 3 && (
                                            <p className="text-[10px] text-muted-foreground pl-1">+{dayBookings.length - 3} more</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Day detail panel */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 sm:p-8 rounded-[2rem] bg-card border border-border shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity group-hover:rotate-12 duration-700">
                            <CalendarIcon className="h-24 w-24 text-primary" />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-tight leading-none mb-1">{format(selectedDate, 'EEEE')}</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{format(selectedDate, 'MMMM d, yyyy')}</p>
                            </div>
                        </div>

                        {selectedDayBookings.length === 0 ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-2 border border-border/50">
                                    <Clock className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">No active nodes scheduled</p>
                                <button
                                    onClick={() => {
                                        handleDateChange(format(selectedDate, 'yyyy-MM-dd'));
                                        setFormData(f => ({ ...f, bookingDate: format(selectedDate, 'yyyy-MM-dd') }));
                                        setIsModalOpen(true)
                                    }}
                                    className="luxury-button px-6 py-2.5 h-auto text-[9px] font-black uppercase tracking-widest"
                                >
                                    <Plus className="h-3.5 w-3.5 inline mr-2" />
                                    Push Deployment
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                {selectedDayBookings.map(b => (
                                    <div key={b.id} className="p-4 rounded-2xl border border-border bg-muted/30 hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all group/item">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${STATUS_COLORS[b.bookingStatus] || STATUS_COLORS.SUBMITTED}`}>
                                                {b.bookingStatus}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                                                <Clock className="h-3 w-3" />
                                                {b.bookingTime}
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-black text-foreground uppercase tracking-tight mb-3 line-clamp-2 group-hover/item:text-primary transition-colors">{b.proceedingType}</h4>
                                        <div className="space-y-2">
                                            {b.contact && (
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    <User className="h-3 w-3 opacity-40" />
                                                    <span className="truncate">{b.contact.firstName} {b.contact.lastName}</span>
                                                </div>
                                            )}
                                            {b.location && (
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    <MapPin className="h-3 w-3 opacity-40" />
                                                    <span className="truncate">{b.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => router.push(`/admin/bookings?id=${b.id}`)}
                                            className="mt-4 w-full py-2 rounded-xl border border-border text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-2 group-hover/item:bg-primary/5 group-hover/item:border-primary/20"
                                        >
                                            Inspect Node <ExternalLink className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Monthly summary */}
                    <div className="glass-panel p-6 sm:p-8 rounded-[2rem] bg-card border border-border shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary"></div>
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Matrix Yield <span className="brand-gradient italic">Monthly</span></h4>
                            <Activity className="h-4 w-4 text-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-4">
                            {['ACCEPTED', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map(s => {
                                const count = bookings.filter(b => {
                                    const d = new Date(b.bookingDate)
                                    return isSameMonth(d, currentMonth) && b.bookingStatus === s
                                }).length
                                if (count === 0) return null
                                return (
                                    <div key={s} className="flex items-center justify-between group/line">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border shadow-sm transition-all group-hover/line:translate-x-1 ${STATUS_COLORS[s]}`}>
                                            {s}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-8 sm:w-16 bg-border group-hover/line:w-24 transition-all duration-500"></div>
                                            <span className="font-black text-foreground text-base tracking-tighter">{count}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Booking Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:pl-72">
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">

                        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-foreground">Schedule Booking</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {formData.bookingDate ? format(new Date(formData.bookingDate), 'MMMM d, yyyy') : 'Select a date'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-6 py-5">
                            <form onSubmit={handleCreateBooking} id="booking-form" className="space-y-5">

                                {conflictWarning && (
                                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                                        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        {conflictWarning}
                                    </div>
                                )}

                                {saveError && (
                                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                        {saveError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Client</label>
                                        <select required className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            value={formData.contactId} onChange={e => setFormData(f => ({ ...f, contactId: e.target.value }))}>
                                            <option value="">Select client…</option>
                                            {contacts.map(c => (
                                                <option key={c.id} value={c.id}>{c.companyName || `${c.firstName} ${c.lastName}`}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Service</label>
                                        <select required className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            value={formData.serviceId} onChange={e => setFormData(f => ({ ...f, serviceId: e.target.value }))}>
                                            <option value="">Select service…</option>
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.serviceName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Proceeding Type / Case Name</label>
                                        <input required className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="e.g. Deposition of Dr. John Smith"
                                            value={formData.proceedingType} onChange={e => setFormData(f => ({ ...f, proceedingType: e.target.value }))} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Date</label>
                                        <input required type="date" className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            value={formData.bookingDate} onChange={e => handleDateChange(e.target.value)} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Time</label>
                                        <input required className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="e.g. 10:00 AM EST" value={formData.bookingTime} onChange={e => setFormData(f => ({ ...f, bookingTime: e.target.value }))} />
                                    </div>

                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Location / Venue</label>
                                        <input className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="e.g. 123 Main St, New York — or — Zoom"
                                            value={formData.location} onChange={e => setFormData(f => ({ ...f, location: e.target.value }))} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Appearance Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(['REMOTE', 'IN_PERSON'] as const).map(type => (
                                            <button key={type} type="button"
                                                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${formData.appearanceType === type ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-background border-border text-muted-foreground hover:border-primary/40'}`}
                                                onClick={() => setFormData(f => ({ ...f, appearanceType: type }))}>
                                                {type === 'REMOTE' ? 'Remote / Zoom' : 'In-Person'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Special Requirements</label>
                                    <textarea className="w-full border border-border bg-background rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        rows={3} placeholder="Any special instructions, exhibits, or notes…"
                                        value={formData.specialRequirements} onChange={e => setFormData(f => ({ ...f, specialRequirements: e.target.value }))} />
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-4 border-t border-border flex-shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                            <button type="submit" form="booking-form" disabled={saving} className="btn-primary flex-1 text-sm">
                                {saving ? 'Scheduling…' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
