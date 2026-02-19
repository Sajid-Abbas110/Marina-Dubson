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
    FileText,
    ChevronLeft,
    ChevronRight,
    Shield,
    Zap,
    Scale,
    UserCheck,
    UserCog
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const navigation = [
    {
        section: 'Operations',
        items: [
            { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
            { name: 'Calendar', href: '/admin/calendar', icon: Calendar, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
            { name: 'Bookings', href: '/admin/bookings', icon: Calendar, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
            { name: 'Jobs', href: '/admin/jobs', icon: Briefcase, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
        ]
    },
    {
        section: 'Finance',
        items: [
            { name: 'Invoices', href: '/admin/invoices', icon: FileText, roles: ['ADMIN', 'MANAGER'] },
            { name: 'Reports', href: '/admin/reports', icon: BarChart3, roles: ['ADMIN', 'MANAGER'] },
        ]
    },
    {
        section: 'People',
        items: [
            { name: 'Team', href: '/admin/team', icon: Users, roles: ['ADMIN', 'MANAGER', 'REPORTER'] },
            { name: 'Clients', href: '/admin/clients', icon: UserCheck, roles: ['ADMIN'] },
            { name: 'Reporters', href: '/admin/reporters', icon: UserCog, roles: ['ADMIN'] },
            { name: 'Messages', href: '/admin/messages', icon: MessageSquare, roles: ['ADMIN', 'MANAGER', 'STAFF', 'REPORTER'] },
        ]
    },
    {
        section: 'Content',
        items: [
            { name: 'Content', href: '/admin/content', icon: BookOpen, roles: ['ADMIN', 'MANAGER'] },
            { name: 'Campaigns', href: '/admin/email-campaigns', icon: Mail, roles: ['ADMIN'] },
            { name: 'Services', href: '/admin/services', icon: Zap, roles: ['ADMIN'] },
        ]
    },
    {
        section: 'System',
        items: [
            { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN', 'REPORTER'] },
        ]
    },
]

interface AdminSidebarProps {
    isCollapsed: boolean
    toggleCollapse: () => void
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function AdminSidebar({ isCollapsed, toggleCollapse, isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) setUser(JSON.parse(storedUser))
    }, [])

    const userRole = user?.role?.toUpperCase() || ''
    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
    }

    return (
        <>
            {/* Mobile toggle */}
            <button
                type="button"
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
            >
                {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-[500] flex flex-col
                    border-r transition-all duration-300 ease-in-out
                    lg:translate-x-0
                    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                    ${isCollapsed ? 'lg:w-[68px] w-64' : 'lg:w-60 w-64'}
                `}
                style={{ background: 'hsl(210 45% 17%)', borderColor: 'hsl(210 35% 23%)' }}
            >
                {/* Logo area */}
                <div className={`
                    flex items-center h-[64px] border-b px-5 gap-3 flex-shrink-0
                    ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                `}
                    style={{ borderColor: 'hsl(210 35% 23%)' }}>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                        style={{ background: 'hsl(38 80% 55%)' }}>
                        <Scale className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in overflow-hidden">
                            <p className="text-white font-bold text-sm leading-none truncate"
                                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                Marina Dubson
                            </p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: 'hsl(210 15% 60%)' }}>
                                Admin Portal
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: 'none' }}>
                    {navigation.map((section) => {
                        // Filter items by role
                        const filtered = section.items.filter(item => {
                            if (!user) return false
                            if (isAdmin) return true
                            return item.roles.includes(userRole)
                        })
                        if (filtered.length === 0) return null

                        return (
                            <div key={section.section} className="mb-1">
                                {!isCollapsed && (
                                    <p className="px-5 py-2 text-[10px] font-semibold uppercase tracking-widest"
                                        style={{ color: 'hsl(210 15% 45%)' }}>
                                        {section.section}
                                    </p>
                                )}
                                <nav className={`space-y-0.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                                    {filtered.map((item) => {
                                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => { if (window.innerWidth < 1024) setIsOpen(false) }}
                                                title={isCollapsed ? item.name : undefined}
                                                className={`
                                                    group relative flex items-center gap-3 rounded-lg
                                                    transition-all duration-150
                                                    ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'}
                                                    ${isActive
                                                        ? 'text-white'
                                                        : 'hover:text-white'
                                                    }
                                                `}
                                                style={{
                                                    background: isActive ? 'hsl(38 80% 55% / 0.18)' : 'transparent',
                                                    color: isActive ? 'hsl(38 80% 70%)' : 'hsl(210 15% 68%)',
                                                    borderLeft: isActive ? '2px solid hsl(38 80% 55%)' : '2px solid transparent',
                                                }}
                                            >
                                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                                {!isCollapsed && (
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                )}

                                                {/* Tooltip for collapsed */}
                                                {isCollapsed && (
                                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                                          opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50
                                                          transition-opacity duration-150 shadow-lg"
                                                        style={{
                                                            background: 'hsl(210 40% 22%)',
                                                            color: 'hsl(40 20% 90%)',
                                                            border: '1px solid hsl(210 35% 28%)'
                                                        }}>
                                                        {item.name}
                                                    </div>
                                                )}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>
                        )
                    })}
                </div>

                {/* User footer */}
                <div className={`flex-shrink-0 border-t p-3 ${isCollapsed ? 'items-center flex flex-col gap-2' : ''}`}
                    style={{ borderColor: 'hsl(210 35% 23%)' }}>

                    {user && !isCollapsed && (
                        <div className="flex items-center gap-3 px-2 py-2 mb-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: 'hsl(210 65% 45%)' }}>
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs truncate" style={{ color: 'hsl(210 15% 55%)' }}>
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`
                            flex items-center gap-3 rounded-lg px-3 py-2 w-full text-sm font-medium
                            transition-all duration-150 hover:opacity-100 opacity-70
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                        style={{ color: 'hsl(0 65% 65%)' }}
                        title={isCollapsed ? 'Sign out' : undefined}
                    >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span>Sign out</span>}
                    </button>
                </div>

                {/* Collapse toggle (desktop only) */}
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-[76px] h-6 w-6 rounded-full
                               flex items-center justify-center shadow-md
                               border-2 transition-all hover:scale-110 duration-200 lg:flex hidden"
                    style={{
                        background: 'hsl(38 80% 55%)',
                        borderColor: 'hsl(210 45% 17%)',
                        color: 'white'
                    }}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed
                        ? <ChevronRight className="h-3 w-3" />
                        : <ChevronLeft className="h-3 w-3" />
                    }
                </button>
            </aside>
        </>
    )
}
