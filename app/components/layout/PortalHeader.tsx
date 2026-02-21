'use client'

import { Bell, MessageSquare, Settings, LogOut, User, Moon, Sun, ChevronDown, Check, Clock } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'
import { format } from 'date-fns'

export default function PortalHeader({ userRole }: { userRole?: string }) {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const [isMsgOpen, setIsMsgOpen] = useState(false)

    const [pendingBookings, setPendingBookings] = useState<any[]>([])
    const [recentMessages, setRecentMessages] = useState<any[]>([])
    const [unreadMsgCount, setUnreadMsgCount] = useState(0)

    const notifRef = useRef<HTMLDivElement>(null)
    const msgRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false)
            if (msgRef.current && !msgRef.current.contains(event.target as Node)) setIsMsgOpen(false)
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token || !userRole) return

            // Fetch Bookings (Notifications)
            const statusParam = userRole === 'CLIENT' ? 'ACCEPTED' : 'ASSIGNED'
            const bookingRes = await fetch(`/api/bookings?status=${statusParam}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (bookingRes.ok) {
                const data = await bookingRes.json()
                setPendingBookings(data.bookings || [])
            }

            // Fetch Messages
            const msgRes = await fetch('/api/messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (msgRes.ok) {
                const data = await msgRes.json()
                const msgs = data.messages || []
                setRecentMessages(msgs.slice(-5).reverse())
                setUnreadMsgCount(msgs.filter((m: any) => !m.isRead && m.recipientId === (user?.id || user?.userId)).length)
            }
        } catch { /* silent */ }
    }, [userRole, user?.id])

    useEffect(() => {
        fetchData()
        const id = setInterval(fetchData, 30_000)
        return () => clearInterval(id)
    }, [fetchData])

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
                           h-[64px] px-3 sm:px-6
                           bg-card/90 backdrop-blur-md border-b border-border">

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <span className="text-[10px] font-black uppercase">MD</span>
                </div>
            </div>

            {/* Greeting — desktop */}
            <div className="hidden lg:block pl-2">
                <p className="text-sm font-medium text-foreground">
                    {user ? `${user.firstName} ${user.lastName}` : 'Welcome back'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                    {userRole?.toLowerCase()} portal
                </p>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button onClick={toggleTheme}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all active:scale-90"
                    aria-label="Toggle theme">
                    {theme === 'light'
                        ? <Moon className="h-4 w-4" />
                        : <Sun className="h-4 w-4 text-amber-500" />
                    }
                </button>

                {/* Messages Dropdown */}
                <div className="relative" ref={msgRef}>
                    <button
                        onClick={() => { setIsMsgOpen(!isMsgOpen); setIsNotifOpen(false); setIsProfileOpen(false); }}
                        className={`p-2 rounded-lg transition-all border ${isMsgOpen ? 'bg-muted border-border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted border-transparent hover:border-border'}`}
                        aria-label="Messages">
                        <MessageSquare className="h-4 w-4" />
                        {unreadMsgCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-0.5 text-[10px] font-bold
                                             bg-primary text-white rounded-full flex items-center justify-center border border-card">
                                {unreadMsgCount}
                            </span>
                        )}
                    </button>

                    {isMsgOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[500]">
                            <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-muted/30">
                                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Communications</h3>
                                <Link href={messagesHref} onClick={() => setIsMsgOpen(false)} className="text-[10px] font-bold text-primary hover:underline">View All</Link>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {recentMessages.length > 0 ? (
                                    recentMessages.map((msg) => (
                                        <button
                                            key={msg.id}
                                            onClick={() => {
                                                router.push(messagesHref);
                                                setIsMsgOpen(false);
                                            }}
                                            className="w-full px-4 py-3 flex gap-3 hover:bg-muted transition-colors border-b border-border/50 text-left last:border-0"
                                        >
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${msg.senderId === user?.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                {msg.sender?.firstName?.[0] ?? '?'}{msg.sender?.lastName?.[0] ?? ''}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="text-xs font-bold text-foreground truncate">{msg.sender?.firstName} {msg.sender?.lastName}</p>
                                                    <p className="text-[8px] font-medium text-muted-foreground whitespace-nowrap">{format(new Date(msg.createdAt), 'HH:mm')}</p>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground truncate">{msg.content}</p>
                                            </div>
                                            {!msg.isRead && msg.recipientId === (user?.id || user?.userId) && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <MessageSquare className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No transmissions</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Dropdown (Using pendingBookings) */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setIsNotifOpen(!isNotifOpen); setIsMsgOpen(false); setIsProfileOpen(false); }}
                        className={`relative p-2 rounded-lg transition-all border ${isNotifOpen ? 'bg-muted border-border text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted border-transparent hover:border-border'}`}
                        aria-label="Notifications">
                        <Bell className="h-4 w-4" />
                        {pendingBookings.length > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-0.5 text-[10px] font-bold
                                             bg-amber-500 text-white rounded-full flex items-center justify-center border border-card animate-pulse">
                                {pendingBookings.length}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[500]">
                            <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-muted/30">
                                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">System Alerts</h3>
                                <Link href={notifHref} onClick={() => setIsNotifOpen(false)} className="text-[10px] font-bold text-primary hover:underline">View All</Link>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {pendingBookings.length > 0 ? (
                                    pendingBookings.slice(0, 5).map((booking) => (
                                        <button
                                            key={booking.id}
                                            onClick={() => {
                                                const url = userRole === 'CLIENT'
                                                    ? `/client/confirm/${booking.id}`
                                                    : `/reporter/portal?tab=jobs`;
                                                router.push(url);
                                                setIsNotifOpen(false);
                                            }}
                                            className="w-full px-4 py-3 flex gap-3 hover:bg-muted transition-colors border-b border-border/50 text-left last:border-0 group"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-foreground uppercase tracking-tight mb-0.5 truncate">{booking.proceedingType}</p>
                                                <p className="text-[9px] font-medium text-muted-foreground uppercase">{userRole === 'CLIENT' ? 'Awaiting your confirmation' : 'New job assignment'}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Check className="h-3 w-3 text-amber-500" />
                                                    <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">{booking.bookingStatus}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <Bell className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status Green - No Alerts</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); setIsMsgOpen(false); }}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all ${isProfileOpen ? 'bg-muted border-border' : 'hover:bg-muted border-transparent hover:border-border'}`}
                    >
                        <div className="h-7 w-7 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
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
                        <div className="absolute right-0 top-full mt-2 w-56 z-[500]
                                        bg-card border border-border rounded-xl shadow-xl
                                        overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-border bg-muted/20">
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
                    )}
                </div>
            </div>
        </header>
    )
}
