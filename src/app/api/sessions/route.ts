import { alertRepository } from "@/repositories/alert";
import { personRepository } from "@/repositories/person";
import { sessionRepository } from "@/repositories/session";
import type PeopleWithSessionsAndAlerts from "@/types/PeopleWithSessionsAndAlerts";

export async function GET(): Promise<Response> {
	const [people, sessions, alerts] = await Promise.all([
		personRepository.listAllPeople(),
		sessionRepository.listAllSessions(),
		alertRepository.listAllAlerts(),
	]);

	const peopleWithSessionsAndAlerts: PeopleWithSessionsAndAlerts[] = people.map(
		(person) => {
			const session = sessions.find(
				(session) => session.personId === person.id,
			);

			let alertId: undefined | string;

			if (session !== undefined) {
				const alert = alerts.find((alert) => alert.sessionId === session.id);
				alertId = alert?.id;
			}

			return {
				...person,
				sessionId: session?.id,
				alertId,
			};
		},
	);

	return Response.json(peopleWithSessionsAndAlerts);
}

export const revalidate = 0;
