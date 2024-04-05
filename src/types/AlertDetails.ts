export default interface AlertDetails {
	id: string;
	details: string;
	createdAt: Date | string;
	local: {
		name: string;
		details: string;
		campus: { id: string; name: string };
	};
	user: null | { id: string; name: string };
}
