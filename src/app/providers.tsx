'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import StyledComponentsRegistry from '@/components/styled-components-registry'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
