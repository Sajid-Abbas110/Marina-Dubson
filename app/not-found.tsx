import Link from 'next/link'
import { Search, Map, Compass, MoveRight } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 font-poppins relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-50/50 rounded-full blur-[80px] -ml-40 -mb-40"></div>

            <div className="max-w-xl w-full text-center relative z-10 space-y-12">
                <div className="space-y-6">
                    <div className="relative inline-block">
                        <span className="text-[12rem] font-black text-gray-50 leading-none select-none">404</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-24 w-24 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                                <Compass className="h-12 w-12 text-blue-600 animate-spin-slow" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            LOST IN <span className="text-blue-600 italic">TRANSCRIPTION</span>?
                        </h1>
                        <p className="text-lg text-gray-500 font-medium max-w-sm mx-auto">
                            The page you are looking for seems to have vanished or never existed. Let&apos;s get you back on track.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/"
                        className="group p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left"
                    >
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Map className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center justify-between">
                            Main Portal
                            <MoveRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Return to homepage</p>
                    </Link>

                    <Link
                        href="/contact"
                        className="group p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all text-left"
                    >
                        <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Search className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center justify-between">
                            Get Support
                            <MoveRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Contact our team</p>
                    </Link>
                </div>

                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] animate-pulse">
                    Marina Dubson Stenographic Services
                </p>
            </div>
        </div>
    )
}
