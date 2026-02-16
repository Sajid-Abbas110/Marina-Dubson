'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Calendar,
    FileText,
    User,
    LogOut,
    CheckCircle,
    Clock,
    Zap,
    TrendingUp,
    DollarSign,
    Upload,
    Bell,
    Settings,
    MapPin,
    ChevronRight,
    Search,
    BadgeCheck
} from 'lucide-react'

export default function ReporterPortal() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            // Check if user has REPORTER role
            if (parsedUser.role !== 'REPORTER') {
                alert('Access denied. This portal is for reporters only.')
                router.push('/login')
                return
            }
            setUser(parsedUser)
        } else {
            router.push('/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#00120d] dark:text-gray-100 font-poppins selection:bg-primary/10 selection:text-primary">
            {/* Professional Reporter Header */}
            <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-2xl border-b border-gray-100 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 transform -rotate-6">
                        MD
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                            Reporter <span className="text-primary italic">Network</span>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Professional Logistics Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 italic">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verified Expert Status</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-100">
                            <LogOut className="h-4 w-4" /> Exit
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-8 py-10">
                {/* Reporter Profile Hero */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-8">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                {user.firstName} <span className="text-primary">{user.lastName}</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Senior Court Reporter • NY Licensed</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl shadow-gray-200">
                            <Zap className="h-4 w-4" /> Set Availability
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Professional Console Tabs */}
                    <aside className="lg:col-span-1 border-r border-gray-100 pr-8 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Ops Management</h3>
                            <nav className="flex flex-col gap-2">
                                <ReporterNavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<TrendingUp />} label="Earnings Dashboard" />
                                <ReporterNavItem active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Calendar />} label="Job Assignment Desk" />
                                <ReporterNavItem active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Upload />} label="Transcript Delivery" />
                                <ReporterNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="Network Profile" />
                            </nav>
                        </div>

                        <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20 group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <DollarSign className="h-10 w-10 text-emerald-200 mb-6" />
                            <h4 className="text-xl font-black uppercase tracking-tight mb-2">Net Earnings</h4>
                            <p className="text-4xl font-black tracking-tighter mb-8">$12,450.00</p>
                            <button className="w-full py-4 bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 hover:bg-white/30 transition-all">Request Payout</button>
                        </div>
                    </aside>

                    {/* Dashboard Detail View */}
                    <div className="lg:col-span-3 space-y-10 animate-in fade-in slide-in-from-right-4 duration-1000">
                        {activeTab === 'overview' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <MetricCard label="Jobs Scheduled" value="08" sub="Next 14 Days" color="text-emerald-500" />
                                    <MetricCard label="Pending Transcripts" value="02" sub="Ready to Deliver" color="text-amber-500" />
                                    <MetricCard label="Network Points" value="1.2k" sub="Expert Performance" color="text-blue-500" />
                                </div>
                                <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-gray-50">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Upcoming Assignments</h3>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input className="pl-12 pr-6 py-3 rounded-xl bg-gray-50 border-none outline-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-100 w-[240px]" placeholder="Find Case ID..." />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <AssignmentItem id="BK-9831" client="Levine & Assoc." location="Manhattan, NY" date="FEB 24" time="10:00 AM" type="REALTIME" />
                                        <AssignmentItem id="BK-9844" client="Global Tech Corp" location="Remote Node" date="FEB 25" time="01:30 PM" type="DEPOSITION" />
                                        <AssignmentItem id="BK-9852" client="Johnson LLP" location="Brooklyn Heights" date="FEB 27" time="09:00 AM" type="HEARING" />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'upload' && (
                            <div className="bg-white rounded-[3rem] p-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] hover:border-emerald-300 transition-colors group">
                                <div className="h-24 w-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-500">
                                    <Upload className="h-10 w-10 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase">Transcript Asset Delivery</h3>
                                    <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">Drag and drop your final TXT, PDF, or PTX files here. Our system will automatically associate them with the active billing ID.</p>
                                </div>
                                <button className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-2xl">Browse Local Files</button>
                                <div className="pt-10 flex gap-8">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ASCII Compliance Check</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">OCR Ready</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

function ReporterNavItem({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-5 w-full p-5 rounded-2xl transition-all duration-500 group ${active
                ? 'bg-primary text-white shadow-2xl shadow-primary/20 translate-x-1'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-xl hover:shadow-gray-200/20'
                }`}
        >
            <div className={`transition-all duration-500 ${active ? 'text-white' : 'text-gray-300 group-hover:text-primary group-hover:rotate-12'}`}>
                {icon}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
            {active && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
        </button>
    )
}

function MetricCard({ label, value, sub, color }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</h4>
            <div className="flex items-end gap-3">
                <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
                <div className="mb-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-[9px] font-black text-gray-300 uppercase mt-4 tracking-widest">{sub}</p>
        </div>
    )
}

function AssignmentItem({ id, client, location, date, time, type }: any) {
    return (
        <div className="group flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 rounded-3xl transition-all border border-transparent hover:border-emerald-100 cursor-pointer">
            <div className="flex items-center gap-8">
                <div className="h-16 w-16 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center shadow-inner group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                    <span className="text-[10px] font-black text-emerald-600">{date.split(' ')[0]}</span>
                    <span className="text-xl font-black text-gray-900">{date.split(' ')[1]}</span>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{type}</span>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">{client}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-tight">{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-tight">{time}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-gray-900">{id}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Assignment Code</p>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-lg transition-all">
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    )
}
