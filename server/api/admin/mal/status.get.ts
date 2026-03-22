import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { malConnections } from '../../../db/schema'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const db = getDb()
  const rows = await db
    .select({
      malUsername: malConnections.malUsername,
      malUserId: malConnections.malUserId,
      expiresAt: malConnections.expiresAt,
      updatedAt: malConnections.updatedAt,
    })
    .from(malConnections)
    .where(eq(malConnections.userId, user.id as number))
    .limit(1)

  if (rows.length === 0) {
    return { connected: false }
  }

  const conn = rows[0]
  const isExpired = conn.expiresAt.getTime() < Date.now()
  const isNearExpiry = !isExpired && conn.expiresAt.getTime() - Date.now() < 5 * 60 * 1000

  return {
    connected: true,
    malUsername: conn.malUsername,
    malUserId: conn.malUserId,
    expiresAt: conn.expiresAt,
    updatedAt: conn.updatedAt,
    isExpired,
    isNearExpiry,
  }
})
