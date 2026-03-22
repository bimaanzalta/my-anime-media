import { getDb } from '../../../db'
import { forumThreads, forumPosts, forumThreadAnime } from '../../../db/schema'
import { getUserFromEvent } from '../../../utils/auth'

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
  const { title, body: postBody, forumCategoryId, animeIds = [] } = body

  if (!title) throw createError({ statusCode: 400, message: 'Title is required' })
  if (!forumCategoryId) throw createError({ statusCode: 400, message: 'Category is required' })

  const db = getDb()
  const slug = generateSlug(title)

  const [threadResult] = await db.insert(forumThreads).values({
    userId: user.id as number,
    forumCategoryId: Number(forumCategoryId),
    title,
    slug,
    lastActivityAt: new Date(),
  })

  const threadId = (threadResult as any).insertId

  await db.insert(forumPosts).values({
    threadId,
    userId: user.id as number,
    body: postBody || '',
    isFirstPost: true,
  })

  if (animeIds.length > 0) {
    await db.insert(forumThreadAnime).values(
      animeIds.map((animeId: number) => ({ threadId, animeId }))
    )
  }

  return { thread: { id: threadId, slug } }
})
