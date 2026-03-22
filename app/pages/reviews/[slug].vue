<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data } = await useFetch(`/api/reviews/${slug}`)
const review = computed(() => (data.value as any)?.review ?? null)

useSeoMeta({
  title: () => review.value?.title || 'Review',
  description: () => review.value?.excerpt || '',
})

// Comments
const reviewId = computed(() => review.value?.id)
const { data: commentsData, refresh: refreshComments } = await useFetch(
  () => reviewId.value ? `/api/comments/review/${reviewId.value}` : null,
  { watch: [reviewId] }
)
const comments = computed(() => (commentsData.value as any)?.comments || [])

const { isLoggedIn } = useAuth()
const newComment = ref('')
const submittingComment = ref(false)

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

async function postComment() {
  if (!newComment.value.trim()) return
  submittingComment.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        commentableType: 'review',
        commentableId: review.value?.id,
        body: newComment.value,
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
    <div v-if="!review" class="flex items-center justify-center min-h-screen">
      <p style="color: var(--text-muted);">Review tidak ditemukan.</p>
    </div>
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <!-- Back -->
      <NuxtLink to="/reviews" class="hover:text-violet-500 transition text-sm mb-6 inline-block" style="color: var(--text-muted);">
        &#8592; Semua Review
      </NuxtLink>

      <!-- Header Card -->
      <div class="rounded-2xl border p-6 mb-8" style="background: var(--bg-card); border-color: var(--border-color);">
        <div class="flex flex-wrap items-center gap-3 mb-3">
          <span v-if="review.spoilerFlag" class="text-xs bg-orange-500/15 text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded-full">
            &#9888; Mengandung Spoiler
          </span>
          <span
            :class="review.status === 'published' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-gray-500/15 text-gray-500'"
            class="text-xs px-2 py-0.5 rounded-full"
          >{{ review.status }}</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold mb-4" style="color: var(--text-primary);">{{ review.title }}</h1>

        <!-- Rating -->
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl text-yellow-500 tracking-wider">{{ stars(review.rating) }}</span>
          <span class="text-lg font-semibold text-yellow-500">{{ review.rating }}/5</span>
          <span class="text-sm" style="color: var(--text-muted);">&middot; {{ review.helpfulCount }} helpful</span>
        </div>

        <!-- Author & Date -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
            {{ review.author?.username?.[0]?.toUpperCase() }}
          </div>
          <div>
            <span class="text-sm font-medium" style="color: var(--text-primary);">{{ review.author?.username }}</span>
            <span class="text-xs ml-2" style="color: var(--text-muted);">{{ new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
          </div>
        </div>
      </div>

      <!-- Anime Cards -->
      <div v-if="review.anime?.length" class="mb-8">
        <h2 class="text-lg font-semibold mb-3" style="color: var(--text-primary);">Anime</h2>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            v-for="animeItem in review.anime"
            :key="animeItem.id"
            :to="`/anime/${animeItem.id}`"
            class="flex items-center gap-3 border rounded-xl px-4 py-2 hover:border-violet-500/50 transition"
            style="background: var(--bg-card); border-color: var(--border-color);"
          >
            <img v-if="animeItem.mainPicture?.medium" :src="animeItem.mainPicture.medium" class="w-8 h-12 object-cover rounded" />
            <div>
              <p class="text-sm font-medium" style="color: var(--text-primary);">{{ animeItem.title }}</p>
              <p v-if="animeItem.mean" class="text-xs text-yellow-500">&#9733; {{ animeItem.mean }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Excerpt -->
      <div v-if="review.excerpt" class="border-l-4 border-violet-500 rounded-r-xl px-6 py-4 mb-8" style="background: var(--bg-card);">
        <p class="italic" style="color: var(--text-secondary);">{{ review.excerpt }}</p>
      </div>

      <!-- Body -->
      <div class="prose-anime max-w-none mb-10" v-html="review.body"></div>

      <!-- Comments -->
      <div class="border-t pt-8" style="border-color: var(--border-subtle);">
        <h2 class="text-xl font-semibold mb-6" style="color: var(--text-primary);">Komentar ({{ comments.length }})</h2>

        <div v-if="isLoggedIn" class="mb-8">
          <textarea
            v-model="newComment"
            rows="3"
            placeholder="Tulis komentar..."
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full resize-none mb-3 text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"
          ></textarea>
          <button
            @click="postComment"
            :disabled="submittingComment || !newComment.trim()"
            class="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition"
          >
            {{ submittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
          </button>
        </div>
        <div v-else class="mb-8 text-sm" style="color: var(--text-muted);">
          <NuxtLink to="/auth/login" class="text-violet-500 hover:text-violet-400">Login</NuxtLink> untuk berkomentar.
        </div>

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
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium" style="color: var(--text-primary);">{{ comment.author?.username }}</span>
                  <span class="text-xs" style="color: var(--text-faint);">{{ new Date(comment.createdAt).toLocaleDateString('id-ID') }}</span>
                </div>
                <p class="text-sm" style="color: var(--text-secondary);">{{ comment.body }}</p>

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
          <p v-if="!comments.length" class="text-sm" style="color: var(--text-muted);">Belum ada komentar.</p>
        </div>
      </div>
    </div>
  </div>
</template>
