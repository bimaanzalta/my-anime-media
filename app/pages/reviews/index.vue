<script setup lang="ts">
const { data } = await useFetch('/api/reviews')
</script>

<template>
  <div class="min-h-screen px-4 py-12" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Review</h1>
      <div class="grid gap-6">
        <div
          v-for="review in data?.reviews"
          :key="review.id"
          class="rounded-xl p-6 border transition hover:border-violet-500/50"
          style="background: var(--bg-card); border-color: var(--border-color);"
        >
          <div class="flex justify-between items-start mb-2">
            <NuxtLink :to="`/reviews/${review.slug}`">
              <h2 class="text-xl font-semibold hover:text-violet-500 transition">{{ review.title }}</h2>
            </NuxtLink>
            <span class="text-yellow-500 font-bold text-lg">{{ review.rating }}/5</span>
          </div>
          <p class="text-sm" style="color: var(--text-muted);">{{ review.excerpt }}</p>
          <div class="flex items-center gap-3 mt-4 text-xs" style="color: var(--text-faint);">
            <span v-if="review.spoilerFlag" class="bg-red-500/15 text-red-500 px-2 py-0.5 rounded">Spoiler</span>
            <span>{{ review.author?.username }}</span>
            <span>•</span>
            <span>{{ new Date(review.createdAt).toLocaleDateString('id-ID') }}</span>
          </div>
        </div>
      </div>
      <p v-if="!data?.reviews?.length" class="text-center mt-12" style="color: var(--text-muted);">Belum ada review.</p>
    </div>
  </div>
</template>
