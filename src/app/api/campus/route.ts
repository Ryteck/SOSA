import { campusRepository } from "@/repositories/campus";

export async function GET(): Promise<Response> {
	const campus = await campusRepository.listAllCampus();

	return Response.json(campus);
}

export const revalidate = 0;
