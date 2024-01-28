'use server'

import type { Alert } from '@prisma/client'
import { alertRepository } from '@/repositories/alert'

export default async function storeNewAlert(
  data: Omit<Alert, 'id' | 'userId' | 'createdAt'>,
): Promise<Alert> {
  return await alertRepository.storeNewAlert(data)
}
