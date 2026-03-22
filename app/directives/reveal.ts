import type { ObjectDirective } from 'vue'

const reveal: ObjectDirective = {
  // Required by Vue SSR — return empty object so server skips the directive
  getSSRProps() {
    return {}
  },
  mounted(el: HTMLElement, binding) {
    const delay = (binding.value as number) || 0
    el.style.transitionDelay = `${delay}ms`
    el.classList.add('reveal')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
  },
}

export default reveal
