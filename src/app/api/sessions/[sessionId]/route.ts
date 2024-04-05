import { sessionRepository } from "@/repositories/session";

interface Params {
	params: { sessionId: string };
}

export async function GET(
	request: Request,
	{ params }: Params,
): Promise<Response> {
	try {
		const session = await sessionRepository.getFullSessionDataById(
			params.sessionId,
		);

		return Response.json(session);
	} catch (e) {
		console.error(e);
		return Response.json(null);
	}
}

export const revalidate = 0;
