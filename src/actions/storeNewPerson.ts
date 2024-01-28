'use server'

import type { Person } from '@prisma/client'
import { personRepository } from '@/repositories/person'

export default async function storeNewPerson(
  data: Omit<Person, 'id'>,
): Promise<Person> {
  return await personRepository.storeNewPerson(data)
}
