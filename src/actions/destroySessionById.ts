'use server'

import type { Session } from '@prisma/client'
import { sessionRepository } from '@/repositories/session'

export default async function destroySessionById(id: string): Promise<Session> {
  return await sessionRepository.destroySessionById(id)
}
