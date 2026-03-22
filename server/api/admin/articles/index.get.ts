import { desc, eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { articles, users, articleCategories } from '../../../db/schema'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })
  if (!['admin', 'moderator'].includes(user.role as string)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const db = getDb()
  const rows = await db.select({
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    excerpt: articles.excerpt,
    coverImage: articles.coverImage,
    status: articles.status,
    publishedAt: articles.publishedAt,
    createdAt: articles.createdAt,
    updatedAt: articles.updatedAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
    category: { id: articleCategories.id, name: articleCategories.name },
  })
    .from(articles)
    .leftJoin(users, eq(articles.userId, users.id))
    .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
    .orderBy(desc(articles.createdAt))

  return { articles: rows }
})
