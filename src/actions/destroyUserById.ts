'use server'

import type { User } from '@prisma/client'
import { userRepository } from '@/repositories/user'

export default async function destroyUserById(id: string): Promise<User> {
  return await userRepository.destroyUserById(id)
}
