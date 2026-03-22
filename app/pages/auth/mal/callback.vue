<script setup lang="ts">
// Server route di server/routes/auth/mal/callback.get.ts menangani OAuth exchange.
// Halaman ini hanya akan tampil jika ada error dari server route.
const route = useRoute()
const error = computed(() => route.query.error as string | undefined)

onMounted(() => {
  if (!error.value && !route.query.code) {
    navigateTo('/')
  }
})

const errorMessages: Record<string, string> = {
  invalid_state: 'State OAuth tidak valid. Silakan coba hubungkan ulang.',
  exchange_failed: 'Gagal menukar kode otorisasi. Pastikan MAL Client Secret sudah diisi di .env.',
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="text-center">
      <div v-if="error" class="bg-red-900/30 border border-red-500/30 rounded-2xl px-8 py-6 max-w-md">
        <p class="text-2xl mb-3">❌</p>
        <h2 class="text-lg font-bold text-red-300 mb-2">Koneksi MAL gagal</h2>
        <p class="text-sm text-gray-400 mb-6">{{ errorMessages[error] || 'Terjadi kesalahan yang tidak diketahui.' }}</p>
        <NuxtLink to="/admin/mal" class="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition">
          Kembali ke pengaturan MAL
        </NuxtLink>
      </div>
      <div v-else class="text-gray-400">
        <div class="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Menghubungkan dengan MyAnimeList...</p>
      </div>
    </div>
  </div>
</template>
