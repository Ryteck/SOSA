import type { Person } from "@prisma/client";

export default interface PersonWithSession extends Person {
	sessionId?: string;
	alertId?: string;
}
