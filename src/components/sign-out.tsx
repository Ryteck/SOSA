'use client'

import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export const SignOut: FC = () => (
  <Button
    onClick={() => {
      signOut().catch(console.error)
    }}
  >
    Sign out
  </Button>
)
