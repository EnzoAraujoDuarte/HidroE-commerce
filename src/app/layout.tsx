import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { CursorSystem } from '@/lib/motion/cursor-system'
import { LenisProvider } from '@/lib/motion/lenis-provider'
import { RouteTransitionProvider } from '@/lib/motion/route-transition-provider'
import { CartProvider } from '@/lib/cart'
import { Header } from '@/components/layout/header'
import { CartDrawer } from '@/features/cart'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'HYDROGEN — Contemporary Fashion',
  description: 'A premium headless e-commerce experience for contemporary fashion',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0a09',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <CartProvider>
          <LenisProvider>
            <Header />
            <RouteTransitionProvider>
              <main>{children}</main>
            </RouteTransitionProvider>
            <CartDrawer />
            <CursorSystem />
          </LenisProvider>
        </CartProvider>
      </body>
    </html>
  )
}
