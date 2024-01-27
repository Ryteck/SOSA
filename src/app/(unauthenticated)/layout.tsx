import type { FC, PropsWithChildren } from 'react'
import { getServerSession } from 'next-auth'
import authOptions from '@/settings/authOptions'
import { redirect } from 'next/navigation'

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (session !== null) redirect('/')

  return <>{children}</>
}

export default Layout
