import { Metadata } from 'next'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import StyledComponentsRegistry from '~/components/StyledComponentsRegistry'
import './globals.css'
import React from 'react'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'

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
        <StyledComponentsRegistry>
          <Header />
          {/* <MaxWidthWrapper>{children}</MaxWidthWrapper>
          <Footer /> */}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
