import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { malConnections } from '../../../db/schema'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const db = getDb()
  await db.delete(malConnections).where(eq(malConnections.userId, user.id as number))

  deleteCookie(event, 'mal_access_token')

  return { ok: true }
})
