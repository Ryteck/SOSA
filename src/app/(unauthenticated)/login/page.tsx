import type { FC } from 'react'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { SignIn } from '@/components/sign-in'

const Page: FC = () => (
  <main className="flex h-screen w-screen items-center justify-center gap-4">
    <h2>Hello, World!</h2>
    <ThemeModeToggle />
    <SignIn />
  </main>
)

export default Page
