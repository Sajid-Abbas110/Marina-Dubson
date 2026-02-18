import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-context'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-poppins',
})

export const viewport: Viewport = {
    themeColor: '#4f46e5',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export const metadata: Metadata = {
    title: 'Marina Dubson Stenographic Services - Court Reporting CRM',
    description: 'Professional court reporting booking, invoicing & automation system',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Marina Dubson CRM',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <head>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/favicon.svg" />
            </head>
            <body className="font-sans antialiased text-gray-900 dark:text-gray-100 bg-white dark:bg-[#020617] transition-colors duration-300">
                <ThemeProvider>
                    <main className="min-h-screen">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    )
}
