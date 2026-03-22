<script setup lang="ts">
// ── Local v-reveal directive (SSR-safe) ───────────────────────────────────
const vReveal = {
  getSSRProps: () => ({ class: 'reveal' }),
  mounted(el: HTMLElement, binding: any) {
    const val = binding.value
    const delay = typeof val === 'object' ? (val.delay ?? 0) : (val ?? 0)
    const threshold = typeof val === 'object' ? (val.threshold ?? 0.1) : 0.1
    el.style.transitionDelay = `${delay}ms`
    el.classList.add('reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
  },
}

// ── Data fetching ──────────────────────────────────────────────────────────
const { data: articlesData } = await useFetch('/api/articles', { query: { limit: 4 } })
const { data: reviewsData } = await useFetch('/api/reviews', { query: { limit: 3 } })
const { data: forumData } = await useFetch('/api/forum/threads', { query: { limit: 4 } })
const { data: animeData } = await useFetch('/api/anime/popular', { query: { limit: 5 } })

const articles = computed(() => (articlesData.value as any)?.articles ?? [])
const reviews = computed(() => (reviewsData.value as any)?.reviews ?? [])
const threads = computed(() => (forumData.value as any)?.threads ?? [])

// ── Anime terpopuler dari DB ───────────────────────────────────────────────
const trendingAnime = computed(() =>
  ((animeData.value as any)?.anime ?? []).map((a: any, i: number) => ({
    id: a.id,
    title: a.title,
    poster: (() => { try { const p = typeof a.mainPicture === 'string' ? JSON.parse(a.mainPicture) : a.mainPicture; return p?.large || p?.medium || '' } catch { return '' } })(),
    genres: (() => { try { const g = typeof a.genres === 'string' ? JSON.parse(a.genres) : (a.genres ?? []); return Array.isArray(g) ? g.map((x: any) => x.name || x).slice(0, 2) : [] } catch { return [] } })(),
    score: Number(a.mean) || 0,
    rank: a.rank || i + 1,
  }))
)

const seasonalAnime = [
  {
    id: 1,
    title: 'Frieren: Beyond Journey\'s End',
    poster: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    genres: ['Adventure', 'Fantasy'],
    score: 9.38,
  },
  {
    id: 3,
    title: 'Jujutsu Kaisen',
    poster: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    genres: ['Action', 'Supernatural'],
    score: 8.62,
  },
  {
    id: 4,
    title: 'Dungeon Meshi',
    poster: 'https://cdn.myanimelist.net/images/anime/1166/138511.jpg',
    genres: ['Comedy', 'Fantasy'],
    score: 8.71,
  },
]

// ── Genre marquee ─────────────────────────────────────────────────────────
const genres = [
  'Action', 'Adventure', 'Fantasy', 'Romance', 'Thriller', 'Sci-Fi',
  'Horror', 'Comedy', 'Slice of Life', 'Mecha', 'Isekai', 'Shounen',
  'Seinen', 'Sports', 'Mystery', 'Psychological', 'Drama', 'Ecchi',
  'School', 'Supernatural',
]

// ── Placeholder articles ──────────────────────────────────────────────────
const placeholderArticles = [
  {
    id: 'p1',
    title: 'Frieren: Mengapa Anime Ini Meraih Rating Tertinggi Sepanjang Masa',
    excerpt: 'Sebuah perjalanan mendalam tentang makna kehilangan, kenangan, dan hubungan antar manusia yang dibalut dalam narasi petualangan yang memukau.',
    category: 'Editorial',
    cover: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    author: 'AniVerse Editorial',
    date: '20 Mar 2026',
  },
  {
    id: 'p2',
    title: 'Musim Semi 2026: 10 Anime yang Wajib Kamu Tonton',
    excerpt: 'Dari isekai baru hingga sekuel yang ditunggu-tunggu, musim semi 2026 menawarkan lineup yang luar biasa.',
    category: 'Berita',
    cover: 'https://cdn.myanimelist.net/images/anime/1166/138511.jpg',
    author: 'AniVerse Team',
    date: '18 Mar 2026',
  },
  {
    id: 'p3',
    title: 'Chainsaw Man Season 2: Konfirmasi dan Apa yang Kita Ketahui',
    excerpt: 'MAPPA akhirnya mengkonfirmasi kelanjutan dari salah satu anime paling fenomenal beberapa tahun terakhir.',
    category: 'Berita',
    cover: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    author: 'Redaksi',
    date: '15 Mar 2026',
  },
  {
    id: 'p4',
    title: 'Mengapa Dungeon Meshi Layak Jadi Anime Terbaik 2024',
    excerpt: 'Studio Trigger berhasil mengadaptasi manga kuliner-fantasi karya Ryoko Kui dengan sempurna.',
    category: 'Opini',
    cover: 'https://cdn.myanimelist.net/images/anime/1166/138511.jpg',
    author: 'AniVerse Editorial',
    date: '12 Mar 2026',
  },
]

const placeholderReviews = [
  {
    id: 'r1',
    title: 'Frieren: Beyond Journey\'s End',
    excerpt: 'Sebuah mahakarya yang mendefinisikan ulang genre fantasi. Narasinya lambat tapi penuh makna, membuatmu merefleksikan arti dari sebuah perjalanan.',
    rating: 10,
    anime: 'Frieren',
    author: 'Satoshi K.',
    genres: ['Fantasy', 'Drama'],
  },
  {
    id: 'r2',
    title: 'Chainsaw Man: Gore yang Artistik',
    excerpt: 'MAPPA mengubah manga brutal menjadi karya sinematik yang menakjubkan. Animasinya luar biasa, soundtracknya legendaris.',
    rating: 9,
    anime: 'Chainsaw Man',
    author: 'Hiromi T.',
    genres: ['Action', 'Horror'],
  },
  {
    id: 'r3',
    title: 'Dungeon Meshi: Memasak di Dungeon Belum Pernah Semenarik Ini',
    excerpt: 'Perpaduan sempurna antara komedi, petualangan, dan worldbuilding yang kaya. Trigger benar-benar paham esensi dari manga aslinya.',
    rating: 9,
    anime: 'Dungeon Meshi',
    author: 'Aiko M.',
    genres: ['Comedy', 'Fantasy'],
  },
]

const placeholderThreads = [
  { id: 't1', title: 'Frieren Episode Finale — Mari Diskusi [SPOILER]', category: 'Diskusi', replies: 142, author: 'SakuraMoon', time: '2j lalu' },
  { id: 't2', title: 'Rekomendasi anime mirip Jujutsu Kaisen?', category: 'Rekomendasi', replies: 87, author: 'NightOwl99', time: '5j lalu' },
  { id: 't3', title: 'Chainsaw Man Season 2 — Prediksi Arc Selanjutnya', category: 'Spekulasi', replies: 63, author: 'DarkBlade', time: '8j lalu' },
  { id: 't4', title: 'Dungeon Meshi: Resep Makanan Dungeon yang Bisa Dicoba IRL', category: 'Fun', replies: 45, author: 'FoodieOtaku', time: '12j lalu' },
]

// ── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function renderStars(rating: number) {
  const filled = Math.round(rating)
  return Array.from({ length: 5 }, (_, i) => i < filled ? '★' : '☆').join('')
}

function getInitial(name: any) {
  return (String(name ?? 'A')).charAt(0).toUpperCase()
}

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    Diskusi: 'bg-violet-500/20 text-violet-500',
    Rekomendasi: 'bg-blue-500/20 text-blue-500',
    Spekulasi: 'bg-amber-500/20 text-amber-600 dark:text-amber-300',
    Fun: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  }
  return map[cat] ?? 'bg-gray-500/15 text-gray-500'
}

// Use fetched data when available, fall back to placeholders
const displayArticles = computed(() => articles.value.length ? articles.value : placeholderArticles)
const displayReviews = computed(() => reviews.value.length ? reviews.value : placeholderReviews)
const displayThreads = computed(() => threads.value.length ? threads.value : placeholderThreads)
</script>

<template>
  <div class="overflow-x-hidden" style="background: var(--bg-base); color: var(--text-primary);">

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 1 · HERO                                           -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden noise">
      <!-- Ambient orbs -->
      <div class="glow-orb absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%); transform: translate(-50%, -50%);" />
      <div class="glow-orb absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style="background: radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%); transform: translate(50%, 50%); animation-delay: 3s;" />

      <!-- Hero content -->
      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <!-- Eyebrow -->
        <div
          class="hero-line inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full glass text-xs tracking-[0.2em] uppercase text-[#8b5cf6] font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] inline-block"></span>
          Platform Media Anime Indonesia
        </div>

        <!-- Main headline -->
        <h1 class="font-black leading-[0.9] tracking-tighter mb-8">
          <div class="hero-line text-[clamp(4rem,12vw,9rem)] block" style="color: var(--text-primary);">BACA.</div>
          <div class="hero-line text-[clamp(4rem,12vw,9rem)] gradient-text block">REVIEW.</div>
          <div class="hero-line text-[clamp(4rem,12vw,9rem)] block"
            style="-webkit-text-stroke: 2px rgba(139,92,246,0.6); color: transparent;">DISKUSI.</div>
        </h1>

        <!-- Subtitle -->
        <p class="hero-line text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10" style="color: var(--text-muted);">
          Platform media anime &amp; manga Indonesia — berita terkini, review mendalam, dan komunitas yang aktif.
        </p>

        <!-- CTAs -->
        <div class="hero-line flex flex-wrap gap-4 justify-center mb-16">
          <NuxtLink to="/anime"
            class="group px-8 py-3.5 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_32px_rgba(124,58,237,0.5)] flex items-center gap-2">
            Jelajahi Anime
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/articles"
            class="px-8 py-3.5 border hover:bg-[#7c3aed]/5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300" style="border-color: var(--border-color); color: var(--text-primary);">
            Baca Artikel
          </NuxtLink>
        </div>

        <!-- Genre marquee -->
        <div class="overflow-hidden w-full max-w-2xl mx-auto">
          <div class="marquee-track flex gap-3 w-max">
            <span v-for="(g, i) in [...genres, ...genres]" :key="`${g}-${i}`"
              class="px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap hover:border-[#7c3aed]/50 hover:text-[#8b5cf6] transition cursor-default" style="border-color: var(--border-color); color: var(--text-muted);">
              {{ g }}
            </span>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-widest uppercase" style="color: var(--text-muted);">
        <span>Scroll</span>
        <svg class="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 2 · TRENDING ANIME                                 -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-24" style="background: var(--bg-surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Section header -->
        <div v-reveal class="flex items-center gap-4 mb-4">
          <span class="text-[#7c3aed] text-xs font-bold tracking-[0.25em] uppercase">Trending</span>
          <div class="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/50 to-transparent max-w-[80px]"></div>
        </div>
        <h2 v-reveal="80" class="text-4xl md:text-5xl font-black tracking-tight mb-12" style="color: var(--text-primary);">
          Anime Terpopuler
        </h2>

        <!-- Grid -->
        <div v-reveal="{ threshold: 0.5 }" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          <NuxtLink v-for="anime in trendingAnime.slice(0, 5)" :key="anime.id" :to="`/anime/${anime.id}`"
            class="anime-card rounded-2xl overflow-hidden cursor-pointer block border" style="background: var(--bg-card); border-color: var(--border-subtle);">
            <!-- Poster -->
            <div class="relative overflow-hidden" style="aspect-ratio: 2/3;">
              <img :src="anime.poster" :alt="anime.title" class="w-full h-full object-cover" loading="lazy" />
              <!-- Rank badge -->
              <div
                class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-xs font-black text-white shadow-lg">
                {{ anime.rank }}
              </div>
              <!-- Score badge -->
              <div
                class="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-xs font-bold text-amber-400 flex items-center gap-1">
                <span>★</span>{{ anime.score }}
              </div>
              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
            <!-- Info -->
            <div class="p-4">
              <h3 class="text-sm font-bold leading-tight mb-2 line-clamp-2" style="color: var(--text-primary);">{{ anime.title }}</h3>
              <div class="flex flex-wrap gap-1">
                <span v-for="genre in anime.genres.slice(0, 2)" :key="genre"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#8b5cf6] border border-[#7c3aed]/20">{{
                    genre }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-reveal="160" class="mt-6 text-right">
          <NuxtLink to="/anime"
            class="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition inline-flex items-center gap-1.5 font-medium">
            Lihat semua anime
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 3 · LATEST ARTICLES — Editorial Grid               -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-24" style="background: var(--bg-base);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div v-reveal class="flex items-center gap-4 mb-4">
          <span class="text-[#7c3aed] text-xs font-bold tracking-[0.25em] uppercase">Editorial</span>
          <div class="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/50 to-transparent max-w-[80px]"></div>
        </div>
        <div class="flex items-end justify-between mb-12">
          <h2 v-reveal="80" class="text-4xl md:text-5xl font-black tracking-tight" style="color: var(--text-primary);">
            Artikel &amp; Berita Terkini
          </h2>
          <NuxtLink v-reveal="120" to="/articles"
            class="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition hidden md:inline-flex items-center gap-1.5 font-medium flex-shrink-0">
            Lihat semua artikel
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Editorial grid -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">

          <!-- Featured article (left, 3/5) -->
          <NuxtLink :to="displayArticles[0]?.slug ? `/articles/${displayArticles[0].slug}` : '/articles'" v-reveal
            class="md:col-span-3 group rounded-2xl overflow-hidden border hover:border-[#7c3aed]/30 transition-all duration-500 block" style="background: var(--bg-card); border-color: var(--border-subtle);">
            <div class="relative overflow-hidden" style="aspect-ratio: 16/9;">
              <img
                :src="displayArticles[0]?.cover || displayArticles[0]?.cover_url || 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg'"
                :alt="displayArticles[0]?.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <span
                class="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#7c3aed] text-xs font-bold text-white tracking-wide uppercase">
                {{ displayArticles[0]?.category || 'Editorial' }}
              </span>
            </div>
            <div class="p-6">
              <h3 class="text-2xl font-black leading-tight mb-3 group-hover:text-[#c4b5fd] transition-colors" style="color: var(--text-primary);">
                {{ displayArticles[0]?.title }}
              </h3>
              <p class="text-sm leading-relaxed line-clamp-2 mb-4" style="color: var(--text-muted);">
                {{ displayArticles[0]?.excerpt }}
              </p>
              <div class="flex items-center gap-2 text-xs" style="color: var(--text-muted);">
                <div class="w-6 h-6 rounded-full bg-[#7c3aed]/30 flex items-center justify-center text-[#8b5cf6] font-bold text-[10px]">
                  {{ getInitial(displayArticles[0]?.author?.username) }}
                </div>
                <span>{{ displayArticles[0]?.author?.username }}</span>
                <span style="color: var(--text-faint);">·</span>
                <span>{{ displayArticles[0]?.date || formatDate(displayArticles[0]?.created_at) }}</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Smaller articles (right, 2/5) -->
          <div class="md:col-span-2 flex flex-col gap-5">
            <NuxtLink v-for="(article, i) in displayArticles.slice(1, 3)" :key="article.id"
              :to="article.slug ? `/articles/${article.slug}` : '/articles'" v-reveal="((i as number) + 1) * 80"
              class="group article-card flex gap-4 p-4 rounded-xl border" style="background: var(--bg-card); border-color: var(--border-subtle);">
              <div class="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                <img
                  :src="article.cover || article.cover_url || 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg'"
                  :alt="article.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy" />
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-[10px] font-bold text-[#7c3aed] tracking-widest uppercase block mb-1">
                  {{ article.category || 'Berita' }}
                </span>
                <h3 class="text-sm font-bold leading-snug mb-1 line-clamp-2 group-hover:text-[#c4b5fd] transition-colors" style="color: var(--text-primary);">
                  {{ article.title }}
                </h3>
                <p class="text-[11px]" style="color: var(--text-muted);">{{ article.author?.username || article.author }} · {{ article.date || formatDate(article.created_at) }}</p>
              </div>
            </NuxtLink>

            <!-- 4th article as simple list item -->
            <NuxtLink v-if="displayArticles[3]" :to="displayArticles[3].slug ? `/articles/${displayArticles[3].slug}` : '/articles'" v-reveal="240"
              class="group flex items-center gap-3 px-4 py-3 rounded-xl border hover:border-[#7c3aed]/30 transition-all duration-300" style="background: var(--bg-card); border-color: var(--border-subtle);">
              <div class="w-1 h-8 rounded-full bg-[#7c3aed] flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold line-clamp-1 group-hover:text-[#c4b5fd] transition-colors" style="color: var(--text-primary);">
                  {{ displayArticles[3].title }}
                </p>
                <p class="text-[11px] mt-0.5" style="color: var(--text-muted);">{{ displayArticles[3].category || 'Opini' }}</p>
              </div>
              <svg class="w-3.5 h-3.5 text-[#6b6b80] group-hover:text-[#8b5cf6] transition flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>

        <div v-reveal class="mt-6 md:hidden">
          <NuxtLink to="/articles"
            class="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition inline-flex items-center gap-1.5 font-medium">
            Lihat semua artikel →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 4 · REVIEW SHOWCASE                                -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-24" style="background: var(--bg-surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div v-reveal class="flex items-center gap-4 mb-4">
          <span class="text-[#7c3aed] text-xs font-bold tracking-[0.25em] uppercase">Review</span>
          <div class="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/50 to-transparent max-w-[80px]"></div>
        </div>
        <div class="flex items-end justify-between mb-12">
          <h2 v-reveal="80" class="text-4xl md:text-5xl font-black tracking-tight" style="color: var(--text-primary);">
            Ulasan dari Komunitas
          </h2>
          <NuxtLink v-reveal="120" to="/reviews"
            class="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition hidden md:inline-flex items-center gap-1.5 font-medium flex-shrink-0">
            Lihat semua review
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Review cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          <NuxtLink v-for="review in displayReviews" :key="review.id"
            :to="review.slug ? `/reviews/${review.slug}` : '/reviews'" v-reveal
            class="group relative block p-6 rounded-2xl border hover:border-[#7c3aed]/40 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(124,58,237,0.12)] cursor-pointer overflow-hidden" style="background: var(--bg-card); border-color: var(--border-subtle);">
            <!-- Gradient border glow on hover -->
            <div
              class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style="background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.04)); border: 1px solid rgba(139,92,246,0.2);">
            </div>

            <!-- Stars -->
            <div class="text-amber-400 text-lg mb-3 tracking-widest">
              {{ renderStars(review.rating || review.score || 5) }}
            </div>

            <!-- Rating number -->
            <div class="absolute top-5 right-5 text-xs font-black text-[#7c3aed]">
              {{ Math.round(((review.rating || review.score || 5) / 10) * 5) }}/5
            </div>

            <h3 class="text-base font-black mb-2 group-hover:text-[#c4b5fd] transition-colors line-clamp-2 leading-snug" style="color: var(--text-primary);">
              {{ review.title }}
            </h3>
            <p class="text-sm leading-relaxed line-clamp-2 mb-4" style="color: var(--text-muted);">
              {{ review.excerpt }}
            </p>

            <!-- Anime tags -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              <span v-for="genre in (review.genres ?? [review.anime]).filter(Boolean).slice(0, 2)" :key="genre"
                class="text-[10px] px-2 py-0.5 rounded-full bg-[#7c3aed]/15 text-[#8b5cf6] border border-[#7c3aed]/20">{{
                  genre }}</span>
            </div>

            <!-- Author -->
            <div class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">
                {{ getInitial(review.author?.username || review.author_name || 'A') }}
              </div>
              <span class="text-xs" style="color: var(--text-muted);">{{ review.author?.username || review.author_name }}</span>
            </div>
          </NuxtLink>
        </div>

        <div v-reveal class="mt-8 md:hidden">
          <NuxtLink to="/reviews"
            class="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition inline-flex items-center gap-1.5 font-medium">
            Lihat semua review →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 5 · FORUM ACTIVITY                                 -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-24 border-y" style="background: var(--bg-base); border-color: var(--border-subtle);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          <!-- Left: Heading -->
          <div>
            <div v-reveal class="flex items-center gap-4 mb-4">
              <span class="text-[#7c3aed] text-xs font-bold tracking-[0.25em] uppercase">Forum</span>
              <div class="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/50 to-transparent max-w-[80px]"></div>
            </div>
            <h2 v-reveal="80" class="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.05]" style="color: var(--text-primary);">
              Diskusi<br /><span class="gradient-text-warm">Aktif</span>
            </h2>
            <p v-reveal="120" class="leading-relaxed mb-10 max-w-sm" style="color: var(--text-muted);">
              Bergabung dalam percakapan seru tentang anime favorit kamu — dari teori, rekomendasi, hingga hot takes
              terbaru.
            </p>
            <NuxtLink v-reveal="160" to="/forum"
              class="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#7c3aed]/40 text-[#8b5cf6] hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed] transition-all duration-300 font-semibold text-sm">
              Ke Forum
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>

          <!-- Right: Thread list -->
          <div class="flex flex-col gap-3 stagger">
            <NuxtLink v-for="thread in displayThreads" :key="thread.id"
              :to="thread.slug ? `/forum/${thread.slug}` : '/forum'" v-reveal
              class="group flex items-start gap-4 p-4 rounded-xl border hover:border-[#7c3aed]/30 transition-all duration-300 cursor-pointer" style="background: var(--bg-surface); border-color: var(--border-subtle);">
              <!-- Active dot -->
              <div class="flex-shrink-0 mt-1">
                <span class="relative flex h-2 w-2">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1.5">
                  <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', categoryColor(thread.category)]">
                    {{ thread.category.name || 'Diskusi' }}
                  </span>
                </div>
                <p class="text-sm font-semibold line-clamp-1 group-hover:text-[#c4b5fd] transition-colors mb-1" style="color: var(--text-primary);">
                  {{ thread.title }}
                </p>
                <div class="flex items-center gap-3 text-[11px]" style="color: var(--text-muted);">
                  <span>{{ thread.author?.username || thread.author_name }}</span>
                  <span style="color: var(--text-faint);">·</span>
                  <span>{{ thread.time || formatDate(thread.created_at) }}</span>
                </div>
              </div>

              <div class="flex-shrink-0 text-right">
                <div class="text-sm font-black" style="color: var(--text-primary);">{{ thread.replies || thread.reply_count || 0 }}</div>
                <div class="text-[10px]" style="color: var(--text-muted);">balasan</div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 6 · STATS COUNTER                                  -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-20 relative overflow-hidden" style="background: var(--bg-surface);">
      <!-- Accent orb -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-[600px] h-[300px] rounded-full"
          style="background: radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%);"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 stagger">
          <div v-for="stat in [
            { number: '50+', label: 'Artikel', sublabel: 'dipublikasikan' },
            { number: '120+', label: 'Review', sublabel: 'ditulis komunitas' },
            { number: '300+', label: 'Thread', sublabel: 'diskusi aktif' },
            { number: '1.2K', label: 'Member', sublabel: 'bergabung' },
          ]" :key="stat.label" v-reveal class="text-center group">
            <div
              class="stat-number text-5xl md:text-6xl font-black gradient-text mb-2 group-hover:scale-105 transition-transform duration-300">
              {{ stat.number }}
            </div>
            <div class="font-bold text-sm tracking-wide uppercase" style="color: var(--text-primary);">{{ stat.label }}</div>
            <div class="text-xs mt-0.5" style="color: var(--text-muted);">{{ stat.sublabel }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 7 · SEASONAL PICKS                                 -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-24" style="background: var(--bg-surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div v-reveal class="flex items-center gap-4 mb-4">
          <span class="text-[#7c3aed] text-xs font-bold tracking-[0.25em] uppercase">Seasonal</span>
          <div class="h-px flex-1 bg-gradient-to-r from-[#7c3aed]/50 to-transparent max-w-[80px]"></div>
        </div>
        <h2 v-reveal="80" class="text-4xl md:text-5xl font-black tracking-tight mb-12" style="color: var(--text-primary);">
          Pilihan Musim Ini
        </h2>

        <!-- Editorial cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          <NuxtLink v-for="anime in seasonalAnime" :key="anime.id" :to="`/anime/${anime.id}`" v-reveal
            class="group relative rounded-2xl overflow-hidden cursor-pointer" style="aspect-ratio: 3/4;">
            <!-- Background poster -->
            <img :src="anime.poster" :alt="anime.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy" />
            <!-- Blur + dark overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500 group-hover:via-black/30"></div>

            <!-- Score badge -->
            <div
              class="absolute top-4 right-4 px-2.5 py-1 rounded-full glass text-xs font-black text-amber-400 flex items-center gap-1">
              <span>★</span> {{ anime.score }}
            </div>

            <!-- Bottom info -->
            <div class="absolute bottom-0 left-0 right-0 p-5">
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span v-for="genre in anime.genres" :key="genre"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-[#7c3aed]/30 text-[#c4b5fd] border border-[#7c3aed]/30 backdrop-blur-sm">{{
                    genre }}</span>
              </div>
              <h3 class="text-lg font-black text-[#f0f0f8] leading-tight group-hover:text-[#c4b5fd] transition-colors">
                {{ anime.title }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- SECTION 8 · CTA — Join Community                           -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="py-32 relative overflow-hidden" style="background: var(--bg-base);">
      <!-- Grid pattern background -->
      <div class="absolute inset-0 pointer-events-none"
        style="background-image: linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px); background-size: 60px 60px;">
      </div>

      <!-- Ambient glow -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="glow-orb w-[700px] h-[400px] rounded-full"
          style="background: radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%);"></div>
      </div>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div v-reveal
          class="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full glass text-xs tracking-[0.2em] uppercase text-[#8b5cf6] font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          Komunitas Aktif
        </div>

        <h2 v-reveal="80" class="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6" style="color: var(--text-primary);">
          Bergabunglah dengan komunitas<br />
          <span class="gradient-text">anime Indonesia</span> terbesar
        </h2>

        <p v-reveal="160" class="text-lg mb-12 leading-relaxed max-w-2xl mx-auto" style="color: var(--text-muted);">
          Tulis review, diskusi di forum, dan ikut trending conversation. Gratis selamanya.
        </p>

        <div v-reveal="200" class="flex flex-wrap gap-4 justify-center">
          <NuxtLink to="/auth/register"
            class="group px-10 py-4 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white rounded-full font-bold tracking-wide transition-all duration-300 hover:shadow-[0_0_48px_rgba(124,58,237,0.5)] flex items-center gap-2">
            Daftar Gratis
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
          <NuxtLink to="/about"
            class="px-10 py-4 border hover:bg-[#7c3aed]/5 rounded-full font-bold tracking-wide transition-all duration-300" style="border-color: var(--border-color); color: var(--text-primary);">
            Pelajari lebih lanjut
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>
