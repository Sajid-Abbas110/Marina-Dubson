'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Database,
    Shield,
    Globe,
    Zap,
    Cpu,
    Lock,
    Layers,
    TrendingUp,
    Activity,
    Box,
    Search,
    ChevronRight,
    ArrowUpRight,
    Terminal,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Server,
    HardDrive,
    Network,
    Filter
} from 'lucide-react'

export default function AdaptiveContentPortal() {
    const [activeNode, setActiveNode] = useState('ALL')

    const globalAssets = [
        { id: 'NODE-X-2026', title: 'Smith vs. Jones Full Render', size: '2.4 GB', node: 'VAULT_01', type: 'VIDEO/4K', status: 'SYNCHRONIZED', date: 'FEB 16' },
        { id: 'NODE-Y-2026', title: 'Holographic ASCII Index', size: '14 KB', node: 'VAULT_04', type: 'DATA/VND', status: 'ENCRYPTED', date: 'FEB 15' },
        { id: 'NODE-Z-2026', title: 'Global Settlement Archive', size: '412 MB', node: 'VAULT_09', type: 'DOC/PDF', status: 'VERIFIED', date: 'FEB 14' }
    ]

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-10 space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Intel Deck Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                        Content <span className="text-primary italic">Vault</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-3">Monitoring Decentralized Asset Nodes & P2P Stream</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input className="pl-10 pr-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none text-[10px] font-black uppercase tracking-widest w-64 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="DECRYPT ASSET_ID..." />
                    </div>
                    <button className="luxury-btn py-4 shadow-xl shadow-primary/20">
                        <Zap className="h-5 w-5" /> Sync Node Relay
                    </button>
                </div>
            </div>

            {/* Matrix View Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ContentStat label="Vault Storage" value="1.4 PB" trend="Near Capacity" icon={<HardDrive />} color="text-primary" />
                <ContentStat label="Active Relay" value="412" trend="Verified Uplink" icon={<Network />} color="text-emerald-500" />
                <ContentStat label="Node Latency" value="0.2ms" trend="Optimal" icon={<Zap />} color="text-emerald-500" />
                <ContentStat label="Encrypted" value="99.9%" trend="RSA-4096 Active" icon={<Lock />} color="text-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Asset Management */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-white/5 rounded-2xl w-fit">
                        <button className="px-6 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">All Assets</button>
                        <button className="px-6 py-2 rounded-xl text-gray-400 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-all">Transcripts</button>
                        <button className="px-6 py-2 rounded-xl text-gray-400 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-all">Renders</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {globalAssets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} />
                        ))}
                        {/* Prototype Node */}
                        <button className="h-full min-h-[220px] border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:border-primary/30 transition-all">
                            <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                <Layers className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Init New Node</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Cyber Intel Column */}
                <div className="space-y-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Shield className="h-24 w-24 text-primary" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Node Security</h4>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">System protocols verified. Vault integrity at 100%. RSA-4096 handshake complete for all VAULT_nodes.</p>
                        <button className="w-full py-4 bg-gray-900 dark:bg-white/5 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary transition-all">Audit Protocols</button>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-800 to-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <Activity className="h-40 w-40" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-4 opacity-60">P2P Matrix</p>
                        <h4 className="text-xl font-black uppercase tracking-tight mb-8">Asset Delivery Optimization</h4>
                        <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all flex items-center justify-center gap-3">
                            Launch Sync <Sparkles className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AssetCard({ asset }: { asset: any }) {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] group hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden relative border border-gray-100 dark:border-white/5">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all">
                <Box className="h-20 w-20 text-primary" />
            </div>

            <div className="flex justify-between items-start mb-6 font-black uppercase tracking-widest text-[8px]">
                <span className="text-primary dark:text-primary">{asset.type}</span>
                <span className="text-gray-400">{asset.date}</span>
            </div>

            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 group-hover:text-primary dark:group-hover:text-primary transition-colors">{asset.title}</h3>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5 mt-auto">
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Node Location</span>
                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase">{asset.node}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-3 w-3 ${asset.status === 'SYNCHRONIZED' ? 'text-primary' : 'text-emerald-500'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${asset.status === 'SYNCHRONIZED' ? 'text-primary' : 'text-emerald-500'}`}>{asset.status}</span>
                </div>
            </div>
        </div>
    )
}

function ContentStat({ label, value, trend, icon, color }: any) {
    return (
        <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{label}</p>
            <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-2">{value}</div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{trend}</p>
        </div>
    )
}
