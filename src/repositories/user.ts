import { prismaClient } from '@/services/prisma'
import type { User } from '@prisma/client'

const userModel = prismaClient.user

const listAllUsers = async (): Promise<Array<Omit<User, 'password'>>> =>
  await userModel.findMany({
    select: { id: true, name: true, nick: true },
    orderBy: { name: 'asc' },
  })

const getUserByNick = async (nick: string): Promise<User> =>
  await userModel.findUniqueOrThrow({ where: { nick } })

const storeNewUser = async (data: Omit<User, 'id'>): Promise<User> =>
  await userModel.create({ data })

const updateUserPasswordById = async (
  id: string,
  password: string,
): Promise<User> =>
  await userModel.update({
    where: { id },
    data: { password },
  })

const destroyUserById = async (id: string): Promise<User> =>
  await userModel.delete({ where: { id } })

export const userRepository = {
  listAllUsers,
  getUserByNick,
  storeNewUser,
  updateUserPasswordById,
  destroyUserById,
}
