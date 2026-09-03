/**
 * Browser compatibility bridge for the Desktop renderer.
 *
 * Electron supplies `window.hermesDesktop` from preload.ts. When the exact
 * same renderer is served by `hermes dashboard`, this adapter maps the two
 * essential native seams (REST and gateway WebSocket discovery) to browser
 * APIs. Native-only affordances remain absent or degrade to browser-native
 * clipboard, download and notification behavior.
 */

interface BrowserHermesGlobals {
  __HERMES_AUTH_REQUIRED__?: boolean
  __HERMES_BASE_PATH__?: string
  __HERMES_SESSION_TOKEN__?: string
  hermesDesktop?: Window['hermesDesktop']
}

const browserWindow = window as unknown as BrowserHermesGlobals

function basePath(): string {
  const raw = browserWindow.__HERMES_BASE_PATH__ ?? ''
  if (!raw) return ''
  return `/${raw.replace(/^\/+|\/+$/g, '')}`
}

function backendBaseUrl(): string {
  return `${window.location.origin}${basePath()}`
}

function addProfile(path: string, profile?: null | string): string {
  if (!profile?.trim()) return path
  const url = new URL(path, window.location.origin)
  url.searchParams.set('profile', profile.trim())
  return `${url.pathname}${url.search}`
}

async function wsUrl(profile?: null | string): Promise<string> {
  const url = new URL(`${backendBaseUrl()}/api/ws`)
  url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

  if (browserWindow.__HERMES_AUTH_REQUIRED__) {
    const response = await fetch(`${backendBaseUrl()}/api/auth/ws-ticket`, {
      method: 'POST',
      credentials: 'include'
    })
    if (!response.ok) throw new Error(`Hermes authentication failed (${response.status})`)
    const payload = (await response.json()) as { ticket?: string }
    if (!payload.ticket) throw new Error('Hermes returned no WebSocket ticket')
    url.searchParams.set('ticket', payload.ticket)
  } else {
    url.searchParams.set('token', browserWindow.__HERMES_SESSION_TOKEN__ ?? '')
  }

  if (profile?.trim()) url.searchParams.set('profile', profile.trim())
  return url.toString()
}

async function api<T>(request: {
  body?: unknown
  method?: string
  path: string
  profile?: null | string
  timeoutMs?: number
  upload?: { bytes: ArrayBuffer; contentType?: string; filename: string }
}): Promise<T> {
  const controller = new AbortController()
  const timer = request.timeoutMs
    ? window.setTimeout(() => controller.abort(), request.timeoutMs)
    : null
  const headers = new Headers()
  const token = browserWindow.__HERMES_SESSION_TOKEN__
  if (token) headers.set('X-Hermes-Session-Token', token)

  let body: BodyInit | undefined
  if (request.upload) {
    const form = new FormData()
    form.append(
      'file',
      new Blob([request.upload.bytes], { type: request.upload.contentType }),
      request.upload.filename
    )
    body = form
  } else if (request.body !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(request.body)
  }

  try {
    const response = await fetch(`${backendBaseUrl()}${addProfile(request.path, request.profile)}`, {
      body,
      credentials: 'include',
      headers,
      method: request.method ?? (body ? 'POST' : 'GET'),
      signal: controller.signal
    })
    if (!response.ok) {
      const error = new Error((await response.text()) || `Hermes request failed (${response.status})`) as Error & {
        statusCode?: number
      }
      error.statusCode = response.status
      throw error
    }
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  } finally {
    if (timer !== null) window.clearTimeout(timer)
  }
}

if (!browserWindow.hermesDesktop) {
  const connection = async (profile?: null | string) => {
    const freshWsUrl = await wsUrl(profile)
    return {
      baseUrl: backendBaseUrl(),
      isFullscreen: false,
      mode: 'remote' as const,
      nativeOverlayWidth: 0,
      profile: profile || undefined,
      sharedPrimary: Boolean(profile),
      source: 'settings' as const,
      token: browserWindow.__HERMES_SESSION_TOKEN__ ?? '',
      windowButtonPosition: null,
      wsUrl: freshWsUrl,
      logs: []
    }
  }
  const off = () => () => undefined

  const bridge: Partial<Window['hermesDesktop']> = {
    api,
    claimAmbientCue: async () => true,
    getBootProgress: async () => ({
      error: null,
      fakeMode: false,
      message: 'Hermes is ready',
      phase: 'backend.ready',
      progress: 100,
      retryable: false,
      running: false,
      timestamp: Date.now()
    }),
    getConnection: connection,
    getConnectionFor: ({ profile }) => connection(profile),
    getGatewayWsUrl: profile => wsUrl(profile),
    getGatewayWsUrlFor: ({ profile }) => wsUrl(profile),
    getProfileRoutes: async profiles => profiles.map(profile => ({
      connectionId: 'local',
      mode: 'local' as const,
      profile,
      targetProfile: profile
    })),
    notify: async payload => {
      if (!('Notification' in window)) return false

      // The Settings test button is a direct user gesture, which is the only
      // context where Safari/iOS permits the permission prompt. Existing
      // background events never cause an unsolicited browser prompt.
      const permission =
        Notification.permission === 'default' && navigator.userActivation?.isActive
          ? await Notification.requestPermission()
          : Notification.permission

      if (permission !== 'granted') return false

      const route = payload.activate || (payload.sessionId ? `/${payload.sessionId}` : window.location.hash.slice(1) || '/')
      const notificationUrl = new URL(`${basePath()}/`, window.location.origin)
      notificationUrl.hash = route
      const options: NotificationOptions = {
        body: payload.body,
        data: { url: notificationUrl.toString() },
        silent: payload.silent,
        tag: payload.tag
      }

      // Mobile Safari exposes notifications through the service-worker
      // registration. Chromium and desktop Safari support this path too.
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(payload.title || 'Hermes', options)
        return true
      }

      new Notification(payload.title || 'Hermes', options)
      return true
    },
    onBackendExit: off,
    onBootProgress: off,
    onConnectionApplied: off,
    onPowerResume: off,
    // Runtime plugin discovery installs this listener unconditionally during
    // renderer boot. Browser builds have no local filesystem watcher, but the
    // no-op subscription preserves the Desktop preload contract.
    onPreviewFileChanged: off,
    onWindowStateChanged: off,
    openExternal: async url => {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    profile: {
      get: async () => ({ profile: 'default' }),
      remember: async name => ({ profile: name || 'default' }),
      set: async name => ({ profile: name || 'default' })
    },
    readClipboard: async () => navigator.clipboard.readText(),
    revalidateConnection: async () => ({ ok: true, rebuilt: false }),
    setActiveWork: () => undefined,
    setDisableF12: () => undefined,
    setKeepAwake: () => undefined,
    setNativeTheme: () => undefined,
    setPreviewShortcutActive: () => undefined,
    setTitleBarTheme: () => undefined,
    setTranslucency: () => undefined,
    touchBackend: async () => ({ ok: true }),
    writeClipboard: async text => {
      await navigator.clipboard.writeText(text)
      return true
    }
  }

  browserWindow.hermesDesktop = bridge as Window['hermesDesktop']
}
