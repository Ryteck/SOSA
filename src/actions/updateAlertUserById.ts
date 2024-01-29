'use server'

import type { Alert } from '@prisma/client'
import { alertRepository } from '@/repositories/alert'

export default async function updateAlertUserById(
  id: string,
  userId: string,
): Promise<Alert> {
  return await alertRepository.updateAlertUserById(id, userId)
}
