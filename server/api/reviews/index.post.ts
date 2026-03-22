import { getDb } from '../../db'
import { reviews, reviewAnime } from '../../db/schema'
import { getUserFromEvent } from '../../utils/auth'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Math.random().toString(36).substring(2, 7)
}

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { title, excerpt, body: content, rating, spoilerFlag, status, animeIds = [] } = body

  if (!title) throw createError({ statusCode: 400, message: 'Title is required' })
  if (!rating || rating < 1 || rating > 5) throw createError({ statusCode: 400, message: 'Rating must be between 1 and 5' })

  const db = getDb()
  const slug = generateSlug(title)

  const [result] = await db.insert(reviews).values({
    userId: user.id as number,
    title,
    slug,
    excerpt: excerpt || null,
    body: content || null,
    rating: Number(rating),
    spoilerFlag: !!spoilerFlag,
    status: status || 'draft',
  })

  const reviewId = (result as any).insertId

  if (animeIds.length > 0) {
    await db.insert(reviewAnime).values(
      animeIds.map((animeId: number) => ({ reviewId, animeId }))
    )
  }

  return { review: { id: reviewId, slug } }
})
