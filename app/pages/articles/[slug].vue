<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data } = await useFetch(`/api/articles/${slug}`)
const article = computed(() => (data.value as any)?.article ?? null)

useSeoMeta({
  title: () => article.value?.title || 'Artikel',
  description: () => article.value?.excerpt || '',
  ogImage: () => article.value?.coverImage || '',
})

// Comments — only fetch when article is loaded
const articleId = computed(() => article.value?.id)

const { data: commentsData, refresh: refreshComments } = await useFetch(
  () => articleId.value ? `/api/comments/article/${articleId.value}` : null,
  { watch: [articleId] }
)
const comments = computed(() => (commentsData.value as any)?.comments || [])

const { user, isLoggedIn } = useAuth()
const newComment = ref('')
const submittingComment = ref(false)

async function postComment(parentId?: number) {
  if (!newComment.value.trim()) return
  submittingComment.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        commentableType: 'article',
        commentableId: article.value?.id,
        body: newComment.value,
        parentId: parentId || null,
      },
    })
    newComment.value = ''
    await refreshComments()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal mengirim komentar')
  } finally {
    submittingComment.value = false
  }
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div v-if="!article" class="flex items-center justify-center min-h-screen">
      <p style="color: var(--text-muted);">Artikel tidak ditemukan.</p>
    </div>
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <!-- Back -->
      <NuxtLink to="/articles" class="hover:text-violet-500 transition text-sm mb-6 inline-block" style="color: var(--text-muted);">
        &#8592; Semua Artikel
      </NuxtLink>

      <!-- Cover -->
      <div v-if="article.coverImage" class="mb-8">
        <img :src="article.coverImage" :alt="article.title" class="w-full h-72 object-cover rounded-2xl" />
      </div>

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <span v-if="article.status === 'published'" class="bg-green-500/15 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">Published</span>
        <span v-if="article.category?.name" class="text-xs text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full">{{ article.category?.name }}</span>
      </div>

      <!-- Title -->
      <h1 class="text-3xl sm:text-4xl font-bold mb-4 leading-tight" style="color: var(--text-primary);">{{ article.title }}</h1>

      <!-- Author & Date -->
      <div class="flex items-center gap-3 mb-8 pb-6 border-b" style="border-color: var(--border-subtle);">
        <div v-if="article.author?.avatar" class="w-9 h-9 rounded-full overflow-hidden" style="background: var(--bg-surface);">
          <img :src="article.author.avatar" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
          {{ article.author?.username?.[0]?.toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-medium" style="color: var(--text-primary);">{{ article.author?.username }}</p>
          <p class="text-xs" style="color: var(--text-muted);">
            {{ article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </p>
        </div>
      </div>

      <!-- Body -->
      <div class="prose-anime max-w-none mb-10" v-html="article.body"></div>

      <!-- Tags -->
      <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mb-10 pb-8 border-b" style="border-color: var(--border-subtle);">
        <span
          v-for="tag in article.tags"
          :key="tag"
          class="text-xs px-3 py-1 rounded-full border"
          style="background: var(--bg-surface); color: var(--text-secondary); border-color: var(--border-color);"
        >#{{ tag }}</span>
      </div>

      <!-- Related Anime -->
      <div v-if="article.anime?.length" class="mb-10">
        <h2 class="text-xl font-semibold mb-4" style="color: var(--text-primary);">Anime Terkait</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="animeItem in article.anime"
            :key="animeItem.id"
            :to="`/anime/${animeItem.id}`"
            class="rounded-xl border overflow-hidden hover:border-violet-500/50 transition group"
            style="background: var(--bg-card); border-color: var(--border-color);"
          >
            <div class="aspect-[3/4] overflow-hidden" style="background: var(--bg-surface);">
              <img v-if="animeItem.mainPicture?.medium" :src="animeItem.mainPicture.medium" :alt="animeItem.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div class="p-3">
              <p class="text-sm font-medium line-clamp-2" style="color: var(--text-primary);">{{ animeItem.title }}</p>
              <p v-if="animeItem.mean" class="text-xs text-yellow-500 mt-1">&#9733; {{ animeItem.mean }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Comments -->
      <div class="border-t pt-8" style="border-color: var(--border-subtle);">
        <h2 class="text-xl font-semibold mb-6" style="color: var(--text-primary);">Komentar ({{ comments.length }})</h2>

        <!-- Comment Form -->
        <div v-if="isLoggedIn" class="mb-8">
          <textarea
            v-model="newComment"
            rows="3"
            placeholder="Tulis komentar..."
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full resize-none mb-3 text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"
          ></textarea>
          <button
            @click="postComment()"
            :disabled="submittingComment || !newComment.trim()"
            class="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition"
          >
            {{ submittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
          </button>
        </div>
        <div v-else class="mb-8 text-sm" style="color: var(--text-muted);">
          <NuxtLink to="/auth/login" class="text-violet-500 hover:text-violet-400">Login</NuxtLink> untuk berkomentar.
        </div>

        <!-- Comments List -->
        <div class="space-y-4">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="rounded-xl border p-4"
            style="background: var(--bg-card); border-color: var(--border-color);"
          >
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {{ comment.author?.username?.[0]?.toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium" style="color: var(--text-primary);">{{ comment.author?.username }}</span>
                  <span class="text-xs" style="color: var(--text-faint);">{{ new Date(comment.createdAt).toLocaleDateString('id-ID') }}</span>
                </div>
                <p class="text-sm" style="color: var(--text-secondary);">{{ comment.body }}</p>

                <!-- Replies -->
                <div v-if="comment.replies?.length" class="mt-4 space-y-3 pl-4 border-l" style="border-color: var(--border-subtle);">
                  <div v-for="reply in comment.replies" :key="reply.id" class="flex items-start gap-3">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style="background: var(--bg-surface); color: var(--text-secondary);">
                      {{ reply.author?.username?.[0]?.toUpperCase() }}
                    </div>
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-medium" style="color: var(--text-primary);">{{ reply.author?.username }}</span>
                        <span class="text-xs" style="color: var(--text-faint);">{{ new Date(reply.createdAt).toLocaleDateString('id-ID') }}</span>
                      </div>
                      <p class="text-sm" style="color: var(--text-secondary);">{{ reply.body }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-if="!comments.length" class="text-sm" style="color: var(--text-muted);">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      </div>
    </div>
  </div>
</template>
