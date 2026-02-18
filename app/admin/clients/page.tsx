'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
    Briefcase
} from 'lucide-react'

export default function ClientsPage() {
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
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
    }

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
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Legal <span className="text-primary italic">Clients</span>
                    </h1>
                    <p className="text-gray-500 font-medium font-poppins">
                        Managing law firms and independent legal counsel registered in the system.
                        {!loading && ` • ${users.length} Registered Clients`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-full sm:w-auto font-poppins">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:min-w-[320px] px-12 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 dark:text-white transition-all"
                            placeholder="Search Client Node..."
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-40">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-primary opacity-50" />
                        </div>
                    </div>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-32 glass-panel rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                    <Building2 className="h-20 w-20 text-gray-200 mx-auto mb-6" />
                    <p className="font-black text-xs uppercase tracking-widest text-gray-400 mb-2">No clients matching your query</p>
                    <p className="text-[10px] text-gray-400">Expand your search parameters or register new client nodes.</p>
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
        <div className="glass-panel group p-8 rounded-[2.5rem] hover:shadow-2xl transition-all relative overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5">
            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-800 flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 duration-500 overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={name} className="h-full w-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[8px] font-black text-primary uppercase tracking-widest border border-primary/20">Client</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{user.company || 'Wilson Law LLC'}</span>
                        </div>
                    </div>
                </div>
                <button className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-gray-500">
                    <Mail className="h-3.5 w-3.5 text-primary/50" />
                    <span className="text-[11px] font-bold truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-primary/50" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Active since {joined}</span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between relative z-10">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-[#001c14] bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                            <Briefcase className="h-3 w-3 text-gray-400" />
                        </div>
                    ))}
                    <div className="h-7 w-7 rounded-full border-2 border-white dark:border-[#001c14] bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary">+4</div>
                </div>
                <button
                    onClick={() => router.push(`/admin/clients/${user.id}`)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[9px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                >
                    View Profile <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
