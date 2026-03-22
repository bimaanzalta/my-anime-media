export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser, isAdmin } = useAuth()

  // Selalu fetch saat SSR agar cookie diteruskan dengan benar
  if (import.meta.server || !user.value) {
    await fetchUser()
  }

  if (!isAdmin.value) {
    return navigateTo('/auth/login')
  }
})
