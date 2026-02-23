'use client'

import { useState, useEffect } from 'react'
import { Globe, ArrowRight, Calendar, MapPin, Clock, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface BookingRequestProps {
    services: any[]
    onBookingCreated?: () => void
}

export default function BookingRequest({ services, onBookingCreated }: BookingRequestProps) {
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        serviceId: '',
        proceedingType: '',
        bookingDate: '',
        bookingTime: '',
        location: '',
        appearanceType: 'REMOTE' as 'REMOTE' | 'IN_PERSON',
        specialRequirements: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
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
                    // If bookingDate is empty, backend might complain, but this field is required
                    bookingDate: format(new Date(formData.bookingDate), 'yyyy-MM-dd')
                })
            })

            if (res.ok) {
                setSuccess(true)
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
                // Reset success message after 5 seconds
                setTimeout(() => setSuccess(false), 5000)
            } else {
                console.error('Booking creation failed with status:', res.status)
                alert('Failed to submit request. Please try again.')
            }
        } catch (error) {
            console.error('Failed to create booking:', error)
            alert('An error occurred while communicating with the server.')
        } finally {
            setSaving(false)
        }
    }

    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    if (success) {
        return (
            <div className="glass-panel rounded-[2.5rem] p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <Globe className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-2">Transmission Received</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">Your booking request has been successfully transmitted to our secure system. A confirmation will be sent shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all"
                >
                    Submit Another Request
                </button>
            </div>
        )
    }

    return (
        <div className="glass-panel rounded-[1.5rem] sm:rounded-[2.5rem] px-3 py-6 sm:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Initiate <span className="text-primary italic">Booking</span>
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request Protocol</p>
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 rounded-md border border-primary/10">
                            <Clock className="h-3 w-3 text-primary animate-pulse" />
                            <span className="text-[10px] font-black text-primary font-mono">{format(currentTime, 'HH:mm:ss')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">System Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Protocol</label>
                        <div className="relative">
                            <select
                                required
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                            >
                                <option value="" className="dark:bg-[#001a12]">Select Service Type</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id} className="dark:bg-[#001a12]">{s.serviceName}</option>
                                ))}
                            </select>
                            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Proceeding Detail</label>
                        <input
                            required
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
                            placeholder="E.G. DEPOSITION OF DR. SMITH"
                            value={formData.proceedingType}
                            onChange={(e) => setFormData({ ...formData, proceedingType: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.bookingDate}
                                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Vector</label>
                            <div className="relative">
                                <input
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="09:00 AM"
                                    value={formData.bookingTime}
                                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                />
                                <Clock className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Coordinates</label>
                        <div className="relative">
                            <input
                                required
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-[10px] sm:text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
                                placeholder="ADDRESS OR URL"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                            <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Modal Vector</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.appearanceType === 'REMOTE'
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10'
                                    : 'bg-transparent text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                onClick={() => setFormData({ ...formData, appearanceType: 'REMOTE' })}
                            >
                                Remote
                            </button>
                            <button
                                type="button"
                                className={`py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.appearanceType === 'IN_PERSON'
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10'
                                    : 'bg-transparent text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                onClick={() => setFormData({ ...formData, appearanceType: 'IN_PERSON' })}
                            >
                                In-Person
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Directives</label>
                        <textarea
                            className="w-full h-24 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-5 py-3.5 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300 resize-none"
                            placeholder="Additional requirements..."
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 group active:scale-[0.98]"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {saving ? 'Transmitting...' : (
                            <><span className="hidden sm:inline">Authorize Deployment</span><span className="sm:hidden">Confirm Booking</span> <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
