export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser, isLoggedIn } = useAuth()

  if (import.meta.server || !user.value) {
    await fetchUser()
  }

  if (!isLoggedIn.value) return navigateTo('/auth/login')
})
