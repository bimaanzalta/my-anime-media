<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { data, refresh } = await useFetch('/api/admin/reviews')
const reviews = computed(() => (data.value as any)?.reviews || [])

async function deleteReview(id: number, title: string) {
  if (!confirm(`Hapus review "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return
  try {
    await $fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menghapus review')
  }
}

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold">Manajemen Review</h1>
          <p class="mt-1 text-sm" style="color: var(--text-muted);">{{ reviews.length }} review ditemukan</p>
        </div>
        <NuxtLink to="/admin/reviews/create" class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition">
          + Buat Review
        </NuxtLink>
      </div>

      <!-- Table -->
      <div class="rounded-xl border overflow-hidden" style="background: var(--bg-card); border-color: var(--border-color);">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left" style="border-color: var(--border-color);">
                <th v-for="h in ['Judul','Rating','Status','Penulis','Tanggal','Aksi']" :key="h"
                  class="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in reviews" :key="review.id" class="border-b last:border-0 transition" style="border-color: var(--border-subtle);">
                <td class="px-6 py-4">
                  <p class="font-medium line-clamp-1 max-w-xs" style="color: var(--text-primary);">{{ review.title }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span v-if="review.spoilerFlag" class="text-xs bg-orange-500/15 text-orange-500 px-1.5 py-0.5 rounded">Spoiler</span>
                    <span class="text-xs" style="color: var(--text-faint);">/reviews/{{ review.slug }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-yellow-500 text-sm tracking-wider">{{ stars(review.rating) }}</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="review.status === 'published' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-gray-500/15 text-gray-500'"
                    class="text-xs px-2 py-0.5 rounded-full"
                  >{{ review.status }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm" style="color: var(--text-secondary);">{{ review.author?.username || '—' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm" style="color: var(--text-muted);">{{ new Date(review.createdAt).toLocaleDateString('id-ID') }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <NuxtLink :to="`/reviews/${review.slug}`" class="px-3 py-1 text-xs rounded-lg transition" style="background: var(--bg-surface); color: var(--text-secondary);">Lihat</NuxtLink>
                    <button @click="deleteReview(review.id, review.title)" class="px-3 py-1 text-xs bg-red-500/15 text-red-500 hover:bg-red-500/25 rounded-lg transition">Hapus</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!reviews.length">
                <td colspan="6" class="px-6 py-12 text-center text-sm" style="color: var(--text-muted);">Belum ada review.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
