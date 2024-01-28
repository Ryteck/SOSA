import { prismaClient } from '@/services/prisma'
import type { Alert } from '@prisma/client'

const alertModel = prismaClient.alert

const listAllAlerts = async (): Promise<Alert[]> => await alertModel.findMany()

const storeNewAlert = async (
  data: Omit<Alert, 'id' | 'userId' | 'createdAt'>,
): Promise<Alert> => await alertModel.create({ data })

export const alertRepository = { listAllAlerts, storeNewAlert }
