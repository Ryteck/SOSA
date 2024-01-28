import { prismaClient } from '@/services/prisma'
import type { Person } from '@prisma/client'

const personModel = prismaClient.person

const listAllPeople = async (): Promise<Person[]> =>
  await personModel.findMany({
    orderBy: { name: 'asc' },
  })

const storeNewPerson = async (data: Omit<Person, 'id'>): Promise<Person> =>
  await personModel.create({ data })

const destroyPersonById = async (id: string): Promise<Person> =>
  await personModel.delete({ where: { id } })

export const personRepository = {
  listAllPeople,
  storeNewPerson,
  destroyPersonById,
}
