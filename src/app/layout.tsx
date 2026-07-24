import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Nav from '@/src/components/Nav'
import Toast from '@/src/components/Toast'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fridge & Cookbook',
  description: 'Your digital kitchen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <Toast />
      </body>
    </html>
  )
}