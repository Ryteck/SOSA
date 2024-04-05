import { localRepository } from "@/repositories/local";
import type LocalActive from "@/types/LocalActive";

interface Params {
	params: { sessionId: string };
}

export async function GET(
	request: Request,
	{ params }: Params,
): Promise<Response> {
	const locations = await localRepository.listAllLocations();

	const sessionLocations = await localRepository.listAllLocationsBySessionId(
		params.sessionId,
	);

	const sessionLocationsId = sessionLocations.map(({ id }) => id);

	const locationsActives: LocalActive[] = locations.map((local) => ({
		...local,
		active: sessionLocationsId.includes(local.id),
	}));

	return Response.json(locationsActives);
}

export const revalidate = 0;
