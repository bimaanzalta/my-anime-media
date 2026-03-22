import { getDb } from '../../db'
import { articles, articleTags, articleAnime } from '../../db/schema'
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
  const { title, excerpt, body: content, categoryId, coverImage, status, tags = [], animeIds = [] } = body

  if (!title) throw createError({ statusCode: 400, message: 'Title is required' })

  const db = getDb()
  const slug = generateSlug(title)

  const [result] = await db.insert(articles).values({
    userId: user.id as number,
    categoryId: categoryId || null,
    title,
    slug,
    excerpt: excerpt || null,
    body: content || null,
    coverImage: coverImage || null,
    status: status || 'draft',
    publishedAt: status === 'published' ? new Date() : null,
  })

  const articleId = (result as any).insertId

  if (tags.length > 0) {
    await db.insert(articleTags).values(
      tags.map((tag: string) => ({ articleId, tag }))
    )
  }

  if (animeIds.length > 0) {
    await db.insert(articleAnime).values(
      animeIds.map((animeId: number) => ({ articleId, animeId }))
    )
  }

  return { article: { id: articleId, slug } }
})
