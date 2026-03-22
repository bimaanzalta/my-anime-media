import { desc, eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { forumThreads, users, forumCategories } from '../../../db/schema'

export default defineEventHandler(async () => {
  const db = getDb()
  const rows = await db.select({
    id: forumThreads.id,
    title: forumThreads.title,
    slug: forumThreads.slug,
    isPinned: forumThreads.isPinned,
    isLocked: forumThreads.isLocked,
    viewCount: forumThreads.viewCount,
    replyCount: forumThreads.replyCount,
    lastActivityAt: forumThreads.lastActivityAt,
    createdAt: forumThreads.createdAt,
    author: { id: users.id, username: users.username },
    category: { id: forumCategories.id, name: forumCategories.name, slug: forumCategories.slug },
  })
    .from(forumThreads)
    .leftJoin(users, eq(forumThreads.userId, users.id))
    .leftJoin(forumCategories, eq(forumThreads.forumCategoryId, forumCategories.id))
    .orderBy(desc(forumThreads.lastActivityAt))
    .limit(20)

  return { threads: rows }
})
