<script setup lang="ts">
const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const error = ref('')

async function search() {
  if (!query.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    const data = await $fetch<any>('/api/anime/search', { query: { q: query.value } })
    results.value = data?.data || []
  } catch (e: any) {
    error.value = e.data?.message || 'Gagal mencari anime'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-12" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Jelajahi Anime</h1>

      <form @submit.prevent="search" class="flex gap-3 mb-10">
        <input
          v-model="query"
          type="text"
          placeholder="Cari anime... (contoh: Frieren, Chainsaw Man)"
          class="flex-1 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border text-sm"
          style="background: var(--bg-card); color: var(--text-primary); border-color: var(--border-color);"
        />
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          {{ loading ? 'Mencari...' : 'Cari' }}
        </button>
      </form>

      <p v-if="error" class="text-red-500 mb-6">{{ error }}</p>

      <div v-if="results.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <NuxtLink
          v-for="anime in results"
          :key="anime.node.id"
          :to="`/anime/${anime.node.id}`"
          class="rounded-xl overflow-hidden border hover:border-violet-500/50 transition group"
          style="background: var(--bg-card); border-color: var(--border-color);"
        >
          <img
            :src="anime.node.main_picture?.medium"
            :alt="anime.node.title"
            class="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
          />
          <div class="p-3">
            <p class="text-sm font-medium leading-tight line-clamp-2" style="color: var(--text-primary);">{{ anime.node.title }}</p>
            <p v-if="anime.node.mean" class="text-xs text-yellow-500 mt-1">★ {{ anime.node.mean }}</p>
          </div>
        </NuxtLink>
      </div>

      <div v-else-if="!loading && query" class="text-center mt-16" style="color: var(--text-muted);">
        Tidak ada hasil untuk "<span style="color: var(--text-primary);">{{ query }}</span>"
      </div>

      <div v-else-if="!query" class="text-center mt-16" style="color: var(--text-faint);">
        <p class="text-2xl mb-2">🔍</p>
        <p>Ketik nama anime untuk mulai mencari</p>
      </div>
    </div>
  </div>
</template>
