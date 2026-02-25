'use client'

import { useState, useEffect } from 'react'
import {
    Users,
    UserPlus,
    Search,
    Briefcase,
    CheckCircle,
    Plus,
    ArrowRight,
    User,
    Loader2,
    X,
    Phone,
    Mail,
    Building2,
    Hash,
    Lock,
    Eye,
    EyeOff,
    Check
} from 'lucide-react'
import ProfileUpload from '@/app/components/ui/ProfileUpload'

export default function TeamManagementPage() {
    const [team, setTeam] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState<any>(null)
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedToId: ''
    })

    const [showMemberModal, setShowMemberModal] = useState(false)
    const [memberData, setMemberData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: 'Operations',
        avatar: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (showTaskModal || showMemberModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [showTaskModal, showMemberModal])

    const fetchTeam = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) { setLoading(false); return }
            const res = await fetch('/api/admin/team', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch team')
            const data = await res.json()
            setTeam(data || [])
        } catch (error) {
            console.error('Failed to fetch team:', error)
            setTeam([])
        }
    }

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) { setLoading(false); return }
            const res = await fetch('/api/admin/tasks', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch tasks')
            const data = await res.json()
            setTasks(data || [])
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
            setTasks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeam()
        fetchTasks()
    }, [])

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (saving) return
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(memberData)
            })
            if (res.ok) {
                setShowMemberModal(false)
                fetchTeam()
                setMemberData({ firstName: '', lastName: '', email: '', phone: '', position: '', department: 'Operations', avatar: '', password: '' })
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to create team member')
            }
        } catch (error) {
            console.error('Failed to create team member:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (saving) return
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskData)
            })
            if (res.ok) {
                setShowTaskModal(false)
                fetchTasks()
                fetchTeam()
                setTaskData({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' })
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to deploy task assignment. Please verify the protocol.')
            }
        } catch (error) {
            console.error('Failed to create task:', error)
        } finally {
            setSaving(false)
        }
    }

    const openTaskModal = (member: any = null) => {
        setSelectedMember(member)
        setTaskData(prev => ({ ...prev, assignedToId: member?.id || '' }))
        setShowTaskModal(true)
    }

    const filteredTeam = team.filter(m => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            m.firstName?.toLowerCase().includes(q) ||
            m.lastName?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.position?.toLowerCase().includes(q)
        )
    })

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 space-y-8 pb-24 animate-in fade-in duration-700">

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase truncate">
                        Team <span className="text-blue-600 italic">Management</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-poppins text-sm">
                        Coordinate internal staff, roles, and task management.
                    </p>
                </div>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full sm:w-auto">
                    <div className="relative group flex-1 sm:flex-none font-poppins">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full sm:min-w-[260px] px-12 py-3 rounded-2xl bg-muted/50 border border-border text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 text-foreground"
                            placeholder="Search Personnel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowMemberModal(true)}
                        className="luxury-button flex items-center justify-center gap-2 px-6 py-3 whitespace-nowrap"
                    >
                        <UserPlus className="h-4 w-4 flex-shrink-0" />
                        <span>Create Team Member</span>
                    </button>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Members', value: team.length, color: 'text-primary' },
                    { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'COMPLETED').length, color: 'text-amber-500' },
                    { label: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length, color: 'text-emerald-500' },
                    { label: 'Departments', value: Array.from(new Set(team.map(m => m.department))).filter(Boolean).length || 1, color: 'text-indigo-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel rounded-2xl p-4 border border-border bg-card/50">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Team Roster – takes 2/3 on xl */}
                <div className="xl:col-span-2">
                    <div className="glass-panel rounded-[2rem] overflow-hidden border border-border">
                        <div className="px-6 py-5 border-b border-border bg-card/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" /> Active Personnel
                                {!loading && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black border border-primary/20">{filteredTeam.length}</span>}
                            </h3>
                            <button
                                onClick={() => setShowMemberModal(true)}
                                className="h-9 w-9 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 hover:scale-105 transition-all shadow-lg"
                            >
                                <UserPlus className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="divide-y divide-border">
                            {loading ? (
                                <div className="p-16 text-center">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground">Synchronizing Staff Data...</p>
                                </div>
                            ) : filteredTeam.length === 0 ? (
                                <div className="p-16 text-center">
                                    <User className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-2">No Team Members</p>
                                    <p className="text-[10px] text-muted-foreground opacity-60">
                                        {searchQuery ? 'No results match your search.' : 'Team members will appear here once registered.'}
                                    </p>
                                </div>
                            ) : filteredTeam.map(member => (
                                <div key={member.id} className="p-4 sm:p-6 hover:bg-primary/5 transition-all group">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Avatar + Info */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-black text-lg shadow-lg transition-transform group-hover:scale-105 duration-500 overflow-hidden relative">
                                                {member.avatar ? (
                                                    <img
                                                        src={member.avatar}
                                                        alt={member.firstName}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).src = '/favicon.svg'
                                                        }}
                                                    />
                                                ) : (
                                                    <>{(member.firstName?.[0] || member.email?.[0] || '?').toUpperCase()}{(member.lastName?.[0] || '').toUpperCase()}</>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-sm sm:text-base font-black text-foreground uppercase tracking-tight truncate">{member.firstName} {member.lastName}</h3>
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20 flex-shrink-0">{member.position || member.role || 'MEMBER'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-3 w-3 flex-shrink-0" />
                                                    <span className="text-[10px] font-bold truncate uppercase tracking-tight">{member.email}</span>
                                                </div>
                                                {member.department && (
                                                    <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                                                        <Building2 className="h-3 w-3 flex-shrink-0" />
                                                        <span className="text-[10px] font-bold truncate uppercase tracking-tight">{member.department}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Load</p>
                                                <p className="text-lg font-black text-foreground tracking-tighter">
                                                    {(member.assignedTasks || []).length}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openTaskModal(member)}
                                                className="h-10 px-4 rounded-xl bg-muted border border-border text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task Stream */}
                <div className="xl:col-span-1">
                    <div className="glass-panel rounded-[2rem] overflow-hidden border border-border h-full">
                        <div className="px-6 py-5 border-b border-border bg-card/50">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-primary" /> Active Task Grid
                                </div>
                                <button
                                    onClick={() => openTaskModal()}
                                    className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </h3>
                        </div>
                        <div className="p-4 sm:p-5 space-y-3">
                            {tasks.filter(t => t.status !== 'COMPLETED').length === 0 ? (
                                <div className="py-10 text-center">
                                    <CheckCircle className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">All done!<br />No pending tasks.</p>
                                </div>
                            ) : tasks.filter(t => t.status !== 'COMPLETED').map(task => (
                                <div key={task.id} className="p-4 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${task.priority === 'URGENT' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                            task.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h5 className="text-xs font-black text-foreground uppercase mb-2 line-clamp-2">{task.title}</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary">
                                                {(task.assignedToTeam?.firstName?.[0] || task.assignedToUser?.firstName?.[0] || '?').toUpperCase()}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase truncate max-w-[100px]">
                                                {task.assignedToTeam ? `${task.assignedToTeam.firstName} ${task.assignedToTeam.lastName}` :
                                                    task.assignedToUser ? `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}` :
                                                        'Unassigned'}
                                            </span>
                                        </div>
                                        <button className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                            <ArrowRight className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Assign Task Modal ── */}
            {showTaskModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-8 lg:pl-72">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowTaskModal(false)} />
                    <div className="relative w-full max-w-lg bg-card rounded-3xl p-5 sm:p-8 shadow-2xl border border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center text-white">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Deploy Tasking</h2>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Personnel Assignment Protocol</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTaskModal(false)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Objective Title</label>
                                <input
                                    required
                                    className="luxury-input"
                                    placeholder="E.G. CONTACT LEVINE & ASSOC."
                                    value={taskData.title}
                                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Assignee</label>
                                    <select
                                        required
                                        className="luxury-input"
                                        value={taskData.assignedToId}
                                        onChange={(e) => setTaskData({ ...taskData, assignedToId: e.target.value })}
                                    >
                                        <option value="">Select Personnel...</option>
                                        {team.map(m => (
                                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.position})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Priority Level</label>
                                    <select
                                        className="luxury-input"
                                        value={taskData.priority}
                                        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                                    >
                                        <option value="LOW">LOW</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HIGH">HIGH</option>
                                        <option value="URGENT">URGENT</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Briefing Details</label>
                                <textarea
                                    className="luxury-input min-h-[100px] py-4 resize-none"
                                    placeholder="Enter complex task requirements..."
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-muted text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:bg-muted/80 transition-all border border-border"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] luxury-btn py-4 px-6 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Check className="h-4 w-4" />}
                                    <span>Authorize Assignment</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Add Team Member Modal ── */}
            {showMemberModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-8 lg:pl-72">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowMemberModal(false)} />
                    <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto scrollbar-hide">

                        {/* Styled Modal Header */}
                        <div className="px-6 pt-6 pb-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                        <UserPlus className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">New Operative</h2>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Internal Personnel Induction</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowMemberModal(false)}
                                    className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateMember} className="p-6 space-y-4">
                            {/* Name Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-3 w-3" /> First Name
                                    </label>
                                    <input
                                        required
                                        className="luxury-input"
                                        placeholder="James"
                                        value={memberData.firstName}
                                        onChange={(e) => setMemberData({ ...memberData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-3 w-3" /> Last Name
                                    </label>
                                    <input
                                        required
                                        className="luxury-input"
                                        placeholder="Logan"
                                        value={memberData.lastName}
                                        onChange={(e) => setMemberData({ ...memberData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> Email Identity
                                </label>
                                <input
                                    required
                                    type="email"
                                    className="luxury-input"
                                    placeholder="j.logan@md-elite.com"
                                    value={memberData.email}
                                    onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="h-3 w-3" /> Secure Line (Phone)
                                </label>
                                <input
                                    className="luxury-input"
                                    placeholder="+1 (555) 000-0000"
                                    value={memberData.phone}
                                    onChange={(e) => setMemberData({ ...memberData, phone: e.target.value })}
                                />
                            </div>

                            {/* Role & Department */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Role / Position
                                    </label>
                                    <input
                                        required
                                        className="luxury-input"
                                        placeholder="Operations Lead"
                                        value={memberData.position}
                                        onChange={(e) => setMemberData({ ...memberData, position: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <Building2 className="h-3 w-3" /> Department
                                    </label>
                                    <select
                                        className="luxury-input"
                                        value={memberData.department}
                                        onChange={(e) => setMemberData({ ...memberData, department: e.target.value })}
                                    >
                                        <option value="Operations">Operations</option>
                                        <option value="Client Relations">Client Relations</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Legal">Legal</option>
                                        <option value="Sales">Sales</option>
                                    </select>
                                </div>
                            </div>

                            {/* Avatar URL */}
                            <ProfileUpload
                                label="Operative Avatar"
                                currentImage={memberData.avatar}
                                onUploadComplete={(url) => setMemberData({ ...memberData, avatar: url })}
                            />

                            {/* Password Row */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Lock className="h-3 w-3" /> Initial Password (Login Credentials)
                                </label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        className="luxury-input pr-12"
                                        placeholder="Min. 6 characters"
                                        value={memberData.password}
                                        onChange={(e) => setMemberData({ ...memberData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-[9px] text-muted-foreground italic pl-2">Member will use this password to login to their portal.</p>
                            </div>

                            {/* Preview Strip */}
                            {(memberData.firstName || memberData.lastName) && (
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                                        {(memberData.firstName?.[0] || '?').toUpperCase()}{(memberData.lastName?.[0] || '').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground uppercase">
                                            {memberData.firstName} {memberData.lastName}
                                        </p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {memberData.position || 'No position set'} • {memberData.department}
                                        </p>
                                    </div>
                                    <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase border border-primary/20">Preview</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowMemberModal(false)}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-muted text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:bg-muted/80 transition-all border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[1.8] py-4 px-6 rounded-2xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <CheckCircle className="h-4 w-4" />}
                                    <span>Confirm Induction</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
