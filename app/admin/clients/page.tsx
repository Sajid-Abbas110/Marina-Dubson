'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import {
    Search,
    Link as LinkIcon,
    ArrowRight,
    User,
    Building2,
    Calendar,
    Mail,
    Phone,
    Plus,
    Loader2,
    MoreHorizontal,
    ShieldCheck,
    Zap,
    Globe,
    Briefcase,
    Activity
} from 'lucide-react'

export default function ClientsPage() {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }

            const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!res.ok) throw new Error('Failed to fetch users')

            const data = await res.json()
            const clients = (data.users || []).filter((u: any) => u.role === 'CLIENT')
            setUsers(clients)
        } catch (error) {
            console.error('Failed to fetch clients:', error)
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const filteredUsers = users.filter(u => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            u.firstName?.toLowerCase().includes(query) ||
            u.lastName?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query)
        )
    })

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700 font-poppins">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase leading-none">
                        Legal <span className="brand-gradient italic">Clients</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.4em]">
                        Managing law firms and independent legal counsel registered in the system.
                        {!loading && <span className="text-primary ml-2 italic"> • {users.length} Registered Clusters</span>}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-full sm:w-auto font-poppins">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:min-w-[400px] pl-14 pr-6 py-5 rounded-2xl bg-card border border-border text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10 text-foreground transition-all"
                            placeholder="DECODE CLIENT_NODE OR EMAIL..."
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-8">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full border-t-4 border-b-4 border-primary animate-spin shadow-[0_0_20px_rgba(var(--primary),0.3)]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="h-10 w-10 text-primary animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse">Scanning Network Nodes...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-32 glass-panel rounded-[3rem] border-2 border-dashed border-border bg-card shadow-2xl">
                    <Building2 className="h-20 w-20 text-muted/20 mx-auto mb-8" />
                    <p className="font-black text-sm uppercase tracking-[0.3em] text-foreground mb-3">No active nodes matching query</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expand your search parameters or register new client clusters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredUsers.map(user => (
                        <ClientCard key={user.id} user={user} />
                    ))}
                </div>
            )}
        </div>
    )
}

function ClientCard({ user }: { user: any }) {
    const router = useRouter()
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    const initials = (user.firstName?.[0] || user.email[0]).toUpperCase() + (user.lastName?.[0] || '').toUpperCase()
    const joined = format(new Date(user.createdAt), 'MMM yyyy').toUpperCase()

    return (
        <div className="glass-panel group p-10 rounded-[3rem] hover:shadow-3xl transition-all relative overflow-hidden border border-border bg-card shadow-xl hover:translate-y-[-4px] duration-500">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                <Building2 className="h-40 w-40 text-primary" />
            </div>

            <div className="flex items-start justify-between relative z-10 mb-10">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-black text-2xl shadow-2xl transition-all group-hover:rotate-6 duration-500 overflow-hidden border border-primary/20">
                        {user.avatar ? (
                            <Image src={user.avatar} alt={name} fill className="object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-primary/10 text-[9px] font-black text-primary uppercase tracking-[0.2em] border border-primary/20">Client</span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate max-w-[120px]">{user.company || 'Wilson Law LLC'}</span>
                        </div>
                    </div>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:bg-card hover:shadow-lg">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-4 text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border group-hover:border-primary/10 transition-all">
                    <div className="h-8 w-8 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                        <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground bg-muted/30 p-4 rounded-2xl border border-border group-hover:border-primary/10 transition-all">
                    <div className="h-8 w-8 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                        <Calendar className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Active since {joined}</span>
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border flex items-center justify-between relative z-10">
                <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 w-10 rounded-full border-4 border-card bg-muted flex items-center justify-center shadow-md">
                            <Briefcase className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-4 border-card bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary shadow-md">+4</div>
                </div>
                <button
                    onClick={() => router.push(`/admin/clients/${user.id}`)}
                    className="luxury-button flex items-center gap-3 px-8 py-3.5 shadow-2xl"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">View Profile</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}
