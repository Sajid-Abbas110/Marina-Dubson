'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Mail,
    Lock,
    User,
    Globe,
    ArrowRight,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    Building2,
    Phone
} from 'lucide-react'

export default function ClientRegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        email: '',
        password: '',
        role: 'CLIENT'
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
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center mb-10">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl mx-auto mb-8 transform rotate-12">
                        MD
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                        Client <span className="text-blue-500 italic">Enrollment</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Secure Access for Law Firms & Corporations</p>
                </div>

                <div className="glass-panel rounded-[3rem] p-8 md:p-12">
                    {success ? (
                        <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                            <div className="h-24 w-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Account Synchronized</h2>
                            <p className="text-gray-500 font-bold mt-3 uppercase tracking-widest text-[10px]">Redirecting to Secure Gate...</p>
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Personal Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="luxury-input pl-16"
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
                                        className="luxury-input"
                                        placeholder="LAST NAME"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Firm / Entity</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="luxury-input pl-16"
                                            placeholder="LAW FIRM INC."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Secure Link</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="luxury-input pl-16"
                                            placeholder="(555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Credential Set</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="luxury-input pl-16"
                                        placeholder="WORK@FIRM.COM"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="luxury-input pl-16"
                                        placeholder="CREATE SECURE PASSWORD"
                                    />
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tight text-right">AES-256 Vaulted Protection Active</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="luxury-btn w-full py-6 mt-6 shadow-2xl shadow-blue-500/20"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Authorize Enrollment <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Already Registered?{' '}
                        <Link href="/login" className="font-black text-blue-500 hover:text-blue-400 underline decoration-2 underline-offset-8 decoration-blue-500/30 px-2 transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
