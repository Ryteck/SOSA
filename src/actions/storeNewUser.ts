'use server'

import type { User } from '@prisma/client'
import { userRepository } from '@/repositories/user'
import { generateHash } from '@/lib/hash'

export default async function storeNewUser(
  data: Omit<User, 'id'>,
): Promise<User> {
  data.password = generateHash(data.password)
  return await userRepository.storeNewUser(data)
}
