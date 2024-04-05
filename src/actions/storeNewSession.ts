"use server";

import { sessionRepository } from "@/repositories/session";
import type { Session } from "@prisma/client";

export default async function storeNewSession(
	data: Omit<Session, "id">,
): Promise<Session> {
	return await sessionRepository.storeNewSession(data);
}
