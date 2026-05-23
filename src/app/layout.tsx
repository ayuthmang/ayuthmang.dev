import type { Metadata } from 'next'
import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import Providers from './providers'
import './globals.css'

const siteUrl = 'https://ayuthmang.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ayuth Mangmesap',
    template: '%s | Ayuth Mangmesap',
  },
  description:
    'Full-Stack Developer specializing in React, Next.js, and Node.js. Writing about web development, cloud architecture, and open-source on Medium and DEV.',
  keywords: [
    'Full-Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Web Development',
    'Ayuth Mangmesap',
  ],
  authors: [{ name: 'Ayuth Mangmesap', url: siteUrl }],
  creator: 'Ayuth Mangmesap',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Ayuth Mangmesap',
    title: 'Ayuth Mangmesap',
    description:
      'Full-Stack Developer specializing in React, Next.js, and Node.js. Writing about web development, cloud architecture, and open-source.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayuth Mangmesap',
    description:
      'Full-Stack Developer specializing in React, Next.js, and Node.js. Writing about web development, cloud architecture, and open-source.',
    creator: '@ayuthmang',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
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
