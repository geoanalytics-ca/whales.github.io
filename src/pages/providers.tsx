// https://nextui.org/docs/frameworks/nextjs#setup-provider
// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}