<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { data, refresh } = await useFetch('/api/admin/articles')
const articles = computed(() => (data.value as any)?.articles || [])

async function deleteArticle(id: number, title: string) {
  if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return
  try {
    await $fetch(`/api/articles/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menghapus artikel')
  }
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold">Manajemen Artikel</h1>
          <p class="mt-1 text-sm" style="color: var(--text-muted);">{{ articles.length }} artikel ditemukan</p>
        </div>
        <NuxtLink to="/admin/articles/create" class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition">
          + Buat Artikel
        </NuxtLink>
      </div>

      <!-- Table -->
      <div class="rounded-xl border overflow-hidden" style="background: var(--bg-card); border-color: var(--border-color);">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-left" style="border-color: var(--border-color);">
                <th v-for="h in ['Judul','Kategori','Status','Penulis','Tanggal','Aksi']" :key="h"
                  class="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in articles" :key="article.id" class="border-b last:border-0 transition" style="border-color: var(--border-subtle);">
                <td class="px-6 py-4">
                  <p class="font-medium line-clamp-1 max-w-xs" style="color: var(--text-primary);">{{ article.title }}</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-faint);">/articles/{{ article.slug }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm" style="color: var(--text-secondary);">{{ article.category?.name || '—' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="article.status === 'published' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-gray-500/15 text-gray-500'"
                    class="text-xs px-2 py-0.5 rounded-full"
                  >{{ article.status }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm" style="color: var(--text-secondary);">{{ article.author?.username || '—' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm" style="color: var(--text-muted);">{{ new Date(article.createdAt).toLocaleDateString('id-ID') }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <NuxtLink :to="`/admin/articles/${article.id}/edit`" class="px-3 py-1 text-xs bg-violet-500/15 text-violet-500 hover:bg-violet-500/25 rounded-lg transition">Edit</NuxtLink>
                    <button @click="deleteArticle(article.id, article.title)" class="px-3 py-1 text-xs bg-red-500/15 text-red-500 hover:bg-red-500/25 rounded-lg transition">Hapus</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!articles.length">
                <td colspan="6" class="px-6 py-12 text-center text-sm" style="color: var(--text-muted);">Belum ada artikel.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
