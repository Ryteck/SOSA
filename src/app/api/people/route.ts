import { personRepository } from '@/repositories/person'

export async function GET(): Promise<Response> {
  const people = await personRepository.listAllPeople()
  return Response.json(people)
}

export const revalidate = 0
