'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    Briefcase,
    CheckCircle,
    Clock,
    AlertCircle,
    Plus,
    Calendar,
    ArrowRight,
    User,
    Loader2
} from 'lucide-react'

export default function TeamManagementPage() {
    const [team, setTeam] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('ALL')
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
        avatar: ''
    })
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
            if (!token) {
                console.error('No token found')
                setLoading(false)
                return
            }

            const res = await fetch('/api/admin/team', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!res.ok) {
                throw new Error('Failed to fetch team')
            }

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
            if (!token) {
                setLoading(false)
                return
            }

            const res = await fetch('/api/admin/tasks', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!res.ok) {
                throw new Error('Failed to fetch tasks')
            }

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
                setMemberData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    position: '',
                    department: 'Operations',
                    avatar: ''
                })
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to create team member')
            }
        } catch (error) {
            console.error('Failed to create team member:', error)
        }
    }

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
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

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700">
            {/* Command Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
                        Service <span className="brand-gradient italic">Squadrons</span>
                    </h1>
                    <p className="text-muted-foreground font-medium font-poppins">Managing the elite internal personnel handling operations.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group w-full sm:w-auto font-poppins">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full sm:min-w-[320px] px-12 py-4 rounded-2xl bg-muted/50 border border-border text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 text-foreground"
                            placeholder="Search Personnel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowMemberModal(true)}
                        className="flex-1 sm:flex-none luxury-button flex items-center justify-center gap-3 px-8 py-4"
                    >
                        <UserPlus className="h-4 w-4" /> <span>Add Team Member</span>
                    </button>
                </div>
            </div>

            {/* Matrix Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Roster */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden">
                        <div className="px-8 py-6 border-b border-border bg-card/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                                <Users className="h-4 w-4 text-primary" /> Active Personnel
                            </h3>
                            <button
                                onClick={() => openTaskModal()}
                                className="h-10 w-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 hover:scale-105 transition-all shadow-lg"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="divide-y divide-border">
                            {loading ? (
                                <div className="p-20 text-center font-black text-xs uppercase tracking-widest text-muted-foreground">Synchronizing Squadrons...</div>
                            ) : team.length === 0 ? (
                                <div className="p-20 text-center">
                                    <User className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
                                    <p className="font-black text-xs uppercase tracking-widest text-muted-foreground mb-2">No Team Members</p>
                                    <p className="text-[10px] text-muted-foreground opacity-60">Team members will appear here once registered</p>
                                </div>
                            ) : team.map(member => (
                                <div key={member.id} className="p-8 hover:bg-primary/5 transition-all group flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl sm:text-2xl shadow-xl transition-transform group-hover:scale-110 duration-500 overflow-hidden relative">
                                            {member.avatar ? (
                                                <Image src={member.avatar} alt={member.firstName} fill className="object-cover" />
                                            ) : (
                                                <>{(member.firstName?.[0] || member.email?.[0] || '?').toUpperCase()}{(member.lastName?.[0] || '').toUpperCase()}</>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">{member.firstName} {member.lastName}</h3>
                                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">{member.position || member.role || 'MEMBER'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <span className="text-[10px] font-bold truncate max-w-[150px] sm:max-w-none uppercase tracking-widest">{member.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Load Balance</p>
                                            <p className="text-xl font-black text-foreground tracking-tighter">
                                                {(member.assignedTasks || []).length} Active
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => openTaskModal(member)}
                                            className="h-12 px-6 rounded-2xl bg-muted border border-border text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                        >
                                            Assign Task
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task Stream */}
                <div className="space-y-8">
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden h-full">
                        <div className="px-8 py-6 border-b border-border bg-card/50">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-primary" /> Active Task Grid
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            {tasks.filter(t => t.status !== 'COMPLETED').map(task => (
                                <div key={task.id} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${task.priority === 'URGENT' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                            task.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h5 className="text-sm font-black text-foreground uppercase mb-2">{task.title}</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                                {(task.assignedToTeam?.firstName?.[0] || task.assignedToUser?.firstName?.[0] || '?').toUpperCase()}
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                {task.assignedToTeam ? `${task.assignedToTeam.firstName} ${task.assignedToTeam.lastName}` :
                                                    task.assignedToUser ? `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}` :
                                                        'Unassigned'}
                                            </span>
                                        </div>
                                        <button className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status !== 'COMPLETED').length === 0 && (
                                <div className="py-12 text-center">
                                    <CheckCircle className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">Matrix Clear.<br />No pending deployments.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Proposal Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-12 lg:pl-80 overflow-hidden">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowTaskModal(false)}></div>
                    <div className="relative w-full max-w-xl bg-card rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-2xl border border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Deploy Tasking</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Personnel Assignment Protocol</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Objective Title</label>
                                <input
                                    required
                                    className="luxury-input"
                                    placeholder="E.G. CONTACT LEVINE & ASSOC."
                                    value={taskData.title}
                                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Assignee Node</label>
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Priority Level</label>
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Briefing Details</label>
                                <textarea
                                    className="luxury-input min-h-[120px] py-6 resize-none"
                                    placeholder="Enter complex task requirements..."
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="flex-1 py-5 rounded-2xl bg-muted text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] luxury-btn py-6 vibrant-collage shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Authorize Assignment <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }

            {/* Add Team Member Modal */}
            {
                showMemberModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-12 lg:pl-80">
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowMemberModal(false)}></div>
                        <div className="relative w-full max-w-xl bg-card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl border border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                                    <UserPlus className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">New Operative</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Internal Personnel Induction</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateMember} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">First Name</label>
                                        <input
                                            required
                                            className="luxury-input"
                                            placeholder="James"
                                            value={memberData.firstName}
                                            onChange={(e) => setMemberData({ ...memberData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Last Name</label>
                                        <input
                                            required
                                            className="luxury-input"
                                            placeholder="Logan"
                                            value={memberData.lastName}
                                            onChange={(e) => setMemberData({ ...memberData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Email Identity</label>
                                    <input
                                        required
                                        type="email"
                                        className="luxury-input"
                                        placeholder="j.logan@md-elite.com"
                                        value={memberData.email}
                                        onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Role/Position</label>
                                        <input
                                            required
                                            className="luxury-input"
                                            placeholder="Operations Lead"
                                            value={memberData.position}
                                            onChange={(e) => setMemberData({ ...memberData, position: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Department</label>
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

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Secure Line (Phone)</label>
                                    <input
                                        className="luxury-input"
                                        placeholder="+1 (555) 000-0000"
                                        value={memberData.phone}
                                        onChange={(e) => setMemberData({ ...memberData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Avatar URL (Profile Picture)</label>
                                    <input
                                        className="luxury-input"
                                        placeholder="https://images.unsplash.com/..."
                                        value={memberData.avatar}
                                        onChange={(e) => setMemberData({ ...memberData, avatar: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowMemberModal(false)}
                                        className="flex-1 py-5 rounded-2xl bg-muted text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] luxury-btn py-5 shadow-2xl shadow-primary/20"
                                    >
                                        Confirm Induction <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

