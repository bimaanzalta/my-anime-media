<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { data: articlesData } = await useFetch('/api/admin/articles')
const { data: reviewsData } = await useFetch('/api/admin/reviews')

const totalArticles = computed(() => (articlesData.value as any)?.articles?.length || 0)
const totalReviews = computed(() => (reviewsData.value as any)?.reviews?.length || 0)

const recentArticles = computed(() =>
  ((articlesData.value as any)?.articles || []).slice(0, 5)
)
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Dashboard Admin</h1>
        <p class="mt-1 text-sm" style="color: var(--text-muted);">Selamat datang di panel administrasi</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in [
          { label: 'Total Artikel', value: totalArticles },
          { label: 'Total Review', value: totalReviews },
          { label: 'Forum Threads', value: '—' },
          { label: 'Total Users', value: '—' },
        ]" :key="stat.label" class="rounded-xl border p-6" style="background: var(--bg-card); border-color: var(--border-color);">
          <p class="text-sm mb-1" style="color: var(--text-muted);">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-violet-500">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Articles -->
        <div class="lg:col-span-2 rounded-xl border p-6" style="background: var(--bg-card); border-color: var(--border-color);">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Artikel Terbaru</h2>
            <NuxtLink to="/admin/articles" class="text-sm text-violet-500 hover:text-violet-400 transition">Lihat semua</NuxtLink>
          </div>
          <div class="space-y-3">
            <div
              v-for="article in recentArticles"
              :key="article.id"
              class="flex items-center justify-between py-3 border-b last:border-0"
              style="border-color: var(--border-subtle);"
            >
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{{ article.title }}</p>
                <p class="text-xs mt-0.5" style="color: var(--text-muted);">{{ article.author?.username }} &middot; {{ new Date(article.createdAt).toLocaleDateString('id-ID') }}</p>
              </div>
              <span
                :class="article.status === 'published' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-gray-500/15 text-gray-500'"
                class="text-xs px-2 py-0.5 rounded-full ml-3 flex-shrink-0"
              >{{ article.status }}</span>
            </div>
            <p v-if="!recentArticles.length" class="text-sm" style="color: var(--text-muted);">Belum ada artikel.</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="rounded-xl border p-6" style="background: var(--bg-card); border-color: var(--border-color);">
          <h2 class="text-lg font-semibold mb-4">Akses Cepat</h2>
          <div class="space-y-2">
            <NuxtLink v-for="link in [
              { to: '/admin/articles', icon: '📰', label: 'Kelola Artikel' },
              { to: '/admin/articles/create', icon: '➕', label: 'Buat Artikel' },
              { to: '/admin/reviews', icon: '⭐', label: 'Kelola Review' },
              { to: '/forum', icon: '💬', label: 'Forum' },
              { to: '/admin/mal', icon: '🔗', label: 'MAL Connection' },
            ]" :key="link.to" :to="link.to"
              class="flex items-center gap-3 px-4 py-3 rounded-lg transition group"
              style="background: var(--bg-surface);"
            >
              <span>{{ link.icon }}</span>
              <span class="text-sm font-medium group-hover:text-violet-500 transition">{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
