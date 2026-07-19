/**
 * TxLINE Scores Service
 *
 * Fetches score snapshots and normalizes them.
 */

import { txGet } from './apiClient'
import type { TxLineScoreEntry, NormalizedScore } from '@/types/txline'
import { SOCCER_PHASE_LABELS, STAT_KEYS } from '@/types/txline'

/**
 * Get scores snapshot for a specific fixture.
 */
export async function getScoresSnapshot(fixtureId: number): Promise<TxLineScoreEntry[]> {
  return txGet<TxLineScoreEntry[]>(`/scores/snapshot/${fixtureId}`)
}

/**
 * Get live scores updates for a fixture.
 */
export async function getScoresUpdates(fixtureId: number): Promise<TxLineScoreEntry[]> {
  return txGet<TxLineScoreEntry[]>(`/scores/updates/${fixtureId}`)
}

/**
 * Get historical scores for a completed fixture.
 * Only available for fixtures that started between 2 weeks and 6 hours ago.
 */
export async function getHistoricalScores(fixtureId: number): Promise<TxLineScoreEntry[]> {
  return txGet<TxLineScoreEntry[]>(`/scores/historical/${fixtureId}`)
}

/**
 * Get scores for a specific time period.
 */
export async function getScoresByPeriod(
  epochDay: number,
  hourOfDay: number,
  interval: number,
): Promise<TxLineScoreEntry[]> {
  return txGet<TxLineScoreEntry[]>(`/scores/updates/${epochDay}/${hourOfDay}/${interval}`)
}

/**
 * Extract a stat value from a score entry, handling both casings.
 */
function getStatValue(entry: TxLineScoreEntry, key: number): number {
  const stats = entry.Stats ?? entry.stats ?? {}
  return stats[String(key)] ?? 0
}

/**
 * Normalize a TxLINE score entry for the UI.
 */
export function normalizeScore(entry: TxLineScoreEntry): NormalizedScore {
  const gamePhase = entry.GameState ?? entry.gameState ?? 1
  const seq = entry.Seq ?? entry.seq ?? 0
  const timestamp = entry.ts ?? (entry.Timestamp ? new Date(entry.Timestamp).getTime() : Date.now())

  return {
    fixtureId: entry.FixtureId ?? entry.fixtureId ?? 0,
    seq,
    timestamp,
    gamePhase,
    gamePhaseName: SOCCER_PHASE_LABELS[gamePhase] ?? 'Unknown',
    homeGoals: getStatValue(entry, STAT_KEYS.P1_TOTAL_GOALS),
    awayGoals: getStatValue(entry, STAT_KEYS.P2_TOTAL_GOALS),
    homeCorners: getStatValue(entry, STAT_KEYS.P1_TOTAL_CORNERS),
    awayCorners: getStatValue(entry, STAT_KEYS.P2_TOTAL_CORNERS),
    homeYellowCards: getStatValue(entry, STAT_KEYS.P1_TOTAL_YELLOW_CARDS),
    awayYellowCards: getStatValue(entry, STAT_KEYS.P2_TOTAL_YELLOW_CARDS),
    homeRedCards: getStatValue(entry, STAT_KEYS.P1_TOTAL_RED_CARDS),
    awayRedCards: getStatValue(entry, STAT_KEYS.P2_TOTAL_RED_CARDS),
    action: entry.Action ?? entry.action,
  }
}

/**
 * Get the latest score for a fixture (last entry in snapshot).
 */
export async function getLatestScore(fixtureId: number): Promise<NormalizedScore | null> {
  try {
    const scores = await getScoresSnapshot(fixtureId)
    if (scores.length === 0) return null
    return normalizeScore(scores[scores.length - 1])
  } catch {
    return null
  }
}
