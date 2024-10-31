import { userRepository } from "@/repositories/user";

export async function GET(): Promise<Response> {
	const users = await userRepository.listAllUsers();
	return Response.json(users);
}

export const revalidate = 20;
