<script setup lang="ts">
const { register } = useAuth()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await register(username.value, email.value, password.value)
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Registrasi gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background: var(--bg-base);">
    <div class="w-full max-w-sm rounded-2xl p-8 border" style="background: var(--bg-card); border-color: var(--border-color);">
      <h1 class="text-2xl font-bold mb-6" style="color: var(--text-primary);">Daftar</h1>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 text-sm transition"
          style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color);"
        />
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
          {{ loading ? 'Memuat...' : 'Daftar' }}
        </button>
      </form>
      <p class="text-sm mt-4 text-center" style="color: var(--text-muted);">
        Sudah punya akun? <NuxtLink to="/auth/login" class="text-violet-500 hover:underline">Masuk</NuxtLink>
      </p>
    </div>
  </div>
</template>
