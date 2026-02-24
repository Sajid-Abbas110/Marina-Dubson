'use client'

import React, { useState, useEffect } from 'react'
import { Share, PlusSquare, X, Download, Smartphone, Monitor } from 'lucide-react'

export default function PWAInstallPrompt() {
    return null; // Force hide all app download/install prompts as per user request
    const [show, setShow] = useState(false)
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null)

    useEffect(() => {
        // Detect if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
        if (isStandalone) return

        // Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIOS = /iphone|ipad|ipod/.test(userAgent)
        const isAndroid = /android/.test(userAgent)

        if (isIOS) {
            setPlatform('ios')
        } else if (isAndroid) {
            setPlatform('android')
        } else {
            setPlatform('desktop')
        }

        // Show after a delay
        const timer = setTimeout(() => {
            const hasDismissed = localStorage.getItem('pwa-prompt-dismissed')
            if (!hasDismissed) setShow(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    if (!show || !platform) return null

    const dismiss = () => {
        setShow(false)
        localStorage.setItem('pwa-prompt-dismissed', 'true')
    }

    return (
        <div className={`
            fixed z-[2000] animate-in slide-in-from-bottom-10 fade-in duration-700
            bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:bottom-8
            w-[calc(100%-2rem)] sm:w-[380px]
        `}>
            {/* Glossy Backdrop */}
            <div className="relative group overflow-hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-[2.5rem] p-7 shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/5">

                {/* Decorative Gradient Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none transition-colors duration-700"></div>

                <button
                    onClick={() => setShow(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative space-y-6">
                    <div className="flex items-center gap-4 text-left">
                        <div className="relative flex-shrink-0">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40">
                                {platform === 'desktop' ? <Monitor className="w-7 h-7" /> : <Smartphone className="w-7 h-7" />}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-[3px] border-white dark:border-zinc-900 flex items-center justify-center">
                                <PlusSquare className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-tight leading-none mb-1">Marina Dubson Portal</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">Stand-Alone Experience</p>
                        </div>
                    </div>

                    <div className="bg-muted/30 dark:bg-white/5 rounded-[1.5rem] p-5 border border-border/50">
                        {platform === 'ios' ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">01. Share</span>
                                    <Share className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="h-px bg-border/40 w-full"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">02. Add to Home</span>
                                    <PlusSquare className="w-3.5 h-3.5 text-primary" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.05em] text-muted-foreground leading-relaxed">
                                    Tap <span className="text-foreground">Browser Menu</span> & Select <span className="text-primary">Install App</span>
                                </p>
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Download className="w-3.5 h-3.5" /></div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={dismiss}
                            className="flex-1 py-3.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                        >
                            Enhance
                        </button>
                        <button
                            onClick={() => setShow(false)}
                            className="px-5 py-3.5 rounded-xl bg-muted/50 dark:bg-white/5 text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em] hover:text-foreground transition-all duration-300"
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
