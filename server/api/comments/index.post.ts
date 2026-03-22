import { getDb } from '../../db'
import { comments } from '../../db/schema'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { commentableType, commentableId, body: commentBody, parentId } = body

  if (!commentableType || !commentableId) throw createError({ statusCode: 400, message: 'commentableType and commentableId are required' })
  if (!commentBody?.trim()) throw createError({ statusCode: 400, message: 'Body is required' })

  const db = getDb()

  const [result] = await db.insert(comments).values({
    userId: user.id as number,
    commentableType,
    commentableId: Number(commentableId),
    parentId: parentId ? Number(parentId) : null,
    body: commentBody,
    status: 'visible',
  })

  return { comment: { id: (result as any).insertId } }
})
