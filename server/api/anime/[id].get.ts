import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { anime } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid id' })

  const db = getDb()
  const [row] = await db.select().from(anime).where(eq(anime.id, id)).limit(1)
  if (!row) throw createError({ statusCode: 404, message: 'Anime tidak ditemukan' })

  return row
})
