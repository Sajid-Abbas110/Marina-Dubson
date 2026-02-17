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
    Activity
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

    useEffect(() => {
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
        fetchBookings()
    }, [])

    const renderHeader = () => {
        return (
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Bookings <span className="text-primary italic">Calendar</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Visualizing the MD logistics pipeline.</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-400 hover:text-primary"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="px-8 text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">
                        {format(currentMonth, 'MMMM yyyy')}
                    </div>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-400 hover:text-primary"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
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

        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ""

        const allDays = eachDayOfInterval({ start: startDate, end: endDate })

        return (
            <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {allDays.map((d, i) => {
                    const dayBookings = (bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), d))
                    const hasTimeConflict = dayBookings.some((b1, idx1) =>
                        dayBookings.some((b2, idx2) => idx1 !== idx2 && b1.bookingTime === b2.bookingTime)
                    )
                    const isHighTraffic = dayBookings.length > 3
                    const hasConflict = hasTimeConflict || isHighTraffic

                    return (
                        <div
                            key={i}
                            className={`min-h-[160px] p-6 bg-white dark:bg-[#001c14] transition-all hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer group relative ${!isSameMonth(d, monthStart) ? 'opacity-30' : ''}`}
                            onClick={() => setSelectedDate(d)}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-black uppercase tracking-widest ${isSameDay(d, new Date()) ? 'text-primary bg-primary/10 px-2 py-1 rounded-md' : 'text-gray-400 dark:text-gray-600'}`}>
                                    {format(d, 'd')}
                                </span>
                                {hasConflict && (
                                    <div className="h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center animate-pulse" title="High Traffic / Conflict Potential">
                                        <Activity className="h-2 w-2 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 space-y-1.5">
                                {dayBookings.slice(0, 4).map(b => (
                                    <div
                                        key={b.id}
                                        className={`px-2 py-1 rounded-md border text-[7px] font-black uppercase truncate transition-all ${b.bookingStatus === 'COMPLETED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                            b.bookingStatus === 'CONFIRMED' ? 'bg-primary/5 border-primary/10 text-primary' :
                                                b.bookingStatus === 'ACCEPTED' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                    'bg-amber-50 border-amber-100 text-amber-600'
                                            }`}
                                    >
                                        {b.bookingTime.split(' ')[0]} {b.proceedingType.split(' ')[0]}
                                    </div>
                                ))}
                                {dayBookings.length > 4 && (
                                    <div className="text-[7px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                        + {dayBookings.length - 4} Cluster
                                    </div>
                                )}
                            </div>

                            {/* Blocked Date Visual Indicator */}
                            {dayBookings.some(b => b.bookingStatus === 'CONFIRMED') && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10"></div>
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
                    <div className="glass-panel rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <CalendarIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{format(selectedDate, 'MMM dd, yyyy')}</h3>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Daily Tactical Briefing</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), selectedDate)).map(b => (
                                <div key={b.id} className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-50 dark:border-white/5 hover:border-primary/20 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${b.bookingStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            b.bookingStatus === 'ACCEPTED' ? 'bg-primary/5 text-primary border-primary/10' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {b.bookingStatus}
                                        </span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase">{b.bookingTime}</span>
                                    </div>
                                    <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-3 line-clamp-1">{b.proceedingType}</h5>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                            <User className="h-3 w-3 text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">{b.contact.firstName} {b.contact.lastName}</span>
                                    </div>

                                    <button className="w-full py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                                        View Details <ArrowRight className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {((bookings || []).filter(b => b && b.bookingDate && isSameDay(new Date(b.bookingDate), selectedDate))).length === 0 && (
                                <div className="py-12 text-center">
                                    <CalendarIcon className="h-10 w-10 text-gray-100 dark:text-white/10 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No deployments<br />scheduled for this node.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 bg-gradient-to-br from-primary/5 to-emerald-500/5">
                        <TrendingUp className="h-8 w-8 text-primary mb-4" />
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Network Load</h4>
                        <p className="text-[10px] text-gray-500 font-medium uppercase leading-relaxed">The current nodes have an 82% saturation rate for the upcoming 7 business days.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TrendingUp(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
