'use client'

import { useState, useEffect } from 'react'
import {
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Search,
    Activity,
    Shield,
    DollarSign,
    Cpu
} from 'lucide-react'

export default function ServicesAdmin() {
    const [services, setServices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        serviceName: '',
        category: 'COURT_REPORTING',
        subService: 'DEPOSITIONS',
        defaultMinimumFee: 400,
        pageRate: 0,
        appearanceFeeRemote: 0,
        appearanceFeeInPerson: 0,
        realtimeFee: 0,
        expediteImmediate: 0,
        expedite1Day: 0,
        expedite2Day: 0,
        expedite3Day: 0,
        description: '',
        active: true,
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/services', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setServices(data.services || [])
        } catch (error) {
            console.error('Failed to fetch services:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (id?: string) => {
        try {
            const token = localStorage.getItem('token')
            const method = id ? 'PATCH' : 'POST'
            const url = id ? `/api/services/${id}` : '/api/services'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setIsEditing(null)
                setIsAdding(false)
                fetchServices()
                resetForm()
            }
        } catch (error) {
            console.error('Failed to save service:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this service node?')) return
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) fetchServices()
        } catch (error) {
            console.error('Failed to delete service:', error)
        }
    }

    const resetForm = () => {
        setFormData({
            serviceName: '',
            category: 'COURT_REPORTING',
            subService: 'DEPOSITIONS',
            defaultMinimumFee: 400,
            pageRate: 0,
            appearanceFeeRemote: 0,
            appearanceFeeInPerson: 0,
            realtimeFee: 0,
            expediteImmediate: 0,
            expedite1Day: 0,
            expedite2Day: 0,
            expedite3Day: 0,
            description: '',
            active: true,
        })
    }

    const startEdit = (service: any) => {
        setIsEditing(service.id)
        setFormData(service)
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto font-poppins">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-4">
                        Service <span className="text-primary italic">Nodes</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] tracking-widest font-black uppercase border border-emerald-100 italic">
                            <Activity className="h-3 w-3 animate-pulse" /> Live Grid
                        </div>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-tight">Configuration matrix for all stenographic service endpoints and rate tiers.</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); resetForm(); }}
                    className="luxury-btn py-4 flex items-center gap-3 shadow-xl shadow-primary/20"
                >
                    <Plus className="h-5 w-5" /> Initialize New Node
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Cpu className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Nodes</p>
                        <p className="text-2xl font-black text-gray-900 leading-none">{services.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Activity className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active Now</p>
                        <p className="text-2xl font-black text-gray-900 leading-none">{services.filter(s => s.active).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                        <DollarSign className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Avg Rate</p>
                        <p className="text-2xl font-black text-gray-900 leading-none">${(services.reduce((acc, s) => acc + s.pageRate, 0) / (services.length || 1)).toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Shield className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Base Min</p>
                        <p className="text-2xl font-black text-gray-900 leading-none">$400.00</p>
                    </div>
                </div>
            </div>

            {/* Quick Seed Action for User */}
            {services.length === 0 && !loading && (
                <div className="p-12 rounded-[3rem] bg-amber-50 border-2 border-dashed border-amber-200 text-center space-y-6">
                    <div className="h-20 w-20 bg-amber-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-amber-600">
                        <Plus className="h-10 w-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-amber-900 uppercase">Operational Void Detected</h3>
                        <p className="text-amber-700 max-w-md mx-auto mt-2">No service nodes are currently broadcasting. Add your first node to enable client bookings.</p>
                    </div>
                </div>
            )}

            <div className="glass-panel rounded-[3rem] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
                    {services.map(service => (
                        <div key={service.id} className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 hover:shadow-2xl hover:border-primary/10 transition-all duration-500 overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${service.active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400 text-gray-400 grayscale'}`}>
                                    <Cpu className="h-7 w-7" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => startEdit(service)} className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 hover:text-primary transition-all flex items-center justify-center">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(service.id)} className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{service.serviceName}</h3>
                            <div className="flex gap-2 mb-6">
                                <span className="px-3 py-1 bg-gray-50 text-[9px] font-black text-gray-500 rounded-full uppercase tracking-widest border border-gray-100">{service.category}</span>
                                <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${service.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {service.active ? 'Active' : 'Offline'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Page Rate</p>
                                    <p className="text-lg font-black text-gray-900">${service.pageRate}/pg</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Remote Fee</p>
                                    <p className="text-lg font-black text-gray-900">${service.appearanceFeeRemote}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || isEditing) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 shadow-3xl relative">
                        <button
                            onClick={() => { setIsAdding(false); setIsEditing(null); }}
                            className="absolute top-10 right-10 h-12 w-12 rounded-2xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all flex items-center justify-center"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-10">
                            {isEditing ? 'Reconfigure' : 'Initialize'} Service <span className="text-primary italic">Node</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Node Designation</label>
                                <input
                                    className="luxury-input"
                                    value={formData.serviceName}
                                    onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                                    placeholder="E.G. PLATINUM STENOGRAPHIC NODE"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Category Matrix</label>
                                <select
                                    className="luxury-input"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="COURT_REPORTING">COURT REPORTING</option>
                                    <option value="LEGAL_PROCEEDINGS">LEGAL PROCEEDINGS</option>
                                </select>
                            </div>

                            <Field label="Base Page Rate ($)" value={formData.pageRate} onChange={(v: any) => setFormData({ ...formData, pageRate: parseFloat(v) })} />
                            <Field label="Remote Presence Fee ($)" value={formData.appearanceFeeRemote} onChange={(v: any) => setFormData({ ...formData, appearanceFeeRemote: parseFloat(v) })} />
                            <Field label="On-Site Attendance ($)" value={formData.appearanceFeeInPerson} onChange={(v: any) => setFormData({ ...formData, appearanceFeeInPerson: parseFloat(v) })} />
                            <Field label="Real-time Stream Sync ($)" value={formData.realtimeFee} onChange={(v: any) => setFormData({ ...formData, realtimeFee: parseFloat(v) })} />

                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Node Specification / Logistics</label>
                                <textarea
                                    className="luxury-input min-h-[120px] py-6 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="DETAILED CAPABILITIES AND PROTOCOLS..."
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end gap-4">
                            <button
                                onClick={() => { setIsAdding(false); setIsEditing(null); }}
                                className="px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                            >
                                Abort Sequence
                            </button>
                            <button
                                onClick={() => handleSave(isEditing || undefined)}
                                className="luxury-btn px-12 py-5 shadow-2xl shadow-primary/30"
                            >
                                {isEditing ? 'Commit Configuration' : 'Activate Node'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Field({ label, value, onChange }: any) {
    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">{label}</label>
            <input
                type="number"
                className="luxury-input"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    )
}
