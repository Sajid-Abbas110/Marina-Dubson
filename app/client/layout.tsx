'use client'

import React from 'react'
import PortalLayout from '@/app/components/layout/PortalLayout'
import {
    LayoutDashboard,
    Calendar,
    Layout,
    Cpu,
    FileText,
    CreditCard,
    MessageSquare,
    Settings
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/client/portal?tab=overview', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/client/portal?tab=bookings', icon: Calendar },
    { name: 'Scheduler', href: '/client/portal?tab=scheduler', icon: Layout },
    { name: 'Services', href: '/client/portal?tab=services', icon: Cpu },
    { name: 'Transcripts', href: '/client/portal?tab=transcripts', icon: FileText },
    { name: 'Financials', href: '/client/portal?tab=financials', icon: CreditCard },
    { name: 'Messages', href: '/client/portal?tab=messages', icon: MessageSquare },
    { name: 'Settings', href: '/client/portal?tab=settings', icon: Settings }, // Added settings
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalLayout navigation={navigation} userRole="CLIENT">
            {children}
        </PortalLayout>
    )
}
