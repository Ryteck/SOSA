"use server";

import { personRepository } from "@/repositories/person";
import type { Person } from "@prisma/client";

export default async function destroyPersonById(id: string): Promise<Person> {
	return await personRepository.destroyPersonById(id);
}
