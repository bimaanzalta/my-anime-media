<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data, refresh } = await useFetch(`/api/forum/threads/${slug}`)
const thread = computed(() => (data.value as any)?.thread ?? null)
const posts = computed(() => (data.value as any)?.posts || [])

useSeoMeta({
  title: () => thread.value?.title || 'Forum',
})

const { isLoggedIn, user } = useAuth()
const replyBody = ref('')
const submitting = ref(false)
const replyError = ref('')

async function submitReply() {
  if (!replyBody.value.trim()) {
    replyError.value = 'Balasan tidak boleh kosong.'
    return
  }
  if (thread.value?.isLocked) {
    replyError.value = 'Thread ini terkunci.'
    return
  }
  submitting.value = true
  replyError.value = ''
  try {
    await $fetch(`/api/forum/threads/${thread.value?.id}/posts`, {
      method: 'POST',
      body: { body: replyBody.value },
    })
    replyBody.value = ''
    await refresh()
  } catch (e: any) {
    replyError.value = e?.data?.message || 'Gagal mengirim balasan.'
  } finally {
    submitting.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div v-if="!thread" class="flex items-center justify-center min-h-screen">
      <p style="color: var(--text-muted);">Thread tidak ditemukan.</p>
    </div>
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <!-- Back -->
      <NuxtLink to="/forum" class="hover:text-violet-500 transition text-sm mb-6 inline-block" style="color: var(--text-muted);">
        &#8592; Forum
      </NuxtLink>

      <!-- Thread Header -->
      <div class="rounded-2xl border p-6 mb-6" style="background: var(--bg-card); border-color: var(--border-color);">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span v-if="thread.category?.name" class="text-xs bg-violet-500/10 text-violet-500 border border-violet-500/30 px-2 py-0.5 rounded-full">{{ thread.category.name }}</span>
          <span v-if="thread.isPinned" class="text-xs bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full">&#128204; Pinned</span>
          <span v-if="thread.isLocked" class="text-xs bg-red-500/15 text-red-500 px-2 py-0.5 rounded-full">&#128274; Locked</span>
        </div>

        <h1 class="text-2xl font-bold mb-4" style="color: var(--text-primary);">{{ thread.title }}</h1>

        <div class="flex flex-wrap items-center gap-4 text-sm" style="color: var(--text-muted);">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {{ thread.author?.username?.[0]?.toUpperCase() }}
            </div>
            <span style="color: var(--text-primary);">{{ thread.author?.username }}</span>
          </div>
          <span>{{ formatDate(thread.createdAt) }}</span>
          <span>&#128065; {{ thread.viewCount }} views</span>
          <span>&#128172; {{ thread.replyCount }} replies</span>
        </div>
      </div>

      <!-- Posts -->
      <div class="space-y-4 mb-8">
        <div
          v-for="(post, index) in posts"
          :key="post.id"
          class="rounded-xl border p-5"
          :class="post.isFirstPost ? 'border-violet-500/40' : ''"
          :style="!post.isFirstPost ? 'background: var(--bg-card); border-color: var(--border-color);' : 'background: var(--bg-card);'"
        >
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <div class="flex-shrink-0 text-center">
              <div class="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white mb-1">
                {{ post.author?.username?.[0]?.toUpperCase() }}
              </div>
              <p class="text-xs w-16 truncate" style="color: var(--text-muted);">{{ post.author?.username }}</p>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs" style="color: var(--text-faint);">{{ formatDate(post.createdAt) }}</span>
                <div class="flex items-center gap-2">
                  <span v-if="post.isFirstPost" class="text-xs bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full">OP</span>
                  <span class="text-xs" style="color: var(--text-faint);">#{{ (index as number) + 1 }}</span>
                </div>
              </div>
              <div class="prose-anime prose-sm max-w-none" v-html="post.body"></div>
              <div v-if="post.upvoteCount > 0" class="mt-3 text-xs" style="color: var(--text-faint);">
                &#9650; {{ post.upvoteCount }} upvotes
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reply Form -->
      <div class="rounded-xl border p-6" style="background: var(--bg-card); border-color: var(--border-color);">
        <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">
          {{ thread.isLocked ? 'Thread Terkunci' : 'Tulis Balasan' }}
        </h2>

        <div v-if="isLoggedIn && !thread.isLocked">
          <div v-if="replyError" class="mb-3 px-4 py-2 bg-red-500/15 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {{ replyError }}
          </div>
          <TipTapEditor v-model="replyBody" placeholder="Tulis balasan..." />
          <div class="flex justify-end mt-4">
            <button
              @click="submitReply"
              :disabled="submitting || !replyBody.trim()"
              class="px-6 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition"
            >
              {{ submitting ? 'Mengirim...' : 'Kirim Balasan' }}
            </button>
          </div>
        </div>

        <div v-else-if="!isLoggedIn" class="text-sm" style="color: var(--text-muted);">
          <NuxtLink to="/auth/login" class="text-violet-500 hover:text-violet-400">Login</NuxtLink> untuk membalas thread ini.
        </div>

        <div v-else class="text-sm" style="color: var(--text-muted);">
          Thread ini telah dikunci dan tidak menerima balasan baru.
        </div>
      </div>
    </div>
  </div>
</template>
