'use client'

import { Bell, Search, MessageSquare, Settings, LogOut, User, Moon, Sun, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

// Page title map
const PAGE_TITLES: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/calendar': 'Calendar',
    '/admin/bookings': 'Bookings',
    '/admin/jobs': 'Jobs',
    '/admin/invoices': 'Invoices',
    '/admin/reports': 'Reports',
    '/admin/team': 'Team',
    '/admin/clients': 'Clients',
    '/admin/reporters': 'Reporters',
    '/admin/messages': 'Messages',
    '/admin/content': 'Content',
    '/admin/email-campaigns': 'Email Campaigns',
    '/admin/services': 'Services',
    '/admin/settings': 'Settings',
    '/admin/analytics': 'Analytics',
}

export default function AdminHeader() {
    const router = useRouter()
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [stats, setStats] = useState({ messages: 0, pendingBookings: 0 })

    // Determine page title
    const pageTitle = Object.entries(PAGE_TITLES).find(([key]) =>
        pathname === key || pathname.startsWith(key + '/')
    )?.[1] ?? 'Admin'

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))
    }, [])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const [bookRes, msgRes] = await Promise.allSettled([
                    fetch('/api/bookings?status=SUBMITTED', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/messages/conversations', { headers: { 'Authorization': `Bearer ${token}` } }),
                ])

                const pending = bookRes.status === 'fulfilled' && bookRes.value.ok
                    ? ((await bookRes.value.json()).total ?? 0)
                    : 0
                const msgs = msgRes.status === 'fulfilled' && msgRes.value.ok
                    ? ((await msgRes.value.json()).conversations?.length ?? 0)
                    : 0

                setStats({ pendingBookings: pending, messages: msgs })
            } catch { /* silent */ }
        }

        fetchStats()
        const id = setInterval(fetchStats, 30_000)
        return () => clearInterval(id)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        router.push('/')
    }

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`
        : 'MD'

    return (
        <header className="sticky top-0 z-[450] flex items-center justify-between gap-4
                           h-[64px] px-4 sm:px-6
                           bg-card/90 backdrop-blur-md border-b border-border">

            {/* Page title — desktop */}
            <div className="hidden lg:block pl-2">
                <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {pageTitle}
                </h1>
            </div>

            {/* Search — centred */}
            <div className="flex-1 max-w-xs pl-14 lg:pl-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search…"
                        className="w-full bg-muted/60 border border-border rounded-lg
                                   pl-9 pr-3 py-1.5 text-sm text-foreground
                                   placeholder:text-muted-foreground
                                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                   transition-all duration-200"
                    />
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === 'light'
                        ? <Moon className="h-4 w-4" />
                        : <Sun className="h-4 w-4 text-amber-500" />
                    }
                </button>

                {/* Messages */}
                <Link href="/admin/messages"
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                    aria-label="Messages">
                    <MessageSquare className="h-4 w-4" />
                    {stats.messages > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-0.5 text-[10px] font-bold
                                         bg-primary text-primary-foreground rounded-full flex items-center justify-center border border-card">
                            {stats.messages}
                        </span>
                    )}
                </Link>

                {/* Notifications */}
                <Link href="/admin/bookings?status=SUBMITTED"
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                    aria-label="Pending bookings">
                    <Bell className="h-4 w-4" />
                    {stats.pendingBookings > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-0.5 text-[10px] font-bold
                                         bg-amber-500 text-white rounded-full flex items-center justify-center border border-card animate-pulse">
                            {stats.pendingBookings}
                        </span>
                    )}
                </Link>

                {/* Divider */}
                <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(v => !v)}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg
                                   hover:bg-muted border border-transparent hover:border-border
                                   transition-all duration-200"
                    >
                        <div className="h-7 w-7 rounded-full flex items-center justify-center
                                        text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'hsl(210 60% 30%)' }}>
                            {initials}
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-semibold text-foreground leading-none">
                                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                                {user?.role?.toLowerCase() ?? ''}
                            </p>
                        </div>
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-56 z-50
                                            bg-card border border-border rounded-xl shadow-xl
                                            overflow-hidden animate-fade-in">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {user?.email ?? ''}
                                    </p>
                                </div>

                                {/* Menu items */}
                                <div className="py-1.5">
                                    <Link
                                        href="/admin/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                    >
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/admin/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        Settings
                                    </Link>
                                </div>

                                <div className="border-t border-border py-1.5">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left
                                                   text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
