import type { Session } from '@prisma/client'
import type AlertDetails from '@/types/AlertDetails'

export default interface FullSessionData extends Session {
  person: { name: string; details: string }
  locations: Array<{ id: string; name: string; details: string }>
  alerts: AlertDetails[]
}
