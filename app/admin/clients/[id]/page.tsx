'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    Calendar,
    AlertCircle,
    Briefcase,
    ShieldCheck,
    Edit3,
    Trash2,
    Plus,
    CheckCircle,
    Clock,
    User,
    Upload,
    ArrowRight,
    Loader2,
    Award,
    Save,
    Zap,
    X,
    Check
} from 'lucide-react'
import ProfileUpload from '@/app/components/ui/ProfileUpload'

export default function UserProfilePage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState<any>({})
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
    const [savingTask, setSavingTask] = useState(false)

    useEffect(() => {
        if (showTaskModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [showTaskModal])

    const fetchUser = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch user')
            const data = await res.json()
            setUser(data)
            setEditData(data)
        } catch (error) {
            console.error('Fetch user error:', error)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (id) fetchUser()
    }, [id, fetchUser])

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            })
            if (res.ok) {
                const updated = await res.json()
                setUser(updated)
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Update profile error:', error)
        }
    }

    const [taskError, setTaskError] = useState('')

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingTask(true)
        setTaskError('')
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/admin/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newTask,
                    assignedToId: id
                })
            })

            const data = await res.json()

            if (res.ok) {
                setShowTaskModal(false)
                setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
                fetchUser()
            } else {
                setTaskError(data.error || 'Failed to initialize mission parameters. Check clearance.')
            }
        } catch (error) {
            console.error('Create task error:', error)
            setTaskError('Network protocol failure. Mission aborted.')
        } finally {
            setSavingTask(false)
        }
    }

    const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
            const token = localStorage.getItem('token')
            await fetch(`/api/admin/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })
            fetchUser()
        } catch (error) {
            console.error('Toggle task status error:', error)
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return
        try {
            const token = localStorage.getItem('token')
            await fetch(`/api/admin/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            fetchUser()
        } catch (error) {
            console.error('Delete task error:', error)
        }
    }

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
    )

    if (!user) return (
        <div className="p-12 text-center mt-20">
            <h2 className="text-2xl font-black uppercase text-gray-400">Client Not Found</h2>
            <button onClick={() => router.back()} className="mt-4 text-primary font-bold uppercase tracking-widest flex items-center gap-2 mx-auto justify-center">
                <ArrowLeft className="h-4 w-4" /> Return to Directory
            </button>
        </div>
    )

    const isClient = user.role === 'CLIENT'
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    const initials = (user.firstName?.[0] || user.email[0]).toUpperCase() + (user.lastName?.[0] || '').toUpperCase()

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 pb-32 animate-in fade-in duration-700">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Matrix
                </button>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                            <button onClick={handleUpdateProfile} className="px-6 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Save className="h-4 w-4" /> Commit Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Edit3 className="h-4 w-4" /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Identity Card */}
                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 relative overflow-hidden text-center">
                        <div className={`absolute top-0 right-0 w-40 h-40 blur-3xl opacity-10 ${isClient ? 'bg-primary' : 'bg-emerald-600'}`}></div>

                        <div className="relative mx-auto h-40 w-40 mb-8 p-1 group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${isClient ? 'from-primary to-indigo-800' : 'from-indigo-500 to-blue-800'} rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                            <div className={`relative h-full w-full rounded-[2.5rem] bg-white dark:bg-[#001c14] border-2 border-white dark:border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] duration-500`}>
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={name} fill className="object-cover" />
                                ) : (
                                    <span className={`text-4xl font-black ${isClient ? 'text-primary' : 'text-indigo-500'}`}>{initials}</span>
                                )}
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 cursor-pointer">
                                        <Upload className="h-6 w-6 mb-2" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-center">Update Avatar URL</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{name}</h2>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${isClient ? 'bg-primary/10 text-primary border-primary/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                            {user.role} Operative
                        </span>

                        <div className="mt-10 space-y-6 text-left">
                            <ProfileField icon={<Mail />} label="Secure Email" value={user.email} isEditing={isEditing} field="email" val={editData.email} onChange={(v: any) => setEditData({ ...editData, email: v })} />
                            <ProfileField icon={<Building2 />} label="Affiliation" value={isClient ? user.company : user.certification} isEditing={isEditing} field={isClient ? "company" : "certification"} val={isClient ? editData.company : editData.certification} onChange={(v: any) => setEditData({ ...editData, [isClient ? 'company' : 'certification']: v })} />
                            <ProfileField icon={<Calendar />} label="Inauguration" value={format(new Date(user.createdAt), 'MMMM dd, yyyy')} isEditing={false} />
                            {isEditing && (
                                <div className="pt-2">
                                    <ProfileUpload
                                        label="Avatar Stream"
                                        currentImage={editData.avatar}
                                        onUploadComplete={(url) => setEditData({ ...editData, avatar: url })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <ShieldCheck className="h-4 w-4 text-primary" /> Security Clearance
                        </h3>
                        <div className="space-y-4">
                            <ClearanceLevel label="Data Sovereignty" level="LEVEL 4" />
                            <ClearanceLevel label="Booking Authority" level="ENABLED" color="text-emerald-500" />
                            <ClearanceLevel label="Financial Trust" level="RESTRICTED" color="text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Active Missions (Tasks) */}
                    <div className="glass-panel rounded-[3.5rem] overflow-hidden border border-gray-100 dark:border-white/5">
                        <div className="px-10 py-8 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-1">Mission Operations</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active tasking and operational requirements</p>
                            </div>
                            <button
                                onClick={() => setShowTaskModal(true)}
                                className="h-12 w-12 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:scale-105 transition-all shadow-xl"
                            >
                                <Plus className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-10 divide-y divide-gray-50 dark:divide-white/5">
                            {!user.assignedTasks || user.assignedTasks.length === 0 ? (
                                <div className="py-20 text-center">
                                    <Briefcase className="h-16 w-16 text-gray-100 dark:text-white/5 mx-auto mb-6" />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Missions Assigned</p>
                                    <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest font-bold">No tasks have been assigned yet</p>
                                </div>
                            ) : (
                                user.assignedTasks?.map((task: any) => (
                                    <div key={task.id} className="py-8 first:pt-0 last:pb-0 group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-6">
                                                <button
                                                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                                                    className={`mt-1 h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === 'COMPLETED' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-gray-200 dark:border-white/10 hover:border-primary'}`}
                                                >
                                                    {task.status === 'COMPLETED' && <CheckCircle className="h-4 w-4" />}
                                                </button>
                                                <div>
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h4 className={`text-lg font-black uppercase tracking-tight ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{task.title}</h4>
                                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' : task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 max-w-xl">{task.description || 'No detailed briefing provided.'}</p>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Due {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No Deadline'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <Award className="h-3.5 w-3.5" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{task.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleDeleteTask(task.id)} className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Operational History */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <StatsCard title="Completed Missions" value={user.assignedTasks?.filter((t: any) => t.status === 'COMPLETED')?.length || 0} icon={<CheckCircle className="text-primary" />} />
                        <StatsCard title="Total Tasks" value={user.assignedTasks?.length || 0} icon={<Zap className="text-amber-500" />} />
                    </div>
                </div>
            </div>

            {/* Task Creation Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/60 dark:bg-[#00120d]/80 backdrop-blur-md" onClick={() => setShowTaskModal(false)}></div>
                    <div className="relative w-full max-w-xl bg-white dark:bg-[#020617] rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-6 mb-10">
                            <div className={`h-14 w-14 rounded-2xl ${isClient ? 'bg-primary' : 'bg-indigo-600'} flex items-center justify-center text-white`}>
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Add Task</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Set details for the new task</p>
                            </div>
                            <button onClick={() => setShowTaskModal(false)} className="ml-auto h-12 w-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {taskError && (
                            <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{taskError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Task Title</label>
                                <input
                                    required
                                    className="luxury-input"
                                    placeholder="e.g. Prepare deposition documents"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Priority Level</label>
                                    <select
                                        className="luxury-input"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="LOW">LOW</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HIGH">HIGH</option>
                                        <option value="URGENT">URGENT</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Due Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                                        <input
                                            type="date"
                                            className="luxury-input pl-12"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Notes / Details</label>
                                <textarea
                                    className="luxury-input min-h-[120px] py-6 resize-none"
                                    placeholder="Add any notes or extra details..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowTaskModal(false)}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-muted text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:bg-muted/80 transition-all border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingTask}
                                    className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {savingTask ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Check className="h-4 w-4" />}
                                    <span>Save Task</span>
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

function ProfileField({ icon, label, value, isEditing, field, val, onChange }: any) {
    return (
        <div className="flex gap-5 group">
            <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{label}</p>
                {isEditing && field ? (
                    <input
                        className="w-full bg-transparent border-b border-primary text-sm font-black text-gray-900 dark:text-white focus:outline-none py-1"
                        value={val || ''}
                        onChange={(e) => onChange(e.target.value)}
                    />
                ) : (
                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">{value || 'NOT_SPECIFIED'}</p>
                )}
            </div>
        </div>
    )
}

function ClearanceLevel({ label, level, color = "text-gray-900 dark:text-white" }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group hover:border-primary/20 transition-all">
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${color}`}>{level}</span>
        </div>
    )
}

function StatsCard({ title, value, icon }: any) {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex items-center gap-6 group hover:shadow-2xl transition-all">
            <div className="h-16 w-16 rounded-[1.25rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white uppercase">{value}</p>
            </div>
        </div>
    )
}
