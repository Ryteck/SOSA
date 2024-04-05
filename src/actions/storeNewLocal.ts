"use server";

import { localRepository } from "@/repositories/local";
import type { Local } from "@prisma/client";

export default async function storeNewLocal(
	data: Omit<Local, "id">,
): Promise<Local> {
	return await localRepository.storeNewLocal(data);
}
