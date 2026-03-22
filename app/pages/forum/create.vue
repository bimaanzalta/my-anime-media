<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const router = useRouter()

const { data: categoriesData } = await useFetch('/api/forum/categories')
const categories = computed(() => (categoriesData.value as any)?.categories || [])

const form = reactive({
  title: '',
  forumCategoryId: '',
  body: '',
  animeIds: [] as number[],
})

const saving = ref(false)
const error = ref('')

async function save() {
  if (!form.title.trim()) {
    error.value = 'Judul wajib diisi.'
    return
  }
  if (!form.forumCategoryId) {
    error.value = 'Pilih kategori forum.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const result = await $fetch('/api/forum/threads', {
      method: 'POST',
      body: {
        title: form.title,
        forumCategoryId: Number(form.forumCategoryId),
        body: form.body,
        animeIds: form.animeIds,
      },
    }) as any
    router.push(`/forum/${result.thread.slug}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Gagal membuat thread.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/forum" class="hover:text-violet-500 transition text-sm" style="color: var(--text-muted);">
          &#8592; Forum
        </NuxtLink>
        <h1 class="text-2xl font-bold">Buat Thread Baru</h1>
      </div>

      <div v-if="error" class="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-500 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="save" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Judul Thread *</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Judul thread diskusi"
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Kategori Forum *</label>
          <select
            v-model="form.forumCategoryId"
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"
          >
            <option value="">Pilih kategori...</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- Body -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Konten Diskusi</label>
          <TipTapEditor v-model="form.body" placeholder="Mulai diskusi di sini..." />
        </div>

        <!-- Anime Search -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Anime Terkait (Opsional)</label>
          <AnimeSearchInput v-model="form.animeIds" />
        </div>

        <!-- Submit -->
        <div class="flex justify-end pt-4 border-t" style="border-color: var(--border-subtle);">
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition"
          >
            {{ saving ? 'Membuat...' : 'Buat Thread' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
