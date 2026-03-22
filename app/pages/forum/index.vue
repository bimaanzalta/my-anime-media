<script setup lang="ts">
const { data } = await useFetch('/api/forum/threads')
</script>

<template>
  <div class="min-h-screen px-4 py-12" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Forum</h1>
      <div class="grid gap-4">
        <div
          v-for="thread in data?.threads"
          :key="thread.id"
          class="rounded-xl p-5 border hover:border-violet-500/50 transition"
          style="background: var(--bg-card); border-color: var(--border-color);"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span v-if="thread.isPinned" class="text-xs bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded">Pin</span>
                <span v-if="thread.isLocked" class="text-xs px-2 py-0.5 rounded" style="background: var(--bg-surface); color: var(--text-muted);">Terkunci</span>
                <span v-if="thread.category" class="text-xs" style="color: var(--text-faint);">{{ thread.category.name }}</span>
              </div>
              <NuxtLink :to="`/forum/${thread.slug}`">
                <h2 class="font-semibold hover:text-violet-500 transition" style="color: var(--text-primary);">{{ thread.title }}</h2>
              </NuxtLink>
              <div class="flex items-center gap-3 mt-2 text-xs" style="color: var(--text-faint);">
                <span>{{ thread.author?.username }}</span>
                <span>{{ thread.replyCount }} balasan</span>
                <span>{{ thread.viewCount }} dilihat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="!data?.threads?.length" class="text-center mt-12" style="color: var(--text-muted);">Belum ada thread.</p>
    </div>
  </div>
</template>
