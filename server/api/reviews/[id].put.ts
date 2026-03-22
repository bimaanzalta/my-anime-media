import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { reviews, reviewAnime } from '../../db/schema'
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

  const body = await readBody(event)
  const { title, excerpt, body: content, rating, spoilerFlag, status, animeIds = [] } = body

  const updateData: any = {
    title,
    excerpt: excerpt || null,
    body: content || null,
    rating: Number(rating),
    spoilerFlag: !!spoilerFlag,
    status: status || existing.status,
  }

  if (status === 'published' && !existing.publishedAt) {
    // reviews don't have publishedAt in schema, skip
  }

  await db.update(reviews).set(updateData).where(eq(reviews.id, id))

  await db.delete(reviewAnime).where(eq(reviewAnime.reviewId, id))
  if (animeIds.length > 0) {
    await db.insert(reviewAnime).values(animeIds.map((animeId: number) => ({ reviewId: id, animeId })))
  }

  return { success: true }
})
