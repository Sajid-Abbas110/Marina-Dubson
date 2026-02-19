'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Calendar,
    FileText,
    LayoutDashboard,
    CreditCard,
    MessageSquare,
    CheckCircle,
    Clock,
    ShieldAlert,
    User,
    Plus,
    Download,
    Search,
    ChevronRight,
    Globe,
    Briefcase,
    Zap
} from 'lucide-react'

export default function NewBookingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        serviceId: '',
        proceedingType: 'DEPOSITION',
        bookingDate: '',
        bookingTime: '',
        appearanceType: 'REMOTE' as 'REMOTE' | 'IN_PERSON',
        state: 'NY',
        jurisdiction: '',
        specialRequirements: '',
    })

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    console.error('No authorization token found')
                    return
                }

                const res = await fetch('/api/services', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    const servicesList = Array.isArray(data.services) ? data.services : []
                    setServices(servicesList)
                    if (servicesList.length > 0) {
                        setFormData(prev => ({ ...prev, serviceId: servicesList[0].id }))
                    }
                } else {
                    console.error('Failed to fetch services:', res.statusText)
                    setServices([])
                }
            } catch (error) {
                console.error('Failed to fetch services:', error)
                setServices([])
            }
        }
        fetchServices()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem('token') // Assuming token is stored in localStorage
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setStep(3)
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to submit booking')
            }
        } catch (error) {
            console.error('Submit booking failed:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background font-poppins text-foreground pb-20">
            {/* Minimal High-End Header */}
            <header className="bg-background/80 backdrop-blur-xl border-b border-border px-8 py-6 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/client/portal" className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center font-black group-hover:bg-primary transition-colors">
                            MD
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Return to Vault</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secure AES-256 Protocol</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
                        Service <span className="text-primary italic">Request</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">Initiate a professional stenographic assignment with our elite NYC-based reporting network.</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-12 mb-16">
                    <StepIndicator active={step >= 1} label="Identity" />
                    <div className={`h-0.5 w-12 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                    <StepIndicator active={step >= 2} label="Logistics" />
                    <div className={`h-0.5 w-12 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                    <StepIndicator active={step >= 3} label="Deployment" />
                </div>

                <div className="glass-panel rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    {step === 1 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Jurisdiction / Venue</label>
                                    <input
                                        className="luxury-input"
                                        placeholder="E.G. SUPREME COURT, NY COUNTY"
                                        value={formData.jurisdiction}
                                        onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Type of Proceeding</label>
                                    <input
                                        className="luxury-input"
                                        placeholder="DEPOSITION OF JOHN DOE"
                                        value={formData.proceedingType}
                                        onChange={(e) => setFormData({ ...formData, proceedingType: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Select Service Node</label>
                                    <select
                                        className="luxury-input appearance-none bg-no-repeat"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.25rem' }}
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    >
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.serviceName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] ml-2">Operational Minimum</label>
                                    <div className="luxury-input flex items-center bg-purple-500/5 border-purple-500/10 text-purple-400 font-black">
                                        $400.00 Base Fee Applied
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-6">
                                <button
                                    onClick={() => setStep(2)}
                                    className="luxury-btn py-5 px-12 shadow-xl shadow-blue-500/20"
                                >
                                    Proceed to Logistics <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Calendar Date</label>
                                    <input
                                        type="date"
                                        className="luxury-input"
                                        value={formData.bookingDate}
                                        onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Start Sequence</label>
                                    <input
                                        type="time"
                                        className="luxury-input"
                                        value={formData.bookingTime}
                                        onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">State Jurisdiction</label>
                                    <select
                                        className="luxury-input"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    >
                                        <option value="NY">NEW YORK</option>
                                        <option value="NJ">NEW JERSEY</option>
                                        <option value="CT">CONNECTICUT</option>
                                        <option value="FL">FLORIDA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Reporting Environment</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <VenueCard
                                        active={formData.appearanceType === 'REMOTE'}
                                        onClick={() => setFormData({ ...formData, appearanceType: 'REMOTE' })}
                                        icon={<Globe className="h-6 w-6" />}
                                        title="Remote Digital"
                                        desc="Zoom / WebEx integration with global technical support."
                                    />
                                    <VenueCard
                                        active={formData.appearanceType === 'IN_PERSON'}
                                        onClick={() => setFormData({ ...formData, appearanceType: 'IN_PERSON' })}
                                        icon={<Briefcase className="h-6 w-6" />}
                                        title="On-Site Presence"
                                        desc="Stenographer deployed to law firm or neutral venue."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Tactical Requirements</label>
                                <textarea
                                    className="luxury-input min-h-[120px] py-6 resize-none"
                                    placeholder="LIST EXPEDITE REQUESTS, VIDEOGRAPHER NEEDS, OR INTERPRETER LANGUAGES..."
                                    value={formData.specialRequirements}
                                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-10">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Modify Information
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="luxury-btn py-5 px-12 shadow-2xl shadow-blue-500/30"
                                >
                                    Confirm & Deploy <Zap className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-20 text-center animate-in zoom-in-95 duration-700">
                            <div className="h-32 w-32 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner relative">
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] animate-ping opacity-20"></div>
                                <CheckCircle className="h-14 w-14 text-emerald-500" />
                            </div>
                            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-4">Registry Processed</h2>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed mb-12">Your booking request has been entered into the MD Tactical Grid. You will receive an operational confirmation within 2 hours.</p>
                            <Link
                                href="/client/portal"
                                className="inline-flex items-center gap-4 py-5 px-12 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary hover:text-primary-foreground transition-all shadow-xl"
                            >
                                Track Assignment in Vault <LayoutDashboard className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function StepIndicator({ active, label }: any) {
    return (
        <div className="flex flex-col items-center gap-3 group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' : 'bg-muted text-muted-foreground'}`}>
                {active ? <CheckCircle className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        </div>
    )
}

function VenueCard({ active, onClick, icon, title, desc }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-8 rounded-[2rem] border-2 transition-all text-left flex flex-col group ${active ? 'border-primary bg-primary/10 shadow-xl shadow-primary/5' : 'border-border hover:border-primary/50'}`}
        >
            <div className={`mb-6 transition-transform group-hover:scale-110 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                {icon}
            </div>
            <h3 className={`text-lg font-black uppercase tracking-tight mb-2 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</h3>
            <p className="text-[10px] text-muted-foreground font-black uppercase leading-relaxed tracking-wider">{desc}</p>
        </button>
    )
}
