'use client'

import { useState } from 'react'
import {
    Send,
    Mail,
    Users,
    BarChart3,
    PieChart,
    TrendingUp,
    Search,
    Filter,
    Plus,
    ArrowUpRight,
    Sparkles,
    Zap,
    Calendar,
    Clock,
    Target,
    MousePointer2,
    Eye
} from 'lucide-react'

export default function DeepCampaignNexus() {
    const [filter, setFilter] = useState('ALL')

    const activeCampaigns = [
        { id: 'CAMP-001', name: 'Q1 Legal Outlook', type: 'Newsletter', reach: '4.2k', opens: '64%', clicks: '12%', status: 'SENT', date: 'FEB 14, 2026' },
        { id: 'CAMP-002', name: 'Elite Reporter Intake', type: 'Recruitment', reach: '1.2k', opens: '82%', clicks: '24%', status: 'ACTIVE', date: 'FEB 16, 2026' },
        { id: 'CAMP-003', name: 'M&A Protocol Briefing', type: 'Service Announcement', reach: '850', opens: '41%', clicks: '8%', status: 'SCHEDULED', date: 'FEB 20, 2026' }
    ]

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-10 space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header Strategy View */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Strategic <span className="text-primary italic">Nexus</span>
                    </h1>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Managing Global Outreach & Audience Engagement Nodes.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-[#0f172a] bg-gray-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                                <Users className="h-4 w-4 text-gray-400" />
                            </div>
                        ))}
                        <div className="h-10 w-10 rounded-full border-2 border-white dark:border-[#0f172a] bg-primary flex items-center justify-center text-[10px] font-black text-white">
                            +12
                        </div>
                    </div>
                    <button className="luxury-btn py-4 shadow-xl shadow-primary/10">
                        <Plus className="h-5 w-5" /> Launch Campaign
                    </button>
                </div>
            </div>

            {/* Real-time Intel Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <IntelCard label="Global Audience" value="12,450" trend="+12%" icon={<Users />} color="text-primary" />
                <IntelCard label="Avg Open Rate" value="58.2%" trend="+4.1%" icon={<Eye />} color="text-emerald-500" />
                <IntelCard label="Click Conversion" value="14.8%" trend="+2.4%" icon={<MousePointer2 />} color="text-purple-500" />
                <IntelCard label="Unsubscribe RL" value="0.02%" trend="-0.01%" icon={<Target />} color="text-rose-500" />
            </div>

            {/* Campaign Central Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Campaign List */}
                <div className="lg:col-span-2 glass-panel rounded-[3rem] overflow-hidden">
                    <div className="p-10 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Outreach Inventory</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none text-[10px] font-black uppercase tracking-widest w-48" placeholder="Search Node..." />
                            </div>
                            <button className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Node</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {activeCampaigns.map(camp => (
                                    <tr key={camp.id} className="group hover:bg-primary/5 dark:hover:bg-primary/5 transition-all cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center shadow-sm group-hover:bg-primary transition-all">
                                                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-white transition-all" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{camp.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{camp.type} • {camp.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-8">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Opens</p>
                                                    <p className="text-sm font-black dark:text-white">{camp.opens}</p>
                                                </div>
                                                <div className="h-8 w-px bg-gray-100 dark:bg-white/10"></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Clicks</p>
                                                    <p className="text-sm font-black dark:text-white">{camp.clicks}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${camp.status === 'SENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                                                camp.status === 'ACTIVE' ? 'bg-emerald-50 text-primary border-primary/20 dark:bg-primary/10 dark:border-primary/20' :
                                                    'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
                                                }`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${camp.status === 'SENT' || camp.status === 'ACTIVE' ? 'bg-current animate-pulse' : 'bg-current'}`}></div>
                                                {camp.status}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button className="h-10 w-10 rounded-xl hover:bg-white dark:hover:bg-white/10 transition-all flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-primary">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Automation & Insights */}
                <div className="space-y-8">
                    <div className="glass-panel rounded-[3rem] p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Active Pulse</h3>
                            <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                        </div>
                        <div className="h-[200px] flex items-end justify-between px-2">
                            {[45, 78, 56, 89, 62, 71, 95].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="w-4 bg-gray-50 dark:bg-white/5 rounded-full h-[150px] relative overflow-hidden flex items-end">
                                        <div
                                            className="w-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">WD-0{i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Engagement flux is up by <span className="text-emerald-500 underline">2.4%</span> across North American Discovery nodes.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-800 to-primary rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <TrendingUp className="h-40 w-40" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-blue-200">AI Predictor</p>
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-8 leading-tight">Optimizing Delivery Timeframe</h4>
                        <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-3">
                            Execute Protocol <Sparkles className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function IntelCard({ label, value, trend, icon, color }: any) {
    return (
        <div className="glass-panel p-10 rounded-[2.5rem] group overflow-hidden relative border border-gray-100 dark:border-white/5">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{label}</p>
            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6 flex items-baseline gap-2">
                {value}
            </div>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend} <span className="text-gray-400 ml-1">Velo</span>
            </div>
        </div>
    )
}
