import '../styles/tailwind.css'
import initDarkMode from './dark-mode.js'

if (DEV_MODE) console.log('Dev mode is currently enabled.')

// handle clicks to toggle the menu
document.getElementById('nav-toggle').onclick = function () {
  document.getElementById('nav-content').classList.toggle('hidden')
}

initDarkMode()
