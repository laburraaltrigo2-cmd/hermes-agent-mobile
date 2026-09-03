import { atom } from 'nanostores'

const KEY = 'hermes.desktop.wallpaper.v1'

function storedWallpaper(): string {
  if (typeof window === 'undefined') return ''

  return window.localStorage.getItem(KEY) ?? ''
}

function paintWallpaper(value: string) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.toggleAttribute('data-custom-wallpaper', Boolean(value))
  root.style.setProperty('--hermes-custom-wallpaper', value ? `url(${JSON.stringify(value)})` : 'none')
}

export const $wallpaper = atom(storedWallpaper())

$wallpaper.subscribe(value => {
  if (typeof window !== 'undefined') {
    if (value) window.localStorage.setItem(KEY, value)
    else window.localStorage.removeItem(KEY)
  }

  paintWallpaper(value)
})

export function setWallpaper(value: string) {
  $wallpaper.set(value.trim())
}

