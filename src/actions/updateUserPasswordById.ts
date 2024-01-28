'use server'

import type { User } from '@prisma/client'
import { userRepository } from '@/repositories/user'
import { generateHash } from '@/lib/hash'

export default async function updateUserPasswordById(
  id: string,
  password: string,
): Promise<User> {
  const hash = generateHash(password)
  return await userRepository.updateUserPasswordById(id, hash)
}
