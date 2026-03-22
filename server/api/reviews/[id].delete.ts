import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { reviews } from '../../db/schema'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()

  const [existing] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1)
  if (!existing) throw createError({ statusCode: 404, message: 'Review not found' })

  const isAdminOrMod = ['admin', 'moderator'].includes(user.role as string)
  if (existing.userId !== user.id && !isAdminOrMod) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  await db.delete(reviews).where(eq(reviews.id, id))
  return { success: true }
})
