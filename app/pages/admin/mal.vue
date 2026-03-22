<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const route = useRoute()
const { data: statusRaw, refresh, pending } = await useFetch('/api/admin/mal/status')
const status = computed(() => statusRaw.value as any)

const refreshing = ref(false)
const disconnecting = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const callbackErrorMessages: Record<string, string> = {
  invalid_state: 'State OAuth tidak valid. Silakan coba hubungkan ulang.',
  exchange_failed: 'Gagal menukar kode otorisasi. Cek MAL_CLIENT_SECRET di .env lalu coba lagi.',
}

onMounted(() => {
  if (route.query.error) {
    message.value = {
      type: 'error',
      text: callbackErrorMessages[route.query.error as string] || 'Koneksi MAL gagal.',
    }
  }
})

function formatDate(date: string | Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

function timeUntilExpiry(date: string | Date | null) {
  if (!date) return ''
  const diff = new Date(date).getTime() - Date.now()
  if (diff <= 0) return 'Sudah kedaluwarsa'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h > 24) return `${Math.floor(h / 24)} hari lagi`
  if (h > 0) return `${h} jam ${m} menit lagi`
  return `${m} menit lagi`
}

async function handleRefresh() {
  refreshing.value = true
  message.value = null
  try {
    await $fetch('/api/admin/mal/refresh', { method: 'POST' })
    await refresh()
    message.value = { type: 'success', text: 'Token berhasil diperbarui.' }
  } catch (e: any) {
    message.value = { type: 'error', text: e.data?.message || 'Gagal memperbarui token.' }
  } finally {
    refreshing.value = false
  }
}

async function handleDisconnect() {
  if (!confirm('Yakin ingin memutuskan koneksi MyAnimeList?')) return
  disconnecting.value = true
  message.value = null
  try {
    await $fetch('/api/admin/mal/disconnect', { method: 'DELETE' })
    await refresh()
    message.value = { type: 'success', text: 'Koneksi MAL berhasil diputus.' }
  } catch (e: any) {
    message.value = { type: 'error', text: e.data?.message || 'Gagal memutus koneksi.' }
  } finally {
    disconnecting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-12" style="background: var(--bg-base); color: var(--text-primary);">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/admin" class="text-sm hover:text-violet-500 transition mb-4 inline-block" style="color: var(--text-muted);">
          ← Admin Panel
        </NuxtLink>
        <h1 class="text-3xl font-bold">Koneksi MyAnimeList</h1>
        <p class="mt-1 text-sm" style="color: var(--text-muted);">
          Hubungkan akun MAL untuk mengaktifkan sinkronisasi data anime dan manga.
        </p>
      </div>

      <!-- Notification -->
      <div v-if="message"
        :class="message.type === 'success' ? 'bg-green-500/15 border-green-500/40 text-green-600 dark:text-green-300' : 'bg-red-500/15 border-red-500/40 text-red-600 dark:text-red-300'"
        class="border rounded-xl px-4 py-3 text-sm mb-6 flex items-center justify-between"
      >
        {{ message.text }}
        <button @click="message = null" class="opacity-60 hover:opacity-100 ml-4">✕</button>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="rounded-2xl border p-8 text-center" style="background: var(--bg-card); border-color: var(--border-color); color: var(--text-muted);">
        Memuat status koneksi...
      </div>

      <!-- Connected State -->
      <template v-else-if="status?.connected">
        <div class="rounded-2xl border overflow-hidden" style="background: var(--bg-card); border-color: var(--border-color);">

          <!-- Status Banner -->
          <div
            :class="status.isExpired ? 'bg-red-500/15 border-red-500/30' : status.isNearExpiry ? 'bg-yellow-500/15 border-yellow-500/30' : 'bg-green-500/15 border-green-500/30'"
            class="border-b px-6 py-4 flex items-center gap-3"
          >
            <span class="text-2xl">{{ status.isExpired ? '🔴' : status.isNearExpiry ? '🟡' : '🟢' }}</span>
            <div>
              <p class="font-semibold">
                {{ status.isExpired ? 'Token kedaluwarsa' : status.isNearExpiry ? 'Token hampir kedaluwarsa' : 'Terhubung' }}
              </p>
              <p class="text-xs opacity-70">
                {{ status.isExpired ? 'Refresh token atau hubungkan ulang akun MAL.' : status.isNearExpiry ? 'Segera refresh token agar koneksi tidak terputus.' : 'Koneksi MAL aktif dan berfungsi normal.' }}
              </p>
            </div>
          </div>

          <!-- Info -->
          <div class="px-6 py-5 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs mb-1" style="color: var(--text-muted);">Username MAL</p>
                <p class="font-medium flex items-center gap-2">
                  <span>{{ status.malUsername || '—' }}</span>
                  <a v-if="status.malUsername" :href="`https://myanimelist.net/profile/${status.malUsername}`" target="_blank" class="text-xs text-violet-500 hover:text-violet-400">↗ Profil</a>
                </p>
              </div>
              <div>
                <p class="text-xs mb-1" style="color: var(--text-muted);">User ID MAL</p>
                <p class="font-medium font-mono">{{ status.malUserId || '—' }}</p>
              </div>
              <div>
                <p class="text-xs mb-1" style="color: var(--text-muted);">Token kedaluwarsa</p>
                <p class="font-medium" :class="status.isExpired ? 'text-red-500' : status.isNearExpiry ? 'text-yellow-500' : 'text-green-500'">
                  {{ formatDate(status.expiresAt) }}
                </p>
              </div>
              <div>
                <p class="text-xs mb-1" style="color: var(--text-muted);">Sisa waktu</p>
                <p class="font-medium" :class="status.isExpired ? 'text-red-500' : status.isNearExpiry ? 'text-yellow-500' : 'text-green-500'">
                  {{ timeUntilExpiry(status.expiresAt) }}
                </p>
              </div>
              <div>
                <p class="text-xs mb-1" style="color: var(--text-muted);">Terakhir diperbarui</p>
                <p class="font-medium text-sm" style="color: var(--text-secondary);">{{ formatDate(status.updatedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 border-t flex flex-wrap gap-3" style="border-color: var(--border-subtle);">
            <button @click="handleRefresh" :disabled="refreshing"
              class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 rounded-lg text-sm font-medium transition">
              {{ refreshing ? 'Memperbarui...' : '🔄 Refresh Token' }}
            </button>
            <a href="/api/mal/auth/authorize?returnTo=/admin/mal"
              class="px-4 py-2 bg-blue-600/60 hover:bg-blue-500/60 text-white rounded-lg text-sm font-medium transition">
              🔗 Hubungkan Ulang
            </a>
            <button @click="handleDisconnect" :disabled="disconnecting"
              class="px-4 py-2 bg-red-500/15 hover:bg-red-500/25 disabled:opacity-50 border border-red-500/30 rounded-lg text-sm font-medium text-red-500 transition ml-auto">
              {{ disconnecting ? 'Memutus...' : '🔌 Putus Koneksi' }}
            </button>
          </div>
        </div>

        <!-- Info Box -->
        <div class="mt-4 rounded-xl border px-5 py-4 text-sm" style="background: var(--bg-surface); border-color: var(--border-subtle); color: var(--text-muted);">
          <p class="font-medium mb-1" style="color: var(--text-secondary);">ℹ️ Auto-refresh aktif</p>
          <p>Token akan diperbarui otomatis saat mendekati kedaluwarsa (5 menit sebelumnya). Jika gagal, gunakan tombol <strong style="color: var(--text-primary);">Refresh Token</strong> atau <strong style="color: var(--text-primary);">Hubungkan Ulang</strong>.</p>
        </div>
      </template>

      <!-- Disconnected State -->
      <template v-else>
        <div class="rounded-2xl border p-8 text-center" style="background: var(--bg-card); border-color: var(--border-color);">
          <div class="text-5xl mb-4">🔌</div>
          <h2 class="text-xl font-bold mb-2">Belum terhubung ke MyAnimeList</h2>
          <p class="text-sm mb-8 max-w-sm mx-auto" style="color: var(--text-muted);">
            Hubungkan akun MAL untuk mengaktifkan fitur sinkronisasi data anime, manga, dan menggunakan MAL API dengan rate limit yang lebih tinggi.
          </p>

          <a href="/api/mal/auth/authorize?returnTo=/admin/mal"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition text-sm">
            <img src="https://cdn.myanimelist.net/images/favicon.ico" class="w-4 h-4" alt="" />
            Hubungkan MyAnimeList
          </a>

          <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div v-for="item in [
              { icon: '📊', title: 'Rate limit lebih tinggi', desc: 'Akses MAL API dengan batas permintaan yang lebih besar.' },
              { icon: '🔄', title: 'Sync otomatis', desc: 'Data anime dan manga disinkronisasi dari MAL secara real-time.' },
              { icon: '🔐', title: 'OAuth 2.0 PKCE', desc: 'Autentikasi aman menggunakan standar OAuth 2.0 dengan PKCE.' },
            ]" :key="item.title" class="rounded-xl p-4" style="background: var(--bg-surface);">
              <p class="text-lg mb-1">{{ item.icon }}</p>
              <p class="font-medium text-sm mb-1">{{ item.title }}</p>
              <p class="text-xs" style="color: var(--text-muted);">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>
