'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    LayoutDashboard,
    CheckSquare,
    MessageSquare,
    Settings,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Search,
    Filter,
    MoreHorizontal,
    Calendar as CalendarIcon,
    User,
    Mail,
    Phone,
    Hash,
    KeyRound,
    Loader2,
    ChevronRight,
    ShieldCheck,
    Send,
    Copy,
    LogOut
} from 'lucide-react'
import { format } from 'date-fns'
import ProfileUpload from '@/app/components/ui/ProfileUpload'

export default function StaffPortalPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'overview'

    const [user, setUser] = useState<any>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Settings state
    const [contactMessage, setContactMessage] = useState('')
    const [contactSending, setContactSending] = useState(false)
    const [contactSent, setContactSent] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    const fetchStaffData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/login')
                return
            }

            const [userRes, tasksRes] = await Promise.all([
                fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/staff/tasks', { headers: { 'Authorization': `Bearer ${token}` } })
            ])

            const userData = await userRes.json()
            const tasksData = await tasksRes.json()

            if (userData.user) setUser(userData.user)
            if (Array.isArray(tasksData)) setTasks(tasksData)

        } catch (error) {
            console.error('Failed to fetch staff data:', error)
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchStaffData()
    }, [fetchStaffData])

    const navigateTab = (tab: string) => {
        router.push(`/staff/portal?tab=${tab}`)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    const handleAvatarUpdate = async (url: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar: url })
            })
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
            }
        } catch (error) {
            console.error('Failed to update avatar:', error)
        }
    }

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/staff/tasks', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ taskId, status: newStatus })
            })

            if (res.ok) {
                setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
            }
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key)
            setTimeout(() => setCopied(null), 2000)
        })
    }

    const handleContactAdmin = async () => {
        if (!contactMessage.trim()) return
        setContactSending(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: `[STAFF REQUEST] ${contactMessage}` })
            })
            if (res.ok) {
                setContactSent(true)
                setContactMessage('')
                setTimeout(() => setContactSent(false), 4000)
            }
        } catch (err) {
            console.error('Failed to contact admin:', err)
        } finally {
            setContactSending(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Synchronizing Secure Access...</p>
            </div>
        </div>
    )

    const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED')
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED')

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-tight">Staff Operations Center</h1>
                        <p className="text-muted-foreground font-medium">Welcome back, {user?.firstName}. You have {pendingTasks.length} objectives currently active.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Total Missions', value: tasks.length, color: 'text-primary', icon: <CheckSquare className="h-4 w-4" /> },
                            { label: 'Active Objectives', value: pendingTasks.length, color: 'text-amber-500', icon: <Clock className="h-4 w-4" /> },
                            { label: 'Successful Reports', value: completedTasks.length, color: 'text-emerald-500', icon: <CheckCircle2 className="h-4 w-4" /> },
                        ].map((stat, i) => (
                            <div key={stat.label} className="glass-panel p-6 rounded-[2rem] border border-border bg-card/50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-2xl bg-${stat.color.split('-')[1]}-500/10 flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-500" /> Critical Directives
                                        </h3>
                                        <button onClick={() => navigateTab('tasks')} className="text-[10px] font-black text-primary uppercase hover:underline">View All Tasks</button>
                                    </div>
                                    <div className="space-y-4">
                                        {pendingTasks.slice(0, 4).map((task) => (
                                            <div key={task.id} className="glass-panel p-5 rounded-3xl border border-border group hover:border-primary/30 transition-all cursor-pointer">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${task.priority === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                            }`}>
                                                            {task.priority} Priority
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground">{format(new Date(task.createdAt), 'MMM dd')}</span>
                                                    </div>
                                                    <button onClick={() => updateTaskStatus(task.id, 'COMPLETED')} className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <h4 className="text-sm font-bold text-foreground mb-1">{task.title}</h4>
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">{task.description}</p>
                                                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">From: {task.createdBy.firstName} {task.createdBy.lastName}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {pendingTasks.length === 0 && (
                                            <div className="py-12 flex flex-col items-center justify-center text-center glass-panel rounded-3xl border border-dashed border-border">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-500/20 mb-3" />
                                                <p className="text-sm font-bold text-muted-foreground">All objectives clear for now.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary" /> Communications
                                    </h3>
                                    <div className="glass-panel p-6 rounded-[2.5rem] border border-border h-full min-h-[400px]">
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center mb-6">
                                                <MessageSquare className="h-8 w-8 text-primary/40" />
                                            </div>
                                            <h4 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">Secure Link Active</h4>
                                            <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mb-8">
                                                Internal messaging system is online. Click below to view protocol messages.
                                            </p>
                                            <button onClick={() => navigateTab('messages')} className="luxury-button py-4 px-8 flex items-center gap-3">
                                                Enter Comms Hub <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tasks' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Active Directives Table</h3>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            placeholder="Filter objectives..."
                                            className="luxury-input pl-12 w-64 h-10 text-xs"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="glass-panel rounded-[2rem] border border-border overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-muted/50 border-b border-border">
                                            <tr>
                                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Objective</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Priority</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Date</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/50">
                                            {tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map((task) => (
                                                <tr key={task.id} className="group hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-foreground">{task.title}</span>
                                                            <span className="text-[10px] text-muted-foreground uppercase">{task.booking?.bookingNumber || 'General Task'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' :
                                                            task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' :
                                                                'bg-amber-500/10 text-amber-600'
                                                            }`}>
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase text-muted-foreground">
                                                            <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' :
                                                                task.priority === 'MEDIUM' ? 'bg-amber-500' :
                                                                    'bg-emerald-500'
                                                                }`} />
                                                            {task.priority}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-xs font-medium text-foreground">
                                                            {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No deadline'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        {task.status !== 'COMPLETED' ? (
                                                            <button
                                                                onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                                                                className="h-8 px-4 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                                                            >
                                                                Complete
                                                            </button>
                                                        ) : (
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                                {/* Account Identity & Credentials */}
                                <div className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-border bg-card">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Identity Management</h3>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Biometric & system credentials</p>
                                        </div>
                                    </div>

                                    {/* Profile Pic Upload */}
                                    <div className="mb-8">
                                        <ProfileUpload
                                            label="Personnel Avatar"
                                            currentImage={user?.avatar}
                                            onUploadComplete={handleAvatarUpdate}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                <Hash className="h-3 w-3" /> Personnel ID
                                            </label>
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                                                <code className="flex-1 text-xs font-mono text-foreground truncate select-all">{user?.id}</code>
                                                <button
                                                    onClick={() => copyToClipboard(user?.id, 'id')}
                                                    className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all flex-shrink-0"
                                                >
                                                    {copied === 'id' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                <Mail className="h-3 w-3" /> Registered Email
                                            </label>
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                                                <code className="flex-1 text-xs font-mono text-foreground truncate select-all">{user?.email}</code>
                                                <button
                                                    onClick={() => copyToClipboard(user?.email, 'email')}
                                                    className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all flex-shrink-0"
                                                >
                                                    {copied === 'email' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                <ShieldCheck className="h-3 w-3" /> Operations Role
                                            </label>
                                            <div className="p-3 rounded-xl bg-muted border border-border text-foreground">
                                                <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{user?.role || 'STAFF'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                <KeyRound className="h-3 w-3" /> Account Key
                                            </label>
                                            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-muted border border-border">
                                                <span className="text-sm text-muted-foreground tracking-widest">••••••••••••</span>
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">Change Link</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Admin Form */}
                                <div className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-border bg-card">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-foreground uppercase tracking-tight">Admin Support Protocol</h3>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Report issues or request credentials</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Request Details</label>
                                        <textarea
                                            className="w-full p-4 rounded-2xl bg-muted/50 border border-border text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                                            placeholder="Specify objective or resource request..."
                                            value={contactMessage}
                                            onChange={(e) => setContactMessage(e.target.value)}
                                        />
                                        {contactSent && (
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 animate-in fade-in duration-300">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                <p className="text-xs font-bold text-emerald-700">Transmission Successful. Admin team notified.</p>
                                            </div>
                                        )}
                                        <button
                                            onClick={handleContactAdmin}
                                            disabled={contactSending || !contactMessage.trim()}
                                            className="luxury-button w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {contactSending ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Transmitting...</>
                                            ) : (
                                                <><Send className="h-4 w-4" /> Send Request</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Final Exit */}
                                <div className="glass-panel rounded-[2rem] p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Mission Exit</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium">Terminate current session and return to base.</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                                    >
                                        <LogOut className="h-4 w-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
