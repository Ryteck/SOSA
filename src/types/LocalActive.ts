import type { Local } from "@prisma/client";

export default interface LocalActive extends Local {
	active: boolean;
}
