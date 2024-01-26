import '@/styles/tailwind.css'

import type { Metadata } from 'next'
import type { FC, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import inter from '@/fonts/inter'
import { ThemeProvider } from '@/components/components/theme-provider'

export const metadata: Metadata = {
  title: 'SOS Alert',
  description: 'Generated by Next.js',
}

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className,
      )}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </body>
  </html>
)

export default Layout
