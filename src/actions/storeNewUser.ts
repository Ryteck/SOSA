"use server";

import { generateHash } from "@/lib/hash";
import { userRepository } from "@/repositories/user";
import type { User } from "@prisma/client";

export default async function storeNewUser(
	data: Omit<User, "id">,
): Promise<User> {
	data.password = generateHash(data.password);
	return await userRepository.storeNewUser(data);
}
