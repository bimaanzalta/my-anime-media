<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const router = useRouter()

const { data: categoriesData } = await useFetch('/api/article-categories')
const categories = computed(() => (categoriesData.value as any)?.categories || [])

const form = reactive({
  title: '',
  categoryId: '',
  coverImage: '',
  excerpt: '',
  body: '',
  status: 'draft' as 'draft' | 'published',
  tags: [] as string[],
  animeIds: [] as number[],
})

const tagInput = ref('')
const saving = ref(false)
const error = ref('')

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(t => t !== tag)
}

function handleTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}

async function save() {
  if (!form.title.trim()) {
    error.value = 'Judul wajib diisi.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/articles', {
      method: 'POST',
      body: {
        title: form.title,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        coverImage: form.coverImage || null,
        excerpt: form.excerpt || null,
        body: form.body,
        status: form.status,
        tags: form.tags,
        animeIds: form.animeIds,
      },
    })
    router.push('/admin/articles')
  } catch (e: any) {
    error.value = e?.data?.message || 'Gagal menyimpan artikel.'
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
        <NuxtLink to="/admin/articles" class="hover:text-violet-500 transition text-sm" style="color: var(--text-muted);">&#8592; Kembali</NuxtLink>
        <h1 class="text-2xl font-bold">Buat Artikel Baru</h1>
      </div>

      <div v-if="error" class="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-500 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="save" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Judul *</label>
          <input v-model="form.title" type="text" placeholder="Judul artikel"
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);" />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Kategori</label>
          <select v-model="form.categoryId"
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);">
            <option value="">Pilih kategori...</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">URL Cover Image</label>
          <input v-model="form.coverImage" type="text" placeholder="https://example.com/image.jpg"
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);" />
          <div v-if="form.coverImage" class="mt-2">
            <img :src="form.coverImage" class="h-32 rounded-lg object-cover" alt="Preview" @error="($event.target as HTMLImageElement).style.display='none'" />
          </div>
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Excerpt</label>
          <textarea v-model="form.excerpt" rows="3" placeholder="Ringkasan singkat artikel..."
            class="rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 border w-full resize-none text-sm"
            style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);"></textarea>
        </div>

        <!-- Body -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Konten</label>
          <TipTapEditor v-model="form.body" placeholder="Tulis konten artikel di sini..." />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Tags</label>
          <div class="flex gap-2 mb-2">
            <input v-model="tagInput" type="text" @keydown="handleTagKeydown" placeholder="Ketik tag lalu Enter..."
              class="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 border"
              style="background: var(--bg-surface); color: var(--text-primary); border-color: var(--border-color);" />
            <button type="button" @click="addTag"
              class="px-4 py-2 rounded-lg text-sm transition"
              style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);">
              Tambah
            </button>
          </div>
          <div v-if="form.tags.length" class="flex flex-wrap gap-2">
            <span v-for="tag in form.tags" :key="tag"
              class="flex items-center gap-1.5 bg-violet-500/15 text-violet-500 border border-violet-500/30 rounded-full px-3 py-1 text-sm">
              {{ tag }}
              <button type="button" @click="removeTag(tag)" class="hover:text-red-400 transition leading-none">&#10005;</button>
            </span>
          </div>
        </div>

        <!-- Anime Search -->
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Anime Terkait</label>
          <AnimeSearchInput v-model="form.animeIds" />
        </div>

        <!-- Status & Submit -->
        <div class="flex items-center justify-between pt-4 border-t" style="border-color: var(--border-subtle);">
          <div class="flex items-center gap-3">
            <span class="text-sm" style="color: var(--text-muted);">Status:</span>
            <button type="button"
              @click="form.status = form.status === 'draft' ? 'published' : 'draft'"
              :class="form.status === 'published' ? 'bg-green-600 hover:bg-green-500 text-white' : 'hover:bg-opacity-80 text-white'"
              :style="form.status !== 'published' ? 'background: var(--bg-surface); color: var(--text-secondary);' : ''"
              class="px-4 py-2 rounded-lg text-sm font-medium transition">
              {{ form.status === 'published' ? 'Published' : 'Draft' }}
            </button>
          </div>
          <button type="submit" :disabled="saving"
            class="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition">
            {{ saving ? 'Menyimpan...' : 'Simpan Artikel' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
