export function useScrollReveal() {
  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    if (!el.value) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { isVisible.value = true; observer.disconnect() } },
      { threshold: 0.12 }
    )
    observer.observe(el.value)
  })

  return { el, isVisible }
}
