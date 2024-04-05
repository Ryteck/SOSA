"use server";

import { sessionRepository } from "@/repositories/session";
import type { Session } from "@prisma/client";

export default async function setLocationsById(
	id: string,
	locationIds: string[],
): Promise<Session> {
	return await sessionRepository.setLocationsById(id, locationIds);
}
