<script setup lang="ts">
const { login } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background: var(--bg-base);">
    <div class="w-full max-w-sm rounded-2xl p-8 border" style="background: var(--bg-card); border-color: var(--border-color);">
      <h1 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Masuk</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email"
          class="w-full rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 text-sm transition"
          style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"
        />
        <input v-model="password" type="password" placeholder="Password"
          class="w-full rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 text-sm transition"
          style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"
        />
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <button type="submit" :disabled="loading" class="w-full bg-violet-600 hover:bg-violet-500 text-white rounded-lg py-3 font-medium transition disabled:opacity-50">
          {{ loading ? 'Memuat...' : 'Masuk' }}
        </button>
      </form>
      <p class="text-sm mt-4 text-center" style="color: var(--text-muted);">
        Belum punya akun? <NuxtLink to="/auth/register" class="text-violet-500 hover:underline">Daftar</NuxtLink>
      </p>
      <div class="mt-4 border-t pt-4" style="border-color: var(--border-subtle);">
        <a href="/api/mal/auth/authorize" class="flex items-center justify-center gap-2 w-full border border-blue-400/30 hover:bg-blue-500/10 text-blue-500 rounded-lg py-3 transition text-sm">
          Login dengan MyAnimeList
        </a>
      </div>
    </div>
  </div>
</template>
