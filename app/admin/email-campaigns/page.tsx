'use client'

import { useState, useEffect } from 'react'
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
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCampaigns = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/campaigns', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setCampaigns(data.campaigns || [])
        } catch (error) {
            console.error('Failed to fetch campaigns')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)
    const [selectedSegment, setSelectedSegment] = useState<'CLIENT' | 'REPORTER' | 'TEAM' | 'ALL'>('CLIENT')
    const [recipients, setRecipients] = useState<any[]>([])
    const [loadingRecipients, setLoadingRecipients] = useState(false)
    const [campaignForm, setCampaignForm] = useState({
        name: '',
        subject: '',
        body: ''
    })
    const [sending, setSending] = useState(false)

    const fetchRecipients = async (segment: any) => {
        setLoadingRecipients(true)
        setSelectedSegment(segment)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/campaign-recipients?segment=${segment}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setRecipients(data.recipients || [])
        } catch (error) {
            console.error('Failed to fetch recipients')
        } finally {
            setLoadingRecipients(false)
        }
    }

    const handleSendCampaign = async (e: React.FormEvent) => {
        e.preventDefault()
        if (recipients.length === 0) return alert('No recipients in this segment')

        setSending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/send-campaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...campaignForm,
                    recipients,
                    campaignName: campaignForm.name,
                    segment: selectedSegment
                })
            })

            if (res.ok) {
                alert('Campaign launched successfully!')
                setIsLaunchModalOpen(false)
                setCampaignForm({ name: '', subject: '', body: '' })
                fetchCampaigns()
            }
        } catch (error) {
            alert('Failed to send campaign')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-10 space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Launch Modal */}
            {isLaunchModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsLaunchModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] p-10 border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Launch <span className="brand-gradient italic">Campaign</span></h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Multi-Segment Audience Outreach</p>
                            </div>
                            <button onClick={() => setIsLaunchModalOpen(false)} className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold">×</button>
                        </div>

                        {/* Segment Selector - THE FOUR SECTIONS */}
                        <div className="grid grid-cols-4 gap-4 mb-10">
                            {[
                                { id: 'CLIENT', label: 'Clients', icon: <Users className="h-4 w-4" /> },
                                { id: 'REPORTER', label: 'Reporters', icon: <Mail className="h-4 w-4" /> },
                                { id: 'TEAM', label: 'Teams', icon: <Target className="h-4 w-4" /> },
                                { id: 'ALL', label: 'All of Them', icon: <Zap className="h-4 w-4" /> }
                            ].map(seg => (
                                <button
                                    key={seg.id}
                                    onClick={() => fetchRecipients(seg.id)}
                                    className={`flex flex-col items-center gap-3 p-5 rounded-[1.5rem] border transition-all ${selectedSegment === seg.id
                                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                        : 'bg-muted border-border text-muted-foreground hover:border-primary/50'
                                        }`}
                                >
                                    {seg.icon}
                                    <span className="text-[9px] font-black uppercase tracking-tighter">{seg.label}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSendCampaign} className="space-y-6">
                            <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 block">Recipient Intel</label>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-black uppercase tracking-tight">
                                        {loadingRecipients ? 'Syncing...' : `${recipients.length} Recipient Profiles Linked`}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    required
                                    className="w-full bg-muted border-none p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Campaign Name (Internal)"
                                    value={campaignForm.name}
                                    onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })}
                                />
                                <input
                                    required
                                    className="w-full bg-muted border-none p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Subject Line"
                                    value={campaignForm.subject}
                                    onChange={e => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                                />
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full bg-muted border-none p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    placeholder="Campaign Messaging..."
                                    value={campaignForm.body}
                                    onChange={e => setCampaignForm({ ...campaignForm, body: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending || recipients.length === 0 || loadingRecipients}
                                className="w-full luxury-button py-5 text-[10px] font-black tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {sending ? 'Transmitting...' : 'Broadcast Campaign'} <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Strategy View */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">
                        Email <span className="brand-gradient italic">Campaigns</span>
                    </h1>
                    <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] mt-2">Manage email campaigns and audience outreach.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ))}
                        <div className="h-10 w-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground">
                            +12
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsLaunchModalOpen(true)
                            fetchRecipients('CLIENT')
                        }}
                        className="luxury-button py-4 shadow-xl shadow-primary/10"
                    >
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
                <div className="lg:col-span-2 glass-panel rounded-[3rem] overflow-hidden border border-border bg-card">
                    <div className="p-10 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Outreach Inventory</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input className="pl-10 pr-4 py-2 rounded-xl bg-muted border-none outline-none text-[10px] font-black uppercase tracking-widest w-48 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search campaign..." />
                            </div>
                            <button className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                <Filter className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border">
                                    <th className="px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Campaign Name</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Performance</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {campaigns.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Mail className="h-12 w-12 text-muted-foreground/20" />
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No Campaigns Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.map(camp => (
                                        <tr key={camp.id} className="group hover:bg-primary/5 transition-all cursor-pointer">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-card border border-border flex flex-col items-center justify-center shadow-sm group-hover:bg-primary transition-all">
                                                        <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-all" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-foreground uppercase tracking-tight">{camp.name}</div>
                                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{camp.segment} • {camp.id.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-8">
                                                    <div>
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Reach</p>
                                                        <p className="text-sm font-black text-foreground">{camp.reach}</p>
                                                    </div>
                                                    <div className="h-8 w-px bg-border"></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Opens</p>
                                                        <p className="text-sm font-black text-foreground">{camp.opens}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${camp.status === 'SENT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    camp.status === 'ACTIVE' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${camp.status === 'SENT' || camp.status === 'ACTIVE' ? 'bg-current animate-pulse' : 'bg-current'}`}></div>
                                                    {camp.status}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="h-10 w-10 rounded-xl hover:bg-muted transition-all flex items-center justify-center text-muted-foreground hover:text-primary">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Automation & Insights */}
                <div className="space-y-8">
                    <div className="glass-panel rounded-[3rem] p-10 space-y-8 border border-border bg-card">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Active Pulse</h3>
                            <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
                        </div>
                        <div className="h-[200px] flex items-end justify-between px-2">
                            {[45, 78, 56, 89, 62, 71, 95].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="w-4 bg-muted rounded-full h-[150px] relative overflow-hidden flex items-end">
                                        <div
                                            className="w-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">WD-0{i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-border">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Engagement flux is up by <span className="text-emerald-500 underline decoration-emerald-500/50">2.4%</span> across North American Discovery systems.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-800 to-primary rounded-[3rem] p-10 text-primary-foreground relative overflow-hidden group shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <TrendingUp className="h-40 w-40" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">AI Predictor</p>
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-8 leading-tight">Optimizing Delivery Timeframe</h4>
                        <button className="w-full py-4 bg-background text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted transition-all flex items-center justify-center gap-3">
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
        <div className="glass-panel p-10 rounded-[2.5rem] group overflow-hidden relative border border-border bg-card">
            <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">{label}</p>
            <div className="text-3xl font-black text-foreground tracking-tighter uppercase mb-6 flex items-baseline gap-2">
                {value}
            </div>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend} <span className="text-muted-foreground ml-1">Velo</span>
            </div>
        </div>
    )
}
