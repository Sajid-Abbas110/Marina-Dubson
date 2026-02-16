'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Briefcase,
    AlertCircle,
    Award,
    FileText,
    Smartphone
} from 'lucide-react'

export default function ReporterRegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        certification: '',
        phone: '',
        email: '',
        password: '',
        role: 'REPORTER'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => router.push('/login'), 2000)
            } else {
                const data = await response.json()
                setError(data.error || 'Identity verification failed.')
            }
        } catch (err) {
            setError('Core network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center p-6 font-poppins relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-full h-full dark-mesh opacity-30"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center mb-10">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl mx-auto mb-8 transform -rotate-6">
                        MD
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                        Reporter <span className="text-emerald-500 italic">Registry</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Elite Stenographic Professionals Only</p>
                </div>

                <div className="glass-panel rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Award className="h-8 w-8 text-emerald-500/20" />
                    </div>

                    {success ? (
                        <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                            <div className="h-24 w-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Access Provisioned</h2>
                            <p className="text-gray-500 font-bold mt-3 uppercase tracking-widest text-[10px]">Onboarding sequence initiated...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <p className="text-xs font-black text-red-400 uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Provider Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="luxury-input pl-16 focus:border-emerald-100 focus:ring-emerald-50/50"
                                            placeholder="FIRST NAME"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-6 md:pt-0">
                                    <label className="hidden md:block text-[10px] font-black text-transparent uppercase tracking-widest ml-2">_</label>
                                    <input
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="luxury-input focus:border-emerald-100 focus:ring-emerald-50/50"
                                        placeholder="LAST NAME"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Primary Certification</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            required
                                            value={formData.certification}
                                            onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                                            className="luxury-input pl-16 focus:border-emerald-100 focus:ring-emerald-50/50"
                                            placeholder="CSR / RPR / CRR"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Quick Contact</label>
                                    <div className="relative group">
                                        <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                        <input
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="luxury-input pl-16 focus:border-emerald-100 focus:ring-emerald-50/50"
                                            placeholder="MOBILE NUMBER"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Identity Credentials</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="luxury-input pl-16 focus:border-emerald-100 focus:ring-emerald-50/50"
                                        placeholder="PROFESSIONAL EMAIL"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="luxury-input pl-16 focus:border-emerald-100 focus:ring-emerald-50/50"
                                        placeholder="SECURE ACCESS KEY"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 mt-6 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95 shadow-2xl shadow-gray-900/10"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Join Professional Registry <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-10 text-center flex flex-col items-center gap-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Already in our records?{' '}
                        <Link href="/login" className="font-black text-emerald-500 hover:text-emerald-400 underline decoration-2 underline-offset-8 decoration-emerald-500/30 px-2 transition-all">
                            Sign In
                        </Link>
                    </p>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Upload Certifications Later</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
