"use server";

import { localRepository } from "@/repositories/local";
import type { Local } from "@prisma/client";

export default async function destroyLocalById(id: string): Promise<Local> {
	return await localRepository.destroyLocalById(id);
}
