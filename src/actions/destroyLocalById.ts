'use server'

import type { Local } from '@prisma/client'
import { localRepository } from '@/repositories/local'

export default async function destroyLocalById(id: string): Promise<Local> {
  return await localRepository.destroyLocalById(id)
}
