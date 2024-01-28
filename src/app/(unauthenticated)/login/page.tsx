import type { FC } from 'react'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { SignIn } from '@/components/sign-in'
import { Card } from '@/components/ui/card'

const Page: FC = () => (
  <main className="flex h-screen w-screen items-center justify-center gap-4">
    <Card className="flex items-center justify-center gap-4 p-4">
      <ThemeModeToggle />
      <SignIn />
    </Card>
  </main>
)

export default Page
