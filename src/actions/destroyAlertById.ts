'use server'

import type { Alert } from '@prisma/client'
import { alertRepository } from '@/repositories/alert'

export default async function destroyAlertById(id: string): Promise<Alert> {
  return await alertRepository.destroyAlertById(id)
}
