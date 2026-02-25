import Link from 'next/link'
import { PublicFooter, PublicHeader, PublicTopBar } from '@/app/components/landing/PublicLayout'

export default function RecoveryPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicTopBar />
            <PublicHeader />
            <main className="max-w-3xl mx-auto px-4 md:px-8 py-16">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0071c5]">Account Recovery</p>
                    <h1 className="mt-3 text-3xl md:text-4xl font-black uppercase italic text-slate-900">Reset Access</h1>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                        Password self-service is not enabled on this portal yet. Please contact platform support to reset your account securely.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-xl bg-[#0071c5] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#005ca1]"
                        >
                            Back to Login
                        </Link>
                        <a
                            href="mailto:team@marinadubson.com"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-white"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    )
}
