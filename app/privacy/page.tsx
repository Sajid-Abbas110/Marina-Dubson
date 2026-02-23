export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 py-32 px-8">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="space-y-6">
                    <h1 className="text-6xl font-black uppercase tracking-tighter">Privacy <span className="text-blue-500 italic">Protocol</span></h1>
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Security Matrix Update: FEB 2026</p>
                </div>

                <div className="grid gap-12 text-slate-400 leading-relaxed font-medium">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Signaling Data Collection</h2>
                        <p>
                            We collect specific telemetry required to maintain the integrity of the reporting systems.
                            This includes personal identifiers, case metadata, and logistical coordinates provided
                            during the signal synchronization process.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">2. End-to-End Encryption</h2>
                        <p>
                            All data transmitted through the Marina Dubson global network is protected by RSA-4096
                            encryption. We do not sell your signal to third-party data harvesters. Your case
                            transcripts are sequestered in dedicated air-gapped vaults.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">3. Signal Retention</h2>
                        <p>
                            Data is retained only as long as necessary for the fulfillment of the legal proceeding
                            and regulatory requirements. Upon request, we can trigger a protocol-level deletion
                            of your non-essential metadata.
                        </p>
                    </section>

                    <section className="space-y-6 p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/20">
                        <h2 className="text-xl font-black text-blue-400 uppercase tracking-tight">Security Officer Transmission</h2>
                        <p className="text-sm">
                            If you have concerns regarding signal integrity or data sequestration, contact our
                            privacy officer at security@marinadubson.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
