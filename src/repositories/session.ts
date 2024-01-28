import { prismaClient } from '@/services/prisma'
import type { Person, Session } from '@prisma/client'
import type FullSessionData from '@/types/FullSessionData'

const sessionModel = prismaClient.session

const listAllSessions = async (): Promise<Session[]> =>
  await sessionModel.findMany()

const getFullSessionDataById = async (id: string): Promise<FullSessionData> =>
  await sessionModel.findUniqueOrThrow({
    where: { id },
    include: {
      person: { select: { name: true, details: true } },
      locations: { select: { id: true, name: true, details: true } },
      alerts: {
        select: {
          details: true,
          createdAt: true,
          local: { select: { name: true, details: true } },
          user: { select: { name: true } },
        },
      },
    },
  })

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
  getFullSessionDataById,
  storeNewSession,
  setLocationsById,
  destroySessionById,
  getPersonById,
}
