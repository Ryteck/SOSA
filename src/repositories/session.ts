import { prismaClient } from '@/services/prisma'
import type { Person, Session } from '@prisma/client'

const sessionModel = prismaClient.session

const listAllSessions = async (): Promise<Session[]> =>
  await sessionModel.findMany()

const storeNewSession = async (data: Omit<Session, 'id'>): Promise<Session> =>
  await sessionModel.create({ data })

const setLocationsById = async (
  id: string,
  locationIds: string[],
): Promise<Session> =>
  await sessionModel.update({
    where: { id },
    data: { locations: { set: locationIds.map(id => ({ id })) } },
  })

const destroySessionById = async (id: string): Promise<Session> =>
  await sessionModel.delete({ where: { id } })

const getPersonById = async (id: string): Promise<Person> => {
  const { person } = await sessionModel.findUniqueOrThrow({
    where: { id },
    select: { person: true },
  })

  return person
}

export const sessionRepository = {
  listAllSessions,
  storeNewSession,
  setLocationsById,
  destroySessionById,
  getPersonById,
}
