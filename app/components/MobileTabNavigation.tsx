'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon, MoreHorizontal, X } from 'lucide-react'

interface TabItem {
    name: string
    href: string
    icon: LucideIcon
}

interface MobileTabNavigationProps {
    navigation: TabItem[]
}

export default function MobileTabNavigation({ navigation }: MobileTabNavigationProps) {
    const pathname = usePathname()
    const [showMore, setShowMore] = useState(false)

    // Helper to check if a tab is active
    const checkActive = (href: string) => {
        if (pathname === href) return true
        if (href.includes('tab=')) {
            const tabParam = href.split('tab=')[1]
            if (typeof window !== 'undefined' && window.location.search.includes(`tab=${tabParam}`)) {
                return true
            }
        }
        return false
    }

    // Determine which items to show directly and which in "More"
    const visibleItems = navigation.length > 5 ? navigation.slice(0, 4) : navigation
    const moreItems = navigation.length > 5 ? navigation.slice(4) : []

    return (
        <>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000]">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-border/50 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.3)] pb-safe"></div>

                <nav className="relative flex items-center justify-around h-[72px] max-w-lg mx-auto px-2 pb-safe">
                    {visibleItems.map((item) => {
                        const isActive = checkActive(item.href)
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
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowMore(false)}
                                        className="flex flex-col items-center gap-3 group"
                                    >
                                        <div className={`
                                            h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300
                                            ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}
                                        `}>
                                            <item.icon className="w-6 h-6 stroke-[2.2]" />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tight text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
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
