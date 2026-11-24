import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Toast from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'Fridge & Cookbook',
  description: 'Your digital kitchen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 min-h-screen`}>
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Toast />
      </body>
    </html>
  )
}
