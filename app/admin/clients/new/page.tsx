'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Phone, User, Building2, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function AdminNewClientPage() {
    const router = useRouter()
    const params = useSearchParams()
    const defaultType = params.get('type') === 'AGENCY' ? 'AGENCY' : 'PRIVATE'
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        clientType: defaultType as 'PRIVATE' | 'AGENCY',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || 'Failed to create client')
            }
            setSuccess(true)
            setTimeout(() => router.push(form.clientType === 'AGENCY' ? '/admin/clients/agency' : '/admin/clients'), 900)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto w-full px-6 py-12 space-y-10">
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Client Registry</p>
                <h1 className="text-3xl font-black uppercase tracking-tight">Add {form.clientType === 'AGENCY' ? 'Agency' : 'Private'} Client</h1>
                <p className="text-sm text-muted-foreground">Create a client profile and linked user account with portal access.</p>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm font-semibold">{error}</span>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">Client created. Redirecting...</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-[2rem] space-y-6 border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="First Name" icon={<User />} value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} required />
                    <Field label="Last Name" icon={<User />} value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} required />
                    <Field label="Email" icon={<Mail />} value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" required />
                    <Field label="Phone" icon={<Phone />} value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                    <Field label="Company (optional)" icon={<Building2 />} value={form.companyName} onChange={v => setForm({ ...form, companyName: v })} />
                    <Field label="Password (optional)" icon={<ShieldCheck />} value={form.password} onChange={v => setForm({ ...form, password: v })} type="password" placeholder="Auto-generate if blank" />
                </div>

                <div className="flex gap-3">
                    {(['PRIVATE', 'AGENCY'] as const).map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setForm({ ...form, clientType: type })}
                            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${form.clientType === type ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
                        >
                            {type === 'PRIVATE' ? 'Private Client' : 'Agency Client'}
                        </button>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="luxury-button w-full py-4 text-center disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Client'}
                </button>
            </form>
        </div>
    )
}

function Field({ label, icon, value, onChange, type = 'text', required = false, placeholder }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>
        </div>
    )
}
