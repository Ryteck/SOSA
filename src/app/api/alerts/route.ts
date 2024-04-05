import { alertRepository } from "@/repositories/alert";

export async function GET(): Promise<Response> {
	const alerts = await alertRepository.listAllDetailAlerts();
	return Response.json(alerts);
}

export const revalidate = 0;
