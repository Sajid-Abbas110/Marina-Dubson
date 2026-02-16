'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Printer, Download, ArrowLeft, CreditCard } from 'lucide-react'

export default function InvoiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`/api/invoices/${params.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setInvoice(data)
                }
            } catch (error) {
                console.error('Failed to fetch invoice:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoice()
    }, [params.id])

    const handlePrint = () => {
        window.print()
    }

    if (loading) return <div className="p-20 text-center font-black uppercase text-gray-400">Loading Secure Invoice...</div>
    if (!invoice) return <div className="p-20 text-center">Invoice not found.</div>

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-serif">
            {/* Control Bar (Hidden on Print) */}
            <div className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50 print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Ledger
                </button>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-gray-100 rounded-lg text-xs font-black uppercase hover:bg-gray-200 transition-all">
                        <Printer className="h-4 w-4" /> Print / PDF
                    </button>
                    {invoice.status !== 'PAID' && (
                        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-xs font-black uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <CreditCard className="h-4 w-4" /> Settle Invoice
                        </button>
                    )}
                </div>
            </div>

            {/* Elite Invoice Template */}
            <div className="max-w-[850px] mx-auto my-12 bg-white shadow-2xl p-16 print:shadow-none print:my-0 min-h-[1100px] relative">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-16 border-b-2 border-gray-900 pb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase leading-none mb-4">Marina Dubson</h1>
                        <div className="text-xs font-bold text-gray-600 space-y-1 uppercase tracking-widest">
                            <p>Marina Dubson Stenographic Services, LLC</p>
                            <p>12A Saturn Lane</p>
                            <p>Staten Island, NY 10314</p>
                            <p>(917) 494-1859</p>
                            <p>MarinaDubson@gmail.com</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-block py-2 px-6 border-2 border-gray-900 mb-6">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Invoice</h2>
                        </div>
                        <div className="text-xs font-black text-gray-900 space-y-2 uppercase text-right">
                            <p>JOB # {invoice.jobNumber}</p>
                            <p>DATE: {format(new Date(invoice.invoiceDate), 'MM/dd/yy')}</p>
                            <p>VOUCHER: {invoice.invoiceNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-10 text-center">
                    <p className="text-[10px] font-black italic text-gray-500 uppercase tracking-[0.2em]">“Committed to accuracy, high quality and excellent customer service”</p>
                </div>

                {/* Main Table */}
                <div className="w-full">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="text-left py-4 font-black uppercase tracking-widest">Service Description</th>
                                <th className="text-center py-4 font-black uppercase tracking-widest">Unit Value</th>
                                <th className="text-center py-4 font-black uppercase tracking-widest">Order</th>
                                <th className="text-right py-4 font-black uppercase tracking-widest">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Original */}
                            <tr className="group">
                                <td className="py-6">
                                    <p className="font-black text-gray-900 uppercase">Original Transcript</p>
                                    <p className="text-[10px] text-gray-500 font-medium italic">({invoice.pages}pgs x ${invoice.pageRate.toFixed(2)})</p>
                                </td>
                                <td className="text-center font-bold">${invoice.pageRate.toFixed(2)}pp</td>
                                <td className="text-center font-bold">{invoice.originalCopies}</td>
                                <td className="text-right font-black text-gray-900">${(invoice.pages * invoice.pageRate * invoice.originalCopies).toFixed(2)}</td>
                            </tr>

                            {/* Copy */}
                            {invoice.additionalCopies > 0 && (
                                <tr>
                                    <td className="py-6">
                                        <p className="font-black text-gray-900 uppercase">Transcript Copies</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">({invoice.pages}pgs x ${invoice.copyRate.toFixed(2)})</p>
                                    </td>
                                    <td className="text-center font-bold">${invoice.copyRate.toFixed(2)}pp</td>
                                    <td className="text-center font-bold">{invoice.additionalCopies}</td>
                                    <td className="text-right font-black text-gray-900">${(invoice.pages * invoice.copyRate * invoice.additionalCopies).toFixed(2)}</td>
                                </tr>
                            )}

                            {/* Appearance & Congestion */}
                            <tr>
                                <td className="py-6">
                                    <p className="font-black text-gray-900 uppercase">Appearance Fee & Logistics</p>
                                    <p className="text-[10px] text-gray-500 font-medium italic">$300 Base + $9 Congestion Pricing</p>
                                </td>
                                <td className="text-center font-bold">${(invoice.appearanceFee + invoice.congestionFee).toFixed(2)}</td>
                                <td className="text-center font-bold">1</td>
                                <td className="text-right font-black text-gray-900">${(invoice.appearanceFee + invoice.congestionFee).toFixed(2)}</td>
                            </tr>

                            {/* Realtime */}
                            {invoice.realtimeFee > 0 && (
                                <tr>
                                    <td className="py-6">
                                        <p className="font-black text-gray-900 uppercase">Realtime Feed</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">({invoice.pages}pgs x $1.50 per device)</p>
                                    </td>
                                    <td className="text-center font-bold">$1.50pp</td>
                                    <td className="text-center font-bold">{invoice.realtimeDevices || 1}</td>
                                    <td className="text-right font-black text-gray-900">${invoice.realtimeFee.toFixed(2)}</td>
                                </tr>
                            )}

                            {/* Roughs */}
                            {invoice.roughFee > 0 && (
                                <tr>
                                    <td className="py-6">
                                        <p className="font-black text-gray-900 uppercase">Rough Draft / Immediate Access</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">(+$1.25 per page per order)</p>
                                    </td>
                                    <td className="text-center font-bold">$1.25pp</td>
                                    <td className="text-center font-bold">1</td>
                                    <td className="text-right font-black text-gray-900">${invoice.roughFee.toFixed(2)}</td>
                                </tr>
                            )}

                            {/* Afterhours */}
                            {invoice.afterHoursFee > 0 && (
                                <tr>
                                    <td className="py-6">
                                        <p className="font-black text-gray-900 uppercase">Afterhours Surcharge</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">($100 per hour after 5:30 PM)</p>
                                    </td>
                                    <td className="text-center font-bold">$100.00/hr</td>
                                    <td className="text-center font-bold">{invoice.afterHoursCount || 1}</td>
                                    <td className="text-right font-black text-gray-900">${invoice.afterHoursFee.toFixed(2)}</td>
                                </tr>
                            )}

                            {/* Wait Time */}
                            {invoice.waitTimeFee > 0 && (
                                <tr>
                                    <td className="py-6">
                                        <p className="font-black text-gray-900 uppercase">Wait Time Surcharge</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">($100 per hour after 30 minutes)</p>
                                    </td>
                                    <td className="text-center font-bold">$100.00/hr</td>
                                    <td className="text-center font-bold">1</td>
                                    <td className="text-right font-black text-gray-900">${invoice.waitTimeFee.toFixed(2)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="mt-20 flex justify-end">
                    <div className="w-1/2 space-y-4">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-400">
                            <span>Subtotal</span>
                            <span className="text-gray-900 font-serif">${invoice.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-900 p-6 text-white">
                            <span className="text-xs font-black uppercase tracking-[0.3em] font-poppins">Total Due</span>
                            <span className="text-2xl font-black font-serif">${invoice.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-32 border-t pt-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Tactical Notes:</h4>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase">
                        {invoice.notes || "Professional services rendered for legal proceeding. Payment constitutes acceptance of final transcript accuracy."}
                    </p>
                </div>

                <div className="absolute bottom-16 left-16 right-16 flex justify-between items-end opacity-20 print:bottom-10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Electronic Verification Node: MD-{invoice.id.slice(-8).toUpperCase()}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Page 01 of 01</p>
                </div>
            </div>
        </div>
    )
}
