import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { users } from '../../db/schema'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const payload = await getUserFromEvent(event)
  if (!payload) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const db = getDb()
  const found = await db.select({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role,
    avatar: users.avatar,
    bio: users.bio,
  }).from(users).where(eq(users.id, payload.id as number)).limit(1)

  if (found.length === 0) throw createError({ statusCode: 404, message: 'User not found' })
  return { user: found[0] }
})
