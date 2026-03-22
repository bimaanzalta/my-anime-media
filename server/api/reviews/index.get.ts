import { desc, eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { reviews, users } from '../../db/schema'

export default defineEventHandler(async () => {
  const db = getDb()
  const rows = await db.select({
    id: reviews.id,
    title: reviews.title,
    slug: reviews.slug,
    excerpt: reviews.excerpt,
    rating: reviews.rating,
    spoilerFlag: reviews.spoilerFlag,
    helpfulCount: reviews.helpfulCount,
    createdAt: reviews.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.status, 'published'))
    .orderBy(desc(reviews.createdAt))
    .limit(20)

  return { reviews: rows }
})
