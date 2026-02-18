'use client'

import { useState } from 'react'
import { Globe, ArrowRight, Calendar, MapPin, Clock } from 'lucide-react'
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

    if (success) {
        return (
            <div className="glass-panel rounded-[2.5rem] p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <Globe className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Transmission Received</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">Your booking request has been successfully transmitted to our secure node. A confirmation will be sent shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all"
                >
                    Submit Another Request
                </button>
            </div>
        )
    }

    return (
        <div className="glass-panel rounded-[2.5rem] p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-10 border-b border-gray-100 dark:border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Initiate <span className="text-primary italic">Booking</span>
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Secure Deployment Request Protocol</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">System Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Protocol</label>
                        <div className="relative">
                            <select
                                required
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                            >
                                <option value="" className="dark:bg-[#001a12]">Select Service Type</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id} className="dark:bg-[#001a12]">{s.serviceName}</option>
                                ))}
                            </select>
                            <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Proceeding Detail</label>
                        <input
                            required
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
                            placeholder="E.G. DEPOSITION OF DR. SMITH"
                            value={formData.proceedingType}
                            onChange={(e) => setFormData({ ...formData, proceedingType: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Date Node</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.bookingDate}
                                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Vector</label>
                            <div className="relative">
                                <input
                                    required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="09:00 AM"
                                    value={formData.bookingTime}
                                    onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                />
                                <Clock className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Location Coordinates</label>
                        <div className="relative">
                            <input
                                required
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
                                placeholder="ENTER ADDRESS OR DIGITAL ROOM URL"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                            <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Appearance Vector</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.appearanceType === 'REMOTE'
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10'
                                    : 'bg-transparent text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                onClick={() => setFormData({ ...formData, appearanceType: 'REMOTE' })}
                            >
                                Remote Link
                            </button>
                            <button
                                type="button"
                                className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.appearanceType === 'IN_PERSON'
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10'
                                    : 'bg-transparent text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                onClick={() => setFormData({ ...formData, appearanceType: 'IN_PERSON' })}
                            >
                                In-Person
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Directives</label>
                        <textarea
                            className="w-full h-32 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300 resize-none"
                            placeholder="Enter any additional requirements, expedited delivery requests, or secure notes..."
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50 group hover:-translate-y-1"
                    >
                        {saving ? 'Transmitting...' : (
                            <>Authorize Deployment <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
