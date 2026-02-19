'use client'

import { useState } from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { LayoutDashboard, Calendar, Users, FileText, Settings, BarChart3, Zap, MessageSquare } from 'lucide-react'
import MobileTabNavigation from '@/app/components/MobileTabNavigation'

const adminMobileNav = [
    { name: 'Home', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Book', href: '/admin/calendar', icon: Calendar },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Invoices', href: '/admin/invoices', icon: FileText },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Analytics', href: '/admin/analytics', icon: Zap },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Core', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SUPER_ADMIN', 'STAFF', 'REPORTER']}>
            <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
                {/* Sidebar */}
                <AdminSidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isOpen={false}
                    setIsOpen={() => { }}
                />

                {/* Main area */}
                <div className={`
                    flex flex-1 flex-col overflow-hidden h-screen
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-60'}
                `}>
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                        {children}
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileTabNavigation navigation={adminMobileNav} />

                {/* Mobile overlay - Not needed */}
            </div>
        </ProtectedRoute>
    )
}
