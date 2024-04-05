import { prismaClient } from "@/services/prisma";
import type LocalDetails from "@/types/LocalDetails";
import type { Local } from "@prisma/client";

const localModel = prismaClient.local;

const listAllLocations = async (): Promise<LocalDetails[]> =>
	await localModel.findMany({
		orderBy: [{ campus: { name: "asc" } }, { name: "asc" }],
		include: { campus: true },
	});

const listAllLocationsBySessionId = async (
	sessionId: string,
): Promise<Local[]> =>
	await localModel.findMany({
		where: { sessions: { some: { id: sessionId } } },
		orderBy: { name: "asc" },
	});

const storeNewLocal = async (data: Omit<Local, "id">): Promise<Local> =>
	await localModel.create({ data });

const destroyLocalById = async (id: string): Promise<Local> =>
	await localModel.delete({ where: { id } });

export const localRepository = {
	listAllLocations,
	listAllLocationsBySessionId,
	storeNewLocal,
	destroyLocalById,
};
