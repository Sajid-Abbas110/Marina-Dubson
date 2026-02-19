'use client'

import { useState } from 'react'
import PortalSidebar from './PortalSidebar'
import PortalHeader from './PortalHeader'
import ProtectedRoute from '@/app/components/ProtectedRoute'

interface PortalLayoutProps {
    children: React.ReactNode
    navigation: any[]
    userRole: string
}

export default function PortalLayout({ children, navigation, userRole }: PortalLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <ProtectedRoute allowedRoles={[userRole]}>
            <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">

                {/* Sidebar */}
                <PortalSidebar
                    navigation={navigation}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    userRole={userRole}
                />

                {/* Main content */}
                <div className={`
                    flex flex-1 flex-col relative overflow-hidden h-screen
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-60'}
                `}>
                    <PortalHeader userRole={userRole} onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </ProtectedRoute>
    )
}
