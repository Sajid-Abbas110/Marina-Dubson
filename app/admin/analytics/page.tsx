'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LineChart,
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    ChevronDown,
    Zap,
    Users,
    DollarSign,
    Clock,
    Globe,
    FileText,
    ArrowUpRight
} from 'lucide-react'

export default function AdministrativeAnalyticsPage() {
    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Analytics Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Intelligence <span className="text-primary italic">Matrix</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Real-time visualization of stenographic throughput and network efficiency.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Last 30 Days</span>
                        <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        <Download className="h-5 w-5" /> Generate Intelligence Rep.
                    </button>
                </div>
            </div>

            {/* Performance Pulse */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PulseCard label="Network Uptime" value="99.98%" trend="+0.02%" color="text-emerald-500" icon={<Zap />} />
                <PulseCard label="Avg Assignment Vel." value="24.2h" trend="-4.1h" color="text-primary" icon={<Clock />} />
                <PulseCard label="Reporter Utilization" value="82%" trend="+12%" color="text-purple-600" icon={<Users />} />
                <PulseCard label="Market Dominance" value="34.2%" trend="+2.1%" color="text-amber-500" icon={<TrendingUp />} />
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Streams - Large */}
                <div className="lg:col-span-2 glass-panel rounded-[3rem] p-6 lg:p-10 space-y-10 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-600"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">Global Revenue Flux</h3>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Tracking Daily Yield Across All Nodes</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Revenue</span>
                            <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-white/10 ml-4"></div>
                            <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Target</span>
                        </div>
                    </div>

                    <div className="h-[300px] flex items-end justify-between px-2 lg:px-4 pb-8 group-hover:scale-[1.02] transition-transform duration-700 overflow-x-auto scrollbar-hide gap-1 lg:gap-4">
                        <Bar value="45%" label="FEB 10" />
                        <Bar value="78%" label="FEB 11" />
                        <Bar value="56%" label="FEB 12" />
                        <Bar value="89%" active label="FEB 13" />
                        <Bar value="62%" label="FEB 14" />
                        <Bar value="71%" label="FEB 15" />
                        <Bar value="95%" label="FEB 16" />
                    </div>
                </div>

                {/* Regional Allocation - Side */}
                <div className="glass-panel rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 space-y-10">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Node Allocation</h3>
                    <div className="flex flex-col items-center justify-center h-[280px] relative">
                        {/* Circular Simulation */}
                        <div className="h-48 w-48 rounded-full border-[12px] border-gray-50 dark:border-white/5 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-t-transparent -rotate-45"></div>
                            <div className="text-center">
                                <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">64%</p>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">NYC AREA</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <DistributionRow label="New York City" value="64%" color="bg-primary" />
                        <DistributionRow label="Remote Global" value="22%" color="bg-emerald-400" />
                        <DistributionRow label="NJ/CT Node" value="14%" color="bg-gray-200 dark:bg-white/10" />
                    </div>
                </div>
            </div>

            {/* Strategic Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InsightCard title="Stenographic Bottlenecks" content="High demand in Remote Discovery nodes detected during 10:00 AM - 01:00 PM intervals." priority="HIGH" />
                <InsightCard title="Yield Optimization" content="Current per-page average has increased by 12% following the v2.4 protocol rollout." priority="NOMINAL" />
                <InsightCard title="Reporter Retainment" status="94%" content="Network professional satisfaction rating remains in the elite top-tier percentile." priority="EXCEPTIONAL" />
            </div>
        </div>
    )
}

function PulseCard({ label, value, trend, color, icon }: any) {
    return (
        <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.1] transition-opacity group-hover:rotate-12 duration-700`}>
                {icon}
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
            <div className={`text-3xl font-black tracking-tighter uppercase ${color} mb-6`}>{value}</div>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Growth</span>
            </div>
        </div>
    )
}

function Bar({ value, label, active }: any) {
    return (
        <div className="flex flex-col items-center gap-4 h-full">
            <div className="flex-1 w-6 lg:w-8 bg-gray-50 dark:bg-white/5 rounded-full flex items-end overflow-hidden group/bar">
                <div
                    className={`w-full transition-all duration-1000 group-hover/bar:bg-primary/80 ${active ? 'bg-primary' : 'bg-primary/60'}`}
                    style={{ height: value }}
                ></div>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{label}</span>
        </div>
    )
}

function DistributionRow({ label, value, color }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${color}`}></div>
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
            </div>
            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{value}</span>
        </div>
    )
}

function InsightCard({ title, status, content, priority }: any) {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] space-y-6 border border-gray-100 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start">
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight max-w-[150px] leading-tight group-hover:text-primary transition-colors">{title}</h4>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${priority === 'HIGH' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600' :
                    priority === 'EXCEPTIONAL' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' :
                        'bg-primary/10 text-primary'
                    }`}>
                    {priority}
                </div>
            </div>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">{content}</p>
        </div>
    )
}
