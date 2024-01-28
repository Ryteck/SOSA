import { prismaClient } from '@/services/prisma'
import type { Alert } from '@prisma/client'

const alertModel = prismaClient.alert

const listAllAlerts = async (): Promise<Alert[]> => await alertModel.findMany()

export const alertRepository = { listAllAlerts }
