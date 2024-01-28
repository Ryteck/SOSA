'use server'

import type { Session } from '@prisma/client'
import { sessionRepository } from '@/repositories/session'

export default async function storeNewSession(
  data: Omit<Session, 'id'>,
): Promise<Session> {
  return await sessionRepository.storeNewSession(data)
}
