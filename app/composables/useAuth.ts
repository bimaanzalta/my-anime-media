export function useAuth() {
  const user = useState<{ id: number; username: string; email: string; role: string; avatar?: string } | null>('user', () => null)

  async function fetchUser() {
    try {
      // useRequestFetch() forwards cookies automatically during SSR
      const fetch = useRequestFetch()
      const data = await fetch<any>('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch<any>('/api/auth/login', { method: 'POST', body: { email, password } })
    user.value = data.user
    return data.user
  }

  async function register(username: string, email: string, password: string) {
    const data = await $fetch<any>('/api/auth/register', { method: 'POST', body: { username, email, password } })
    user.value = data.user
    return data.user
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => ['admin', 'moderator'].includes(user.value?.role || ''))

  return { user, fetchUser, login, register, logout, isLoggedIn, isAdmin, isModerator }
}
