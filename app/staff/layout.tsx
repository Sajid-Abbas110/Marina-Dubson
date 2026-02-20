'use client'

import React from 'react'
import PortalLayout from '@/app/components/layout/PortalLayout'
import {
    LayoutDashboard,
    CheckSquare,
    MessageSquare,
    Settings,
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/staff/portal?tab=overview', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/staff/portal?tab=tasks', icon: CheckSquare },
    { name: 'Messages', href: '/staff/portal?tab=messages', icon: MessageSquare },
    { name: 'Settings', href: '/staff/portal?tab=settings', icon: Settings },
]

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalLayout navigation={navigation} userRole="STAFF">
            {children}
        </PortalLayout>
    )
}
