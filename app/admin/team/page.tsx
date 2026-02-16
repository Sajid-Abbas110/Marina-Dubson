'use client'

import { useState, useEffect } from 'react'
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
    User
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

    const fetchTeam = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/team', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setTeam(data)
        } catch (error) {
            console.error('Failed to fetch team:', error)
        }
    }

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/tasks', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setTasks(data)
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeam()
        fetchTasks()
    }, [])

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/tasks', {
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
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        Service <span className="text-primary italic">Squadrons</span>
                    </h1>
                    <p className="text-gray-500 font-medium font-poppins">Managing the elite personnel handling client service deployments.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group w-full sm:w-auto font-poppins">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            className="w-full sm:min-w-[320px] px-12 py-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 dark:text-white"
                            placeholder="Search Personnel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Matrix Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Roster */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <Users className="h-4 w-4 text-primary" /> Active Personnel
                            </h3>
                            <button
                                onClick={() => openTaskModal()}
                                className="h-10 w-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 hover:scale-105 transition-all shadow-lg"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/5">
                            {loading ? (
                                <div className="p-20 text-center font-black text-xs uppercase tracking-widest text-gray-400">Synchronizing Squadrons...</div>
                            ) : team.map(member => (
                                <div key={member.id} className="p-8 hover:bg-primary/5 transition-all group flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white font-black text-lg">
                                            {member.firstName[0]}{member.lastName[0]}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                                {member.firstName} {member.lastName}
                                            </h4>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase border border-primary/20">
                                                    {member.role}
                                                </span>
                                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {member.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Load Balance</p>
                                            <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                                                {member.assignedTasks.length} Active
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => openTaskModal(member)}
                                            className="h-12 px-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
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
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 h-full">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <Briefcase className="h-4 w-4 text-primary" /> Active Task Grid
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            {tasks.filter(t => t.status !== 'COMPLETED').map(task => (
                                <div key={task.id} className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100 text-primary'
                                            }`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-2">{task.title}</h5>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                                {task.assignedTo?.firstName[0]}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{task.assignedTo?.firstName} {task.assignedTo?.lastName}</span>
                                        </div>
                                        <button className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 hover:text-primary transition-colors">
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status !== 'COMPLETED').length === 0 && (
                                <div className="py-12 text-center">
                                    <CheckCircle className="h-10 w-10 text-gray-100 dark:text-white/10 mx-auto mb-4" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Matrix Clear.<br />No pending deployments.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Proposal Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-[#00120d]/80 backdrop-blur-xl" onClick={() => setShowTaskModal(false)}></div>
                    <div className="relative w-full max-w-xl bg-white dark:bg-[#001c14] rounded-[3rem] p-10 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Deploy Tasking</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Personnel Assignment Protocol</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Objective Title</label>
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
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Assignee Node</label>
                                    <select
                                        className="luxury-input"
                                        value={taskData.assignedToId}
                                        onChange={(e) => setTaskData({ ...taskData, assignedToId: e.target.value })}
                                    >
                                        <option value="">Select Personnel...</option>
                                        {team.map(m => (
                                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Priority Level</label>
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
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Briefing Details</label>
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
                                    className="flex-1 py-5 rounded-2xl bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] luxury-btn py-5 shadow-2xl shadow-primary/20"
                                >
                                    Authorize Assignment <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
