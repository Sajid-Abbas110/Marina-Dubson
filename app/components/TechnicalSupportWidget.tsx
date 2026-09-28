'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
    interface Window {
        TechnicalSupport?: {
            mount: (cfg: Record<string, unknown>) => void
            setContext: (ctx: Record<string, unknown>) => void
            open: () => void
            destroy: () => void
        }
        TechnicalSupportKB?: unknown
    }
}

type TsRole = 'admin' | 'private' | 'agency' | 'reporter'

// Widget only ships KB roles for admin | private | agency | reporter.
// Internal staff/manager/super-admin get the admin (internal) answer set.
function roleForUser(user: any): TsRole | null {
    const role = String(user?.role || '').toUpperCase()
    if (role === 'ADMIN' || role === 'MANAGER' || role === 'SUPER_ADMIN' || role === 'STAFF') return 'admin'
    if (role === 'REPORTER') return 'reporter'
    if (role === 'CLIENT') return user?.clientType === 'AGENCY' ? 'agency' : 'private'
    return null
}

function pageLabel(pathname: string, tab: string | null): string {
    if (pathname.startsWith('/admin')) {
        if (pathname.startsWith('/admin/bookings')) return 'Bookings'
        if (pathname.startsWith('/admin/calendar')) return 'Calendar'
        if (pathname.startsWith('/admin/jobs')) return 'Jobs'
        if (pathname.startsWith('/admin/users')) return 'User Accounts'
        if (pathname.startsWith('/admin/reporter-invoices')) return 'Invoices'
        if (pathname.startsWith('/admin/invoices')) return 'Invoices'
        if (pathname.startsWith('/admin/documents')) return 'Documents'
        if (pathname.startsWith('/admin/settings')) return 'Settings'
        if (pathname.startsWith('/admin/services')) return 'Services'
        if (pathname.startsWith('/admin/clients')) return 'Clients'
        if (pathname.startsWith('/admin/reporters')) return 'Reporters'
        if (pathname.startsWith('/admin/reports')) return 'Reports'
        if (pathname.startsWith('/admin/analytics')) return 'Analytics'
        if (pathname.startsWith('/admin/email-campaigns')) return 'Campaigns'
        if (pathname.startsWith('/admin/messages')) return 'Messages'
        if (pathname.startsWith('/admin/team')) return 'Team'
        if (pathname.startsWith('/admin/compliance')) return 'Compliance'
        if (pathname.startsWith('/admin/inquiries')) return 'Inquiries'
        return 'Dashboard'
    }
    if (pathname.startsWith('/client')) {
        if (pathname.startsWith('/client/bookings') || pathname.startsWith('/client/confirm')) return 'My Bookings'
        if (pathname.startsWith('/client/invoices')) return 'Rates'
        const map: Record<string, string> = {
            overview: 'Dashboard', bookings: 'My Bookings', services: 'Services',
            documents: 'My Documents', rates: 'Rates', messages: 'Messages', settings: 'Settings'
        }
        return map[tab || 'overview'] || 'Dashboard'
    }
    if (pathname.startsWith('/reporter')) {
        if (pathname.startsWith('/reporter/marketplace')) return 'Marketplace'
        if (pathname.startsWith('/reporter/earnings')) return 'Rates'
        if (pathname.startsWith('/reporter/jobs')) return 'Jobs'
        if (pathname.startsWith('/reporter/upload')) return 'Assignments'
        const map: Record<string, string> = {
            overview: 'Dashboard', jobs: 'Assignments', market: 'Jobs', calendar: 'Calendar',
            rates: 'Rates', messages: 'Messages', settings: 'Settings'
        }
        return map[tab || 'overview'] || 'Dashboard'
    }
    if (pathname.startsWith('/staff')) {
        const map: Record<string, string> = { overview: 'Dashboard', tasks: 'My Tasks', messages: 'Messages', settings: 'Settings' }
        return map[tab || 'overview'] || 'Dashboard'
    }
    return 'Dashboard'
}

function loadScriptOnce(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
        const s = document.createElement('script')
        s.src = src
        s.onload = () => resolve()
        s.onerror = () => reject(new Error(`Failed to load ${src}`))
        document.body.appendChild(s)
    })
}

function TechnicalSupportInner() {
    const pathname = usePathname()
    const tab = useSearchParams().get('tab')
    const [role, setRole] = useState<TsRole | null>(null)
    const [ready, setReady] = useState(false)
    const mountedRef = useRef(false)

    useEffect(() => {
        const syncRole = () => {
            try {
                const stored = localStorage.getItem('user')
                setRole(stored ? roleForUser(JSON.parse(stored)) : null)
            } catch {
                setRole(null)
            }
        }
        syncRole()
        window.addEventListener('storage', syncRole)
        window.addEventListener('user-profile-updated', syncRole)
        return () => {
            window.removeEventListener('storage', syncRole)
            window.removeEventListener('user-profile-updated', syncRole)
        }
    }, [])

    useEffect(() => {
        if (!role) return
        let cancelled = false
            ; (async () => {
                try {
                    if (!window.TechnicalSupportKB) await loadScriptOnce('/technical-support/technical-support-kb.js')
                    if (!window.TechnicalSupport) await loadScriptOnce('/technical-support/technical-support.js')
                    if (!cancelled) setReady(true)
                } catch (e) {
                    console.error('[TechnicalSupport] failed to load widget scripts', e)
                }
            })()
        return () => { cancelled = true }
    }, [role])

    const label = role ? pageLabel(pathname || '', tab) : 'Dashboard'

    useEffect(() => {
        if (!ready || !role || !window.TechnicalSupport) return
        if (!mountedRef.current) {
            window.TechnicalSupport.mount({
                role, page: label, theme: 'auto',
                mode: 'api',
                apiEndpoint: '/api/assistant/ask',
                getAuthHeaders: () => {
                    try {
                        const t = localStorage.getItem('token')
                        return t ? { Authorization: `Bearer ${t}` } : {}
                    } catch {
                        return {}
                    }
                },
                onLog: (entry: unknown) => console.log('[technical-support]', entry)
            })
            mountedRef.current = true
        } else {
            window.TechnicalSupport.setContext({ role, page: label })
        }
    }, [ready, role, label])

    useEffect(() => {
        return () => {
            if (mountedRef.current) {
                window.TechnicalSupport?.destroy()
                mountedRef.current = false
            }
        }
    }, [])

    if (!role) return null
    return <link rel="stylesheet" href="/technical-support/technical-support.css" />
}

// Mount only inside authenticated portal layouts (admin/client/reporter/staff) —
// never on the public site. See public/technical-support/INTEGRATION.md.
export default function TechnicalSupportWidget() {
    return (
        <Suspense fallback={null}>
            <TechnicalSupportInner />
        </Suspense>
    )
}
