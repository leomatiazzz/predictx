/**
 * useTxLine — Central data hook for TxLINE integration
 *
 * This hook replaces the hardcoded mock data with real API calls.
 * It maintains the SAME return types that existing components expect
 * (adapter pattern) so no component changes are needed for basic rendering.
 *
 * Data flow:
 *   1. Check if authenticated (credentials in apiClient)
 *   2. If yes → fetch real data from TxLINE API
 *   3. If no  → return fallback mock data (graceful degradation)
 */

import { useState, useEffect, useCallback } from 'react'
import { isAuthenticated } from '@/services/txline/apiClient'
import { fullAuthFlow } from '@/services/txline/auth'
import { getNormalizedFixtures } from '@/services/txline/fixtures'
import { getOddsSnapshot, normalizeOddsToMarket } from '@/services/txline/odds'
import { getLatestScore, normalizeScore } from '@/services/txline/scores'
import { connectAllStreams } from '@/services/txline/stream'
import type { NormalizedFixture, TxLineOddsEntry, TxLineScoreEntry } from '@/types/txline'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import useAppStore from '@/stores/main'

// ============================================================
// Types (kept for backward compatibility with existing components)
// ============================================================

export type Match = {
  id: string
  homeTeam: string
  awayTeam: string
  homeFlag: string
  awayFlag: string
  score: string
  time: string
  isLive: boolean
  /** Real fixture ID from TxLINE */
  fixtureId?: number
}

export type Market = {
  id: string
  matchId: string
  title: string
  titleKey?: string
  options: { label: string; odds: number; probability: number }[]
  volume: number
  isLive: boolean
}

export type Settlement = {
  id: string
  fixtureId?: number
  matchName: string
  marketName: string
  marketType: 'Over25' | 'MatchWinner' | 'FirstGoal'
  status: 'WINNER' | 'LOSER'
  payout: number
  minutesAgo: number
  timeAgo?: string
}

// ============================================================
// Country flag mapping (emoji flags for World Cup teams)
// ============================================================

const TEAM_FLAGS: Record<string, string> = {
  'Brazil': '🇧🇷', 'Argentina': '🇦🇷', 'France': '🇫🇷', 'Germany': '🇩🇪',
  'Spain': '🇪🇸', 'England': '🇬🇧', 'Portugal': '🇵🇹', 'Netherlands': '🇳🇱',
  'Italy': '🇮🇹', 'Belgium': '🇧🇪', 'Croatia': '🇭🇷', 'Uruguay': '🇺🇾',
  'Colombia': '🇨🇴', 'Mexico': '🇲🇽', 'USA': '🇺🇸', 'Canada': '🇨🇦',
  'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦', 'Iran': '🇮🇷', 'Morocco': '🇲🇦', 'Senegal': '🇸🇳',
  'Ghana': '🇬🇭', 'Cameroon': '🇨🇲', 'Nigeria': '🇳🇬', 'Tunisia': '🇹🇳',
  'Egypt': '🇪🇬', 'Poland': '🇵🇱', 'Denmark': '🇩🇰', 'Switzerland': '🇨🇭',
  'Serbia': '🇷🇸', 'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'Chile': '🇨🇱',
  'Paraguay': '🇵🇾', 'Ecuador': '🇪🇨', 'Peru': '🇵🇪', 'Venezuela': '🇻🇪',
  'Costa Rica': '🇨🇷', 'Panama': '🇵🇦', 'Honduras': '🇭🇳', 'Jamaica': '🇯🇲',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Ireland': '🇮🇪',
  'Czech Republic': '🇨🇿', 'Austria': '🇦🇹', 'Turkey': '🇹🇷', 'Russia': '🇷🇺',
  'Ukraine': '🇺🇦', 'Romania': '🇷🇴', 'Hungary': '🇭🇺', 'Greece': '🇬🇷',
  'Algeria': '🇩🇿', 'Ivory Coast': '🇨🇮', 'Mali': '🇲🇱', 'South Africa': '🇿🇦',
  'China': '🇨🇳', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Thailand': '🇹🇭',
  'Vietnam': '🇻🇳', 'Philippines': '🇵🇭', 'New Zealand': '🇳🇿',
  'Bolivia': '🇧🇴', 'Guatemala': '🇬🇹', 'El Salvador': '🇸🇻',
  'Trinidad and Tobago': '🇹🇹', 'Haiti': '🇭🇹', 'Cuba': '🇨🇺',
}

function getFlag(team: string): string {
  return TEAM_FLAGS[team] ?? '🏳️'
}

// ============================================================
// Fixture → Match adapter
// ============================================================

function fixtureToMatch(fixture: NormalizedFixture, score?: { home: number; away: number }): Match {
  const now = new Date()
  let timeDisplay: string

  if (fixture.isLive) {
    timeDisplay = 'LIVE'
  } else if (fixture.isFinished) {
    timeDisplay = 'FT'
  } else {
    const diff = fixture.startTime.getTime() - now.getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 24 && fixture.startTime.getDate() === now.getDate()) {
      timeDisplay = `Today • ${fixture.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else {
      timeDisplay = fixture.startTime.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }

  return {
    id: fixture.id,
    homeTeam: fixture.homeTeam,
    awayTeam: fixture.awayTeam,
    homeFlag: getFlag(fixture.homeTeam),
    awayFlag: getFlag(fixture.awayTeam),
    score: score ? `${score.home} - ${score.away}` : '0 - 0',
    time: timeDisplay,
    isLive: fixture.isLive,
    fixtureId: fixture.fixtureId,
  }
}

// ============================================================
// Empty state (no fabricated fixtures/markets)
// ============================================================

const EMPTY_MATCH: Match = {
  id: '',
  homeTeam: '',
  awayTeam: '',
  homeFlag: '',
  awayFlag: '',
  score: '',
  time: '',
  isLive: false,
}

// ============================================================
// Main hook
// ============================================================

export function useTxLine() {
  const [liveMatch, setLiveMatch] = useState<Match>(EMPTY_MATCH)
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [featuredMarkets, setFeaturedMarkets] = useState<Market[]>([])
  const [recentSettlements] = useState<Settlement[]>([])
  const [allFixtures, setAllFixtures] = useState<NormalizedFixture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const wallet = useWallet()
  const { connection } = useConnection()
  const { setAuthStatus, setAuthError } = useAppStore()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsFallback(false)
    setIsConnected(false)
    setLiveMatch(EMPTY_MATCH)
    setUpcomingMatches([])
    setFeaturedMarkets([])
    setAllFixtures([])

    try {
      if (!isAuthenticated()) {
        if (!wallet.connected || !wallet.publicKey || !wallet.signMessage) {
          setError('Connect your wallet to fetch live predictions data.')
          setLoading(false)
          return
        }

        try {
          await fullAuthFlow(
            wallet,
            connection,
            wallet.signMessage,
            (status) => setAuthStatus(status as any),
          )
        } catch (authErr) {
          console.warn('TxLINE Auth failed:', authErr)
          const errorMsg = authErr instanceof Error ? authErr.message : 'Failed to authenticate'
          setAuthError(errorMsg)
          setError(errorMsg)
          setLoading(false)
          return
        }
      }

      const fixtures = await getNormalizedFixtures()
      setAllFixtures(fixtures)

      const live = fixtures.filter((f) => f.isLive)
      const upcoming = fixtures.filter((f) => f.isUpcoming).slice(0, 5)

      if (live.length > 0) {
        const firstLive = live[0]
        const score = await getLatestScore(firstLive.fixtureId)
        setLiveMatch(
          fixtureToMatch(firstLive, score ? { home: score.homeGoals, away: score.awayGoals } : undefined),
        )
      }

      if (upcoming.length > 0) {
        setUpcomingMatches(upcoming.map((f) => fixtureToMatch(f)))
      }

      if (live.length > 0) {
        try {
          const odds = await getOddsSnapshot(live[0].fixtureId)
          const markets = odds.map((o) =>
            normalizeOddsToMarket(o, live[0].fixtureId, live[0].homeTeam, live[0].awayTeam),
          )
          if (markets.length > 0) {
            setFeaturedMarkets(
              markets.map((m) => ({
                id: m.id,
                matchId: String(m.fixtureId),
                title: m.title,
                options: m.options,
                volume: m.volume,
                isLive: m.isLive,
              })),
            )
          }
        } catch {
          setFeaturedMarkets([])
        }
      }

      setIsConnected(true)
    } catch (err) {
      console.error('TxLINE fetch failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [wallet.connected, wallet.publicKey, wallet.signMessage, connection, setAuthStatus, setAuthError])

  // Fetch on mount and when auth changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Connect to SSE streams for real-time updates once the initial snapshot has loaded
  useEffect(() => {
    if (!isConnected) return

    const cleanup = connectAllStreams(
      (event, data) => {
        const entries = (Array.isArray(data) ? data : [data]) as TxLineOddsEntry[]
        setFeaturedMarkets((prevMarkets) => {
          let updated = [...prevMarkets]
          let hasChanges = false

          entries.forEach((entry) => {
            const fixtureId = entry.fixtureId ?? entry.FixtureId
            const marketType = entry.marketType ?? entry.MarketType ?? 'Match Result'

            if (!fixtureId || !marketType || !entry.odds?.length) return

            const marketIndex = updated.findIndex((m) => {
              return m.matchId === String(fixtureId) || m.title.includes(marketType)
            })

            if (marketIndex >= 0) {
              const currentMarket = updated[marketIndex]
              const segments = currentMarket.title.includes(' — ')
                ? currentMarket.title.split(' — ')[1]?.split(' vs ') ?? []
                : []
              const [homeTeam, awayTeam] = segments
              const normalized = normalizeOddsToMarket(entry, fixtureId, homeTeam ?? 'Home', awayTeam ?? 'Away')

              updated[marketIndex] = {
                ...currentMarket,
                title: normalized.title || currentMarket.title,
                options: normalized.options,
                isLive: true,
              }
              hasChanges = true
            }
          })

          return hasChanges ? updated : prevMarkets
        })
      },
      (event, data) => {
        const entries = (Array.isArray(data) ? data : [data]) as TxLineScoreEntry[]

        entries.forEach((entry) => {
          const normalizedScore = normalizeScore(entry)

          // Update live match score if it matches
          setLiveMatch((prev) => {
            if (prev.fixtureId === normalizedScore.fixtureId) {
              return {
                ...prev,
                score: `${normalizedScore.homeGoals} - ${normalizedScore.awayGoals}`,
                time: normalizedScore.gamePhaseName === 'Finished' ? 'FT' : 'LIVE',
                isLive: normalizedScore.gamePhaseName !== 'Finished',
              }
            }
            return prev
          })
        })
      },
    )

    return cleanup
  }, [isConnected])

  return {
    liveMatch,
    upcomingMatches,
    featuredMarkets,
    recentSettlements,
    allFixtures,
    loading,
    error,
    isFallback,
    isConnected,
    refetch: fetchData,
  }
}
