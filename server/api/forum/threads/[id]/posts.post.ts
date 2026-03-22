import { eq, sql } from 'drizzle-orm'
import { getDb } from '../../../../db'
import { forumThreads, forumPosts } from '../../../../db/schema'
import { getUserFromEvent } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const threadId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { body: postBody } = body

  if (!postBody?.trim()) throw createError({ statusCode: 400, message: 'Body is required' })

  const db = getDb()

  const [thread] = await db.select().from(forumThreads).where(eq(forumThreads.id, threadId)).limit(1)
  if (!thread) throw createError({ statusCode: 404, message: 'Thread not found' })
  if (thread.isLocked) throw createError({ statusCode: 403, message: 'Thread is locked' })

  const [result] = await db.insert(forumPosts).values({
    threadId,
    userId: user.id as number,
    body: postBody,
    isFirstPost: false,
  })

  const postId = (result as any).insertId

  await db.update(forumThreads)
    .set({
      replyCount: sql`${forumThreads.replyCount} + 1`,
      lastActivityAt: new Date(),
    })
    .where(eq(forumThreads.id, threadId))

  return { post: { id: postId } }
})
