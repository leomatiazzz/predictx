/**
 * TxLINE SSE Stream Service
 *
 * Handles real-time odds and scores updates via Server-Sent Events.
 * Based on: https://txline.txodds.com/documentation/examples/streaming-data
 */

import { txStream } from './apiClient'
import type { SseMessage } from '@/types/txline'

// ============================================================
// SSE Parsing (from official TxLINE docs)
// ============================================================

function parseSseBlock(block: string): SseMessage | null {
  const message: SseMessage = { data: '' }

  for (const rawLine of block.split(/\r?\n/)) {
    if (!rawLine || rawLine.startsWith(':')) continue

    const separatorIndex = rawLine.indexOf(':')
    const field = separatorIndex === -1 ? rawLine : rawLine.slice(0, separatorIndex)
    const value =
      separatorIndex === -1
        ? ''
        : rawLine.slice(separatorIndex + 1).replace(/^ /, '')

    if (field === 'data') message.data += `${value}\n`
    if (field === 'event') message.event = value
    if (field === 'id') message.id = value
    if (field === 'retry') message.retry = Number(value)
  }

  message.data = message.data.replace(/\n$/, '')
  return message.data || message.event || message.id ? message : null
}

async function* readSseMessages(response: Response): AsyncGenerator<SseMessage> {
  if (!response.body) throw new Error('Stream response has no body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      let separator = buffer.match(/\r?\n\r?\n/)
      while (separator?.index !== undefined) {
        const block = buffer.slice(0, separator.index)
        buffer = buffer.slice(separator.index + separator[0].length)

        const message = parseSseBlock(block)
        if (message) yield message

        separator = buffer.match(/\r?\n\r?\n/)
      }
    }

    buffer += decoder.decode()
    const message = parseSseBlock(buffer)
    if (message) yield message
  } finally {
    reader.releaseLock()
  }
}

function parseSseData(data: string): unknown {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

// ============================================================
// Stream Connections
// ============================================================

export type StreamCallback = (event: string, data: unknown) => void

/**
 * Connect to the odds stream.
 * Returns an AbortController to cancel the stream.
 */
export function connectOddsStream(
  onMessage: StreamCallback,
  onError?: (error: Error) => void,
): AbortController {
  const controller = new AbortController()

  ;(async () => {
    try {
      const response = await txStream('/odds/stream')

      for await (const message of readSseMessages(response)) {
        if (controller.signal.aborted) break
        const event = message.event ?? 'message'
        const data = parseSseData(message.data)
        onMessage(event, data)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        onError?.(err instanceof Error ? err : new Error(String(err)))
      }
    }
  })()

  return controller
}

/**
 * Connect to the scores stream.
 * Returns an AbortController to cancel the stream.
 */
export function connectScoresStream(
  onMessage: StreamCallback,
  onError?: (error: Error) => void,
): AbortController {
  const controller = new AbortController()

  ;(async () => {
    try {
      const response = await txStream('/scores/stream')

      for await (const message of readSseMessages(response)) {
        if (controller.signal.aborted) break
        const event = message.event ?? 'message'
        const data = parseSseData(message.data)
        onMessage(event, data)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        onError?.(err instanceof Error ? err : new Error(String(err)))
      }
    }
  })()

  return controller
}

/**
 * Connect to both streams with auto-reconnect.
 * Returns a cleanup function.
 */
export function connectAllStreams(
  onOdds: StreamCallback,
  onScores: StreamCallback,
  onError?: (error: Error) => void,
): () => void {
  let oddsController = connectOddsStream(onOdds, (err) => {
    onError?.(err)
    // Auto-reconnect after 5 seconds
    setTimeout(() => {
      if (!oddsController.signal.aborted) {
        oddsController = connectOddsStream(onOdds, onError)
      }
    }, 5000)
  })

  let scoresController = connectScoresStream(onScores, (err) => {
    onError?.(err)
    // Auto-reconnect after 5 seconds
    setTimeout(() => {
      if (!scoresController.signal.aborted) {
        scoresController = connectScoresStream(onScores, onError)
      }
    }, 5000)
  })

  return () => {
    oddsController.abort()
    scoresController.abort()
  }
}
