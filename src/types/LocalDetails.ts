import type { Campus, Local } from "@prisma/client";

export default interface LocalDetails extends Local {
	campus: Campus;
}
