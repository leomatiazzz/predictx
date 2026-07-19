/**
 * TxLINE Odds Service
 *
 * Fetches odds snapshots and normalizes them into market structures.
 */

import { txGet } from './apiClient'
import type { TxLineOddsEntry, NormalizedMarket, NormalizedMarketOption } from '@/types/txline'

/**
 * Get odds snapshot for a specific fixture.
 */
export async function getOddsSnapshot(fixtureId: number): Promise<TxLineOddsEntry[]> {
  return txGet<TxLineOddsEntry[]>(`/odds/snapshot/${fixtureId}`)
}

/**
 * Get odds updates for a specific time period.
 */
export async function getOddsUpdates(
  epochDay: number,
  hourOfDay: number,
  interval: number,
): Promise<TxLineOddsEntry[]> {
  return txGet<TxLineOddsEntry[]>(`/odds/updates/${epochDay}/${hourOfDay}/${interval}`)
}

/**
 * Normalize a TxLINE odds entry into a market structure for the UI.
 */
export function normalizeOddsToMarket(
  entry: TxLineOddsEntry,
  fixtureId: number,
  homeTeam: string,
  awayTeam: string,
): NormalizedMarket {
  const marketType = entry.MarketType ?? entry.marketType ?? 'Match Result'
  const oddsValues = entry.Odds ?? entry.odds ?? []

  const options: NormalizedMarketOption[] = oddsValues.map((odds) => {
    const label = odds.Label ?? odds.label ?? 'Unknown'
    const value = odds.Value ?? odds.value ?? 0
    const probability = odds.Probability ?? odds.probability ?? (value > 0 ? 1 / value : 0)

    // Replace generic labels with actual team names
    const displayLabel = label
      .replace(/Participant\s*1/i, homeTeam)
      .replace(/Participant\s*2/i, awayTeam)
      .replace(/^1$/, homeTeam)
      .replace(/^2$/, awayTeam)
      .replace(/^X$/, 'Draw')

    return {
      label: displayLabel,
      odds: value,
      probability: Math.round(probability * 100) / 100,
    }
  })

  // Generate a human-readable title
  const title = marketType === 'Match Result'
    ? `${homeTeam} vs ${awayTeam}`
    : `${marketType} — ${homeTeam} vs ${awayTeam}`

  return {
    id: `${fixtureId}-${marketType}`,
    fixtureId,
    title,
    marketType,
    options,
    volume: 0, // TxLINE doesn't provide volume; can be derived later
    isLive: false, // Will be set based on fixture state
  }
}
