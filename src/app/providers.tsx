'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import StyledComponentsRegistry from '@/components/styled-components-registry'
import { ThemeProvider } from '../components/theme-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
