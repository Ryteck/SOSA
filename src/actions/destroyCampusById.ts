"use server";

import { campusRepository } from "@/repositories/campus";
import type { Campus } from "@prisma/client";

export default async function destroyCampusById(id: string): Promise<Campus> {
	return await campusRepository.destroyCampusById(id);
}
