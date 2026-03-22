import { eq, sql } from 'drizzle-orm'
import { getDb } from '../../../db'
import { forumThreads, forumPosts, users, forumCategories } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const params = event.context.params ?? {}
  const slug = (params.slug || params.id || '') as string
  const db = getDb()

  const threadRows = await db.select({
    id: forumThreads.id,
    title: forumThreads.title,
    slug: forumThreads.slug,
    isPinned: forumThreads.isPinned,
    isLocked: forumThreads.isLocked,
    viewCount: forumThreads.viewCount,
    replyCount: forumThreads.replyCount,
    lastActivityAt: forumThreads.lastActivityAt,
    createdAt: forumThreads.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
    category: { id: forumCategories.id, name: forumCategories.name, slug: forumCategories.slug },
  })
    .from(forumThreads)
    .leftJoin(users, eq(forumThreads.userId, users.id))
    .leftJoin(forumCategories, eq(forumThreads.forumCategoryId, forumCategories.id))
    .where(eq(forumThreads.slug, slug))
    .limit(1)

  if (!threadRows.length) return { thread: null, posts: [] }

  const thread = threadRows[0]

  // Increment view count
  await db.update(forumThreads)
    .set({ viewCount: sql`${forumThreads.viewCount} + 1` })
    .where(eq(forumThreads.id, thread.id))

  const posts = await db.select({
    id: forumPosts.id,
    body: forumPosts.body,
    isFirstPost: forumPosts.isFirstPost,
    upvoteCount: forumPosts.upvoteCount,
    createdAt: forumPosts.createdAt,
    updatedAt: forumPosts.updatedAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(forumPosts)
    .leftJoin(users, eq(forumPosts.userId, users.id))
    .where(eq(forumPosts.threadId, thread.id))

  return { thread: { ...thread, viewCount: thread.viewCount + 1 }, posts }
})
