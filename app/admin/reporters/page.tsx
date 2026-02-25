'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
    Search,
    Link as LinkIcon,
    ArrowRight,
    User,
    Award,
    Calendar,
    Mail,
    Phone,
    Plus,
    Loader2,
    MoreHorizontal,
    ShieldCheck,
    Zap,
    Briefcase
} from 'lucide-react'

interface Reporter {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    avatar?: string | null;
    certification?: string | null;
}

export default function ReportersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<Reporter[]>([])
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
            const reporters = (data.users || []).filter((u: any) => u.role === 'REPORTER')
            setUsers(reporters)
        } catch (error) {
            console.error('Failed to fetch reporters:', error)
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const filteredUsers = useMemo(() => {
        const reporters = users || []
        if (!searchQuery) return reporters
        const query = searchQuery.toLowerCase()
        return reporters.filter(u =>
            u.firstName?.toLowerCase().includes(query) ||
            u.lastName?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query)
        )
    }, [users, searchQuery])

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-foreground tracking-tight uppercase leading-none">
                        Master <span className="brand-gradient italic">Stenographers</span>
                    </h1>
                    <p className="text-muted-foreground font-medium font-poppins text-[9px] tracking-[0.3em] uppercase">
                        Highly certified court reporters and digital specialists in the MD Elite network.
                        {!loading && <span className="text-primary ml-2 italic"> • {users.length} Certified Reporters</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group w-full sm:w-auto font-poppins">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:min-w-[300px] pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-[9px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 text-foreground transition-all"
                            placeholder="Search Professional RSR..."
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-40">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Award className="h-8 w-8 text-primary opacity-50" />
                        </div>
                    </div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-32 glass-panel rounded-[3rem] border border-border">
                    <User className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-2">No professionals found</p>
                    <p className="text-[10px] text-muted-foreground/60">Broaden your search criteria or register new stenography assets.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredUsers.map(user => (
                        <ReporterCard key={user.id} user={user} />
                    ))}
                </div>
            )}
        </div>
    )
}

function ReporterCard({ user }: { user: Reporter }) {
    const router = useRouter()
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    const initials = (user.firstName?.[0] || user.email[0]).toUpperCase() + (user.lastName?.[0] || '').toUpperCase()
    const joined = format(new Date(user.createdAt), 'MMM yyyy').toUpperCase()
    const avatarSrc = user.avatar || '/favicon.svg'

    return (
        <div className="glass-panel group p-6 rounded-[2rem] hover:shadow-2xl transition-all relative overflow-hidden bg-card border border-border">
            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-indigo-800 flex items-center justify-center text-primary-foreground font-black text-sm shadow-md transition-transform group-hover:scale-110 duration-500 overflow-hidden relative">
                        {user.avatar ? (
                            <img
                                src={avatarSrc}
                                alt={name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/favicon.svg'
                                }}
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-tight line-clamp-1">{name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-[6px] font-black text-primary uppercase tracking-widest border border-primary/20">Reporter</span>
                            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">{user.certification || 'CSR-RPR'}</span>
                        </div>
                    </div>
                </div>
                <button className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                    <MoreHorizontal className="h-3 w-3" />
                </button>
            </div>

            <div className="mt-4 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Mail className="h-2.5 w-2.5 text-primary/50" />
                        <span className="text-[8px] font-bold truncate max-w-[120px] line-clamp-1">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10">
                        <ShieldCheck className="h-2 w-2 text-indigo-600" />
                        <span className="text-[5px] font-black text-indigo-600 uppercase tracking-widest">Verified</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-2.5 w-2.5 text-primary/50" />
                    <span className="text-[8px] font-bold uppercase tracking-tight">Active since {joined}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                    <span className="text-[6px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Load Balance</span>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/3 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-[8px] font-black text-foreground">Low</span>
                    </div>
                </div>
                <button
                    onClick={() => router.push(`/admin/reporters/${user.id}`)}
                    className="luxury-button flex items-center gap-1.5 px-3 py-2 text-[7px]"
                >
                    History <ArrowRight className="h-2.5 w-2.5" />
                </button>
            </div>
        </div>
    )
}
