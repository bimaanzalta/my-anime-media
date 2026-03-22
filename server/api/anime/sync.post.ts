import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { anime } from '../../db/schema'
import { getMalAnimeDetail } from '../../utils/mal'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user || !['admin', 'moderator'].includes(user.role as string)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const { malId } = await readBody(event)
  if (!malId) throw createError({ statusCode: 400, message: 'malId required' })

  const malToken = getCookie(event, 'mal_access_token')
  const data: any = await getMalAnimeDetail(malId, malToken || undefined)

  const db = getDb()
  const existing = await db.select().from(anime).where(eq(anime.malId, malId)).limit(1)

  const animeData = {
    malId: data.id,
    title: data.title,
    titleEn: data.alternative_titles?.en || null,
    titleJp: data.alternative_titles?.ja || null,
    synopsis: data.synopsis || null,
    mainPicture: JSON.stringify(data.main_picture || {}),
    mediaType: data.media_type || null,
    status: data.status || null,
    genres: JSON.stringify(data.genres?.map((g: any) => g.name) || []),
    studios: JSON.stringify(data.studios?.map((s: any) => s.name) || []),
    startDate: data.start_date || null,
    endDate: data.end_date || null,
    mean: data.mean?.toString() || null,
    popularity: data.popularity || null,
    rank: data.rank || null,
    relatedAnime: JSON.stringify(data.related_anime || []),
    syncedAt: new Date(),
  }

  if (existing.length > 0) {
    await db.update(anime).set(animeData).where(eq(anime.malId, malId))
  } else {
    await db.insert(anime).values(animeData)
  }

  return { ok: true, anime: animeData }
})
