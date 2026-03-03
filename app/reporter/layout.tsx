'use client'

import React from 'react'
import PortalLayout from '@/app/components/layout/PortalLayout'
import {
    LayoutDashboard,
    Calendar,
    Briefcase,
    DollarSign,
    MessageSquare,
    Settings,
    Globe
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/reporter/portal?tab=overview', icon: LayoutDashboard },
    { name: 'Assignments', href: '/reporter/portal?tab=jobs', icon: Briefcase },
    { name: 'Jobs', href: '/reporter/portal?tab=market', icon: Globe },
    { name: 'Calendar', href: '/reporter/portal?tab=calendar', icon: Calendar },
    { name: 'Financials', href: '/reporter/portal?tab=financials', icon: DollarSign },
    { name: 'Messages', href: '/reporter/portal?tab=messages', icon: MessageSquare },
    { name: 'Settings', href: '/reporter/portal?tab=settings', icon: Settings },
]

export default function ReporterLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalLayout navigation={navigation} userRole="REPORTER">
            {children}
        </PortalLayout>
    )
}
