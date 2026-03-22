import { asc } from 'drizzle-orm'
import { getDb } from '../../db'
import { anime } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const { limit = 5 } = getQuery(event)
  try {
    const db = getDb()
    const rows = await db
      .select({
        id: anime.id,
        title: anime.title,
        mainPicture: anime.mainPicture,
        genres: anime.genres,
        mean: anime.mean,
        rank: anime.rank,
      })
      .from(anime)
      .orderBy(asc(anime.id))
      .limit(Number(limit))

    return { anime: rows }
  } catch {
    return { anime: [] }
  }
})
