import { prismaClient } from '@/services/prisma'
import type { User } from '@prisma/client'

const userModel = prismaClient.user

const listAll = async (): Promise<User[]> => await userModel.findMany()

const storeNewUser = async (data: Omit<User, 'id'>): Promise<User> =>
  await userModel.create({ data })

const destroyUserById = async (id: string): Promise<User> =>
  await userModel.delete({ where: { id } })

export const userRepository = { listAll, storeNewUser, destroyUserById }
