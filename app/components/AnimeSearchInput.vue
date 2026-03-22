<script setup lang="ts">
const props = defineProps<{ modelValue: number[] }>()
const emit = defineEmits<{ 'update:modelValue': [number[]] }>()

const query = ref('')
const results = ref<any[]>([])
const selectedAnime = ref<any[]>([])
const searching = ref(false)
let timeout: any

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

function select(item: any) {
  const node = item.node
  if (!selectedAnime.value.find(a => a.id === node.id)) {
    selectedAnime.value.push(node)
    emit('update:modelValue', selectedAnime.value.map(a => a.id))
  }
  query.value = ''
  results.value = []
}

function remove(id: number) {
  selectedAnime.value = selectedAnime.value.filter(a => a.id !== id)
  emit('update:modelValue', selectedAnime.value.map(a => a.id))
}
</script>

<template>
  <div>
    <div class="relative">
      <input
        v-model="query"
        type="text"
        placeholder="Cari anime..."
        class="w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 border"
        style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"
      />
      <div
        v-if="results.length || searching"
        class="absolute top-full left-0 right-0 z-10 border rounded-xl mt-1 max-h-60 overflow-y-auto shadow-xl"
        style="background: var(--bg-card); border-color: var(--border-color);"
      >
        <div v-if="searching" class="px-4 py-3 text-sm" style="color: var(--text-muted);">Mencari...</div>
        <button
          v-for="item in results"
          :key="item.node.id"
          type="button"
          @click="select(item)"
          class="w-full flex items-center gap-3 px-3 py-2 transition text-left search-result-btn"
        >
          <img
            v-if="item.node.main_picture?.medium"
            :src="item.node.main_picture?.medium"
            class="w-10 h-14 object-cover rounded flex-shrink-0"
          />
          <div class="min-w-0">
            <p class="text-sm font-medium line-clamp-1" style="color: var(--text-primary);">{{ item.node.title }}</p>
            <p class="text-xs" style="color: var(--text-muted);">{{ item.node.mean ? '&#9733; ' + item.node.mean : '' }}</p>
          </div>
        </button>
      </div>
    </div>
    <div v-if="selectedAnime.length" class="flex flex-wrap gap-2 mt-2">
      <div
        v-for="animeItem in selectedAnime"
        :key="animeItem.id"
        class="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm"
        style="background: var(--bg-surface); border-color: var(--border-color);"
      >
        <img
          v-if="animeItem.main_picture?.medium"
          :src="animeItem.main_picture.medium"
          class="w-6 h-8 object-cover rounded"
        />
        <span class="max-w-[150px] truncate" style="color: var(--text-primary);">{{ animeItem.title }}</span>
        <button
          type="button"
          @click="remove(animeItem.id)"
          class="transition ml-1 hover:text-red-400"
          style="color: var(--text-muted);"
        >&#10005;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-result-btn {
  cursor: pointer;
}
.search-result-btn:hover {
  background: var(--hover-bg);
}
</style>
