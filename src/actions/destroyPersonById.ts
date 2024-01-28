'use server'

import type { Person } from '@prisma/client'
import { personRepository } from '@/repositories/person'

export default async function destroyPersonById(id: string): Promise<Person> {
  return await personRepository.destroyPersonById(id)
}
