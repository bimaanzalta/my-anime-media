import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { articles, users, articleCategories, articleTags, articleAnime, anime } from '../../../db/schema'
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
    id: articles.id,
    title: articles.title,
    slug: articles.slug,
    excerpt: articles.excerpt,
    body: articles.body,
    coverImage: articles.coverImage,
    status: articles.status,
    publishedAt: articles.publishedAt,
    createdAt: articles.createdAt,
    categoryId: articles.categoryId,
    author: { id: users.id, username: users.username, avatar: users.avatar },
    category: { id: articleCategories.id, name: articleCategories.name },
  })
    .from(articles)
    .leftJoin(users, eq(articles.userId, users.id))
    .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
    .where(eq(articles.id, id))
    .limit(1)

  if (!rows.length) throw createError({ statusCode: 404, message: 'Article not found' })

  const tags = await db.select().from(articleTags).where(eq(articleTags.articleId, id))

  const animeRelations = await db.select({
    id: anime.id,
    title: anime.title,
    mainPicture: anime.mainPicture,
    mean: anime.mean,
  })
    .from(articleAnime)
    .leftJoin(anime, eq(articleAnime.animeId, anime.id))
    .where(eq(articleAnime.articleId, id))

  return {
    article: {
      ...rows[0],
      tags: tags.map(t => t.tag),
      anime: animeRelations,
    }
  }
})
