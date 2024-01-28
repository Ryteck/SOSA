import { localRepository } from '@/repositories/local'

export async function GET(): Promise<Response> {
  const locations = await localRepository.listAllLocations()
  return Response.json(locations)
}

export const revalidate = 0
