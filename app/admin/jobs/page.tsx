'use client'

import { useState } from 'react'
import {
    Briefcase,
    CheckCircle,
    Clock,
    FileText,
    MoreVertical,
    UserCheck,
    Users,
    Search,
    Filter,
    Plus,
    Target,
    Zap,
    ArrowUpRight,
    TrendingUp,
    Shield
} from 'lucide-react'

const jobs = [
    {
        id: 'JOB-8821',
        title: 'Deposition: Apple v. Goldman',
        client: 'Wilson Law Firm',
        reporter: 'Sarah Jenkins',
        status: 'IN_TRANSCRIPTION',
        dueDate: 'FEB 24, 2026',
        priority: 'CRITICAL',
        progress: 68,
        value: '$2,450'
    },
    {
        id: 'JOB-8822',
        title: 'Arbitration: Logistics Corp',
        client: 'P.H. Legal Partners',
        reporter: null,
        status: 'PENDING_ASSIGNMENT',
        dueDate: 'FEB 26, 2026',
        priority: 'HIGH',
        progress: 0,
        value: '$1,800'
    },
    {
        id: 'JOB-8823',
        title: 'Court Proceeding: NY District',
        client: 'State Attorney Office',
        reporter: 'Michael Chen',
        status: 'QUALITY_ASSURANCE',
        dueDate: 'FEB 22, 2026',
        priority: 'NORMAL',
        progress: 92,
        value: '$3,120'
    },
]

export default function AdministrativeJobNexus() {
    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Elite Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                        Protocol <span className="text-primary italic">Inventory</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.5em] mt-3">Monitoring Job Lifecycle & Resource Matrix</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input className="w-full sm:w-64 pl-10 pr-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all dark:text-white" placeholder="IDENTIFY JOB_ID..." />
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto justify-center">
                        <Plus className="h-5 w-5" /> Initiate Job Node
                    </button>
                </div>
            </div>

            {/* Matrix View Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <JobStat label="Active Nodes" value="24" trend="+3 today" icon={<Zap />} color="text-yellow-500" />
                <JobStat label="Unassigned" value="06" trend="Priority alert" icon={<Users />} color="text-rose-500" />
                <JobStat label="QA Pipeline" value="12" trend="8 ready" icon={<Shield />} color="text-primary" />
                <JobStat label="Value Locked" value="$42.5k" trend="+12.4%" icon={<TrendingUp />} color="text-emerald-500" />
            </div>

            {/* Job Board Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Assignment */}
                <SectorColumn title="Intake / Pending" count={1} status="PENDING">
                    <JobOperationalCard job={jobs[1]} />
                </SectorColumn>

                {/* Operations */}
                <SectorColumn title="Operations / Sync" count={1} status="ACTIVE">
                    <JobOperationalCard job={jobs[0]} />
                </SectorColumn>

                {/* Delivery */}
                <SectorColumn title="QA / Delivery" count={1} status="QA">
                    <JobOperationalCard job={jobs[2]} />
                </SectorColumn>
            </div>
        </div>
    )
}

function SectorColumn({ title, count, status, children }: any) {
    const colorClass =
        status === 'PENDING' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
            status === 'ACTIVE' ? 'text-primary bg-primary/10 border-primary/20' :
                'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'

    return (
        <div className="space-y-6">
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${colorClass}`}>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{title}</span>
                <span className="text-[10px] font-black">{count} NODES</span>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    )
}

function JobOperationalCard({ job }: { job: any }) {
    return (
        <div className="glass-panel p-8 rounded-[3rem] group hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden relative border border-gray-100 dark:border-white/5">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-all">
                <Briefcase className="h-16 w-16 text-primary" />
            </div>

            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.id}</span>
                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${job.priority === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' :
                    job.priority === 'HIGH' ? 'bg-amber-500 text-white' :
                        'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                    }`}>
                    {job.priority}
                </div>
            </div>

            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">{job.client}</p>

            {/* Neural Progress */}
            <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                    <span className="text-gray-400">Node Sync</span>
                    <span className="text-primary">{job.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-primary transition-all duration-1000 ${job.progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}`}
                        style={{ height: '100%', width: `${job.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-3">
                    {job.reporter ? (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <UserCheck className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase">{job.reporter}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-600/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-orange-600" />
                            </div>
                            <span className="text-[10px] font-black text-orange-600 uppercase italic">Unassigned</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{job.dueDate}</span>
                </div>
            </div>
        </div>
    )
}

function JobStat({ label, value, trend, icon, color }: any) {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{label}</p>
            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">{value}</div>
            <p className={`text-[9px] font-black uppercase tracking-widest ${trend.includes('Priority') || trend.includes('+') ? 'text-primary' : 'text-gray-400'}`}>{trend}</p>
        </div>
    )
}
