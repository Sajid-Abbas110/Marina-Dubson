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
            <div className="flex h-screen overflow-hidden bg-background transition-colors duration-500 font-sans selection:bg-primary/20 selection:text-primary relative font-poppins">
                {/* Background elements */}
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

                {/* Sidebar */}
                <PortalSidebar
                    navigation={navigation}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    userRole={userRole}
                />

                {/* Main Content Area */}
                <div className={`flex flex-1 flex-col relative transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'} overflow-hidden h-screen`}>
                    <PortalHeader userRole={userRole} />
                    <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-6 lg:p-10">
                        {children}
                    </main>
                </div>

                {/* Global Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-all duration-500"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </ProtectedRoute>
    )
}
