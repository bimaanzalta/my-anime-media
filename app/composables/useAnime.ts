export function useAnime() {
  async function searchAnime(query: string) {
    return $fetch<any>('/api/anime/search', { query: { q: query } })
  }

  async function syncAnime(malId: number) {
    return $fetch('/api/anime/sync', { method: 'POST', body: { malId } })
  }

  return { searchAnime, syncAnime }
}
