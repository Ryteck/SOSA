"use server";

import { personRepository } from "@/repositories/person";
import type { Person } from "@prisma/client";

export default async function storeNewPerson(
	data: Omit<Person, "id">,
): Promise<Person> {
	return await personRepository.storeNewPerson(data);
}
