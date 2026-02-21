'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-ping"></div>
                </div>
                <div className="space-y-1 text-center">
                    <p className="text-[10px] font-black text-foreground uppercase tracking-[0.3em] animate-pulse">Synchronizing Data</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Please wait for protocol update...</p>
                </div>
            </div>
        </div>
    )
}
