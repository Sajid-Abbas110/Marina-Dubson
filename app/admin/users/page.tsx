'use client'

import { useCallback, useEffect, useState } from 'react'
import {
    Loader2,
    Search,
    UserPlus,
    ShieldCheck,
    Users,
} from 'lucide-react'

const ROLE_FILTERS = ['All Roles', 'CLIENT', 'AGENCY', 'REPORTER', 'STAFF', 'MANAGER', 'ADMIN']
const CLIENT_TYPE_FILTERS = ['All Clients', 'PRIVATE', 'AGENCY']
const ADMIN_ROLE_OPTIONS = ['CLIENT', 'AGENCY', 'REPORTER', 'STAFF', 'MANAGER', 'ADMIN']

const DEFAULT_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: 'CLIENT',
    clientType: 'PRIVATE',
    password: '',
}

type FormState = typeof DEFAULT_FORM

export default function AdminUserRegistryPage() {
    const [users, setUsers] = useState<any[]>([])
    const [filters, setFilters] = useState({
        role: 'All Roles',
        clientType: 'All Clients',
        search: ''
    })
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM })
    const [statusHint, setStatusHint] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [tempPassword, setTempPassword] = useState<string | null>(null)

    const showClientTypeSelect = form.role === 'CLIENT' || form.role === 'AGENCY'

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true)
        setErrorMessage('')
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }
            const query = new URLSearchParams()
            if (filters.role !== 'All Roles') query.set('role', filters.role)
            if (filters.clientType !== 'All Clients') query.set('clientType', filters.clientType)
            if (filters.search.trim()) query.set('search', filters.search.trim())

            const resp = await fetch(`/api/admin/users?${query.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!resp.ok) {
                if (resp.status === 401) {
                    window.location.href = '/login'
                    return
                }
                const body = await resp.json().catch(() => null)
                throw new Error(body?.error || 'Unable to load user directory.')
            }

            const data = await resp.json()
            setUsers(Array.isArray(data.users) ? data.users : [])
        } catch (error: any) {
            console.error('User fetch failure:', error)
            setErrorMessage(error.message || 'Unable to load user directory.')
        } finally {
            setLoadingUsers(false)
        }
    }, [filters.role, filters.clientType, filters.search])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleFormChange = (field: keyof FormState, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }))
        setStatusHint('')
        setTempPassword(null)
    }

    const handleRoleChange = (value: string) => {
        setForm(prev => ({
            ...prev,
            role: value,
            clientType: value === 'AGENCY' ? 'AGENCY' : prev.clientType || 'PRIVATE'
        }))
        setStatusHint('')
        setTempPassword(null)
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setCreating(true)
        setErrorMessage('')
        setStatusHint('')
        setTempPassword(null)

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            const payload: Record<string, unknown> = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                role: form.role,
                company: form.company.trim() || undefined,
                password: form.password.trim() || undefined,
            }

            if (showClientTypeSelect) {
                payload.clientType = form.clientType
            }

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login'
                    return
                }
                const body = await response.json().catch(() => null)
                throw new Error(body?.error || 'Failed to create account.')
            }

            const data = await response.json()
            setStatusHint(`${data.user.firstName} ${data.user.lastName} added as ${data.user.role}.`)
            if (data.temporaryPassword) {
                setTempPassword(data.temporaryPassword)
            }
            setForm({ ...DEFAULT_FORM })
            fetchUsers()
        } catch (error: any) {
            console.error('Create user failed:', error)
            setErrorMessage(error.message || 'Unable to create this account.')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 lg:px-10 space-y-8">
            <header className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">CRM Command Center</p>
                <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-primary" /> Account Management
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                    Provision reporters, clients, agencies, and staff from one stable surface. Use the filters to find existing accounts, then spin up a new user with the correct role and client type.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px),1fr]">
                <section className="space-y-6 p-6 bg-card border border-border rounded-[2rem] shadow-lg shadow-primary/10">
                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.4em] text-primary">
                        <UserPlus className="h-5 w-5" />
                        <span>Create Account</span>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                value={form.firstName}
                                onChange={(e) => handleFormChange('firstName', e.target.value)}
                                placeholder="First Name"
                                required
                                className="luxury-input"
                            />
                            <input
                                value={form.lastName}
                                onChange={(e) => handleFormChange('lastName', e.target.value)}
                                placeholder="Last Name"
                                required
                                className="luxury-input"
                            />
                        </div>

                        <input
                            value={form.email}
                            onChange={(e) => handleFormChange('email', e.target.value)}
                            placeholder="Email"
                            type="email"
                            required
                            className="luxury-input"
                        />

                        <input
                            value={form.company}
                            onChange={(e) => handleFormChange('company', e.target.value)}
                            placeholder="Company"
                            className="luxury-input"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <select
                                value={form.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="luxury-input"
                            >
                                {ADMIN_ROLE_OPTIONS.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>

                            {showClientTypeSelect ? (
                                <select
                                    value={form.clientType}
                                    onChange={(e) => handleFormChange('clientType', e.target.value)}
                                    className="luxury-input"
                                >
                                    <option value="PRIVATE">Private Client</option>
                                    <option value="AGENCY">Agency Client</option>
                                </select>
                            ) : (
                                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground py-3 px-4 rounded-xl border border-border bg-muted/50 text-center">
                                    Role does not require client type
                                </div>
                            )}
                        </div>

                        <input
                            value={form.password}
                            onChange={(e) => handleFormChange('password', e.target.value)}
                            type="password"
                            placeholder="Set temporary password (leave blank to auto-generate)"
                            className="luxury-input"
                        />

                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Passwords auto-generate when blank. Share the generated string if you want to self-manage onboarding.</p>

                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Provision Account'}
                        </button>

                        {statusHint && (
                            <p className="text-sm text-emerald-500 font-semibold">{statusHint}</p>
                        )}

                        {tempPassword && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700">
                                Temporary password: <span className="font-semibold">{tempPassword}</span>
                            </div>
                        )}

                        {errorMessage && (
                            <p className="text-sm text-red-500 font-semibold">{errorMessage}</p>
                        )}
                    </form>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Directory</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-muted/50">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <input
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    placeholder="Search by name or email"
                                    className="bg-transparent text-sm focus:outline-none"
                                />
                            </div>
                            <select
                                value={filters.role}
                                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                                className="luxury-input min-w-[150px]"
                            >
                                {ROLE_FILTERS.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <select
                                value={filters.clientType}
                                onChange={(e) => setFilters(prev => ({ ...prev, clientType: e.target.value }))}
                                className="luxury-input min-w-[150px]"
                            >
                                {CLIENT_TYPE_FILTERS.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-hidden border border-border rounded-[2rem] bg-card">
                        <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                            <span>User</span>
                            <div className="flex items-center gap-6">
                                <span>Role</span>
                                <span>Client Type</span>
                                <span>Company</span>
                                <span>Date</span>
                            </div>
                        </div>

                        {loadingUsers ? (
                            <div className="flex items-center justify-center p-10">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No accounts match the current filters.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {users.map(user => (
                                    <div key={user.id} className="flex flex-col gap-3 px-5 py-4 border-b last:border-b-0 border-border bg-background/50">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-black text-foreground">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em]">
                                                <span>{user.role}</span>
                                                <span>{user.contact?.clientType || '—'}</span>
                                                <span>{user.contact?.companyName || user.company || '—'}</span>
                                                <span>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
