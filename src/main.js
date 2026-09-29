import './style.css'

const MUSIC_HASHES = new Set(['muzik', 'parcalar', 'zalim'])
const TATTOO_HASHES = new Set(['', 'tattoo', 'galeri', 'surec', 'randevu'])

const SEO = {
  tattoo: {
    title: 'Arin Premium Tattoo Studyosu — Nevşehir dövme',
    description:
      'Nevşehir’de kişiye özel dövme. Randevu Instagram’dan, @arintattoo7. Stüdyo Salı–Cumartesi 12:00–20:00.',
  },
  muzik: {
    title: 'Arin — Zalım ve diğer parçalar',
    description:
      'Arin’in müziği. Zalım 2,6 milyon izlenme. YouTube kanalı @ArinOfficiall ve Spotify’da Arin.',
  },
}

const dialog = document.querySelector('#lightbox')
const lightboxImg = document.querySelector('#lightbox-img')
const lightboxCaption = document.querySelector('#lightbox-caption')
const announcer = document.querySelector('#route-announcer')
const tiles = [...document.querySelectorAll('[data-lightbox]')]
let tileIndex = 0
let lastTrigger = null
let route = null

function hashKey() {
  return location.hash.replace(/^#\/?/, '')
}

function routeFromLocation() {
  const key = hashKey()
  if (MUSIC_HASHES.has(key)) return 'muzik'
  if (TATTOO_HASHES.has(key)) return 'tattoo'
  return document.documentElement.dataset.route === 'muzik' ? 'muzik' : 'tattoo'
}

function setMeta(name, content) {
  const node = document.head.querySelector(`meta[name="${name}"]`)
  if (node) node.setAttribute('content', content)
}

function applyRoute(next, { scroll = false } = {}) {
  const changed = route !== next
  route = next
  document.documentElement.dataset.route = next

  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.dataset.nav === next) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })

  const seo = SEO[next]
  document.title = seo.title
  setMeta('description', seo.description)
  setMeta('theme-color', next === 'muzik' ? '#f3eadf' : '#141210')

  if (changed && announcer) {
    announcer.textContent = next === 'muzik' ? 'Müzik sayfası' : 'Tattoo sayfası'
  }

  if (changed && scroll) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    const heading = document.querySelector(`[data-page="${next}"] h1`)
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }
}

function syncFromHash() {
  applyRoute(routeFromLocation())
}

document.querySelectorAll('[data-nav]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    const next = link.dataset.nav === 'muzik' ? 'muzik' : 'tattoo'
    const hash = next === 'muzik' ? '#muzik' : '#tattoo'
    if (location.hash !== hash) history.pushState(null, '', hash)
    applyRoute(next, { scroll: true })
  })
})

window.addEventListener('hashchange', syncFromHash)
window.addEventListener('popstate', syncFromHash)
applyRoute(routeFromLocation())

function showTile(index) {
  tileIndex = (index + tiles.length) % tiles.length
  const tile = tiles[tileIndex]
  const source = tile.querySelector('img')
  lightboxImg.src = source.currentSrc || source.src
  lightboxImg.alt = tile.dataset.alt || ''
  lightboxCaption.textContent = tile.dataset.caption || ''
  dialog.showModal()
}

tiles.forEach((tile, index) => {
  tile.addEventListener('click', () => {
    lastTrigger = tile
    showTile(index)
  })
})

dialog.addEventListener('click', (event) => {
  if (event.target === dialog || event.target.closest('[data-close]')) dialog.close()
})

dialog.querySelector('[data-prev]').addEventListener('click', () => showTile(tileIndex - 1))
dialog.querySelector('[data-next]').addEventListener('click', () => showTile(tileIndex + 1))

dialog.addEventListener('close', () => {
  lightboxImg.removeAttribute('src')
  lastTrigger?.focus()
})

document.addEventListener('keydown', (event) => {
  if (!dialog.open) return
  if (event.key === 'ArrowRight') showTile(tileIndex + 1)
  if (event.key === 'ArrowLeft') showTile(tileIndex - 1)
})

function closeTracks(except) {
  document.querySelectorAll('.track-open').forEach((button) => {
    if (button === except) return
    button.setAttribute('aria-expanded', 'false')
    button.textContent = 'Oynat'
    const slot = document.getElementById(button.getAttribute('aria-controls'))
    if (!slot) return
    slot.hidden = true
    slot.replaceChildren()
  })
}

document.querySelectorAll('.track-open').forEach((button) => {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true'
    const slot = document.getElementById(button.getAttribute('aria-controls'))
    if (!slot) return
    if (open) {
      closeTracks()
      return
    }
    const video = button.dataset.video || ''
    if (!/^[\w-]{6,}$/.test(video)) return
    closeTracks(button)
    const title = button.dataset.title || 'Arin'
    const frame = document.createElement('iframe')
    frame.className = 'aspect-video w-full bg-ink'
    frame.src = `https://www.youtube-nocookie.com/embed/${video}`
    frame.title = title
    frame.loading = 'lazy'
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    frame.referrerPolicy = 'strict-origin-when-cross-origin'
    frame.allowFullscreen = true
    slot.replaceChildren(frame)
    slot.hidden = false
    button.setAttribute('aria-expanded', 'true')
    button.textContent = 'Kapat'
  })
})
