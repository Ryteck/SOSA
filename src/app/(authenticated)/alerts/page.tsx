'use client'

import type { FC } from 'react'
import { useIsClient } from '@/hooks/isClient'
import { AlertTable } from '@/components/tables/alert-table'

const Page: FC = () => {
  const isClient = useIsClient()
  return <>{isClient && <AlertTable />}</>
}

export default Page
