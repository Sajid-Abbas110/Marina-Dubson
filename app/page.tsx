'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Fingerprint,
    Scale,
    Gavel,
    Shield,
    Globe
} from 'lucide-react'

export default function LoginPortal() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))

                setTimeout(() => {
                    if (data.user.role === 'ADMIN') router.push('/admin/dashboard')
                    else if (data.user.role === 'REPORTER') router.push('/reporter/portal')
                    else router.push('/client/portal')
                }, 1000)
            } else {
                setError(data.error || 'Authentication sequence failed.')
            }
        } catch (err) {
            setError('System core unreachable. Check link integrity.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#00120d] flex overflow-hidden font-poppins">
            {/* Left Side: Stunning Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <img
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2070"
                    alt="Courtroom"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply scale-110 hover:scale-100 transition-transform duration-[10s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="relative z-10 p-20 flex flex-col justify-between w-full">
                    <div className="flex items-center gap-4 group">
                        <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                            <Scale className="h-8 w-8" />
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-white tracking-widest uppercase">MARINA DUBSON</span>
                            <span className="block text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mt-1 text-primary-foreground/80">Intelligence Network</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                            <Sparkles className="h-4 w-4 text-indigo-400" /> Advanced Legal Ecosystem
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter leading-tight uppercase">
                            Elite <span className="text-indigo-400 italic block">Stenography</span> Solutions
                        </h1>
                        <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed">
                            Securing the future of legal records through precision, speed, and military-grade encryption.
                        </p>
                    </div>

                    <div className="flex items-center gap-12 border-t border-white/10 pt-10">
                        <StatItem icon={<Shield className="h-4 w-4" />} label="Encrypted" />
                        <StatItem icon={<Globe className="h-4 w-4" />} label="Global" />
                        <StatItem icon={<Fingerprint className="h-4 w-4" />} label="Biometric" />
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 right-10 w-40 h-40 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 left-10 w-60 h-60 bg-primary/20 blur-[120px] rounded-full animate-pulse-soft"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative bg-[#00120d] lg:bg-transparent">
                {/* Mobile Background (Courtroom image background for mobile) */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2070"
                        alt="Courtroom"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-[#00120d]/80"></div>
                </div>

                <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-right-10 duration-1000">
                    <div className="lg:hidden text-center mb-10">
                        <div className="h-16 w-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl mb-4">
                            <Scale className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-widest uppercase">MARINA DUBSON</h2>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                            System <span className="text-primary italic">Access</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] leading-relaxed">
                            Authorized personnel only. Encrypted multi-factor gateway active.
                        </p>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]">
                        {error && (
                            <div className="mb-8 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                                <AlertCircle className="h-5 w-5 text-rose-500" />
                                <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest flex-1">{error}</p>
                            </div>
                        )}

                        {success ? (
                            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                                <div className="h-24 w-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                                    <CheckCircle2 className="h-12 w-12 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Access Validated</h3>
                                <p className="text-gray-400 font-black mt-3 uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix Nodes...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] ml-2 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div> Registry Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="luxury-input pl-16 py-6"
                                            placeholder="OFFICE@MARINADUBSON.COM"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div> Private Key
                                        </label>
                                        <Link href="/recovery" className="text-[9px] font-black text-primary hover:text-indigo-400 uppercase tracking-widest transition-all">Recover</Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="luxury-input pl-16 py-6"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="luxury-btn w-full py-6 mt-6 shadow-2xl shadow-primary/20 bg-primary hover:bg-indigo-600"
                                >
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            Authorize Portal <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-12 text-center space-y-8 animate-in fade-in duration-1000 delay-500">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            New to the Network?{' '}
                            <Link href="/register" className="text-primary hover:text-indigo-400 underline underline-offset-8 decoration-2 decoration-primary/20 px-2 transition-all">
                                Initialize Account
                            </Link>
                        </p>

                        <div className="flex items-center justify-center gap-10 pt-8 border-t border-gray-100 dark:border-white/5 opacity-40">
                            <div className="flex flex-col items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-gray-400" />
                                <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">AES-256</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Gavel className="h-5 w-5 text-gray-400" />
                                <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                {icon}
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
        </div>
    )
}
