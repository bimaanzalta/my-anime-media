import { and, eq, isNull } from 'drizzle-orm'
import { getDb } from '../../../db'
import { comments, users } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')!
  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) return { comments: [] }
  const db = getDb()

  // Get all visible comments for this entity
  const allComments = await db.select({
    id: comments.id,
    body: comments.body,
    parentId: comments.parentId,
    status: comments.status,
    createdAt: comments.createdAt,
    author: { id: users.id, username: users.username, avatar: users.avatar },
  })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(
      and(
        eq(comments.commentableType, type),
        eq(comments.commentableId, id),
        eq(comments.status, 'visible')
      )
    )

  // Build tree: top-level first, then nest replies
  const topLevel = allComments.filter(c => !c.parentId)
  const replies = allComments.filter(c => !!c.parentId)

  const tree = topLevel.map(comment => ({
    ...comment,
    replies: replies.filter(r => r.parentId === comment.id),
  }))

  return { comments: tree }
})
