'use client'

import type { FC } from 'react'
import { useIsClient } from '@/hooks/isClient'
import { SessionTable } from '@/components/tables/session-table'

const Page: FC = () => {
  const isClient = useIsClient()
  return <>{isClient && <SessionTable />}</>
}

export default Page
