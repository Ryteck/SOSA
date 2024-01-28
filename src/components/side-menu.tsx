'use client'

import type { FC } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SignOut } from '@/components/sign-out'
import { Button } from '@/components/ui/button'
import { DashboardIcon } from '@radix-ui/react-icons'
import { useIsClient } from '@/hooks/isClient'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'

export const SideMenu: FC = () => {
  const isClient = useIsClient()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      {isClient && (
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="icon" type="submit">
              <DashboardIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="h-full">
            <SheetHeader>
              <SheetTitle>SOS - Alert</SheetTitle>
            </SheetHeader>

            <div className="my-8 flex flex-col gap-2">
              <Button
                disabled={pathname === '/clients'}
                onClick={() => {
                  router.push('/clients')
                }}
              >
                Clients
              </Button>

              <Button
                disabled={pathname === '/sessions'}
                onClick={() => {
                  router.push('/sessions')
                }}
              >
                Sessions
              </Button>

              <Button
                disabled={pathname === '/users'}
                onClick={() => {
                  router.push('/users')
                }}
              >
                Users
              </Button>
            </div>

            <SheetFooter className="flex w-full">
              <ThemeModeToggle />
              <SignOut />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
