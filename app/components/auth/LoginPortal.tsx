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
    Scale,
    Eye,
    EyeOff,
    FileText,
    Gavel,
    Award
} from 'lucide-react'

export default function LoginPortal() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    // On mount: restore remembered email, check if already logged in
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        const rememberedFlag = localStorage.getItem('rememberMe')
        if (rememberedEmail && rememberedFlag === 'true') {
            setEmail(rememberedEmail)
            setRememberMe(true)
        }
        // Auto-redirect if token already exists
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr)
                if (user.role === 'ADMIN') router.replace('/admin/dashboard')
                else if (user.role === 'REPORTER') router.replace('/reporter/portal')
                else if (user.role === 'STAFF') router.replace('/staff/portal')
                else router.replace('/client/portal')
            } catch {
                // invalid stored user, stay on login
            }
        }
    }, [router])

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

                // Handle Remember Me
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email)
                    localStorage.setItem('rememberMe', 'true')
                } else {
                    localStorage.removeItem('rememberedEmail')
                    localStorage.setItem('rememberMe', 'false')
                }

                setTimeout(() => {
                    if (data.user.role === 'ADMIN') router.push('/admin/dashboard')
                    else if (data.user.role === 'REPORTER') router.push('/reporter/portal')
                    else if (data.user.role === 'STAFF') router.push('/staff/portal')
                    else router.push('/client/portal')
                }, 1000)
            } else {
                setError(data.error || 'Invalid email or password. Please try again.')
            }
        } catch (err) {
            setError('Unable to connect. Please check your internet connection.')
        } finally {
            setLoading(false)
        }
    }

    const features = [
        { icon: <FileText className="h-5 w-5" />, title: 'Booking Management', desc: 'Schedule and track all court reporting sessions in one place.' },
        { icon: <Gavel className="h-5 w-5" />, title: 'Documents Vault', desc: 'Securely access and manage all uploaded case documents and transcripts.' },
    ]

    return (
        <div className="min-h-screen flex">
            {/* ── Left Panel ── */}
            <div
                className="hidden lg:flex lg:w-[52%] xl:w-1/2 relative flex-col justify-between p-14 overflow-hidden"
                style={{ background: 'hsl(210 45% 17%)' }}
            >
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                        backgroundSize: '18px 18px'
                    }}
                />

                {/* Soft glow */}
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[120px] opacity-20"
                    style={{ background: 'hsl(38 80% 55%)' }} />
                <div className="absolute top-10 right-10 w-60 h-60 rounded-full blur-[100px] opacity-10"
                    style={{ background: 'hsl(210 65% 60%)' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ background: 'hsl(38 80% 55%)' }}>
                        <Scale className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg leading-tight">
                            Marina Dubson
                        </p>
                        <p className="text-sm" style={{ color: 'hsl(210 20% 65%)' }}>
                            Stenographic Services, LLC
                        </p>
                    </div>
                </div>

                {/* Hero text */}
                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl xl:text-5xl text-white leading-tight">
                        Legal precision,<br />
                        <span style={{ color: 'hsl(38 80% 65%)' }}>delivered with care.</span>
                    </h1>
                    <p className="text-base leading-relaxed max-w-md" style={{ color: 'hsl(210 15% 72%)' }}>
                        Your central hub for booking court reporters, managing transcripts, and coordinating every detail of your legal proceedings.
                    </p>

                    <div className="pt-4 space-y-4">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl"
                                style={{ background: 'hsl(210 40% 22%)' }}>
                                <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'hsl(38 80% 55% / 0.2)', color: 'hsl(38 80% 65%)' }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{f.title}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'hsl(210 15% 65%)' }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer note */}
                <div className="relative z-10 flex items-center gap-2" style={{ color: 'hsl(210 15% 55%)' }}>
                    <ShieldCheck className="h-4 w-4" />
                    <p className="text-xs">256-bit encrypted · GDPR compliant · SOC 2 ready</p>
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-background">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-3 mb-10">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                        style={{ background: 'hsl(210 45% 17%)' }}>
                        <Scale className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-foreground">
                        Marina Dubson Stenographic
                    </p>
                </div>

                <div className="max-w-md w-full mx-auto animate-fade-in">
                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-3xl text-foreground mb-2">
                            Welcome back
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Sign in to access your portal
                        </p>
                    </div>


                    {/* Error alert */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in"
                            style={{ background: 'hsl(0 70% 55% / 0.08)', border: '1px solid hsl(0 70% 55% / 0.2)' }}>
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
                            <p className="text-sm text-destructive leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Success state */}
                    {success ? (
                        <div className="py-12 text-center animate-fade-in">
                            <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'hsl(145 55% 40% / 0.1)', border: '2px solid hsl(145 55% 40% / 0.3)' }}>
                                <CheckCircle2 className="h-10 w-10" style={{ color: 'hsl(145 55% 40%)' }} />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Signed in successfully</h3>
                            <p className="text-sm text-muted-foreground">Redirecting you to your portal…</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="form-label">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input pl-10"
                                        placeholder="email@marinadubson.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="form-label mb-0">Password</label>
                                    <Link href="/recovery" className="text-xs font-medium hover:underline"
                                        style={{ color: 'hsl(var(--primary))' }}>
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input pl-10 pr-10"
                                        placeholder="Your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-3 py-1">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    id="remember-me-toggle"
                                    className={`relative h-5 w-5 rounded flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 ${rememberMe
                                        ? 'bg-primary border-primary'
                                        : 'bg-transparent border-border hover:border-primary/50'
                                        }`}
                                    aria-checked={rememberMe}
                                    role="checkbox"
                                >
                                    {rememberMe && (
                                        <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                                <label
                                    htmlFor="remember-me-toggle"
                                    className="text-sm text-muted-foreground cursor-pointer select-none"
                                    onClick={() => setRememberMe(!rememberMe)}
                                >
                                    Remember my email on this device
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full justify-center py-3 mt-2"
                                style={{ fontSize: '0.9rem' }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Register link */}
                    {!success && (
                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-semibold hover:underline"
                                style={{ color: 'hsl(var(--primary))' }}>
                                Request access
                            </Link>
                        </p>
                    )}
                </div>

                {/* Bottom trust bar */}
                <div className="mt-auto pt-10 mx-auto max-w-md w-full">
                    <p className="text-xs text-center text-muted-foreground">
                        Protected by enterprise-grade security · Privacy Policy · Terms of Service
                    </p>
                </div>
            </div>
        </div>
    )
}
