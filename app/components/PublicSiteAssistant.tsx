'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

declare global {
    interface Window {
        PublicAssistant?: {
            mount: (cfg: Record<string, unknown>) => void
            setContext: (ctx: Record<string, unknown>) => void
            open: () => void
            destroy: () => void
        }
        PublicAssistantKB?: unknown
    }
}

const PORTAL_PREFIXES = ['/admin', '/client', '/reporter', '/staff']

function pageLabel(pathname: string): string {
    if (pathname === '/') return 'Home'
    if (pathname.startsWith('/about')) return 'About Us'
    if (pathname.startsWith('/services') || pathname.startsWith('/pricing') || pathname.startsWith('/plans')) return 'Services'
    if (pathname.startsWith('/gallery')) return 'Gallery'
    if (pathname.startsWith('/blogs')) return 'Blogs'
    if (pathname.startsWith('/notable-experience')) return 'Notable Experience'
    if (pathname.startsWith('/contact')) return 'Contact Us'
    if (pathname.startsWith('/register')) return 'Register'
    if (pathname.startsWith('/login')) return 'Login'
    return 'Home'
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

// Visitor-facing FAQ chatbot for the public marketing site.
// Deliberately its own engine/KB/globals (site-assistant*.js,
// window.PublicAssistant) — separate from the portal's
// TechnicalSupportWidget — so the two can never collide if a user
// crosses between the public site and the authenticated portal
// within the same client-side session.
export default function PublicSiteAssistant() {
    const pathname = usePathname() || '/'
    const isPortalPath = PORTAL_PREFIXES.some((p) => pathname.startsWith(p))
    const [ready, setReady] = useState(false)
    const mountedRef = useRef(false)

    useEffect(() => {
        if (isPortalPath) return
        let cancelled = false
            ; (async () => {
                try {
                    await loadScriptOnce('/technical-support/site-assistant-kb.js')
                    await loadScriptOnce('/technical-support/site-assistant.js')
                    if (!cancelled) setReady(true)
                } catch (e) {
                    console.error('[PublicSiteAssistant] failed to load widget scripts', e)
                }
            })()
        return () => { cancelled = true }
    }, [isPortalPath])

    const label = pageLabel(pathname)

    useEffect(() => {
        if (isPortalPath) {
            if (mountedRef.current) {
                window.PublicAssistant?.destroy()
                mountedRef.current = false
            }
            return
        }
        if (!ready || !window.PublicAssistant) return
        if (!mountedRef.current) {
            window.PublicAssistant.mount({
                page: label, theme: 'auto', brandName: 'Marina Dubson Assistant',
                onLog: (entry: unknown) => console.log('[site-assistant]', entry)
            })
            mountedRef.current = true
        } else {
            window.PublicAssistant.setContext({ page: label })
        }
    }, [ready, isPortalPath, label])

    useEffect(() => {
        return () => {
            if (mountedRef.current) {
                window.PublicAssistant?.destroy()
                mountedRef.current = false
            }
        }
    }, [])

    if (isPortalPath) return null
    return <link rel="stylesheet" href="/technical-support/technical-support.css" />
}
