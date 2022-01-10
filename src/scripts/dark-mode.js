import '../styles/tailwind.css'

export default () => {
  const toggleEl = document.querySelector('#color-scheme-toggle')
  const DARK = 'dark'
  const LIGHT = 'light'
  const LOCAL_STORAGE_DARK_LIGHT = 'color-scheme'

  toggleEl.addEventListener('click', () => {
    const bodyEl = document.querySelector('html')
    const isDark = bodyEl.classList.toggle('dark')
    const mode = isDark ? DARK : LIGHT
    localStorage.setItem(LOCAL_STORAGE_DARK_LIGHT, mode)

    if (isDark) {
      toggleEl.src = toggleEl.src.replace(DARK, LIGHT)
      toggleEl.alt = toggleEl.alt.replace(DARK, LIGHT)
    } else {
      toggleEl.src = toggleEl.src.replace(LIGHT, DARK)
      toggleEl.alt = toggleEl.alt.replace(LIGHT, DARK)
    }
  })

  const isSystemDarkMode =
    matchMedia && matchMedia('(prefers-color-scheme: dark)').matches

  // start with local storage value
  let mode = localStorage.getItem(LOCAL_STORAGE_DARK_LIGHT)

  // if not set check preference
  if (!mode) {
    if (isSystemDarkMode) {
      mode = DARK
    }
  }

  // default to DARK if no other setting
  mode = mode || DARK

  // default is DARK in <html> page.njk template so switch if needed when loading
  if (mode === LIGHT) {
    document.querySelector('#color-scheme-toggle').click()
  }
}
