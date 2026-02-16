'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Loader2,
    AlertCircle,
    UserCircle2,
    CheckCircle2,
    Sparkles,
    Fingerprint
} from 'lucide-react'

export default function LoginPage() {
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
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col justify-center items-center p-6 font-poppins relative overflow-hidden transition-colors duration-500">
            {/* Cinematic Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full dark-mesh opacity-20 dark:opacity-40"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-soft"></div>

            <div className="w-full max-w-[520px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                {/* Elite Branding */}
                <div className="text-center mb-16 px-4">
                    <Link href="/" className="inline-flex items-center gap-5 p-2 pr-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 mb-10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <span className="block text-lg font-black text-gray-900 dark:text-white tracking-widest uppercase leading-none">MARINA DUBSON</span>
                            <span className="block text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">Intelligence Network</span>
                        </div>
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight uppercase">
                        Protocol <span className="text-blue-500 italic">Access</span>
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 font-bold mt-4 uppercase tracking-[0.3em] text-[9px] max-w-sm mx-auto leading-relaxed">Secure multi-factor gateway for legal professionals and stenographers.</p>
                </div>

                <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl border border-gray-100 dark:border-white/5 rounded-[3.5rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden relative">
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 blur-3xl rounded-full"></div>

                    {error && (
                        <div className="mb-10 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-5 animate-in slide-in-from-top-4 duration-300">
                            <div className="h-12 w-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-rose-500" />
                            </div>
                            <p className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest leading-relaxed flex-1">{error}</p>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-16 animate-in zoom-in-95 duration-500">
                            <div className="h-28 w-28 bg-emerald-500/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
                                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Access Validated</h2>
                            <p className="text-gray-400 font-black mt-4 uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix Nodes...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] ml-4 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> System Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="luxury-input pl-16 py-6"
                                        placeholder="ADMIN@MARINADUBSON.COM"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em] flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div> Private Key
                                    </label>
                                    <Link href="/recovery" className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest border-b-2 border-blue-500/0 hover:border-blue-500/50 transition-all">Request Recovery</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
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
                                className="luxury-btn w-full py-6 mt-10 shadow-3xl shadow-blue-600/20"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Authorize Environment <Sparkles className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Secure Footer */}
                <div className="mt-16 text-center space-y-12 animate-in fade-in duration-1000 delay-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Need Registration?{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-500 underline decoration-2 underline-offset-8 decoration-blue-600/20 px-3 transition-all">
                            Initialize Account
                        </Link>
                    </p>

                    <div className="flex items-center justify-center gap-12 pt-12 border-t border-gray-100 dark:border-white/5 mx-20">
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all">
                                <Fingerprint className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500" />
                            </div>
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.4em]">FIPS-140-2 Validated</span>
                        </div>
                        <div className="flex flex-col items-center gap-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-emerald-600/10 group-hover:border-emerald-500/20 transition-all">
                                <ShieldCheck className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500" />
                            </div>
                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.4em]">SOC2 Type II Sync</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
