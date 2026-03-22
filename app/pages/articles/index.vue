<script setup lang="ts">
const { data } = await useFetch('/api/articles')
</script>

<template>
  <div class="min-h-screen px-4 py-12" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Artikel &amp; Berita</h1>
      <div class="grid gap-6">
        <article
          v-for="article in data?.articles"
          :key="article.id"
          class="rounded-xl p-6 border transition hover:border-violet-500/50"
          style="background: var(--bg-card); border-color: var(--border-color);"
        >
          <NuxtLink :to="`/articles/${article.slug}`">
            <h2 class="text-xl font-semibold mb-2 hover:text-violet-500 transition">{{ article.title }}</h2>
          </NuxtLink>
          <p class="text-sm" style="color: var(--text-muted);">{{ article.excerpt }}</p>
          <div class="flex items-center gap-2 mt-4 text-xs" style="color: var(--text-faint);">
            <span>{{ article.author?.username }}</span>
            <span>•</span>
            <span>{{ new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID') }}</span>
          </div>
        </article>
      </div>
      <p v-if="!data?.articles?.length" class="text-center mt-12" style="color: var(--text-muted);">Belum ada artikel.</p>
    </div>
  </div>
</template>
