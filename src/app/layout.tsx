import type { Metadata } from 'next'
import { DM_Sans, Fraunces, Lora, Playfair_Display } from 'next/font/google'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Toast from '@/components/ui/Toast'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-lora',
})
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
  preload: false,
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-playfair',
  preload: false,
})

const fontVariables = [dmSans.variable, lora.variable, fraunces.variable, playfair.variable].join(
  ' ',
)

export const metadata: Metadata = {
  title: 'Fridge & Cookbook',
  description: 'Your digital kitchen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen">
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <Toast />
      </body>
    </html>
  )
}
