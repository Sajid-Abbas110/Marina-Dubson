'use client'

import { useState, useEffect } from 'react'
import {
    Briefcase,
    CheckCircle,
    Clock,
    FileText,
    MoreVertical,
    UserCheck,
    Users,
    Search,
    Filter,
    Plus,
    Target,
    Zap,
    ArrowUpRight,
    TrendingUp,
    Shield,
    Trash2,
    Edit3,
    ArrowRight,
    X,
    Calendar,
    MapPin,
    AlertCircle,
    Building2,
    DollarSign,
    Check,
    Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export default function AdministrativeJobNexus() {
    const router = useRouter()
    const [bookings, setBookings] = useState<any[]>([])
    const [contacts, setContacts] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [reporters, setReporters] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedJob, setSelectedJob] = useState<any>(null)

    // Form states
    const [formData, setFormData] = useState({
        contactId: '',
        serviceId: '',
        proceedingType: 'Deposition',
        bookingDate: '',
        bookingTime: '09:00',
        location: '',
        venue: '',
        appearanceType: 'REMOTE' as 'REMOTE' | 'IN_PERSON',
        specialRequirements: '',
        priority: 'MEDIUM'
    })

    const [editFormData, setEditFormData] = useState<any>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (showAddModal || showEditModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [showAddModal, showEditModal])

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const headers = { 'Authorization': `Bearer ${token}` }

            const [bRes, cRes, sRes, rRes] = await Promise.all([
                fetch('/api/bookings', { headers }),
                fetch('/api/contacts', { headers }),
                fetch('/api/services', { headers }),
                fetch('/api/admin/users', { headers })
            ])

            const [bData, cData, sData, rData] = await Promise.all([
                bRes.json(),
                cRes.json(),
                sRes.json(),
                rRes.json()
            ])

            setBookings(Array.isArray(bData.bookings) ? bData.bookings : [])
            setContacts(Array.isArray(cData.contacts) ? cData.contacts : [])
            setServices(Array.isArray(sData.services) ? sData.services : [])
            setReporters((rData.users || []).filter((u: any) => u.role === 'REPORTER'))
        } catch (error) {
            console.error('Failed to fetch jobs data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setShowAddModal(false)
                fetchInitialData()
                // Reset form
                setFormData({
                    contactId: '',
                    serviceId: '',
                    proceedingType: 'Deposition',
                    bookingDate: '',
                    bookingTime: '09:00',
                    location: '',
                    venue: '',
                    appearanceType: 'REMOTE',
                    specialRequirements: '',
                    priority: 'MEDIUM'
                })
            } else {
                const errorData = await res.json()
                alert(`Creation failed: ${errorData.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Failed to create job:', error)
            alert('A critical system error occurred during deployment initiation.')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateJob = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedJob) return
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            // Prepare payload: Convert empty strings back to null for Prisma
            const payload = {
                ...editFormData,
                reporterId: editFormData.reporterId === '' ? null : editFormData.reporterId
            }

            const res = await fetch(`/api/bookings/${selectedJob.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setShowEditModal(false)
                fetchInitialData()
            } else {
                const errorData = await res.json()
                alert(`Update failed: ${errorData.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Failed to update job:', error)
            alert('Communication with the job nexus failed. System error detected.')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteJob = async (id: string) => {
        if (!confirm('Are you sure you want to delete this job node?')) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                fetchInitialData()
            }
        } catch (error) {
            console.error('Failed to delete job:', error)
        }
    }

    const openEditModal = (job: any) => {
        setSelectedJob(job)
        setEditFormData({
            bookingStatus: job.bookingStatus,
            isMarketplace: job.isMarketplace,
            reporterId: job.reporterId || '',
            notes: job.notes || ''
        })
        setShowEditModal(true)
    }

    const filteredBookings = bookings.filter(b => {
        const query = searchQuery.toLowerCase()
        return (
            b.bookingNumber?.toLowerCase().includes(query) ||
            b.proceedingType?.toLowerCase().includes(query) ||
            b.contact?.companyName?.toLowerCase().includes(query) ||
            b.contact?.firstName?.toLowerCase().includes(query) ||
            b.contact?.lastName?.toLowerCase().includes(query)
        )
    })

    const sectors = [
        { title: 'Intake / Pending', status: ['SUBMITTED', 'PENDING'], colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
        { title: 'Confirmed / Active', status: ['ACCEPTED', 'CONFIRMED'], colorClass: 'text-primary bg-primary/10 border-primary/20' },
        { title: 'Completion / QA', status: ['COMPLETED'], colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' }
    ]

    return (
        <div className="max-w-[1600px] w-[95%] mx-auto p-6 lg:p-12 space-y-12 pb-24 animate-in fade-in duration-700 font-poppins selection:bg-primary/10 selection:text-primary">
            {/* Elite Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">
                        Protocol <span className="brand-gradient italic">Inventory</span>
                    </h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] mt-3">Monitoring Job Lifecycle & Resource Matrix</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-6 py-3 rounded-xl bg-muted/50 border border-border outline-none text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
                            placeholder="IDENTIFY JOB_ID..."
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="luxury-button flex items-center gap-3 px-8 py-4 text-[10px] w-full sm:w-auto justify-center"
                    >
                        <Plus className="h-5 w-5" /> Initiate Job Node
                    </button>
                </div>
            </div>

            {/* Matrix View Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <JobStat label="Total Nodes" value={bookings.length.toString()} trend="Global Registry" icon={<Zap />} color="text-primary" />
                <JobStat label="Unassigned" value={bookings.filter(b => !b.reporterId).length.toString()} trend="Priority alert" icon={<Users />} color="text-primary/60" />
                <JobStat label="Active Pool" value={bookings.filter(b => b.bookingStatus === 'ACCEPTED' || b.bookingStatus === 'CONFIRMED').length.toString()} trend="Logistics Live" icon={<Shield />} color="text-primary" />
                <JobStat label="Market Live" value={bookings.filter(b => b.isMarketplace).length.toString()} trend="Open Channels" icon={<TrendingUp />} color="text-primary" />
            </div>

            {/* Job Board Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {sectors.map((sector, idx) => {
                    const sectorBookings = filteredBookings.filter(b => sector.status.includes(b.bookingStatus))
                    return (
                        <div key={idx} className="space-y-6">
                            <div className={`flex items-center justify-between p-4 rounded-2xl border ${sector.colorClass}`}>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{sector.title}</span>
                                <span className="text-[10px] font-black">{sectorBookings.length} NODES</span>
                            </div>
                            <div className="space-y-6 min-h-[200px]">
                                {sectorBookings.length === 0 ? (
                                    <div className="py-12 text-center glass-panel rounded-3xl border-dashed border-2 border-border">
                                        <AlertCircle className="h-8 w-8 text-muted/30 mx-auto mb-3" />
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Sector Empty</p>
                                    </div>
                                ) : (
                                    sectorBookings.map(job => (
                                        <JobOperationalCard
                                            key={job.id}
                                            job={job}
                                            onDelete={() => handleDeleteJob(job.id)}
                                            onEdit={() => openEditModal(job)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Add Job Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-12 sm:lg:pl-80 overflow-hidden">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-card rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-2xl border border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                                <Plus className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Initiate Job Node</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Manual Deployment Protocol</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="ml-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateJob} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Target Contact</label>
                                    <select
                                        required
                                        className="luxury-input"
                                        value={formData.contactId}
                                        onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                                    >
                                        <option value="">Select Contact...</option>
                                        {contacts.map(c => (
                                            <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.companyName || 'Individual'})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Service Node</label>
                                    <select
                                        required
                                        className="luxury-input"
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    >
                                        <option value="">Select Service...</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.serviceName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Proceeding Type</label>
                                    <input
                                        required
                                        className="luxury-input"
                                        placeholder="e.g. Deposition, Hearing"
                                        value={formData.proceedingType}
                                        onChange={(e) => setFormData({ ...formData, proceedingType: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Appearance Logistics</label>
                                    <select
                                        className="luxury-input"
                                        value={formData.appearanceType}
                                        onChange={(e) => setFormData({ ...formData, appearanceType: e.target.value as any })}
                                    >
                                        <option value="REMOTE">REMOTE / VIRTUAL</option>
                                        <option value="IN_PERSON">IN_PERSON / PHYSICAL</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Deployment Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="luxury-input"
                                        value={formData.bookingDate}
                                        onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Operational Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="luxury-input"
                                        value={formData.bookingTime}
                                        onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Location / Venue Intelligence</label>
                                <input
                                    className="luxury-input"
                                    placeholder="e.g. Zoom Link or Physical Address"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-5 rounded-2xl bg-muted text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] luxury-button py-5 shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Authorize Deployment <ArrowRight className="h-4 w-4" /></>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Job Modal */}
            {showEditModal && selectedJob && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-12 sm:lg:pl-80 overflow-hidden">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowEditModal(false)}></div>
                    <div className="relative w-full max-w-xl bg-card rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-2xl border border-border animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-6 mb-10">
                            <div className={`h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground`}>
                                <Edit3 className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Reconfigure Node</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">{selectedJob.bookingNumber}</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="ml-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateJob} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Job Status</label>
                                <select
                                    className="luxury-input"
                                    value={editFormData.bookingStatus}
                                    onChange={(e) => setEditFormData({ ...editFormData, bookingStatus: e.target.value })}
                                >
                                    <option value="SUBMITTED">SUBMITTED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="DECLINED">DECLINED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>

                            <div className="space-y-4 py-4 px-6 rounded-2xl bg-primary/5 border border-primary/20">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${editFormData.isMarketplace ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-card'}`}>
                                        {editFormData.isMarketplace && <Check className="h-4 w-4" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={editFormData.isMarketplace}
                                        onChange={(e) => setEditFormData({ ...editFormData, isMarketplace: e.target.checked })}
                                    />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Push to Logistics Marketplace</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Assigned Operative</label>
                                <select
                                    className="luxury-input"
                                    value={editFormData.reporterId}
                                    onChange={(e) => setEditFormData({ ...editFormData, reporterId: e.target.value })}
                                >
                                    <option value="">Pool / Unassigned</option>
                                    {reporters.map(r => (
                                        <option key={r.id} value={r.id}>{r.firstName} {r.lastName} ({r.certification || 'Reporter'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Operational Notes</label>
                                <textarea
                                    className="luxury-input min-h-[100px] py-4"
                                    value={editFormData.notes}
                                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 py-5 rounded-2xl bg-muted text-[10px] font-black uppercase text-muted-foreground hover:text-foreground transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-[2] luxury-button py-5 shadow-xl transition-all"
                                >
                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update Job Node'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function JobOperationalCard({ job, onDelete, onEdit }: { job: any, onDelete: () => void, onEdit: () => void }) {
    return (
        <div className="glass-panel p-8 rounded-[3rem] group hover:-translate-y-2 transition-all duration-500 relative border border-border bg-card">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all">
                <Briefcase className="h-16 w-16 text-primary" />
            </div>

            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{job.bookingNumber}</span>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${job.priority === 'URGENT' ? 'bg-rose-500 text-white animate-pulse' :
                        job.priority === 'HIGH' ? 'bg-amber-500 text-white' :
                            job.bookingStatus === 'COMPLETED' ? 'bg-primary/20 text-primary border border-primary/30' :
                                'bg-muted text-muted-foreground border border-border'
                        }`}>
                        {job.bookingStatus}
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{job.proceedingType}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <Building2 className="h-3 w-3" />
                {job.contact?.companyName || `${job.contact?.firstName} ${job.contact?.lastName}`}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                    {job.reporter ? (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <UserCheck className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase">{job.reporter.firstName} {job.reporter.lastName}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary-foreground text-primary flex items-center justify-center border border-primary">
                                <Users className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase italic">Unassigned</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/30">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{format(new Date(job.bookingDate), 'MMM dd')}</span>
                </div>
            </div>
        </div>
    )
}

function JobStat({ label, value, trend, icon, color }: any) {
    return (
        <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group border border-border bg-card">
            <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">{label}</p>
            <div className="text-3xl font-black text-foreground tracking-tighter uppercase mb-2">{value}</div>
            <p className={`text-[9px] font-black uppercase tracking-widest ${trend.includes('Priority') || trend.includes('+') ? 'text-primary' : 'text-muted-foreground/40'}`}>{trend}</p>
        </div>
    )
}
