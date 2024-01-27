import type { FC } from 'react'
import { getServerSession } from 'next-auth'
import authOptions from '@/settings/authOptions'
import { redirect } from 'next/navigation'

const Page: FC = async () => {
  const session = await getServerSession(authOptions)
  redirect(session === null ? '/login' : '/users')
}

export default Page
