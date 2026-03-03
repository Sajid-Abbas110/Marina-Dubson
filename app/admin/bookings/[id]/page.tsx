'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, Loader2 } from 'lucide-react'

export default function BookingDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [booking, setBooking] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }
                const res = await fetch(`/api/bookings/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!res.ok) {
                    throw new Error('Booking not found')
                }
                const data = await res.json()
                setBooking(data)
            } catch (e: any) {
                setError(e.message || 'Unable to load booking')
            } finally {
                setLoading(false)
            }
        }
        fetchBooking()
    }, [params.id, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-lg font-bold text-foreground">Booking not found</p>
                <button onClick={() => router.back()} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Go back
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-lg border border-border hover:border-primary/40">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Booking</p>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">#{booking.bookingNumber || booking.id}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon={<Calendar className="h-5 w-5" />} label="Date" value={new Date(booking.bookingDate).toLocaleDateString()} />
                <InfoCard icon={<Clock className="h-5 w-5" />} label="Time" value={booking.bookingTime} />
                <InfoCard icon={<MapPin className="h-5 w-5" />} label="Location" value={booking.location || 'Remote'} />
                <InfoCard icon={<User className="h-5 w-5" />} label="Client" value={booking.contact?.companyName || `${booking.contact?.firstName || ''} ${booking.contact?.lastName || ''}`} />
                <InfoCard icon={<FileText className="h-5 w-5" />} label="Proceeding" value={booking.proceedingType} />
                <InfoCard icon={<FileText className="h-5 w-5" />} label="Service" value={booking.service?.serviceName} />
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Special Requirements</p>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border text-sm leading-relaxed">
                    {booking.specialRequirements || 'None provided.'}
                </div>
            </div>

            <div className="flex gap-3">
                <Link href="/admin/bookings" className="btn-secondary px-4 py-3 text-[10px] font-black uppercase tracking-widest">
                    Back to bookings
                </Link>
            </div>
        </div>
    )
}

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-primary">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
        </div>
    )
}
