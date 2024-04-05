import { prismaClient } from "@/services/prisma";
import type { Campus, Session, User } from "@prisma/client";

const campusModel = prismaClient.campus;

const listAllCampus = async (): Promise<Campus[]> =>
	await campusModel.findMany();

const storeNewCampus = async (data: Omit<Campus, "id">): Promise<Campus> =>
	await campusModel.create({ data });

const destroyCampusById = async (id: string): Promise<Campus> =>
	await campusModel.delete({ where: { id } });

export const campusRepository = {
	listAllCampus,
	storeNewCampus,
	destroyCampusById,
};
