import type { FC } from 'react'
import { ThemeModeToggle } from '@/components/components/theme-mode-toggle'

const Page: FC = () => (
  <main className="flex h-screen w-screen items-center justify-center gap-4">
    <h2>Hello, World!</h2>
    <ThemeModeToggle />
  </main>
)

export default Page
