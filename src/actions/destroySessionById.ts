"use server";

import { sessionRepository } from "@/repositories/session";
import type { Session } from "@prisma/client";

export default async function destroySessionById(id: string): Promise<Session> {
	return await sessionRepository.destroySessionById(id);
}
