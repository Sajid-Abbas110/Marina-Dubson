'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LucideIcon, MoreHorizontal, X, ChevronUp } from 'lucide-react'

interface SubTab {
    name: string
    href: string
    color?: string // optional accent color class e.g. 'text-emerald-500'
}

interface TabItem {
    name: string
    href: string
    icon: LucideIcon
    variant?: 'default' | 'calendar' | 'featured' // special visual styles
    subTabs?: SubTab[]
}

interface MobileTabNavigationProps {
    navigation: TabItem[]
}

export default function MobileTabNavigation({ navigation }: MobileTabNavigationProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showMore, setShowMore] = useState(false)
    const [activeSubTab, setActiveSubTab] = useState<string | null>(null) // which item's sub-tabs are expanded

    // Close sub-tab tray when route changes
    useEffect(() => {
        setActiveSubTab(null)
        setShowMore(false)
    }, [pathname, searchParams])

    // Helper to check if a tab or sub-tab is active
    const checkActive = (href: string) => {
        const [hrefPath, hrefQuery] = href.split('?')
        if (hrefQuery) {
            // Match both pathname and query param
            const paramKey = hrefQuery.split('=')[0]
            const paramVal = hrefQuery.split('=')[1]
            return pathname === hrefPath && searchParams.get(paramKey) === paramVal
        }
        if (pathname === href) return true
        if (pathname.startsWith(href) && href !== '/') return true
        return false
    }

    // Determine which items to show directly and which in "More"
    const visibleItems = navigation.length > 5 ? navigation.slice(0, 4) : navigation
    const moreItems = navigation.length > 5 ? navigation.slice(4) : []

    const handleTabPress = (item: TabItem) => {
        if (item.subTabs && item.subTabs.length > 0) {
            // Toggle sub-tab tray
            setActiveSubTab(prev => prev === item.href ? null : item.href)
        } else {
            setActiveSubTab(null)
            router.push(item.href)
        }
    }

    const expandedItem = visibleItems.find(i => i.href === activeSubTab) ||
        moreItems.find(i => i.href === activeSubTab)

    return (
        <>
            {/* Sub-tab Tray */}
            {expandedItem?.subTabs && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setActiveSubTab(null)}
                    />
                    {/* Tray */}
                    <div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-[999] animate-in slide-in-from-bottom-4 duration-300">
                        <div className="mx-3 mb-2 rounded-2xl bg-card/98 border border-border shadow-2xl backdrop-blur-2xl overflow-hidden">
                            {/* Tray Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
                                <div className="flex items-center gap-2.5">
                                    <expandedItem.icon className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                                        {expandedItem.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setActiveSubTab(null)}
                                    className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {/* Sub-tabs Grid */}
                            <div className="flex items-center gap-2 p-3 flex-wrap">
                                {/* Main link */}
                                <Link
                                    href={expandedItem.href}
                                    onClick={() => setActiveSubTab(null)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${checkActive(expandedItem.href) && !expandedItem.subTabs?.some(s => checkActive(s.href))
                                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                        : 'bg-muted text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                                        }`}
                                >
                                    All
                                </Link>
                                {expandedItem.subTabs.map(sub => (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        onClick={() => setActiveSubTab(null)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${checkActive(sub.href)
                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                                            : 'bg-muted text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                                            }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000]">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-border/50 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.3)] pb-safe"></div>

                <nav className="relative flex items-center justify-around h-[72px] max-w-lg mx-auto px-2 pb-safe">
                    {visibleItems.map((item) => {
                        const isActive = checkActive(item.href)
                        const isSubOpen = activeSubTab === item.href
                        const isCalendar = item.variant === 'calendar'

                        if (isCalendar) {
                            // Special Calendar tab — raised pill style
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => handleTabPress(item)}
                                    className="flex flex-col items-center justify-center flex-1 h-full relative group transition-all"
                                >
                                    <div className={`
                                        relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl
                                        transition-all duration-300 -mt-5 shadow-xl
                                        ${isActive
                                            ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-white shadow-purple-500/40 scale-110'
                                            : 'bg-gradient-to-br from-violet-400/80 via-purple-500/80 to-indigo-500/80 text-white shadow-purple-500/20 group-hover:scale-105'
                                        }
                                    `}>
                                        <item.icon className="w-5 h-5 stroke-[2.2]" />
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm animate-pulse" />
                                        )}
                                    </div>
                                    <span className={`
                                        text-[8px] font-black uppercase tracking-tighter text-center leading-[1.1] px-1 mt-1.5 transition-all
                                        ${isActive ? 'text-violet-600 dark:text-violet-400 scale-105' : 'text-muted-foreground/70'}
                                    `}>
                                        {item.name}
                                    </span>
                                </button>
                            )
                        }

                        if (item.subTabs && item.subTabs.length > 0) {
                            // Bookings-style tab with sub-tab tray
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => handleTabPress(item)}
                                    className="flex flex-col items-center justify-center flex-1 h-full relative group transition-all"
                                >
                                    <div className={`absolute top-0 w-8 h-1 rounded-b-full transition-all duration-300 ${isActive || isSubOpen ? 'opacity-100 bg-primary' : 'opacity-0 bg-primary'}`}></div>
                                    <div className={`
                                        p-2 rounded-xl transition-all duration-300 mb-0.5 relative
                                        ${isActive || isSubOpen ? 'bg-primary/10 text-primary scale-110' : 'text-muted-foreground'}
                                    `}>
                                        <item.icon className="w-5 h-5 stroke-[2.2]" />
                                        {isSubOpen && (
                                            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary border border-white" />
                                        )}
                                    </div>
                                    <span className={`
                                        text-[9px] font-black uppercase tracking-tighter text-center leading-[1.1] px-1 transition-all h-[20px] flex items-center gap-0.5
                                        ${isActive || isSubOpen ? 'text-primary scale-105' : 'text-muted-foreground/60'}
                                    `}>
                                        {item.name}
                                        <ChevronUp className={`w-2.5 h-2.5 transition-transform duration-200 ${isSubOpen ? 'rotate-180' : ''}`} />
                                    </span>
                                </button>
                            )
                        }

                        // Default tab
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center flex-1 h-full relative group transition-all"
                            >
                                <div className={`absolute top-0 w-8 h-1 rounded-b-full bg-primary transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`
                                    p-2 rounded-xl transition-all duration-300 mb-0.5
                                    ${isActive ? 'bg-primary/10 text-primary scale-110' : 'text-muted-foreground'}
                                `}>
                                    <item.icon className="w-5 h-5 stroke-[2.2]" />
                                </div>
                                <span className={`
                                    text-[9px] font-black uppercase tracking-tighter text-center leading-[1.1] px-1 transition-all h-[20px] flex items-center
                                    ${isActive ? 'text-primary scale-105' : 'text-muted-foreground/60'}
                                `}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}

                    {navigation.length > 5 && (
                        <button
                            onClick={() => setShowMore(true)}
                            className="flex flex-col items-center justify-center flex-1 h-full relative group transition-all"
                        >
                            <div className={`
                                p-2 rounded-xl transition-all duration-300 mb-0.5
                                ${showMore ? 'bg-primary/10 text-primary scale-110' : 'text-muted-foreground'}
                            `}>
                                <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-[1.1] px-1 text-muted-foreground/60 h-[20px] flex items-center">
                                More
                            </span>
                        </button>
                    )}
                </nav>
            </div>

            {/* More Menu Overlay */}
            {showMore && (
                <div className="fixed inset-0 z-[1001] animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMore(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-400">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">More Destinations</h3>
                            <button
                                onClick={() => setShowMore(false)}
                                className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-y-8">
                            {navigation.map((item) => {
                                const isActive = checkActive(item.href)
                                const isCalendar = item.variant === 'calendar'
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.subTabs ? '#' : item.href}
                                        onClick={() => {
                                            setShowMore(false)
                                            if (item.subTabs) {
                                                setActiveSubTab(item.href)
                                            }
                                        }}
                                        className="flex flex-col items-center gap-3 group"
                                    >
                                        <div className={`
                                            h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300
                                            ${isCalendar
                                                ? isActive
                                                    ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-110'
                                                    : 'bg-gradient-to-br from-violet-400/70 via-purple-500/70 to-indigo-500/70 text-white'
                                                : isActive
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                                                    : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                                            }
                                        `}>
                                            <item.icon className="w-6 h-6 stroke-[2.2]" />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tight text-center ${isCalendar && isActive ? 'text-violet-600 dark:text-violet-400' :
                                            isActive ? 'text-primary' : 'text-muted-foreground'
                                            }`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
