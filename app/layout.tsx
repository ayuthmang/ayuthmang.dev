'use client'

import StyledJsxRegistry from '~/app/lib/registry'
import '~/app/styles/globals.css'
import Header from '~/app/components/Header/Header'
import Footer from '~/app/components/Footer/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>
          <Header />
          {children}
          <Footer />
        </StyledJsxRegistry>
      </body>
    </html>
  )
}
