"use server";

import { alertRepository } from "@/repositories/alert";
import type { Alert } from "@prisma/client";

export default async function updateAlertUserById(
	id: string,
	userId: string,
): Promise<Alert> {
	return await alertRepository.updateAlertUserById(id, userId);
}
