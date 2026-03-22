import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { reviews, users, reviewAnime, anime } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params ?? {}
  const slug = (params.slug || params.id || '') as string
  const db = getDb()

  const rows = await db.select({
    id: reviews.id,
    title: reviews.title,
    slug: reviews.slug,
    excerpt: reviews.excerpt,
    body: reviews.body,
    rating: reviews.rating,
    spoilerFlag: reviews.spoilerFlag,
    helpfulCount: reviews.helpfulCount,
    status: reviews.status,
    createdAt: reviews.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.slug, slug))
    .limit(1)

  if (!rows.length) return { review: null }

  const animeRelations = await db.select({
    id: anime.id,
    title: anime.title,
    mainPicture: anime.mainPicture,
    mean: anime.mean,
  })
    .from(reviewAnime)
    .leftJoin(anime, eq(reviewAnime.animeId, anime.id))
    .where(eq(reviewAnime.reviewId, rows[0].id))

  return { review: { ...rows[0], anime: animeRelations } }
})
