import { desc, eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { articles, users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const { page = 1, limit = 10, category } = getQuery(event)
  const db = getDb()
  const offset = (Number(page) - 1) * Number(limit)

  const rows = await db.select({
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    excerpt: articles.excerpt,
    coverImage: articles.coverImage,
    status: articles.status,
    publishedAt: articles.publishedAt,
    createdAt: articles.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(articles)
    .leftJoin(users, eq(articles.userId, users.id))
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(Number(limit))
    .offset(offset)

  return { articles: rows }
})
