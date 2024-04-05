import { prismaClient } from "@/services/prisma";
import type AlertDetailsWithSession from "@/types/AlertDetailsWithSession";
import type { Alert } from "@prisma/client";

const alertModel = prismaClient.alert;

const listAllAlerts = async (): Promise<Alert[]> => await alertModel.findMany();

const listAllDetailAlerts = async (): Promise<AlertDetailsWithSession[]> =>
	await alertModel.findMany({
		select: {
			id: true,
			details: true,
			createdAt: true,
			local: { select: { name: true, details: true } },
			user: { select: { id: true, name: true } },
			session: {
				select: { person: { select: { name: true, details: true } } },
			},
		},
		orderBy: {
			createdAt: "asc",
		},
	});

const storeNewAlert = async (
	data: Omit<Alert, "id" | "userId" | "createdAt">,
): Promise<Alert> => await alertModel.create({ data });

const destroyAlertById = async (id: string): Promise<Alert> =>
	await alertModel.delete({ where: { id } });

const updateAlertUserById = async (
	id: string,
	userId: string,
): Promise<Alert> =>
	await alertModel.update({
		where: { id },
		data: { userId },
	});

export const alertRepository = {
	listAllAlerts,
	listAllDetailAlerts,
	storeNewAlert,
	destroyAlertById,
	updateAlertUserById,
};
