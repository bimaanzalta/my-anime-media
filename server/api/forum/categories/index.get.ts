import { asc } from 'drizzle-orm'
import { getDb } from '../../../db'
import { forumCategories } from '../../../db/schema'

export default defineEventHandler(async () => {
  const db = getDb()
  const rows = await db.select().from(forumCategories).orderBy(asc(forumCategories.order))
  return { categories: rows }
})
