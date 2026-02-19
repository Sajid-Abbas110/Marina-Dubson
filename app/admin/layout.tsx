'use client'

import { useState } from 'react'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import ProtectedRoute from '@/app/components/ProtectedRoute'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SUPER_ADMIN', 'STAFF', 'REPORTER']}>
            <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
                {/* Sidebar */}
                <AdminSidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                {/* Main area */}
                <div className={`
                    flex flex-1 flex-col overflow-hidden h-screen
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-60'}
                `}>
                    <AdminHeader />
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
