'use client'

import { useState, useEffect } from 'react'
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    User,
    ArrowRight,
    Activity,
    Plus,
    X,
    Globe,
    Clock,
    MapPin
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
    eachDayOfInterval
} from 'date-fns'
import { createPortal } from 'react-dom'

interface ClientCalendarProps {
    bookings: any[]
    onBookingCreated?: () => void
    services: any[]
}

export default function ClientCalendar({ bookings, onBookingCreated, services }: ClientCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        serviceId: '',
        proceedingType: '',
        bookingDate: '',
        bookingTime: '',
        location: '',
        appearanceType: 'REMOTE' as 'REMOTE' | 'IN_PERSON',
        specialRequirements: ''
    })

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
                if (onBookingCreated) onBookingCreated()
                setFormData({
                    serviceId: '',
                    proceedingType: '',
                    bookingDate: '',
                    bookingTime: '',
                    location: '',
                    appearanceType: 'REMOTE',
                    specialRequirements: ''
                })
            } else {
                console.error('Booking creation failed with status:', res.status)
                alert('Failed to create booking. Please try again.')
            }
        } catch (error) {
            console.error('Failed to create booking:', error)
            alert('An error occurred while communicating with the server.')
        } finally {
            setSaving(false)
        }
    }

    const renderHeader = () => {
        return (
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                            Operational <span className="text-primary italic">Timeline</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-xs">Synchronized schedule of your active case assets.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 bg-white dark:bg-white/5 p-4 md:p-2 rounded-[2.5rem] md:rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
                    <button
                        onClick={() => {
                            setFormData({ ...formData, bookingDate: format(selectedDate, 'yyyy-MM-dd') })
                            setIsModalOpen(true)
                        }}
                        className="px-6 h-12 rounded-2xl bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-all group shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Request Booking</span>
                    </button>
                    <div className="h-8 w-px bg-gray-100 dark:bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-400 group"
                        >
                            <ChevronLeft className="h-5 w-5 group-hover:text-primary" />
                        </button>
                        <div className="px-4 text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] min-w-[150px] text-center">
                            {format(currentMonth, 'MMMM yyyy')}
                        </div>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-400 group"
                        >
                            <ChevronRight className="h-5 w-5 group-hover:text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return (
            <div className="grid grid-cols-7 mb-4">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
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
            <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                {allDays.map((d, i) => {
                    const dayBookings = (bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), d))

                    return (
                        <div
                            key={i}
                            className={`min-h-[140px] p-5 bg-white dark:bg-[#001c14] transition-all hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer group relative ${!isSameMonth(d, monthStart) ? 'opacity-30' : ''}`}
                            onClick={() => setSelectedDate(d)}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isSameDay(d, new Date()) ? 'text-primary' : 'text-gray-400'}`}>
                                    {format(d, 'd')}
                                </span>
                            </div>

                            <div className="mt-4 space-y-1">
                                {dayBookings.slice(0, 3).map(b => (
                                    <div
                                        key={b.id}
                                        className={`px-2 py-1 rounded-lg border text-[7px] font-black uppercase truncate transition-all ${b.bookingStatus === 'COMPLETED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                            ['CONFIRMED', 'ACCEPTED'].includes(b.bookingStatus) ? 'bg-primary/5 border-primary/10 text-primary' :
                                                'bg-amber-50 border-amber-100 text-amber-600'
                                            }`}
                                    >
                                        {b.bookingTime.split(' ')[0]} {b.proceedingType.split(' ')[0]}
                                    </div>
                                ))}
                                {dayBookings.length > 3 && (
                                    <div className="text-[7px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        + {dayBookings.length - 3} Sessions
                                    </div>
                                )}
                            </div>

                            {dayBookings.length > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20"></div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const selectedDayBookings = (bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), selectedDate))

    return (
        <div className="animate-in fade-in duration-700">
            {renderHeader()}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                <div className="xl:col-span-3">
                    {renderDays()}
                    {renderCells()}
                </div>

                <div className="space-y-8">
                    <div className="glass-panel rounded-[2.5rem] p-8 border border-border dark:border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">{format(selectedDate, 'MMM dd, yyyy')}</h3>
                                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">Daily Briefing</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedDayBookings.map(b => (
                                <div key={b.id} className="p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/20 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${b.bookingStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            ['CONFIRMED', 'ACCEPTED'].includes(b.bookingStatus) ? 'bg-primary/5 text-primary border-primary/10' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {b.bookingStatus}
                                        </span>
                                        <span className="text-[8px] font-black text-muted-foreground uppercase">{b.bookingTime}</span>
                                    </div>
                                    <h5 className="text-xs font-black text-foreground uppercase mb-2 line-clamp-1">{b.proceedingType}</h5>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-5 w-5 rounded-full bg-card flex items-center justify-center border border-border">
                                            <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                                        </div>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase truncate">{b.location || 'Remote Node'}</span>
                                    </div>

                                    <button className="w-full py-2.5 rounded-xl bg-card border border-border text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                                        Authorization Stack <ArrowRight className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {selectedDayBookings.length === 0 && (
                                <div className="py-12 text-center">
                                    <CalendarIcon className="h-8 w-8 text-gray-100 mx-auto mb-3" />
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No deployments scheduled.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2rem] p-6 border border-gray-100 bg-gradient-to-br from-primary/5 to-emerald-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="h-5 w-5 text-primary" />
                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Resource Allocation</h4>
                        </div>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase leading-relaxed">MD Network protocols are operating at peak efficiency across all selected temporal nodes.</p>
                    </div>
                </div>
            </div>

            {/* Request Booking Modal */}
            {isModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white dark:bg-[#001a12] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 bg-primary text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Case Deployment Request</h3>
                                <p className="text-[9px] uppercase font-black tracking-widest opacity-60">Initializing schedule for {format(selectedDate, 'MMM dd, yyyy')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateBooking} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Type</label>
                                    <select
                                        required
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    >
                                        <option value="" className="dark:bg-[#001a12]">Select Service Protocol</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id} className="dark:bg-[#001a12]">{s.serviceName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Proceeding Detail</label>
                                    <input
                                        required
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="E.G. DEPOSITION OF DR. SMITH"
                                        value={formData.proceedingType}
                                        onChange={(e) => setFormData({ ...formData, proceedingType: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Time Node</label>
                                    <input
                                        required
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="E.G. 10:00 AM"
                                        value={formData.bookingTime}
                                        onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Deployment Location</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="STREET ADDRESS OR ZOOM/WEBEX"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Appearance Vector</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.appearanceType === 'REMOTE' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-transparent text-gray-400 border-gray-100 dark:border-white/10'}`}
                                            onClick={() => setFormData({ ...formData, appearanceType: 'REMOTE' })}
                                        >
                                            Remote
                                        </button>
                                        <button
                                            type="button"
                                            className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.appearanceType === 'IN_PERSON' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-transparent text-gray-400 border-gray-100 dark:border-white/10'}`}
                                            onClick={() => setFormData({ ...formData, appearanceType: 'IN_PERSON' })}
                                        >
                                            In-Person
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-5 bg-gray-900 dark:bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-primary dark:hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {saving ? 'Processing Request...' : (
                                    <>Authorize Request <Globe className="h-4 w-4" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
