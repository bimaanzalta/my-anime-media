import { useDark, useToggle } from '@vueuse/core'

export const useTheme = () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'aniverse-theme',
    initialValue: 'dark',
  })
  const toggleTheme = useToggle(isDark)
  return { isDark, toggleTheme }
}
