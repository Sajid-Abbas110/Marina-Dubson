'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search,
    Link as LinkIcon,
    ArrowRight,
    User,
    Briefcase,
    CheckCircle,
    ShieldCheck,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Globe,
    Building2,
    Calendar,
    Zap
} from 'lucide-react'

export default function UserDirectoryPage() {
    const [filter, setFilter] = useState('ALL')

    const users = [
        { id: 'USR-001', name: 'James Wilson', role: 'CLIENT', company: 'Wilson Law LLC', email: 'j.wilson@wilsonlaw.com', status: 'ACTIVE', assignments: 12, joined: 'JAN 2026' },
        { id: 'USR-002', name: 'Sarah Jenkins', role: 'REPORTER', certification: 'CSR-9921', email: 'sarah.j@steno.net', status: 'ONLINE', assignments: 45, joined: 'DEC 2025' },
        { id: 'USR-003', name: 'Harvey Specter', role: 'CLIENT', company: 'Pearson Hardman', email: 'harvey@pearson.com', status: 'ACTIVE', assignments: 8, joined: 'FEB 2026' },
        { id: 'USR-004', name: 'Michael Chen', role: 'REPORTER', certification: 'RPR-1022', email: 'm.chen@legalrep.com', status: 'BUSY', assignments: 22, joined: 'JAN 2026' }
    ]

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Directorty Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Network <span className="text-primary italic">Directory</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Verifying and Managing connections within the MD Elite Professional Registry.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input className="px-12 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 min-w-[320px] dark:text-white" placeholder="Global Member Search..." />
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        <User className="h-4 w-4" /> Add Member
                    </button>
                </div>
            </div>

            {/* Role Matrix Filters */}
            <div className="flex items-center gap-4">
                <button onClick={() => setFilter('ALL')} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white dark:bg-white/5 text-gray-400 hover:text-gray-900 border border-gray-100 dark:border-white/10'}`}>All Personnel</button>
                <button onClick={() => setFilter('CLIENT')} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'CLIENT' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white dark:bg-white/5 text-gray-400 hover:text-gray-900 border border-gray-100 dark:border-white/10'}`}>Legal Clients</button>
                <button onClick={() => setFilter('REPORTER')} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === 'REPORTER' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-white dark:bg-white/5 text-gray-400 hover:text-gray-900 border border-gray-100 dark:border-white/10'}`}>Stenographers</button>
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {users.filter(u => filter === 'ALL' || u.role === filter).map(user => (
                    <div key={user.id} className="glass-panel group p-8 rounded-[2.5rem] hover:shadow-2xl transition-all relative overflow-hidden border border-gray-100 dark:border-white/5">
                        {/* Role Indicator Ornament */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 ${user.role === 'CLIENT' ? 'bg-primary' : 'bg-emerald-600'}`}></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className={`h-20 w-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl transition-transform group-hover:scale-110 duration-500 ${user.role === 'CLIENT' ? 'bg-gradient-to-br from-primary to-emerald-800' : 'bg-gradient-to-br from-emerald-500 to-teal-700'}`}>
                                    {user.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${user.role === 'CLIENT' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{user.role}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="h-3 w-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{user.company || user.certification}</span>
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Since {user.joined}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Global ID</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{user.id}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Assignments</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{user.assignments} Processed</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 dark:border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex gap-4">
                                <Link href="/admin/messages" className="h-10 w-10 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                                    <Mail className="h-4 w-4" />
                                </Link>
                                <button className="h-10 w-10 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all">
                                    <LinkIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <button className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${user.role === 'CLIENT' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20'}`}>
                                Link Network <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Directory Insights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DirectoryStat label="Verification Rate" value="100%" icon={<ShieldCheck className="text-emerald-500" />} />
                <DirectoryStat label="Avg Lead Time" value="2.4h" icon={<Zap className="text-yellow-500" />} />
                <DirectoryStat label="Regional Nodes" value="NY/NJ/CT" icon={<Globe className="text-blue-500" />} />
                <DirectoryStat label="Active Streams" value="12" icon={<ArrowRight className="text-purple-500" />} />
            </div>
        </div>
    )
}

function DirectoryStat({ label, value, icon }: any) {
    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 flex flex-col items-center text-center group hover:shadow-xl transition-all">
            <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black text-gray-900 dark:text-white uppercase">{value}</p>
        </div>
    )
}
