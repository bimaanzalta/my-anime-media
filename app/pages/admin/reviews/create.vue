<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const router = useRouter()

const form = reactive({
  title: '',
  excerpt: '',
  body: '',
  rating: 0,
  spoilerFlag: false,
  status: 'draft' as 'draft' | 'published',
  animeIds: [] as number[],
})

const saving = ref(false)
const error = ref('')

function setRating(star: number) {
  form.rating = star
}

async function save() {
  if (!form.title.trim()) {
    error.value = 'Judul wajib diisi.'
    return
  }
  if (!form.rating) {
    error.value = 'Rating wajib dipilih.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: {
        title: form.title,
        excerpt: form.excerpt || null,
        body: form.body,
        rating: form.rating,
        spoilerFlag: form.spoilerFlag,
        status: form.status,
        animeIds: form.animeIds,
      },
    })
    router.push('/admin/reviews')
  } catch (e: any) {
    error.value = e?.data?.message || 'Gagal menyimpan review.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/admin/reviews" class="hover:text-violet-500 transition text-sm" style="color: var(--text-muted);">&#8592; Kembali</NuxtLink>
        <h1 class="text-2xl font-bold">Buat Review Baru</h1>
      </div>

      <div v-if="error" class="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-500 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="save" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Judul *</label>
          <input v-model="form.title" type="text" placeholder="Judul review"
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);" />
        </div>

        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Rating *</label>
          <div class="flex items-center gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="setRating(star)"
              class="text-3xl transition focus:outline-none"
              :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'"
            >&#9733;</button>
            <span class="ml-3 text-sm" style="color: var(--text-muted);">{{ form.rating ? `${form.rating}/5` : 'Pilih rating' }}</span>
          </div>
        </div>

        <!-- Spoiler Flag -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="form.spoilerFlag = !form.spoilerFlag"
            :class="form.spoilerFlag ? 'bg-orange-600 border-orange-500' : ''"
            :style="!form.spoilerFlag ? 'background: var(--bg-surface); border-color: var(--border-color);' : ''"
            class="w-12 h-6 rounded-full border-2 relative transition flex-shrink-0"
          >
            <span :class="form.spoilerFlag ? 'translate-x-6' : 'translate-x-1'" class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform"></span>
          </button>
          <label class="text-sm cursor-pointer" style="color: var(--text-secondary);" @click="form.spoilerFlag = !form.spoilerFlag">
            Mengandung Spoiler
          </label>
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Excerpt</label>
          <textarea v-model="form.excerpt" rows="3" placeholder="Ringkasan singkat review..."
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full resize-none text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"></textarea>
        </div>

        <!-- Body -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Konten Review</label>
          <TipTapEditor v-model="form.body" placeholder="Tulis review lengkap di sini..." />
        </div>

        <!-- Anime Search -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Anime yang Direview</label>
          <AnimeSearchInput v-model="form.animeIds" />
        </div>

        <!-- Status & Submit -->
        <div class="flex items-center justify-between pt-4 border-t" style="border-color: var(--border-subtle);">
          <div class="flex items-center gap-3">
            <span class="text-sm" style="color: var(--text-muted);">Status:</span>
            <button type="button"
              @click="form.status = form.status === 'draft' ? 'published' : 'draft'"
              :class="form.status === 'published' ? 'bg-green-600 hover:bg-green-500 text-white' : ''"
              :style="form.status !== 'published' ? 'background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-color);' : ''"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">
              {{ form.status === 'published' ? 'Published' : 'Draft' }}
            </button>
          </div>
          <button type="submit" :disabled="saving"
            class="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition">
            {{ saving ? 'Menyimpan...' : 'Simpan Review' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
