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
                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase leading-none">
                        Intelligence <span className="brand-gradient italic">Matrix</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.4em]">Real-time visualization of stenographic throughput and network efficiency.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-card border border-border shadow-sm group hover:border-primary/50 transition-all cursor-pointer">
                        <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Last 30 Days</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                    <button className="luxury-button flex items-center gap-3 px-10 py-4">
                        <Download className="h-5 w-5" />
                        <span className="uppercase tracking-widest text-[10px] font-black">Generate Intelligence Report</span>
                    </button>
                </div>
            </div>

            {/* Performance Pulse */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <PulseCard label="Network Uptime" value="99.98%" trend="+0.02%" color="text-emerald-500" icon={<Zap />} />
                <PulseCard label="Avg Assignment Vel." value="24.2h" trend="-4.1h" color="text-primary" icon={<Clock />} />
                <PulseCard label="Reporter Utilization" value="82%" trend="+12%" color="text-primary" icon={<Users />} />
                <PulseCard label="Market Dominance" value="34.2%" trend="+2.1%" color="text-primary" icon={<TrendingUp />} />
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Streams - Large */}
                <div className="lg:col-span-2 glass-panel rounded-[3rem] p-10 space-y-10 bg-card border border-border relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Global Revenue Flux</h3>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tracking Daily Yield Across All Nodes</p>
                        </div>
                        <div className="flex items-center gap-4 bg-muted/30 px-5 py-2.5 rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                                <span className="text-[9px] font-black text-foreground uppercase tracking-[0.2em]">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-muted border border-border"></div>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Target</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] flex items-end justify-between px-4 pb-8 group-hover:scale-[1.01] transition-transform duration-700 overflow-x-auto scrollbar-hide gap-4 border-b border-border bg-gradient-to-t from-muted/20 to-transparent">
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
                <div className="glass-panel rounded-[3rem] p-10 bg-card border border-border space-y-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 translate-x-4">
                        <Globe className="h-40 w-40 text-primary" />
                    </div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-tight relative z-10">Node Allocation</h3>
                    <div className="flex flex-col items-center justify-center h-[280px] relative z-10">
                        <div className="h-52 w-52 rounded-full border-[14px] border-muted flex items-center justify-center relative shadow-inner">
                            <div className="absolute inset-0 rounded-full border-[14px] border-primary border-r-transparent border-t-transparent -rotate-45 shadow-[0_0_15px_rgba(var(--primary),0.2)]"></div>
                            <div className="text-center">
                                <p className="text-4xl font-black text-foreground tracking-tighter uppercase">64%</p>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2">NYC CORE</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 relative z-10">
                        <DistributionRow label="New York City" value="64%" color="bg-primary" />
                        <DistributionRow label="Remote Global" value="22%" color="bg-primary/60" />
                        <DistributionRow label="NJ/CT Node" value="14%" color="bg-muted" />
                    </div>
                </div>
            </div>

            {/* Strategic Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InsightCard title="Stenographic Bottlenecks" content="High demand in Remote Discovery nodes detected during 10:00 AM - 01:00 PM intervals." priority="CRITICAL" />
                <InsightCard title="Yield Optimization" content="Current per-page average has increased by 12% following the v2.4 protocol rollout." priority="OPTIMIZED" />
                <InsightCard title="Reporter Retainment" status="94%" content="Network professional satisfaction rating remains in the elite top-tier percentile." priority="EXCEPTIONAL" />
            </div>
        </div>
    )
}

function PulseCard({ label, value, trend, color, icon }: any) {
    return (
        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity group-hover:rotate-12 duration-700`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">{label}</p>
            <div className={`text-4xl font-black tracking-tighter uppercase ${color} mb-8`}>{value}</div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
                    <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Growth Pulse</span>
                </div>
                <button className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

function Bar({ value, label, active }: any) {
    return (
        <div className="flex flex-col items-center gap-6 h-full min-w-[32px] lg:min-w-[40px]">
            <div className="flex-1 w-8 lg:w-10 bg-muted/50 border-x border-t border-border rounded-t-2xl flex items-end overflow-hidden group/bar transition-all hover:bg-muted">
                <div
                    className={`w-full transition-all duration-1000 group-hover/bar:bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] ${active ? 'bg-primary' : 'bg-primary/40'}`}
                    style={{ height: value }}
                ></div>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
        </div>
    )
}

function DistributionRow({ label, value, color }: any) {
    return (
        <div className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${color} shadow-sm group-hover:scale-125 transition-transform`}></div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">{label}</span>
            </div>
            <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{value}</span>
        </div>
    )
}

function InsightCard({ title, status, content, priority }: any) {
    return (
        <div className="glass-panel p-10 rounded-[3rem] space-y-8 border border-border bg-card hover:border-primary/30 transition-all group shadow-lg hover:shadow-2xl">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h4 className="text-base font-black text-foreground uppercase tracking-tight max-w-[180px] leading-tight group-hover:brand-gradient transition-all">{title}</h4>
                    <div className="h-1 w-8 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    priority === 'EXCEPTIONAL' ? 'bg-primary text-primary-foreground border-primary/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                    {priority}
                </div>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-[0.1em]">{content}</p>
        </div>
    )
}
