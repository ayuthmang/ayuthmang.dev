import type { Metadata } from 'next'
import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayuth Mangmesap',
  description: 'My personal website',
}

export type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body suppressHydrationWarning={true}>
        <Providers>
          <Header />
          <MaxWidthWrapper>{children}</MaxWidthWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
