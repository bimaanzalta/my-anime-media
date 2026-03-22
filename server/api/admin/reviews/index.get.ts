import { desc, eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { reviews, users } from '../../../db/schema'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })
  if (!['admin', 'moderator'].includes(user.role as string)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const db = getDb()
  const rows = await db.select({
    id: reviews.id,
    title: reviews.title,
    slug: reviews.slug,
    excerpt: reviews.excerpt,
    rating: reviews.rating,
    spoilerFlag: reviews.spoilerFlag,
    status: reviews.status,
    helpfulCount: reviews.helpfulCount,
    createdAt: reviews.createdAt,
    updatedAt: reviews.updatedAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .orderBy(desc(reviews.createdAt))

  return { reviews: rows }
})
