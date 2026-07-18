/**
 * TxLINE API Client
 *
 * Centralized HTTP wrapper that handles:
 * - Authentication headers (Bearer JWT + X-Api-Token)
 * - Error handling with typed errors
 * - Automatic retry on 401 (JWT renewal)
 *
 * Based on the official TxLINE docs:
 * https://txline.txodds.com/documentation/examples/fetching-snapshots
 */

import { getConfig } from './config'
import type { TxLineApiError, TxLineCredentials } from '@/types/txline'

/** Stored credentials — set via setCredentials() after auth */
let credentials: TxLineCredentials | null = null

/** Callback to refresh JWT on 401 */
let onJwtExpired: (() => Promise<string>) | null = null

/**
 * Store authenticated credentials for all subsequent requests.
 */
export function setCredentials(creds: TxLineCredentials): void {
  credentials = creds
}

/**
 * Get the current credentials (or null if not authenticated).
 */
export function getCredentials(): TxLineCredentials | null {
  return credentials
}

/**
 * Clear stored credentials (on disconnect / logout).
 */
export function clearCredentials(): void {
  credentials = null
}

/**
 * Register a callback to renew the guest JWT when a 401 is received.
 */
export function setJwtRefreshHandler(handler: () => Promise<string>): void {
  onJwtExpired = handler
}

/**
 * Build request headers with current auth credentials.
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (credentials?.guestJwt) {
    headers['Authorization'] = `Bearer ${credentials.guestJwt}`
  }
  if (credentials?.apiToken) {
    headers['X-Api-Token'] = credentials.apiToken
  }
  return headers
}

/**
 * Core fetch wrapper with auth, error handling, and optional JWT retry.
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const config = getConfig()
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  // Handle 401 — try to renew JWT once
  if (response.status === 401 && retry && onJwtExpired) {
    try {
      const newJwt = await onJwtExpired()
      if (credentials) {
        credentials = { ...credentials, guestJwt: newJwt }
      }
      return request<T>(path, options, false)
    } catch {
      throw createApiError(401, 'JWT renewal failed')
    }
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const body = await response.json()
      message = body.message || body.error || message
    } catch {
      // body may not be JSON
    }
    throw createApiError(response.status, message)
  }

  // Handle empty responses (204, etc.)
  const text = await response.text()
  if (!text) return undefined as T

  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

function createApiError(status: number, message: string): TxLineApiError {
  return { status, message }
}

// ============================================================
// Public API methods
// ============================================================

/**
 * GET request to TxLINE API.
 *
 * @example
 * const fixtures = await txGet<TxLineFixture[]>('/fixtures/snapshot')
 * const odds = await txGet<TxLineOddsEntry[]>('/odds/snapshot/17271370')
 */
export async function txGet<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> {
  let url = path
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value))
    })
    url = `${path}?${searchParams.toString()}`
  }
  return request<T>(url, { method: 'GET' })
}

/**
 * POST request to TxLINE API.
 *
 * @example
 * const auth = await txPost<GuestAuthResponse>('/auth/guest/start', {}, false)
 */
export async function txPost<T>(
  path: string,
  body?: unknown,
  requiresAuth = true,
): Promise<T> {
  const config = getConfig()
  const url = path.startsWith('http') ? path : `${config.apiOrigin}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (requiresAuth) {
    Object.assign(headers, getAuthHeaders())
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const resBody = await response.json()
      message = resBody.message || resBody.error || message
    } catch {
      // body may not be JSON
    }
    throw createApiError(response.status, message)
  }

  const text = await response.text()
  if (!text) return undefined as T

  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

/**
 * Create a fetch-based SSE connection to a TxLINE stream endpoint.
 * Returns the raw Response for consuming with readSseMessages().
 *
 * @example
 * const response = await txStream('/odds/stream')
 * for await (const msg of readSseMessages(response)) { ... }
 */
export async function txStream(path: string): Promise<Response> {
  const config = getConfig()
  const url = `${config.apiBaseUrl}${path}`

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(),
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })

  if (!response.ok) {
    throw createApiError(response.status, `Stream failed: ${response.status}`)
  }

  return response
}

/**
 * Check if the client has valid credentials set.
 */
export function isAuthenticated(): boolean {
  return !!(credentials?.guestJwt && credentials?.apiToken)
}
