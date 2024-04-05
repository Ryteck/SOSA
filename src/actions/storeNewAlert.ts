"use server";

import { alertRepository } from "@/repositories/alert";
import type { Alert } from "@prisma/client";

export default async function storeNewAlert(
	data: Omit<Alert, "id" | "userId" | "createdAt">,
): Promise<Alert> {
	return await alertRepository.storeNewAlert(data);
}
