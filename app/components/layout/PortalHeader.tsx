'use client'

import { Bell, Search, MessageSquare, ChevronDown, Settings, LogOut, User, Command, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

export default function PortalHeader({ userRole }: { userRole?: string }) {
    const router = useRouter()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState({
        unreadMessages: 0,
        pendingBookings: 0
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            // 1. Fetch relevant bookings based on role
            let pendingCount = 0
            if (userRole === 'CLIENT') {
                // Clients care about ACCEPTED bookings (awaiting their confirmation)
                const res = await fetch('/api/bookings?status=ACCEPTED', { headers: { 'Authorization': `Bearer ${token}` } })
                const data = await res.json()
                pendingCount = (data.bookings || []).length
            } else if (userRole === 'REPORTER') {
                // Reporters care about ASSIGNED bookings? Or just new ones. 
                // For now, let's just show total active bookings
                const res = await fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } })
                const data = await res.json()
                // Maybe filter purely "ASSIGNED" ones?
                pendingCount = (data.bookings || []).filter((b: any) => b.bookingStatus === 'ASSIGNED').length
            } else {
                // Admin default
                const res = await fetch('/api/bookings?status=SUBMITTED', { headers: { 'Authorization': `Bearer ${token}` } })
                const data = await res.json()
                pendingCount = data.total || 0
            }

            // 2. Fetch Unread Messages
            const messagesRes = await fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } })
            const messagesData = await messagesRes.json()
            // Admin gets 'conversations', users get 'messages'. Standardize?
            // Client/Reporter /api/messages returns explicit messages list.
            // Let's count unread if we had a field. For now, show total count of recent?
            // Actually, for portals, /api/messages returns all messages.
            // Let's just use 0 for now to avoid noise, or maybe implement unread count later.
            const messageCount = 0 // Placeholder until unread API exists

            setStats({
                unreadMessages: messageCount,
                pendingBookings: pendingCount
            })

        } catch (error) {
            console.error('Failed to fetch header stats:', error)
        }
    }

    useEffect(() => {
        if (userRole) {
            fetchNotifications()
            const interval = setInterval(fetchNotifications, 30000)
            return () => clearInterval(interval)
        }
    }, [userRole])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        router.push('/login')
    }

    return (
        <header className={`sticky top-0 z-[450] px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-2xl border-b border-border shadow-md py-2' : 'bg-transparent'
            }`}>
            {/* Command Palette Vibe Search */}
            <div className="flex-1 max-w-lg min-w-0 mr-4 md:mr-6 lg:mr-0 pl-14 lg:pl-0">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder={userRole === 'CLIENT' ? "Search My Cases..." : "Search..."}
                        className="w-full bg-muted/50 backdrop-blur-md border border-border hover:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 rounded-xl pl-11 pr-4 sm:pr-11 py-2 outline-none transition-all duration-500 font-medium text-xs text-foreground shadow-sm"
                    />
                    <div className="absolute right-3 hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-muted border border-border rounded text-muted-foreground">
                        <Command className="h-2 w-2" />
                        <span className="text-[8px] font-black uppercase">K</span>
                    </div>
                </div>
            </div>

            {/* Premium Actions & User Profile */}
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-card hover:bg-muted border border-border transition-all duration-300"
                    >
                        {theme === 'light' ? (
                            <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                            <Sun className="h-3.5 w-3.5 text-yellow-500" />
                        )}
                    </button>
                    <div className="hidden sm:flex items-center gap-1">
                        <Link href={userRole === 'CLIENT' ? "/client/portal?tab=messages" : "/reporter/portal?tab=messages"}>
                            <HeaderAction
                                icon={<MessageSquare className="h-3.5 w-3.5" />}
                                badge={stats.unreadMessages > 0 ? stats.unreadMessages.toString() : undefined}
                            />
                        </Link>
                        <Link href={userRole === 'CLIENT' ? "/client/portal?tab=bookings" : "/reporter/portal?tab=jobs"}>
                            <HeaderAction
                                icon={<Bell className="h-3.5 w-3.5" />}
                                badge={stats.pendingBookings > 0 ? stats.pendingBookings.toString() : undefined}
                                pulse={stats.pendingBookings > 0}
                            />
                        </Link>
                    </div>
                </div>

                <div className="hidden sm:block h-6 w-px bg-border mx-1"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="group flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-all duration-300 border border-transparent hover:border-border"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px] shadow-lg shadow-primary/30 transition-transform">
                                MD
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full"></div>
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <p className="text-[10px] font-black text-foreground uppercase tracking-wider leading-none truncate">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</p>
                            <p className="text-[8px] font-bold text-muted-foreground mt-0.5 uppercase tracking-tighter truncate">{user?.role || 'Portal Access'}</p>
                        </div>
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-500 flex-shrink-0 ${isProfileOpen ? 'rotate-180 text-primary' : 'group-hover:text-foreground'}`} />
                    </button>

                    {/* Elite Dropdown */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-4 w-72 glass-panel rounded-[2rem] overflow-hidden p-3 z-50 bg-card border border-border shadow-2xl">
                                <div className="p-6 bg-primary rounded-[1.5rem] text-primary-foreground mb-2 shadow-lg shadow-primary/20">
                                    <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em] mb-2">Secure Identity</p>
                                    <h4 className="font-black text-lg truncate">{user?.email || 'user@example.com'}</h4>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider">{user?.role}</span>
                                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Link href={userRole === 'CLIENT' ? "/client/portal?tab=settings" : "/reporter/portal?tab=settings"} onClick={() => setIsProfileOpen(false)}>
                                        <DropdownItem icon={<User className="h-4 w-4" />} label="My Profile" />
                                    </Link>
                                    <Link href={userRole === 'CLIENT' ? "/client/portal?tab=settings" : "/reporter/portal?tab=settings"} onClick={() => setIsProfileOpen(false)}>
                                        <DropdownItem icon={<Settings className="h-4 w-4" />} label="Preferences" />
                                    </Link>
                                    <div className="h-px bg-border my-2 mx-4"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-5 py-4 text-sm text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all font-black uppercase tracking-widest group"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LogOut className="h-4 w-4" />
                                        </div>
                                        Sign Out Session
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

function HeaderAction({ icon, badge, pulse }: any) {
    return (
        <div className="relative group p-3 rounded-2xl bg-card hover:bg-muted border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-90 cursor-pointer">
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {icon}
            </div>
            {badge && (
                <span className={`absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-primary text-[10px] font-black text-primary-foreground rounded-full flex items-center justify-center border-2 border-background shadow-lg ${pulse ? 'animate-pulse' : ''}`}>
                    {badge}
                </span>
            )}
        </div>
    )
}

function DropdownItem({ icon, label }: any) {
    return (
        <div className="w-full flex items-center gap-4 px-5 py-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-2xl transition-all font-bold uppercase tracking-widest group text-left">
            <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all group-hover:scale-110">
                {icon}
            </div>
            {label}
        </div>
    )
}
