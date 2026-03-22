import { searchMalAnime } from '../../utils/mal'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event)
  if (!q) throw createError({ statusCode: 400, message: 'Query required' })

  const malToken = getCookie(event, 'mal_access_token')
  const results = await searchMalAnime(q as string, malToken || undefined)
  return results
})
