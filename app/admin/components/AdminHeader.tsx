import { Bell, Search, MessageSquare, ChevronDown, Settings, LogOut, User, Command, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme-context'

export default function AdminHeader() {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-[#00120d]/80 backdrop-blur-2xl border-b border-gray-100/50 dark:border-white/5 shadow-xl py-2' : 'bg-transparent'
            }`}>
            {/* Command Palette Vibe Search */}
            <div className="flex-1 max-w-lg min-w-0 mr-4 md:mr-6 lg:mr-0">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 hover:border-gray-200 focus:bg-white dark:focus:bg-[#001f19] focus:ring-4 focus:ring-primary/10 focus:border-primary/50 rounded-xl pl-11 pr-4 sm:pr-11 py-2 outline-none transition-all duration-500 font-medium text-xs text-gray-900 dark:text-white shadow-sm"
                    />
                    <div className="absolute right-3 hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded text-gray-400">
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
                        className="p-2 rounded-lg bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-gray-100 dark:border-white/10 transition-all duration-300"
                    >
                        {theme === 'light' ? (
                            <Moon className="h-3.5 w-3.5 text-gray-400" />
                        ) : (
                            <Sun className="h-3.5 w-3.5 text-yellow-400" />
                        )}
                    </button>
                    <div className="hidden sm:flex items-center gap-1">
                        <HeaderAction icon={<MessageSquare className="h-3.5 w-3.5" />} badge="2" />
                        <HeaderAction icon={<Bell className="h-3.5 w-3.5" />} badge="8" pulse />
                    </div>
                </div>

                <div className="hidden sm:block h-6 w-px bg-gray-100 dark:bg-white/10 mx-1"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="group flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-primary/30 transition-transform">
                                MD
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-[#00120d] rounded-full"></div>
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider leading-none truncate">Marina Dubson</p>
                            <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-tighter truncate">Admin</p>
                        </div>
                        <ChevronDown className={`h-3.5 w-3.5 text-gray-300 transition-transform duration-500 flex-shrink-0 ${isProfileOpen ? 'rotate-180 text-primary' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} />
                    </button>

                    {/* Elite Dropdown */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-4 w-72 glass-dropdown dark:bg-[#001f19] rounded-[2rem] overflow-hidden p-3 z-50 border border-gray-100 dark:border-white/5 shadow-2xl">
                                <div className="p-6 bg-gradient-to-br from-gray-900 to-[#001a12] rounded-[1.5rem] text-white mb-2">
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Primary Identity</p>
                                    <h4 className="font-black text-lg truncate">admin@mariadubson.com</h4>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider">Super Admin</span>
                                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">Active Now</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <DropdownItem icon={<User className="h-4 w-4" />} label="Personal Profile" />
                                    <DropdownItem icon={<Settings className="h-4 w-4" />} label="Security Settings" />
                                    <div className="h-px bg-gray-50 dark:bg-white/5 my-2 mx-4"></div>
                                    <button className="w-full flex items-center gap-4 px-5 py-4 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase tracking-widest group">
                                        <div className="h-10 w-10 rounded-xl bg-red-100/50 dark:bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
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
        <button className="relative group p-3 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-gray-100 dark:border-white/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-90">
            <div className="text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                {icon}
            </div>
            {badge && (
                <span className={`absolute -top-1 -right-1 h-5 min-w-[20px] px-1 bg-primary text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#00120d] shadow-lg ${pulse ? 'animate-pulse' : ''}`}>
                    {badge}
                </span>
            )}
        </button>
    )
}

function DropdownItem({ icon, label }: any) {
    return (
        <button className="w-full flex items-center gap-4 px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all font-bold uppercase tracking-widest group text-left">
            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 group-hover:text-primary dark:group-hover:text-primary flex items-center justify-center transition-all group-hover:scale-110">
                {icon}
            </div>
            {label}
        </button>
    )
}
