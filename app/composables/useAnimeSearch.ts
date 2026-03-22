export function useAnimeSearch() {
  const query = ref('')
  const results = ref<any[]>([])
  const selected = ref<any[]>([])
  const searching = ref(false)

  let timeout: ReturnType<typeof setTimeout>

  watch(query, (val) => {
    clearTimeout(timeout)
    if (!val.trim()) { results.value = []; return }
    timeout = setTimeout(async () => {
      searching.value = true
      try {
        const data = await $fetch<any>('/api/anime/search', { query: { q: val } })
        results.value = data?.data || []
      } finally {
        searching.value = false
      }
    }, 400)
  })

  function select(animeNode: any) {
    if (!selected.value.find(a => a.id === animeNode.id)) {
      selected.value.push(animeNode)
    }
    query.value = ''
    results.value = []
  }

  function remove(id: number) {
    selected.value = selected.value.filter(a => a.id !== id)
  }

  return { query, results, selected, searching, select, remove }
}
