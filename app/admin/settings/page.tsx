'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Settings,
    User,
    Shield,
    Bell,
    Lock,
    Database,
    Zap,
    Terminal,
    Globe,
    Fingerprint,
    ArrowRight,
    ChevronRight,
    Command,
    Smartphone,
    Cloud,
    Power,
    CheckCircle2,
    MessageSquare,
    Loader2,
    BadgeCheck
} from 'lucide-react'
import ProfileUpload from '@/app/components/ui/ProfileUpload'

export default function AdministrativeSettingsPage() {
    const [activeTab, setActiveTab] = useState('PROFILE')
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        availability: '',
        portfolio: '',
        certification: '',
        bio: '',
        twoFactor: true,
        encryption: true,
        ipWhitelist: false,
        cachePurge: true,
        autoLinking: true,
        directMessaging: true,
        directoryVisibility: false
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user)
                    setFormData(prev => ({
                        ...prev,
                        firstName: data.user.firstName || '',
                        lastName: data.user.lastName || '',
                        email: data.user.email || '',
                        company: data.user.company || 'Marina Dubson Stenographic',
                        availability: data.user.availability || '(917) 494-1859',
                        portfolio: data.user.portfolio || 'MarinaDubson@gmail.com',
                        certification: data.user.certification || '12A Saturn Lane, Staten Island, NY',
                        bio: data.user.bio || 'Directing the future of stenographic excellence.'
                    }))
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

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
                window.dispatchEvent(new Event('user-profile-updated'))
            }
        } catch (error) {
            console.error('Failed to update avatar:', error)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                localStorage.setItem('user', JSON.stringify(data.user))
                window.dispatchEvent(new Event('user-profile-updated'))
                alert('Settings updated successfully!')
            } else {
                const errorData = await res.json()
                alert(`Failed: ${errorData.error || 'Update Error'}`)
            }
        } catch (err) {
            console.error('Save error:', err)
            alert('An error occurred while saving')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
            {/* Sticky Settings Header */}
            <div className="sticky top-0 z-[400] -mx-4 lg:-mx-12 px-4 lg:px-12 py-4 bg-background/80 backdrop-blur-md border-b border-border mb-8">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase">
                            Configuration <span className="text-primary italic">Core</span>
                        </h1>
                        <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">System Instance & Authority Settings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={saving}
                            onClick={handleSave}
                            className="h-10 px-8 rounded-xl bg-primary text-white font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                            Commit System Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Control Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Hierarchy Controls</h3>
                        <nav className="flex flex-col gap-1.5">
                            <SettingsTab active={activeTab === 'PROFILE'} onClick={() => setActiveTab('PROFILE')} icon={<User />} label="Root Identity" />
                            <SettingsTab active={activeTab === 'SECURITY'} onClick={() => setActiveTab('SECURITY')} icon={<Shield />} label="Security" />
                            <SettingsTab active={activeTab === 'NETWORK'} onClick={() => setActiveTab('NETWORK')} icon={<Globe />} label="Network Grid" />
                            <SettingsTab active={activeTab === 'SYSTEM'} onClick={() => setActiveTab('SYSTEM')} icon={<Terminal />} label="Core Engine" />
                            <SettingsTab active={activeTab === 'NOTIFICATIONS'} onClick={() => setActiveTab('NOTIFICATIONS')} icon={<Bell />} label="Notifications" />
                        </nav>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-inner group">
                        <Power className="h-6 w-6 text-gray-300 dark:text-gray-600 mb-3 group-hover:text-rose-500 transition-colors" />
                        <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-0.5">Emergency Off-Grid</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed tracking-tighter">Temporarily disable all external API endpoints and secure the system.</p>
                        <button className="w-full py-3 mt-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[9px] font-black uppercase text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all">Enable Lockdown</button>
                    </div>
                </aside>

                {/* Main Settings Canvas */}
                <div className="lg:col-span-3 space-y-8">
                    {activeTab === 'PROFILE' && (
                        <div className="glass-panel rounded-[2rem] p-8 space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="flex flex-col md:flex-row md:items-center gap-8 pb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="flex-shrink-0">
                                    <ProfileUpload
                                        label="Command Identity"
                                        currentImage={user?.avatar}
                                        onUploadComplete={handleAvatarUpdate}
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                        {formData.firstName} {formData.lastName}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                                        {user?.role || 'ADMINISTRATOR'} • Access Point
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SettingsField label="Professional First Name" value={formData.firstName} onChange={(v: string) => setFormData({ ...formData, firstName: v })} />
                                <SettingsField label="Professional Last Name" value={formData.lastName} onChange={(v: string) => setFormData({ ...formData, lastName: v })} />
                                <SettingsField label="Global Command Email" value={formData.email} disabled />
                                <SettingsField label="Public Company Name" value={formData.company} onChange={(v: string) => setFormData({ ...formData, company: v })} />
                                <SettingsField label="Public Contact Phone" value={formData.availability} onChange={(v: string) => setFormData({ ...formData, availability: v })} />
                                <SettingsField label="Public Contact Email" value={formData.portfolio} onChange={(v: string) => setFormData({ ...formData, portfolio: v })} />
                            </div>

                            <SettingsField label="Public Address" value={formData.certification} onChange={(v: string) => setFormData({ ...formData, certification: v })} />
                            <SettingsField label="Biography Asset" value={formData.bio} onChange={(v: string) => setFormData({ ...formData, bio: v })} isTextArea />

                            <div className="pt-8 border-t border-border flex justify-end">
                                <button
                                    disabled={saving}
                                    onClick={handleSave}
                                    className="px-8 py-3 rounded-xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                                >
                                    {saving ? 'Synchronizing...' : 'Update Root Profile'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SECURITY' && (
                        <div className="glass-panel rounded-[3rem] p-12 space-y-10 animate-in slide-in-from-right-8 duration-500">
                            <div className="space-y-8">
                                <SecurityToggle
                                    label="Two-Factor Fingerprint Auth"
                                    status={formData.twoFactor ? "Enabled" : "Disabled"}
                                    icon={<Fingerprint className="text-primary" />}
                                    active={formData.twoFactor}
                                    onClick={() => setFormData({ ...formData, twoFactor: !formData.twoFactor })}
                                />
                                <SecurityToggle
                                    label="End-to-End Transcript Encryption"
                                    status={formData.encryption ? "Military Grade (AES-256)" : "Standard"}
                                    icon={<Lock className="text-emerald-500" />}
                                    active={formData.encryption}
                                    onClick={() => setFormData({ ...formData, encryption: !formData.encryption })}
                                />
                                <SecurityToggle
                                    label="IP Access Whitelist"
                                    status={formData.ipWhitelist ? "Restricted" : "Open Access"}
                                    icon={<Shield className="text-purple-500" />}
                                    active={formData.ipWhitelist}
                                    onClick={() => setFormData({ ...formData, ipWhitelist: !formData.ipWhitelist })}
                                />
                                <SecurityToggle
                                    label="Automatic Cache Purge"
                                    status={formData.cachePurge ? "Every 24 Hours" : "Off"}
                                    icon={<Zap className="text-yellow-500" />}
                                    active={formData.cachePurge}
                                    onClick={() => setFormData({ ...formData, cachePurge: !formData.cachePurge })}
                                />
                            </div>

                            <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Command className="h-10 w-10 text-gray-200 dark:text-gray-700" />
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase">Change Security Access Key</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">Last updated 14 days ago</p>
                                    </div>
                                </div>
                                <button className="px-6 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[10px] font-black uppercase text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">Initiate Reset</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'NETWORK' && (
                        <div className="glass-panel rounded-[2rem] p-8 space-y-8 animate-in slide-in-from-right-8 duration-500">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Network Grid Coordination</h3>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1.5">Manage the links between legal clients and stenographic professionals.</p>
                            </div>
                            <div className="space-y-6">
                                <SecurityToggle
                                    label="Automated Personnel Linking"
                                    status={formData.autoLinking ? "Active" : "Manual Only"}
                                    icon={<Globe className="text-primary" />}
                                    active={formData.autoLinking}
                                    onClick={() => setFormData({ ...formData, autoLinking: !formData.autoLinking })}
                                />
                                <SecurityToggle
                                    label="Inter-Portal Direct Messaging"
                                    status={formData.directMessaging ? "Allowed" : "Disabled"}
                                    icon={<MessageSquare className="text-emerald-500" />}
                                    active={formData.directMessaging}
                                    onClick={() => setFormData({ ...formData, directMessaging: !formData.directMessaging })}
                                />
                                <SecurityToggle
                                    label="Global Directory Visibility"
                                    status={formData.directoryVisibility ? "Visible" : "Hidden"}
                                    icon={<Database className="text-purple-500" />}
                                    active={formData.directoryVisibility}
                                    onClick={() => setFormData({ ...formData, directoryVisibility: !formData.directoryVisibility })}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'SYSTEM' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500">
                            <InfrastructureCard label="PostgreSQL Global Instance" status="Healthy" icon={<Database className="text-indigo-400" />} load="12%" />
                            <InfrastructureCard label="Cloud Asset Storage (AWS)" status="Syncing" icon={<Cloud className="text-primary" />} load="44%" />
                            <InfrastructureCard label="Real-time Stream Relay" status="Online" icon={<Zap className="text-amber-400" />} load="08%" />
                            <InfrastructureCard label="Auth0 Identity Provider" status="Verified" icon={<Fingerprint className="text-rose-400" />} load="02%" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function SettingsTab({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-500 group ${active
                ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 hover:shadow-lg hover:shadow-gray-200/20'
                }`}
        >
            <div className={`transition-all duration-500 ${active ? 'text-white' : 'text-gray-300 group-hover:text-primary group-hover:rotate-12'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-left">{label}</span>
            {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
        </button>
    )
}

function SettingsField({ label, value, onChange, disabled, isTextArea }: any) {
    const inputClasses = "w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all disabled:opacity-50";

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">{label}</label>
            {isTextArea ? (
                <textarea
                    className={inputClasses + " min-h-[120px] resize-none leading-relaxed"}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                />
            ) : (
                <input
                    className={inputClasses}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                />
            )}
        </div>
    )
}

function SecurityToggle({ label, status, icon, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:shadow-lg transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{label}</h4>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{status}</p>
                </div>
            </div>
            <div className={`h-8 w-14 rounded-full p-1 flex items-center transition-all ${active ? 'bg-emerald-500 justify-end' : 'bg-gray-200 dark:bg-gray-700 justify-start'} relative shadow-inner`}>
                <div className="h-6 w-6 rounded-full bg-white shadow-lg"></div>
            </div>
        </div>
    )
}

function InfrastructureCard({ label, status, icon, load }: any) {
    return (
        <div className="glass-panel p-6 rounded-[2rem] space-y-6 border border-gray-100 dark:border-white/5 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-white/10 group-hover:shadow-md transition-all">
                    <div className="scale-90">{icon}</div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Active Load</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">{load}</p>
                </div>
            </div>
            <div>
                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1.5">{label}</h4>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{status}</span>
                </div>
            </div>
            <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: load }}></div>
            </div>
        </div>
    )
}
