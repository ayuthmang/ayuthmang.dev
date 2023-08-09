import { Metadata } from 'next'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import StyledComponentsRegistry from '~/components/StyledComponentsRegistry'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayuth Mangmesap',
  description: 'My personal website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>
          <Header />
          {children}
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
