'use server'

import type { Local } from '@prisma/client'
import { localRepository } from '@/repositories/local'

export default async function storeNewLocal(
  data: Omit<Local, 'id'>,
): Promise<Local> {
  return await localRepository.storeNewLocal(data)
}
