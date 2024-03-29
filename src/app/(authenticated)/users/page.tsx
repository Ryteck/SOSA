'use client'

import type { FC } from 'react'
import { useIsClient } from '@/hooks/isClient'
import { UserTable } from '@/components/tables/user-table'

const Page: FC = () => {
  const isClient = useIsClient()
  return <>{isClient && <UserTable />}</>
}

export default Page
