'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Calendar,
    Briefcase,
    Users,
    MessageSquare,
    BookOpen,
    Mail,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Globe,
    FileText,
    ChevronLeft,
    ChevronRight,
    Shield,
    Zap
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
    { name: 'Calendar', href: '/admin/calendar', icon: Calendar, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
    { name: 'Financials', href: '/admin/invoices', icon: FileText, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Team', href: '/admin/team', icon: Users, roles: ['ADMIN', 'MANAGER', 'REPORTER'] },
    { name: 'Clients', href: '/admin/clients', icon: Users, roles: ['ADMIN'] },
    { name: 'Reporters', href: '/admin/reporters', icon: Users, roles: ['ADMIN'] },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
    { name: 'Content', href: '/admin/content', icon: BookOpen, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Campaigns', href: '/admin/email-campaigns', icon: Mail, roles: ['ADMIN'] },
    { name: 'Service Nodes', href: '/admin/services', icon: Zap, roles: ['ADMIN'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN', 'REPORTER'] },
]

interface AdminSidebarProps {
    isCollapsed: boolean
    toggleCollapse: () => void
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function AdminSidebar({ isCollapsed, toggleCollapse, isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname()
    const { theme } = useTheme()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) setUser(JSON.parse(storedUser))
    }, [])

    const filteredNavigation = navigation.filter(item => {
        if (!user) return false
        const userRole = user.role?.toUpperCase() || ''
        if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') return true
        return item.roles.includes(userRole)
    })

    return (
        <>
            {/* Mobile menu button */}
            <button
                type="button"
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-2xl text-foreground bg-card border border-border shadow-2xl active:scale-90 transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Elite Sidebar for desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-[500] flex flex-col border-r border-border transition-all duration-300 ease-in-out transform lg:translate-x-0 
                    bg-card
                    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                    ${isCollapsed ? 'lg:w-20 w-72' : 'lg:w-72 w-72'}`}
            >
                {/* Brand Identity Section */}
                <div className={`flex flex-col relative overflow-hidden h-[100px] justify-center border-b border-border transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-6'}`}>
                    {/* Animated background glow */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 animate-pulse"></div>

                    <div className={`flex items-center gap-4 relative z-10 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative group">
                            <div className="absolute -inset-1.5 bg-primary rounded-xl blur-lg opacity-10 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                            <div className="relative h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shadow-2xl border border-primary/20 transform group-hover:rotate-12 transition-transform duration-500">
                                MD
                            </div>
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                                <h1 className="text-xl font-black text-foreground tracking-tighter flex items-center gap-2">
                                    MARINA
                                    <span className="text-primary-foreground font-bold text-[9px] bg-primary px-1.5 py-0.5 rounded-md">PRO</span>
                                </h1>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Stenography CRM</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Scroll Area */}
                <div className="flex-1 flex flex-col overflow-y-auto py-6 space-y-8 custom-scrollbar">
                    <div className={`space-y-2 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                        {!isCollapsed && (
                            <h3 className="px-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">Operations Center</h3>
                        )}
                        <nav className="space-y-1">
                            {filteredNavigation.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) setIsOpen(false)
                                        }}
                                        className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]'
                                            : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                                            } ${isCollapsed ? 'justify-center px-0 h-12 w-12 mx-auto' : ''}`}
                                    >
                                        <item.icon className={`h-4.5 w-4.5 flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:text-primary group-hover:rotate-3'
                                            }`} />

                                        {!isCollapsed && (
                                            <span className="ml-3 font-bold text-xs tracking-tight">{item.name}</span>
                                        )}

                                        {isActive && !isCollapsed && (
                                            <div className="absolute right-3 h-1 w-1 rounded-full bg-primary-foreground shadow-[0_0_8px_white] animate-pulse"></div>
                                        )}

                                        {/* Tooltip for collapsed mode */}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-4 px-3 py-1 bg-card text-foreground text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-border">
                                                {item.name}
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Premium Footer */}
                <div className={`p-6 border-t border-border ${isCollapsed ? 'items-center px-2' : ''}`}>
                    {!isCollapsed ? (
                        <div className="bg-muted/50 rounded-[1.25rem] p-4 border border-border mt-auto">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">v2.4.0</span>
                                </div>
                                <Shield className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[10px] font-black text-foreground uppercase tracking-tighter">Encryption Active</p>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">Enterprise Tier</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-8 w-8 mx-auto rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
                        </div>
                    )}
                </div>

                {/* Collapse Control */}
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-8 h-7 w-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-xl hover:scale-110 transition-transform duration-300 z-50 lg:flex hidden border-2 border-background"
                >
                    {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>
            </aside>
        </>
    )
}
