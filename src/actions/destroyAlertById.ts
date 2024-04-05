"use server";

import { alertRepository } from "@/repositories/alert";
import type { Alert } from "@prisma/client";

export default async function destroyAlertById(id: string): Promise<Alert> {
	return await alertRepository.destroyAlertById(id);
}
