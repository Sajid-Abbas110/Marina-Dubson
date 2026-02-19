'use client'

import { useState } from 'react'
import PortalSidebar from './PortalSidebar'
import PortalHeader from './PortalHeader'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import MobileTabNavigation from '@/app/components/MobileTabNavigation'

interface PortalLayoutProps {
    children: React.ReactNode
    navigation: any[]
    userRole: string
}

export default function PortalLayout({ children, navigation, userRole }: PortalLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <ProtectedRoute allowedRoles={[userRole]}>
            <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">

                {/* Sidebar */}
                <PortalSidebar
                    navigation={navigation}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isOpen={false}
                    setIsOpen={() => { }}
                    userRole={userRole}
                />

                {/* Main content */}
                <div className={`
                    flex flex-1 flex-col relative overflow-hidden h-screen
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-60'}
                `}>
                    <PortalHeader userRole={userRole} />
                    <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                        {children}
                    </main>
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileTabNavigation navigation={navigation} />

                {/* Mobile overlay - Not needed without hamburger */}
            </div>
        </ProtectedRoute>
    )
}
