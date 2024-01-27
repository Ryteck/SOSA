import { userRepository } from '@/repositories/user'

export async function GET(): Promise<Response> {
  const users = await userRepository.listAll()
  return Response.json(users)
}

export const revalidate = 0
