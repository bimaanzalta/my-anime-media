<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const { data: anime } = await useFetch<any>(`/api/anime/${id}`)
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div v-if="anime" class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <NuxtLink to="/anime"
        class="inline-flex items-center gap-2 text-sm hover:text-violet-500 transition mb-8"
        style="color: var(--text-muted);">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </NuxtLink>

      <div class="flex flex-col md:flex-row gap-10">
        <img :src="anime.mainPicture?.large || anime.mainPicture?.medium" :alt="anime.title"
          class="w-56 h-80 object-cover rounded-2xl flex-shrink-0 shadow-2xl" />
        <div>
          <h1 class="text-3xl md:text-4xl font-black mb-2" style="color: var(--text-primary);">{{ anime.title }}</h1>
          <p v-if="anime.titleEn" class="text-sm mb-4" style="color: var(--text-muted);">{{ anime.titleEn }}</p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span v-for="g in JSON.parse(anime.genres)" :key="g.id || g"
              class="px-3 py-1 rounded-full text-xs bg-[#7c3aed]/15 text-[#8b5cf6] border border-[#7c3aed]/20">
              {{ g.name || g }}
            </span>
          </div>
          <div class="flex gap-6 mb-6 text-sm">
            <div v-if="anime.score">
              <span style="color: var(--text-muted);">Score</span>
              <p class="text-amber-500 font-black text-xl">{{ anime.score }}</p>
            </div>
            <div v-if="anime.mediaType">
              <span style="color: var(--text-muted);">Tipe</span>
              <p class="font-bold capitalize" style="color: var(--text-primary);">{{ anime.mediaType }}</p>
            </div>
            <div v-if="anime.status">
              <span style="color: var(--text-muted);">Status</span>
              <p class="font-bold capitalize" style="color: var(--text-primary);">{{ anime.status }}</p>
            </div>
          </div>
          <p class="leading-relaxed text-sm" style="color: var(--text-secondary);">{{ anime.synopsis }}</p>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center min-h-screen">
      <p style="color: var(--text-muted);">Anime tidak ditemukan.</p>
    </div>
  </div>
</template>
