import type { FC } from 'react'
import { sessionRepository } from '@/repositories/session'

interface Params {
  params: { sessionId: string }
}

const Page: FC<Params> = async ({ params }) => {
  const person = await sessionRepository.getPersonById(params.sessionId)

  return (
    <main className="flex flex-col items-center">
      <h2 className="mt-2 text-center text-2xl font-bold">{person.name}</h2>
    </main>
  )
}

export default Page
