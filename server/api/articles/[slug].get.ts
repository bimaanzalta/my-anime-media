import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { articles, users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params ?? {}
  const slug = (params.slug || params.id || '') as string
  console.log('[articles] params:', params, '→ slug:', slug)
  const db = getDb()

  try {
  const rows = await db.select({
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    excerpt: articles.excerpt,
    body: articles.body,
    coverImage: articles.coverImage,
    status: articles.status,
    publishedAt: articles.publishedAt,
    createdAt: articles.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(articles)
    .leftJoin(users, eq(articles.userId, users.id))
    .where(eq(articles.slug, slug))
    .limit(1)

  if (rows.length === 0) return { article: null }
  return { article: rows[0] }
  } catch (e) {
    console.error('[articles/[slug].get] DB error for slug:', slug, e)
    return { article: null }
  }
})
