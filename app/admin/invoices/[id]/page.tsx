'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Printer, Download, ArrowLeft, ExternalLink, CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react'

export default function InvoiceDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [payUrl, setPayUrl] = useState<string | null>(null)
    const printRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`/api/invoices/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (res.ok) {
                    const data = await res.json()
                    setInvoice(data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoice()
    }, [id])

    const handleGeneratePaymentLink = async () => {
        setGenerating(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/invoices/${id}/payment-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const data = await res.json()
                setPayUrl(data.url)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setGenerating(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        PAID: { label: 'Paid', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
        SENT: { label: 'Sent — Awaiting Payment', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
        DRAFT: { label: 'Draft', color: 'text-slate-600 bg-slate-100 border-slate-200', icon: AlertCircle },
        OVERDUE: { label: 'Overdue', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle },
    }
    const status = statusConfig[invoice?.status] || statusConfig.DRAFT

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-3">
                    <div className="h-10 w-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading invoice…</p>
                </div>
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-3">
                    <p className="text-lg font-semibold text-foreground">Invoice not found</p>
                    <button onClick={() => router.back()} className="btn-secondary text-sm">Go back</button>
                </div>
            </div>
        )
    }

    const pages = invoice.pages || 0
    const lineItems = [
        pages > 0 && invoice.pageRate > 0 && {
            label: 'Original Transcript',
            detail: `${pages} pgs × $${invoice.pageRate.toFixed(2)}/pg × ${invoice.originalCopies} original(s)`,
            amount: pages * invoice.pageRate * invoice.originalCopies,
        },
        invoice.additionalCopies > 0 && pages > 0 && {
            label: 'Copy',
            detail: `${pages} pgs × $${invoice.copyRate.toFixed(2)}/pg × ${invoice.additionalCopies} copy(s)`,
            amount: pages * invoice.copyRate * invoice.additionalCopies,
        },
        {
            label: 'Appearance Fee',
            detail: `${invoice.booking?.appearanceType === 'REMOTE' ? 'Remote' : 'In-Person'} (incl. $${invoice.congestionFee?.toFixed(2) || '9.00'} congestion)`,
            amount: invoice.appearanceFee + (invoice.congestionFee || 9),
        },
        invoice.realtimeFee && {
            label: 'Realtime',
            detail: `${pages} pgs × $1.50/device × ${invoice.realtimeDevices || 1} device(s)`,
            amount: invoice.realtimeFee,
        },
        invoice.roughFee && {
            label: 'Rough Draft',
            detail: `${pages} pgs × $1.25/pg`,
            amount: invoice.roughFee,
        },
        invoice.videographerFee > 0 && {
            label: 'Videography Services',
            detail: `${pages} pgs × $1.25/pg`,
            amount: invoice.videographerFee,
        },
        invoice.interpreterFee > 0 && {
            label: 'Interpreter Coordination',
            detail: `${pages} pgs × $1.25/pg`,
            amount: invoice.interpreterFee,
        },
        invoice.expertFee > 0 && {
            label: 'Expert Witness Logistics',
            detail: `${pages} pgs × $2.00/pg`,
            amount: invoice.expertFee,
        },
        invoice.afterHoursFee > 0 && {
            label: 'After-Hours Surcharge',
            detail: `$125/hr after 5:30 PM (${invoice.afterHoursCount || 0} hr(s))`,
            amount: invoice.afterHoursFee,
        },
        invoice.waitTimeFee > 0 && {
            label: 'Wait Time Surcharge',
            detail: `$100/hr after 30 min (${invoice.waitTimeCount || 0} hr(s))`,
            amount: invoice.waitTimeFee,
        },
        invoice.cancellationFee && {
            label: 'Cancellation Fee',
            detail: `Late cancellation — minimum booking fee`,
            amount: invoice.cancellationFee,
        },
    ].filter(Boolean) as { label: string; detail: string; amount: number }[]

    return (
        <>
            {/* Action bar — hidden on print */}
            <div className="print:hidden p-4 sm:p-6 border-b border-border bg-card flex items-center justify-between gap-4 flex-wrap sticky top-0 z-40 backdrop-blur-md">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Invoices
                </button>
                <div className="flex items-center gap-3 flex-wrap">
                    {invoice.status !== 'PAID' && (
                        <button
                            onClick={handleGeneratePaymentLink}
                            disabled={generating}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <CreditCard className="h-4 w-4" />
                            {generating ? 'Generating…' : 'Generate Stripe Payment Link'}
                        </button>
                    )}
                    {payUrl && (
                        <a href={payUrl} target="_blank" rel="noopener noreferrer"
                            className="btn-secondary flex items-center gap-2 text-sm">
                            <ExternalLink className="h-4 w-4" />
                            Open Payment Page
                        </a>
                    )}
                    <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
                        <Printer className="h-4 w-4" />
                        Print / Save PDF
                    </button>
                </div>
            </div>

            {/* Status bar */}
            <div className="print:hidden px-6 py-3 flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${status.color}`}>
                    <status.icon className="h-3.5 w-3.5" />
                    {status.label}
                </span>
                {invoice.status !== 'PAID' && invoice.dueDate && (
                    <span className="text-xs text-muted-foreground">
                        Due: {format(new Date(invoice.dueDate), 'MMMM d, yyyy')}
                    </span>
                )}
            </div>

            {/* Printable Invoice — matches Marina's exact template */}
            <div ref={printRef} className="max-w-3xl mx-auto my-6 px-4 print:p-0 print:max-w-full">
                <div className="bg-white text-black border border-gray-200 rounded-xl shadow-lg print:shadow-none print:border-0 p-8 print:p-6 space-y-6" style={{ fontFamily: 'Arial, sans-serif' }}>

                    {/* Header */}
                    <div className="text-center border-b border-gray-300 pb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Marina Dubson</h1>
                        <p className="text-sm text-gray-700 mt-1">Marina Dubson Stenographic Services, LLC</p>
                        <p className="text-sm text-gray-600">12A Saturn Lane, Staten Island, NY 10314</p>
                        <p className="text-sm text-gray-600">(917) 494-1859 &nbsp;|&nbsp; MarinaDubson@gmail.com</p>
                        <p className="text-xs text-gray-500 italic mt-2">"Committed to accuracy, high quality and excellent customer service"</p>
                    </div>

                    {/* Invoice title + meta */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">INVOICE</h2>
                        </div>
                        <div className="text-right text-sm text-gray-700 space-y-1">
                            <p><span className="font-semibold">JOB #</span> {invoice.jobNumber || invoice.invoiceNumber}</p>
                            <p><span className="font-semibold">Invoice #</span> {invoice.invoiceNumber}</p>
                            <p><span className="font-semibold">Date:</span> {format(new Date(invoice.invoiceDate), 'MM/dd/yyyy')}</p>
                            {invoice.dueDate && (
                                <p><span className="font-semibold">Due:</span> {format(new Date(invoice.dueDate), 'MM/dd/yyyy')}</p>
                            )}
                        </div>
                    </div>

                    {/* Bill to */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Bill To</p>
                        <p className="font-bold text-gray-900">
                            {invoice.contact.companyName || `${invoice.contact.firstName} ${invoice.contact.lastName}`}
                        </p>
                        {invoice.contact.companyName && (
                            <p className="text-sm text-gray-700">{invoice.contact.firstName} {invoice.contact.lastName}</p>
                        )}
                        <p className="text-sm text-gray-600">{invoice.contact.email}</p>
                        {invoice.contact.phone && <p className="text-sm text-gray-600">{invoice.contact.phone}</p>}
                    </div>

                    {/* Booking reference */}
                    {invoice.booking && (
                        <div className="text-sm text-gray-600 space-y-0.5">
                            <p><strong>Booking:</strong> {invoice.booking.bookingNumber}</p>
                            {invoice.booking.bookingDate && (
                                <p><strong>Service Date:</strong> {format(new Date(invoice.booking.bookingDate), 'MMMM d, yyyy')}</p>
                            )}
                            {invoice.booking.service?.serviceName && (
                                <p><strong>Service:</strong> {invoice.booking.service.serviceName}</p>
                            )}
                            {invoice.booking.proceedingType && (
                                <p><strong>Proceeding:</strong> {invoice.booking.proceedingType}</p>
                            )}
                        </div>
                    )}

                    {/* Line items table — Marina's exact format */}
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="text-left px-3 py-2 font-bold">Service</th>
                                <th className="text-center px-3 py-2 font-bold w-20"># of Pages</th>
                                <th className="text-center px-3 py-2 font-bold w-20"># of Orders</th>
                                <th className="text-right px-3 py-2 font-bold w-28">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {lineItems.map((item, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-3 py-2.5">
                                        <span className="font-medium text-gray-900">{item.label}</span>
                                        {item.detail && (
                                            <span className="text-xs text-gray-500 block">{item.detail}</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-center text-gray-700">{pages > 0 ? pages : '—'}</td>
                                    <td className="px-3 py-2.5 text-center text-gray-700">1</td>
                                    <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                                        ${item.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Notes + Total */}
                    <div className="flex gap-6 items-start">
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Notes</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {invoice.notes || 'Payment due within 14 days of invoice date.\nLate payments subject to 1.5% monthly interest.'}
                            </p>
                        </div>
                        <div className="min-w-[200px] space-y-1 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
                            </div>
                            {invoice.minimumFee > invoice.subtotal && (
                                <div className="flex justify-between gap-4 text-amber-700">
                                    <span>Minimum Fee Applied</span>
                                    <span className="font-semibold">${invoice.minimumFee.toFixed(2)}</span>
                                </div>
                            )}
                            {invoice.tax > 0 && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-gray-600">Tax</span>
                                    <span>${invoice.tax.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between gap-4 border-t border-gray-800 pt-2 mt-2">
                                <span className="font-black text-gray-900 text-base uppercase">Total Due</span>
                                <span className="font-black text-gray-900 text-xl">${invoice.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-300 pt-4 text-center text-xs text-gray-500 space-y-1">
                        <p>Please make payment to: <strong>Marina Dubson Stenographic Services, LLC</strong></p>
                        <p>12A Saturn Lane, Staten Island, NY 10314 &nbsp;|&nbsp; (917) 494-1859 &nbsp;|&nbsp; MarinaDubson@gmail.com</p>
                        <p className="italic mt-1">This invoice was generated by the Marina Dubson CRM system. Payment due within 14 days.</p>
                    </div>
                </div>
            </div>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                }
            `}</style>
        </>
    )
}
