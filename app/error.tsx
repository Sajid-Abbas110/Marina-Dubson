'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCcw, Home, MessageSquare } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-poppins">
            <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Visual Art */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative h-32 w-32 bg-white rounded-[2.5rem] shadow-xl border border-red-50 flex items-center justify-center mx-auto transform hover:rotate-6 transition-transform">
                        <AlertTriangle className="h-16 w-16 text-red-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                        System Encountered <br />
                        <span className="text-red-600">A Setback</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                        Something unexpected happened on our server. Our team has been notified and we are working to resolve the issue.
                    </p>
                </div>

                {/* Technical Snippet */}
                {error.digest && (
                    <div className="bg-white/50 border border-gray-100 rounded-2xl p-3 inline-block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Error Reference</p>
                        <p className="text-xs font-mono text-gray-600 mt-1">{error.digest}</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <Home className="h-4 w-4" />
                        Back Home
                    </Link>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-400 mb-4 tracking-tight">Need immediate assistance?</p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href="/contact" className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-2 uppercase tracking-widest">
                            <MessageSquare className="h-4 w-4" />
                            Live Chat
                        </Link>
                        <Link href="mailto:support@mariadubson.com" className="text-xs font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest">
                            Email Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
