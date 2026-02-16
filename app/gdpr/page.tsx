import { Globe, Shield, Lock, Cpu } from 'lucide-react'

export default function GDPRPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 py-32 px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full"></div>

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        <Shield className="h-3 w-3" /> GDPR Compliant Node
                    </div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter">GDPR <span className="text-emerald-500 italic">Matrix</span></h1>
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">European Signal Protection Standards</p>
                </div>

                <div className="grid gap-8">
                    <ComplianceCard
                        title="Right to Access"
                        desc="You have the absolute right to request a complete dump of all telemetry data linked to your node identifier."
                        icon={<Globe className="h-6 w-6" />}
                    />
                    <ComplianceCard
                        title="Right to Rectification"
                        desc="Correct any signal errors or identity mismatches within our global registry at any time."
                        icon={<Cpu className="h-6 w-6" />}
                    />
                    <ComplianceCard
                        title="Right to Sequestration"
                        desc="Also known as the right to be forgotten. Trigger a total wipe of your persona from our active nodes."
                        icon={<Lock className="h-6 w-6" />}
                    />
                </div>

                <div className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 space-y-8">
                    <h3 className="text-2xl font-black uppercase italic text-white tracking-widest">Signal Processing</h3>
                    <p className="text-slate-400 leading-relaxed font-medium">
                        Marina Dubson Stenographic Services operates as a Data Processor for our clients (Data Controllers).
                        We handle all legal proceedings data with the highest level of confidentiality and
                        security protocols, ensuring that EU citizens&apos; data is protected regardless of where
                        the signal originates.
                    </p>
                </div>
            </div>
        </div>
    )
}

function ComplianceCard({ title, desc, icon }: any) {
    return (
        <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all group">
            <div className="flex items-start gap-8">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="space-y-3">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{title}</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    )
}
