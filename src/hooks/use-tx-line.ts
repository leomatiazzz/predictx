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
import { isAuthenticated, setCredentials } from '@/services/txline/apiClient'
import { getGuestJwt, fullAuthFlow } from '@/services/txline/auth'
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
// Fallback mock data (for when API is not authenticated)
// ============================================================

const MOCK_LIVE_MATCH: Match = {
  id: 'm1',
  homeTeam: 'Brazil',
  awayTeam: 'Japan',
  homeFlag: '🇧🇷',
  awayFlag: '🇯🇵',
  score: '2 - 1',
  time: "90+5'",
  isLive: true,
}

const MOCK_UPCOMING: Match[] = [
  { id: 'm2', homeTeam: 'France', awayTeam: 'Argentina', homeFlag: '🇫🇷', awayFlag: '🇦🇷', score: '0 - 0', time: 'Today • 16:00', isLive: false },
  { id: 'm3', homeTeam: 'Germany', awayTeam: 'Spain', homeFlag: '🇩🇪', awayFlag: '🇪🇸', score: '0 - 0', time: 'Today • 19:00', isLive: false },
]

const MOCK_MARKETS: Market[] = [
  { id: 'mk1', matchId: 'm1', title: 'Match Winner — Brazil vs Japan', titleKey: 'markets.matchWinner', options: [{ label: 'Brazil', odds: 1.25, probability: 78 }, { label: 'Draw', odds: 5.4, probability: 15 }, { label: 'Japan', odds: 9.2, probability: 7 }], volume: 125430, isLive: true },
  { id: 'mk2', matchId: 'm1', title: 'Over/Under 2.5 Goals', titleKey: 'markets.overUnderGoals', options: [{ label: 'Over 2.5', odds: 1.68, probability: 62 }, { label: 'Under 2.5', odds: 2.15, probability: 38 }], volume: 98210, isLive: true },
  { id: 'mk3', matchId: 'm1', title: 'First Goal — Brazil vs Japan', titleKey: 'markets.firstGoal', options: [{ label: 'Brazil', odds: 1.85, probability: 55 }, { label: 'Japan', odds: 2.35, probability: 38 }, { label: 'No Goal', odds: 15.0, probability: 7 }], volume: 45330, isLive: true },
  { id: 'mk4', matchId: 'm1', title: 'Total Corners', titleKey: 'markets.totalCorners', options: [{ label: 'Over 9.5', odds: 1.9, probability: 53 }, { label: 'Under 9.5', odds: 1.9, probability: 47 }], volume: 32660, isLive: true },
]

const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 's1', matchName: 'Brazil vs Japan', marketName: 'Over 2.5 Goals', marketType: 'Over25', status: 'WINNER', payout: 18.75, minutesAgo: 2, timeAgo: '2m ago' },
  { id: 's2', matchName: 'Portugal vs Morocco', marketName: 'Match Winner', marketType: 'MatchWinner', status: 'WINNER', payout: 12.4, minutesAgo: 15, timeAgo: '15m ago' },
  { id: 's3', matchName: 'England vs Senegal', marketName: 'First Goal', marketType: 'FirstGoal', status: 'LOSER', payout: -10.0, minutesAgo: 28, timeAgo: '28m ago' },
]

// ============================================================
// Main hook
// ============================================================

export function useTxLine() {
  const [liveMatch, setLiveMatch] = useState<Match>(MOCK_LIVE_MATCH)
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>(MOCK_UPCOMING)
  const [featuredMarkets, setFeaturedMarkets] = useState<Market[]>(MOCK_MARKETS)
  const [recentSettlements] = useState<Settlement[]>(MOCK_SETTLEMENTS)
  const [allFixtures, setAllFixtures] = useState<NormalizedFixture[]>([])
  const [loading, setLoading] = useState(false)
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

    try {
      if (!isAuthenticated()) {
        if (!wallet.connected || !wallet.publicKey || !wallet.signMessage) {
          setIsFallback(true)
          setLoading(false)
          return
        }

        try {
          await fullAuthFlow(
            wallet,
            connection,
            wallet.signMessage,
            (status) => setAuthStatus(status as any)
          )
        } catch (authErr) {
          console.warn('TxLINE Auth failed, using fallback mocks', authErr)
          setAuthError(authErr instanceof Error ? authErr.message : 'Failed to authenticate')
          setIsFallback(true)
          setLoading(false)
          return
        }
      }
      // Fetch all fixtures
      const fixtures = await getNormalizedFixtures()
      setAllFixtures(fixtures)

      // Find live matches
      const live = fixtures.filter((f) => f.isLive)
      const upcoming = fixtures.filter((f) => f.isUpcoming).slice(0, 5)

      // Fetch scores for live matches
      if (live.length > 0) {
        const firstLive = live[0]
        const score = await getLatestScore(firstLive.fixtureId)
        setLiveMatch(
          fixtureToMatch(firstLive, score ? { home: score.homeGoals, away: score.awayGoals } : undefined),
        )
      }

      // Map upcoming fixtures to Match type
      if (upcoming.length > 0) {
        setUpcomingMatches(upcoming.map((f) => fixtureToMatch(f)))
      }

      // Fetch odds for the first live fixture to build markets
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
          // Odds may not be available for all fixtures
        }
      }
      
      setIsConnected(true)
    } catch (err) {
      console.warn('TxLINE fetch failed, using fallback mocks', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setIsFallback(true)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }, [wallet.connected, wallet.publicKey, wallet.signMessage, connection, setAuthStatus, setAuthError])

  // Fetch on mount and when auth changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Connect to SSE streams for real-time updates
  useEffect(() => {
    if (!isConnected) return

    const cleanup = connectAllStreams(
      (event, data) => {
        const entries = (Array.isArray(data) ? data : [data]) as TxLineOddsEntry[]
        setFeaturedMarkets((prevMarkets) => {
          let updated = [...prevMarkets]
          let hasChanges = false

          entries.forEach((entry) => {
            if (!entry.fixtureId || !entry.marketType || !entry.odds) return
            
            const marketIndex = updated.findIndex(
              (m) => m.matchId === String(entry.fixtureId) && m.title.includes(entry.marketType as string)
            )

            if (marketIndex >= 0) {
              const currentMarket = updated[marketIndex]
              const normalized = normalizeOddsToMarket(
                entry,
                entry.fixtureId,
                currentMarket.title.split(' — ')[1]?.split(' vs ')[0] ?? 'Home',
                currentMarket.title.split(' — ')[1]?.split(' vs ')[1] ?? 'Away'
              )
              
              updated[marketIndex] = {
                ...currentMarket,
                options: normalized.options,
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
      }
    )

    return cleanup
  }, [])

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
