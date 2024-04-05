"use server";

import { campusRepository } from "@/repositories/campus";
import type { Campus } from "@prisma/client";

export default async function storeNewCampus(
	data: Omit<Campus, "id">,
): Promise<Campus> {
	return await campusRepository.storeNewCampus(data);
}
