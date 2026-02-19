'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu, X, ChevronLeft, ChevronRight, LogOut, Scale } from 'lucide-react'

interface NavigationItem {
    name: string
    href: string
    icon: any
    matchPath?: boolean
}

interface PortalSidebarProps {
    navigation: NavigationItem[]
    isCollapsed: boolean
    toggleCollapse: () => void
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    userRole: string
}

export default function PortalSidebar({
    navigation, isCollapsed, toggleCollapse, isOpen, setIsOpen, userRole
}: PortalSidebarProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
    }

    const isActive = (item: NavigationItem) => {
        const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
        if (item.href === currentUrl) return true
        if (item.href.includes('?')) {
            const tabParam = new URLSearchParams(item.href.split('?')[1]).get('tab')
            const currentTab = searchParams.get('tab')
            if (tabParam && currentTab === tabParam) return true
        }
        if (!item.href.includes('?') && !item.matchPath) {
            return pathname === item.href
        }
        return false
    }

    const portalLabel = userRole === 'CLIENT' ? 'Client Portal' : 'Reporter Portal'
    const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` : '?'

    return (
        <>

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-[500] flex flex-col
                    border-r transition-all duration-300 ease-in-out
                    lg:translate-x-0
                    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                    ${isCollapsed ? 'lg:w-[68px] w-64' : 'lg:w-60 w-64'}
                `}
                style={{
                    background: 'hsl(210 45% 17%)',
                    borderColor: 'hsl(210 35% 23%)'
                }}
            >
                {/* Logo */}
                <div
                    className={`flex items-center h-[64px] border-b gap-3 flex-shrink-0
                        ${isCollapsed ? 'lg:justify-center lg:px-0 px-5' : 'px-5'}`}
                    style={{ borderColor: 'hsl(210 35% 23%)' }}
                >
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: 'hsl(38 80% 55%)' }}>
                        <Scale className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden animate-fade-in">
                            <p className="text-white font-bold text-sm leading-none">
                                Marina Dubson
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: 'hsl(210 15% 60%)' }}>
                                {portalLabel}
                            </p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
                    {navigation.map((item) => {
                        const active = isActive(item)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => { if (window.innerWidth < 1024) setIsOpen(false) }}
                                title={isCollapsed ? item.name : undefined}
                                className={`
                                    group relative flex items-center gap-3 rounded-lg
                                    transition-all duration-150
                                    ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
                                `}
                                style={{
                                    background: active ? 'hsl(38 80% 55% / 0.18)' : 'transparent',
                                    color: active ? 'hsl(38 80% 70%)' : 'hsl(210 15% 68%)',
                                    borderLeft: active ? '2px solid hsl(38 80% 55%)' : '2px solid transparent',
                                }}
                            >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.name}</span>
                                )}

                                {/* Tooltip */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium
                                                    opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap
                                                    z-50 transition-opacity duration-150 shadow-lg"
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

                {/* Footer */}
                <div className="flex-shrink-0 border-t p-3"
                    style={{ borderColor: 'hsl(210 35% 23%)' }}>
                    {user && !isCollapsed && (
                        <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
                            <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ background: 'hsl(210 65% 45%)' }}>
                                {initials}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-medium text-white truncate leading-none">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-[10px] mt-0.5 truncate capitalize"
                                    style={{ color: 'hsl(210 15% 55%)' }}>
                                    {user.role?.toLowerCase()}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 w-full text-sm
                                    transition-all duration-150 opacity-60 hover:opacity-100
                                    ${isCollapsed ? 'justify-center' : ''}`}
                        style={{ color: 'hsl(0 65% 65%)' }}
                        title={isCollapsed ? 'Sign out' : undefined}
                    >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Sign out</span>}
                    </button>
                </div>

                {/* Collapse control */}
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
