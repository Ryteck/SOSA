"use server";

import { userRepository } from "@/repositories/user";
import type { User } from "@prisma/client";

export default async function destroyUserById(id: string): Promise<User> {
	return await userRepository.destroyUserById(id);
}
