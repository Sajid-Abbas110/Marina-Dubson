'use client'

import { useState, useEffect } from 'react'
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    MapPin,
    Search,
    Filter,
    ArrowRight,
    Activity,
    Plus,
    X,
    Briefcase,
    Globe,
    Zap
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
    addDays,
    eachDayOfInterval
} from 'date-fns'

export default function VisualCalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [contacts, setContacts] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        contactId: '',
        serviceId: '',
        proceedingType: '',
        bookingDate: '',
        bookingTime: '',
        location: '',
        venue: '',
        appearanceType: 'REMOTE' as 'REMOTE' | 'IN_PERSON',
        specialRequirements: ''
    })

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setBookings(Array.isArray(data.bookings) ? data.bookings : [])
        } catch (error) {
            console.error('Failed to fetch bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSupportingData = async () => {
        try {
            const token = localStorage.getItem('token')
            const [contactsRes, servicesRes] = await Promise.all([
                fetch('/api/contacts', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } })
            ])
            const contactsData = await contactsRes.json()
            const servicesData = await servicesRes.json()
            setContacts(contactsData.contacts || [])
            setServices(servicesData.services || [])
        } catch (error) {
            console.error('Failed to fetch supporting data:', error)
        }
    }

    useEffect(() => {
        fetchBookings()
        fetchSupportingData()
    }, [])

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    bookingDate: format(new Date(formData.bookingDate), 'yyyy-MM-dd')
                })
            })

            if (res.ok) {
                setIsModalOpen(false)
                fetchBookings()
                setFormData({
                    contactId: '',
                    serviceId: '',
                    proceedingType: '',
                    bookingDate: '',
                    bookingTime: '',
                    location: '',
                    venue: '',
                    appearanceType: 'REMOTE',
                    specialRequirements: ''
                })
            }
        } catch (error) {
            console.error('Failed to create booking:', error)
        } finally {
            setSaving(false)
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase leading-none">
                        Bookings <span className="brand-gradient italic">Calendar</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.4em]">Visualizing the MD logistics pipeline.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-2.5 rounded-[2.5rem] border border-border shadow-sm">
                    <button
                        onClick={() => {
                            setFormData({ ...formData, bookingDate: format(selectedDate, 'yyyy-MM-dd') })
                            setIsModalOpen(true)
                        }}
                        className="luxury-button py-3.5 px-8 h-12 flex items-center gap-2 group"
                    >
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Quick Deployment</span>
                    </button>
                    <div className="h-8 w-px bg-border hidden md:block mx-2"></div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-card hover:shadow-lg hover:border border-border transition-all text-muted-foreground hover:text-primary"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="px-6 text-[11px] font-black text-foreground uppercase tracking-[0.3em] min-w-[200px] text-center">
                            {format(currentMonth, 'MMMM yyyy')}
                        </div>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-card hover:shadow-lg hover:border border-border transition-all text-muted-foreground hover:text-primary"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return (
            <div className="grid grid-cols-7 mb-6">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">{day}</div>
                ))}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const allDays = eachDayOfInterval({ start: startDate, end: endDate })

        return (
            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-[3rem] overflow-hidden shadow-2xl bg-border/20">
                {allDays.map((d, i) => {
                    const dayBookings = (bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), d))
                    const hasConflict = dayBookings.length > 3
                    const isToday = isSameDay(d, new Date())

                    return (
                        <div
                            key={i}
                            className={`min-h-[160px] p-6 bg-card transition-all hover:bg-primary/5 cursor-pointer group relative ${!isSameMonth(d, monthStart) ? 'opacity-20 grayscale' : ''}`}
                            onClick={() => setSelectedDate(d)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[11px] font-black transition-all ${isToday ? 'text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 scale-110 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                    {format(d, 'd')}
                                </span>
                                {hasConflict && (
                                    <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                {dayBookings.slice(0, 3).map(b => (
                                    <div
                                        key={b.id}
                                        className={`px-2.5 py-1.5 rounded-lg border text-[8px] font-black uppercase truncate transition-all ${b.bookingStatus === 'COMPLETED' ? 'bg-primary/5 border-primary/10 text-primary/80' :
                                            b.bookingStatus === 'CONFIRMED' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10' :
                                                b.bookingStatus === 'ACCEPTED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                    'bg-muted border-border text-muted-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1 w-1 rounded-full bg-current"></div>
                                            {b.bookingTime.split(' ')[0]} {b.proceedingType}
                                        </div>
                                    </div>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest pl-2 pt-1 italic">
                                        + {dayBookings.length - 3} Operations
                                    </div>
                                )}
                            </div>

                            {isSameDay(d, selectedDate) && (
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {renderHeader()}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                <div className="xl:col-span-3">
                    {renderDays()}
                    {renderCells()}
                </div>

                <div className="space-y-8">
                    <div className="glass-panel rounded-[3rem] p-8 bg-card border border-border shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Activity className="h-24 w-24 text-primary" />
                        </div>

                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <CalendarIcon className="h-7 w-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{format(selectedDate, 'MMM dd, yyyy')}</h3>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] leading-none">Daily Tactical Briefing</p>
                            </div>
                        </div>

                        <div className="space-y-5 relative z-10">
                            {(bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), selectedDate)).map(b => (
                                <div key={b.id} className="p-6 rounded-[2rem] bg-muted/30 border border-border hover:border-primary/20 transition-all group/item shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${b.bookingStatus === 'COMPLETED' ? 'bg-primary/10 text-primary border-primary/20' :
                                            b.bookingStatus === 'ACCEPTED' ? 'bg-primary text-primary-foreground border-primary' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {b.bookingStatus}
                                        </span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-card px-2 py-0.5 rounded-md border border-border">{b.bookingTime}</span>
                                    </div>
                                    <h5 className="text-sm font-black text-foreground uppercase mb-4 line-clamp-2 tracking-tight group-hover/item:text-primary transition-colors">{b.proceedingType}</h5>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{b.contact?.firstName} {b.contact?.lastName}</span>
                                    </div>

                                    <button className="w-full py-3.5 rounded-xl bg-card border border-border text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:border-primary transition-all shadow-sm">
                                        Decrypt Full Specs <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                            {((bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), selectedDate))).length === 0 && (
                                <div className="py-20 text-center space-y-6">
                                    <div className="h-20 w-20 rounded-[2.5rem] bg-muted/50 border border-dashed border-border flex items-center justify-center mx-auto text-muted-foreground/20">
                                        <CalendarIcon className="h-10 w-10" />
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] leading-relaxed">No active signals<br />on this temporal node.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 bg-card border border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                            <Zap className="h-20 w-20 text-primary" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <Activity className="h-6 w-6" />
                            </div>
                            <h4 className="text-sm font-black text-foreground uppercase tracking-[0.4em]">Grid Load</h4>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase leading-relaxed tracking-tight">Node saturation is currently at <span className="text-primary font-black">82% capacity</span> for the upcoming operational cycle.</p>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-primary w-[82%] shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:pl-80 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl bg-card rounded-[3.5rem] shadow-3xl border border-border overflow-hidden p-12 custom-scrollbar max-h-[90vh]">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-8">
                                <div className="h-16 w-16 rounded-[1.5rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl">
                                    <Plus className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight leading-none">Node Initialization</h3>
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Logistics Cluster for {format(selectedDate, 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-14 w-14 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all flex items-center justify-center">
                                <X className="h-7 w-7" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateBooking} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Entity Target</label>
                                    <select
                                        required
                                        className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4.5 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-primary/10 text-foreground appearance-none cursor-pointer"
                                        value={formData.contactId}
                                        onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                                    >
                                        <option value="">Select Identity</option>
                                        {contacts.map(c => (
                                            <option key={c.id} value={c.id}>{c.companyName || `${c.firstName} ${c.lastName}`}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Service Node</label>
                                    <select
                                        required
                                        className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4.5 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-primary/10 text-foreground appearance-none cursor-pointer"
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    >
                                        <option value="">Select Protocol</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.serviceName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Proceeding Vector</label>
                                    <input
                                        required
                                        className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4.5 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground/30"
                                        placeholder="E.G. DEPOSITION OF DR. SMITH"
                                        value={formData.proceedingType}
                                        onChange={(e) => setFormData({ ...formData, proceedingType: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Temporal Marker</label>
                                    <input
                                        required
                                        className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-4.5 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground/30"
                                        placeholder="E.G. 10:00 AM EST"
                                        value={formData.bookingTime}
                                        onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Appearance Type</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className={`flex-1 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${formData.appearanceType === 'REMOTE' ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' : 'bg-muted border-border text-muted-foreground hover:border-primary/20'}`}
                                        onClick={() => setFormData({ ...formData, appearanceType: 'REMOTE' })}
                                    >
                                        Remote Broadcast
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${formData.appearanceType === 'IN_PERSON' ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20' : 'bg-muted border-border text-muted-foreground hover:border-primary/20'}`}
                                        onClick={() => setFormData({ ...formData, appearanceType: 'IN_PERSON' })}
                                    >
                                        On-Site Deployment
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-2">Logistics Meta Data</label>
                                <textarea
                                    className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-6 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-primary/10 text-foreground min-h-[120px] resize-none placeholder:text-muted-foreground/30"
                                    placeholder="ENTER SPECIAL INSTRUCTIONS OR EXHIBIT PROTOCOLS..."
                                    value={formData.specialRequirements}
                                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                />
                            </div>

                            <div className="mt-12">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full luxury-button py-6 shadow-3xl flex items-center justify-center gap-4 group"
                                >
                                    {saving ? (
                                        <div className="h-6 w-6 border-3 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="uppercase tracking-[0.4em] text-[10px] font-black">Authorize Schedule Deployment</span>
                                            <Globe className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
