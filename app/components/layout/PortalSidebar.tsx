'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
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

interface NavigationItem {
    name: string
    href: string
    icon: any
    matchPath?: boolean // If true, matches path strictly. If false (default), might match query.
}

interface PortalSidebarProps {
    navigation: NavigationItem[]
    isCollapsed: boolean
    toggleCollapse: () => void
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    userRole: string
}

export default function PortalSidebar({ navigation, isCollapsed, toggleCollapse, isOpen, setIsOpen, userRole }: PortalSidebarProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { theme } = useTheme()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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

            {/* Sidebar for desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-[500] flex flex-col border-r border-border transition-all duration-300 ease-in-out transform lg:translate-x-0 
                    bg-card
                    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                    ${isCollapsed ? 'lg:w-20 w-64' : 'lg:w-64 w-64'}`}
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
                            <div className="flex flex-col transition-opacity duration-300 opacity-100 group">
                                <span className="text-lg font-black tracking-tight text-foreground uppercase flex items-center gap-1">
                                    MARINA <span className="text-primary">DUBSON</span>
                                </span>
                                <span className="text-[9px] font-black tracking-[0.25em] text-muted-foreground uppercase flex items-center gap-1">
                                    <Shield className="h-2.5 w-2.5 text-primary" />
                                    Global Network
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    {navigation.map((item) => {
                        // Check if active: strict path match OR query param match
                        const isActive = item.matchPath
                            ? pathname === item.href
                            : pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '') === item.href || (pathname === item.href && !searchParams.toString())

                        // Fallback matching logic for query params:
                        const isActiveQuery = !item.matchPath && item.href.includes('?') && (pathname + '?' + searchParams.toString()).includes(item.href.split('?')[1])

                        const active = isActive || isActiveQuery

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 mb-1
                                    ${active
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <div className={`flex items-center justify-center transition-colors duration-300 ${active ? 'text-primary-foreground' : 'group-hover:text-primary'}`}>
                                    <item.icon
                                        className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                                        aria-hidden="true"
                                    />
                                </div>
                                {!isCollapsed && (
                                    <span className="ml-3 font-bold uppercase tracking-wider text-[11px] truncate flex-1 transition-all duration-300 group-hover:tracking-widest">
                                        {item.name}
                                    </span>
                                )}
                                {active && !isCollapsed && (
                                    <div className="h-1.5 w-1.5 rounded-full bg-white ml-auto animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-xl whitespace-nowrap z-50 border border-border uppercase tracking-wider">
                                        {item.name}
                                        {/* Little triangle pointer */}
                                        <div className="absolute top-1/2 right-full -mt-1 -mr-1 border-4 border-transparent border-r-popover"></div>
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Collapse Button */}
                <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
                    <button
                        onClick={toggleCollapse}
                        className={`w-full flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 group ring-1 ring-transparent hover:ring-border ${isCollapsed ? 'bg-muted/50' : ''}`}
                    >
                        {isCollapsed ? (
                            <LogOut className="h-5 w-5 transform rotate-180 group-hover:text-primary transition-colors" />
                        ) : (
                            <div className="flex items-center gap-3 w-full px-2">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <LogOut className="h-4 w-4 group-hover:text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Collapse Menu</span>
                                <ChevronLeft className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </button>
                    {!isCollapsed && (
                        <div className="mt-4 flex justify-center">
                            <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] hover:text-primary/60 transition-colors cursor-default">
                                v2.5.0 • SECURE MODE
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}
