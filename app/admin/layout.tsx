'use client'

import { useState } from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'

import ProtectedRoute from '@/app/components/ProtectedRoute'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SUPER_ADMIN', 'STAFF', 'REPORTER']}>
            <div className="flex h-screen overflow-hidden bg-white dark:bg-[#00120d] transition-colors duration-500 font-sans selection:bg-primary/10 selection:text-primary relative">
                {/* Background elements */}
                <div className="absolute inset-0 mesh-gradient opacity-100 dark:opacity-30 pointer-events-none"></div>

                {/* Sidebar */}
                <AdminSidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                {/* Main Content Area */}
                <div className={`flex flex-1 flex-col relative transition-all duration-500 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'} overflow-hidden h-screen`}>
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
                        {children}
                    </main>
                </div>

                {/* Global Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-500"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </ProtectedRoute>
    )
}
