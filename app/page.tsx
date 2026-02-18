'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="min-h-screen bg-background flex overflow-hidden font-poppins">
            {/* Left Side: Stunning Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <Image
                    src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2070"
                    alt="Courtroom"
                    fill
                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-110 hover:scale-100 transition-transform duration-[10s] ease-out"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                <div className="relative z-10 p-20 flex flex-col justify-between w-full">
                    <div className="flex items-center gap-4 group">
                        <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                            <Scale className="h-8 w-8" />
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-white tracking-widest uppercase">MARINA DUBSON</span>
                            <span className="block text-xs font-black text-primary-foreground/70 uppercase tracking-[0.4em] mt-1">Intelligence Network</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em]">
                            <Sparkles className="h-4 w-4" /> Advanced Legal Ecosystem
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter leading-tight uppercase">
                            Elite <span className="text-primary-foreground italic block opacity-80">Stenography</span> Solutions
                        </h1>
                        <p className="text-xl text-primary-foreground/80 font-medium max-w-lg leading-relaxed">
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
                <div className="absolute top-1/4 right-10 w-40 h-40 bg-white/10 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 left-10 w-60 h-60 bg-white/5 blur-[120px] rounded-full animate-pulse-soft"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative bg-background">
                {/* Mobile Background */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2070"
                        alt="Courtroom"
                        fill
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-background/90"></div>
                </div>

                <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-right-10 duration-1000">
                    <div className="lg:hidden text-center mb-10">
                        <div className="h-16 w-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl mb-4 text-white">
                            <Scale className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground tracking-widest uppercase">MARINA DUBSON</h2>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                            System <span className="text-primary italic">Access</span>
                        </h2>
                        <p className="text-muted-foreground font-bold mt-4 uppercase tracking-[0.3em] text-[10px] leading-relaxed">
                            Authorized personnel only. Encrypted multi-factor gateway active.
                        </p>
                    </div>

                    <div className="glass-panel rounded-[3rem] p-10 md:p-12 shadow-2xl">
                        {error && (
                            <div className="mb-8 p-5 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                <p className="text-[10px] font-black text-destructive uppercase tracking-widest flex-1">{error}</p>
                            </div>
                        )}

                        {success ? (
                            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                                <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/20">
                                    <CheckCircle2 className="h-12 w-12 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Access Validated</h3>
                                <p className="text-muted-foreground font-black mt-3 uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix Nodes...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] ml-2 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div> Registry Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-muted/50 backdrop-blur-sm border border-border focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 rounded-xl pl-16 pr-5 py-6 outline-none transition-all duration-300 font-medium text-foreground placeholder:text-muted-foreground placeholder:font-bold placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
                                            placeholder="OFFICE@MARINADUBSON.COM"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></div> Private Key
                                        </label>
                                        <Link href="/recovery" className="text-[9px] font-black text-primary hover:opacity-80 uppercase tracking-widest transition-all">Recover</Link>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-muted/50 backdrop-blur-sm border border-border focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 rounded-xl pl-16 pr-5 py-6 outline-none transition-all duration-300 font-medium text-foreground placeholder:text-muted-foreground placeholder:font-bold placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="luxury-button w-full py-6 mt-6 shadow-2xl shadow-primary/20"
                                >
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    ) : (
                                        <span className="flex items-center justify-center gap-3">
                                            Authorize Portal <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-12 text-center space-y-8 animate-in fade-in duration-1000 delay-500">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            New to the Network?{' '}
                            <Link href="/register" className="text-primary hover:opacity-80 underline underline-offset-8 decoration-2 decoration-primary/20 px-2 transition-all">
                                Initialize Account
                            </Link>
                        </p>

                        <div className="flex items-center justify-center gap-10 pt-8 border-t border-border opacity-60">
                            <div className="flex flex-col items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">AES-256</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Gavel className="h-5 w-5 text-muted-foreground" />
                                <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Certified</span>
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
