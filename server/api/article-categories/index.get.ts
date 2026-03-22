import { getDb } from '../../db'
import { articleCategories } from '../../db/schema'

export default defineEventHandler(async () => {
  const db = getDb()
  const rows = await db.select().from(articleCategories)
  return { categories: rows }
})
