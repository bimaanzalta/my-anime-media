import { eq, and } from 'drizzle-orm'
import { getDb } from '../../db'
import { articles, articleTags, articleAnime } from '../../db/schema'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()

  const [existing] = await db.select().from(articles).where(eq(articles.id, id)).limit(1)
  if (!existing) throw createError({ statusCode: 404, message: 'Article not found' })

  const isAdminOrMod = ['admin', 'moderator'].includes(user.role as string)
  if (existing.userId !== user.id && !isAdminOrMod) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event)
  const { title, excerpt, body: content, categoryId, coverImage, status, tags = [], animeIds = [] } = body

  const updateData: any = {
    title,
    excerpt: excerpt || null,
    body: content || null,
    categoryId: categoryId || null,
    coverImage: coverImage || null,
    status: status || existing.status,
  }

  if (status === 'published' && !existing.publishedAt) {
    updateData.publishedAt = new Date()
  }

  await db.update(articles).set(updateData).where(eq(articles.id, id))

  // Replace tags
  await db.delete(articleTags).where(eq(articleTags.articleId, id))
  if (tags.length > 0) {
    await db.insert(articleTags).values(tags.map((tag: string) => ({ articleId: id, tag })))
  }

  // Replace anime relations
  await db.delete(articleAnime).where(eq(articleAnime.articleId, id))
  if (animeIds.length > 0) {
    await db.insert(articleAnime).values(animeIds.map((animeId: number) => ({ articleId: id, animeId })))
  }

  return { success: true }
})
