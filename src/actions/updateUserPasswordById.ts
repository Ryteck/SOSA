"use server";

import { generateHash } from "@/lib/hash";
import { userRepository } from "@/repositories/user";
import type { User } from "@prisma/client";

export default async function updateUserPasswordById(
	id: string,
	password: string,
): Promise<User> {
	const hash = generateHash(password);
	return await userRepository.updateUserPasswordById(id, hash);
}
