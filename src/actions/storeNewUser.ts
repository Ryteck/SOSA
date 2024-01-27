'use server'

import type { User } from '@prisma/client'
import { userRepository } from '@/repositories/user'

export default async function storeNewUser(
  data: Omit<User, 'id'>,
): Promise<User> {
  return await userRepository.storeNewUser(data)
}
