<script setup lang="ts">
const { user, fetchUser, logout, isLoggedIn, isAdmin, isModerator } = useAuth()
const { isDark, toggleTheme } = useTheme()
onMounted(() => fetchUser())

const writeMenuOpen = ref(false)
const adminMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

function closeAll() {
  writeMenuOpen.value = false
  adminMenuOpen.value = false
  mobileMenuOpen.value = false
}

// Scroll-aware navbar
const scrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 60
  }, { passive: true })
})
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--bg-base); color: var(--text-primary);" @click="closeAll">
    <nav
      class="sticky top-0 z-50 transition-all duration-500"
      :class="scrolled
        ? 'backdrop-blur-xl border-b shadow-[0_1px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_40px_rgba(0,0,0,0.4)]'
        : 'border-b border-transparent'"
      :style="scrolled ? 'background: color-mix(in srgb, var(--bg-surface) 92%, transparent); border-color: var(--border-color);' : ''"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        <!-- Logo -->
        <NuxtLink to="/" class="font-black text-xl flex-shrink-0 tracking-tight">
          <span class="text-[#8b5cf6]">Ani</span><span style="color: var(--text-primary);">Verse</span>
        </NuxtLink>

        <!-- Desktop Nav links -->
        <div class="hidden md:flex items-center gap-0.5 text-sm" style="color: var(--text-muted);">
          <NuxtLink
            to="/articles"
            class="px-3 py-2 rounded-lg transition-all duration-200"
            style="color: var(--text-muted);"
            active-class="!text-[#8b5cf6] bg-[#7c3aed]/10"
            @mouseenter="$event.target.style.color = 'var(--text-primary)'; $event.target.style.background = 'var(--hover-bg)'"
            @mouseleave="$event.target.style.color = 'var(--text-muted)'; $event.target.style.background = 'transparent'"
          >Artikel</NuxtLink>
          <NuxtLink
            to="/reviews"
            class="px-3 py-2 rounded-lg transition-all duration-200"
            style="color: var(--text-muted);"
            active-class="!text-[#8b5cf6] bg-[#7c3aed]/10"
            @mouseenter="$event.target.style.color = 'var(--text-primary)'; $event.target.style.background = 'var(--hover-bg)'"
            @mouseleave="$event.target.style.color = 'var(--text-muted)'; $event.target.style.background = 'transparent'"
          >Review</NuxtLink>
          <NuxtLink
            to="/anime"
            class="px-3 py-2 rounded-lg transition-all duration-200"
            style="color: var(--text-muted);"
            active-class="!text-[#8b5cf6] bg-[#7c3aed]/10"
            @mouseenter="$event.target.style.color = 'var(--text-primary)'; $event.target.style.background = 'var(--hover-bg)'"
            @mouseleave="$event.target.style.color = 'var(--text-muted)'; $event.target.style.background = 'transparent'"
          >Anime</NuxtLink>
          <NuxtLink
            to="/forum"
            class="px-3 py-2 rounded-lg transition-all duration-200"
            style="color: var(--text-muted);"
            active-class="!text-[#8b5cf6] bg-[#7c3aed]/10"
            @mouseenter="$event.target.style.color = 'var(--text-primary)'; $event.target.style.background = 'var(--hover-bg)'"
            @mouseleave="$event.target.style.color = 'var(--text-muted)'; $event.target.style.background = 'transparent'"
          >Forum</NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2 text-sm flex-shrink-0">

          <!-- Theme toggle -->
          <button
            @click.stop="toggleTheme()"
            class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[var(--hover-bg)]"
            style="color: var(--text-muted);"
            :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <!-- Sun icon (show in dark mode to switch to light) -->
            <svg v-if="isDark" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l1.41-1.41"/>
            </svg>
            <!-- Moon icon (show in light mode to switch to dark) -->
            <svg v-else class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <!-- Desktop: Tulis / Create menu (member+) -->
          <div v-if="isLoggedIn" class="relative hidden md:block">
            <button
              @click.stop="writeMenuOpen = !writeMenuOpen; adminMenuOpen = false"
              class="flex items-center gap-1.5 px-3 py-2 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white rounded-full font-semibold transition-all duration-200 text-sm shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tulis
              <svg class="w-3 h-3 opacity-70 transition-transform" :class="writeMenuOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <div
              v-if="writeMenuOpen"
              @click.stop
              class="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden py-1.5 border"
              style="background: var(--bg-card); border-color: var(--border-color);"
            >
              <p class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Buat Baru</p>
              <NuxtLink to="/admin/articles/create" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="w-8 h-8 rounded-lg bg-[#7c3aed]/15 flex items-center justify-center text-base flex-shrink-0">📰</span>
                <div>
                  <p class="text-sm font-semibold">Artikel</p>
                  <p class="text-xs" style="color: var(--text-muted);">Berita & editorial</p>
                </div>
              </NuxtLink>
              <NuxtLink to="/admin/reviews/create" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="w-8 h-8 rounded-lg bg-[#7c3aed]/15 flex items-center justify-center text-base flex-shrink-0">⭐</span>
                <div>
                  <p class="text-sm font-semibold">Review</p>
                  <p class="text-xs" style="color: var(--text-muted);">Review anime & manga</p>
                </div>
              </NuxtLink>
              <NuxtLink to="/forum/create" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="w-8 h-8 rounded-lg bg-[#7c3aed]/15 flex items-center justify-center text-base flex-shrink-0">💬</span>
                <div>
                  <p class="text-sm font-semibold">Thread Forum</p>
                  <p class="text-xs" style="color: var(--text-muted);">Mulai diskusi baru</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Desktop: Admin menu (admin/mod) -->
          <div v-if="isModerator" class="relative hidden md:block">
            <button
              @click.stop="adminMenuOpen = !adminMenuOpen; writeMenuOpen = false"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8b5cf6] hover:text-[#a78bfa] border border-[#7c3aed]/30 hover:border-[#7c3aed]/60 rounded-full transition-all duration-200 cursor-pointer"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
              <svg class="w-3 h-3 opacity-70 transition-transform" :class="adminMenuOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <div
              v-if="adminMenuOpen"
              @click.stop
              class="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden py-1.5 border"
              style="background: var(--bg-card); border-color: var(--border-color);"
            >
              <p class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest" style="color: var(--text-muted);">Admin Panel</p>
              <NuxtLink to="/admin" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="text-base">📊</span><span class="text-sm">Dashboard</span>
              </NuxtLink>
              <NuxtLink to="/admin/articles" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="text-base">📰</span><span class="text-sm">Kelola Artikel</span>
              </NuxtLink>
              <NuxtLink to="/admin/reviews" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="text-base">⭐</span><span class="text-sm">Kelola Review</span>
              </NuxtLink>
              <div class="border-t my-1" style="border-color: var(--border-subtle);" />
              <NuxtLink to="/admin/mal" @click="closeAll" class="nav-dropdown-item flex items-center gap-3 px-4 py-2.5 transition cursor-pointer" style="color: var(--text-primary);">
                <span class="text-base">🔗</span><span class="text-sm">Koneksi MAL</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Desktop: User info & logout -->
          <template v-if="isLoggedIn">
            <div class="hidden md:flex items-center gap-2 pl-2 border-l" style="border-color: var(--border-subtle);">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                {{ user?.username?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden sm:block max-w-[80px] truncate text-xs" style="color: var(--text-muted);">{{ user?.username }}</span>
              <button @click="logout" class="hover:text-red-400 transition text-xs ml-1 cursor-pointer" style="color: var(--text-muted);" title="Keluar">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="hidden md:block transition px-3 py-2 text-sm" style="color: var(--text-muted);">Masuk</NuxtLink>
            <NuxtLink to="/auth/register" class="hidden md:block bg-[#7c3aed] hover:bg-[#8b5cf6] text-white px-4 py-2 rounded-full transition-all duration-200 text-sm font-semibold shadow-[0_0_16px_rgba(124,58,237,0.3)]">Daftar</NuxtLink>
          </template>

          <!-- Mobile: Hamburger -->
          <button
            class="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[var(--hover-bg)]"
            style="color: var(--text-muted);"
            @click.stop="mobileMenuOpen = !mobileMenuOpen; writeMenuOpen = false; adminMenuOpen = false"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

        </div>
      </div>

      <!-- Mobile menu dropdown -->
      <div
        v-if="mobileMenuOpen"
        @click.stop
        class="md:hidden border-t"
        style="background: var(--bg-card); border-color: var(--border-color);"
      >
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          <!-- Nav links -->
          <NuxtLink to="/articles" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);" active-class="!text-[#8b5cf6] bg-[#7c3aed]/10">
            <span>📰</span> Artikel
          </NuxtLink>
          <NuxtLink to="/reviews" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);" active-class="!text-[#8b5cf6] bg-[#7c3aed]/10">
            <span>⭐</span> Review
          </NuxtLink>
          <NuxtLink to="/anime" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);" active-class="!text-[#8b5cf6] bg-[#7c3aed]/10">
            <span>🎌</span> Anime
          </NuxtLink>
          <NuxtLink to="/forum" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);" active-class="!text-[#8b5cf6] bg-[#7c3aed]/10">
            <span>💬</span> Forum
          </NuxtLink>

          <div class="border-t my-1" style="border-color: var(--border-subtle);" />

          <!-- Auth section -->
          <template v-if="isLoggedIn">
            <div class="flex items-center gap-3 px-3 py-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                {{ user?.username?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium" style="color: var(--text-primary);">{{ user?.username }}</span>
            </div>
            <NuxtLink to="/admin/articles/create" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);">
              <span>✏️</span> Tulis Artikel
            </NuxtLink>
            <NuxtLink to="/admin/reviews/create" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);">
              <span>📝</span> Tulis Review
            </NuxtLink>
            <NuxtLink to="/forum/create" @click="closeAll" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition" style="color: var(--text-secondary);">
              <span>🗨️</span> Buat Thread
            </NuxtLink>
            <button @click="logout; closeAll()" class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 transition w-full text-left">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" @click="closeAll" class="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold border transition" style="color: var(--text-primary); border-color: var(--border-color);">
              Masuk
            </NuxtLink>
            <NuxtLink to="/auth/register" @click="closeAll" class="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-[#7c3aed] hover:bg-[#8b5cf6] text-white transition shadow-[0_0_16px_rgba(124,58,237,0.3)]">
              Daftar
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t py-12" style="background: var(--bg-surface); border-color: var(--border-subtle);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div class="font-black text-xl tracking-tight mb-1">
              <span class="text-[#8b5cf6]">Ani</span><span style="color: var(--text-primary);">Verse</span>
            </div>
            <p class="text-xs" style="color: var(--text-muted);">Platform media anime &amp; manga Indonesia</p>
          </div>
          <div class="flex items-center gap-6 text-xs" style="color: var(--text-muted);">
            <NuxtLink to="/articles" class="hover:text-[#8b5cf6] transition">Artikel</NuxtLink>
            <NuxtLink to="/reviews" class="hover:text-[#8b5cf6] transition">Review</NuxtLink>
            <NuxtLink to="/anime" class="hover:text-[#8b5cf6] transition">Anime</NuxtLink>
            <NuxtLink to="/forum" class="hover:text-[#8b5cf6] transition">Forum</NuxtLink>
          </div>
          <p class="text-xs" style="color: var(--text-muted);">© {{ new Date().getFullYear() }} AniVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-dropdown-item:hover {
  background: var(--hover-bg);
}
</style>
