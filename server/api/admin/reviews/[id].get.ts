import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { reviews, users, reviewAnime, anime } from '../../../db/schema'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })
  if (!['admin', 'moderator'].includes(user.role as string)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = Number(getRouterParam(event, 'id'))
  const db = getDb()

  const rows = await db.select({
    id: reviews.id,
    title: reviews.title,
    slug: reviews.slug,
    excerpt: reviews.excerpt,
    body: reviews.body,
    rating: reviews.rating,
    spoilerFlag: reviews.spoilerFlag,
    status: reviews.status,
    helpfulCount: reviews.helpfulCount,
    createdAt: reviews.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.id, id))
    .limit(1)

  if (!rows.length) throw createError({ statusCode: 404, message: 'Review not found' })

  const animeRelations = await db.select({
    id: anime.id,
    title: anime.title,
    mainPicture: anime.mainPicture,
    mean: anime.mean,
  })
    .from(reviewAnime)
    .leftJoin(anime, eq(reviewAnime.animeId, anime.id))
    .where(eq(reviewAnime.reviewId, id))

  return { review: { ...rows[0], anime: animeRelations } }
})
