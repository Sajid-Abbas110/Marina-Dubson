'use client'

import { Bell, MessageSquare, Settings, LogOut, User, Moon, Sun, ChevronDown, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

export default function PortalHeader({ userRole, onMenuClick }: { userRole?: string, onMenuClick?: () => void }) {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))
    }, [])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token || !userRole) return

                const statusParam = userRole === 'CLIENT' ? 'ACCEPTED' : 'ASSIGNED'
                const res = await fetch(`/api/bookings?status=${statusParam}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    const count = userRole === 'CLIENT'
                        ? (data.bookings?.length ?? 0)
                        : (data.bookings?.filter((b: any) => b.bookingStatus === 'ASSIGNED').length ?? 0)
                    setPendingCount(count)
                }
            } catch { /* silent */ }
        }
        fetchStats()
        const id = setInterval(fetchStats, 30_000)
        return () => clearInterval(id)
    }, [userRole])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        router.push('/')
    }

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`
        : '?'

    const messagesHref = userRole === 'CLIENT'
        ? '/client/portal?tab=messages'
        : '/reporter/portal?tab=messages'

    const notifHref = userRole === 'CLIENT'
        ? '/client/portal?tab=bookings'
        : '/reporter/portal?tab=jobs'

    const settingsHref = userRole === 'CLIENT'
        ? '/client/portal?tab=settings'
        : '/reporter/portal?tab=settings'

    return (
        <header className="sticky top-0 z-[450] flex items-center justify-between gap-4
                           h-[64px] px-4 sm:px-6
                           bg-card/90 backdrop-blur-md border-b border-border">

            {/* Greeting — desktop */}
            <div className="hidden lg:block pl-2">
                <p className="text-sm font-medium text-foreground">
                    {user ? `${user.firstName} ${user.lastName}` : 'Welcome back'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                    {userRole?.toLowerCase()} portal
                </p>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors absolute left-4 z-50"
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Spacer */}
            <div className="flex-1 lg:hidden" />
            <div className="flex-1 hidden lg:block pl-2" />

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Theme */}
                <button onClick={toggleTheme}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                    aria-label="Toggle theme">
                    {theme === 'light'
                        ? <Moon className="h-4 w-4" />
                        : <Sun className="h-4 w-4 text-amber-500" />
                    }
                </button>

                {/* Messages */}
                <Link href={messagesHref}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                    aria-label="Messages">
                    <MessageSquare className="h-4 w-4" />
                </Link>

                {/* Notifications */}
                <Link href={notifHref}
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                    aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                    {pendingCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-0.5 text-[10px] font-bold
                                         bg-amber-500 text-white rounded-full flex items-center justify-center border border-card animate-pulse">
                            {pendingCount}
                        </span>
                    )}
                </Link>

                <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(v => !v)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                                   hover:bg-muted border border-transparent hover:border-border transition-all"
                    >
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: 'hsl(210 60% 30%)' }}>
                            {initials}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold text-foreground leading-none">
                                {user?.firstName ?? 'User'}
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
                                <div className="px-4 py-3 border-b border-border">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {user ? `${user.firstName} ${user.lastName}` : 'User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                        {user?.email ?? ''}
                                    </p>
                                </div>
                                <div className="py-1.5">
                                    <Link href={settingsHref} onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        My Profile
                                    </Link>
                                    <Link href={settingsHref} onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        Settings
                                    </Link>
                                </div>
                                <div className="border-t border-border py-1.5">
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left
                                                   text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
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
