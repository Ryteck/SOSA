import type AlertDetails from "@/types/AlertDetails";

export default interface AlertDetailsWithSession extends AlertDetails {
	session: { person: { name: string; details: string } };
}
