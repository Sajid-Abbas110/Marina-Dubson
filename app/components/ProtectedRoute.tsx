'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({
    children,
    allowedRoles
}: {
    children: React.ReactNode,
    allowedRoles?: string[]
}) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token')
            const userStr = localStorage.getItem('user')

            if (!token || !userStr) {
                console.log('No auth found, redirecting...')
                router.push('/login')
                return
            }

            try {
                const user = JSON.parse(userStr)
                const role = user.role?.toUpperCase() || ''

                if (allowedRoles && !allowedRoles.includes(role)) {
                    console.log(`Role ${role} not authorized. Expected: ${allowedRoles}`)
                    router.push('/login')
                    return
                }

                setAuthorized(true)
            } catch (e) {
                console.error('Auth parsing error:', e)
                router.push('/login')
            }
        }

        checkAuth()
    }, [router, allowedRoles])

    if (!authorized) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-[#00120d]">
                <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
            </div>
        )
    }

    return <>{children}</>
}
