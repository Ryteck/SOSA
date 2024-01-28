'use server'

import type { Session } from '@prisma/client'
import { sessionRepository } from '@/repositories/session'

export default async function setLocationsById(
  id: string,
  locationIds: string[],
): Promise<Session> {
  return await sessionRepository.setLocationsById(id, locationIds)
}
