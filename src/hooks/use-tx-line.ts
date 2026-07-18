export type Match = {
  id: string
  homeTeam: string
  awayTeam: string
  homeFlag: string
  awayFlag: string
  score: string
  time: string
  isLive: boolean
}

export type Market = {
  id: string
  matchId: string
  titleKey: string
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
}

export function useTxLine() {
  const liveMatch: Match = {
    id: 'm1',
    homeTeam: 'Brazil',
    awayTeam: 'Japan',
    homeFlag: '🇧🇷',
    awayFlag: '🇯🇵',
    score: '2 - 1',
    time: "90+5'",
    isLive: true,
  }

  const upcomingMatches: Match[] = [
    {
      id: 'm2',
      homeTeam: 'France',
      awayTeam: 'Argentina',
      homeFlag: '🇫🇷',
      awayFlag: '🇦🇷',
      score: '0 - 0',
      time: 'Today • 16:00',
      isLive: false,
    },
    {
      id: 'm3',
      homeTeam: 'Germany',
      awayTeam: 'Spain',
      homeFlag: '🇩🇪',
      awayFlag: '🇪🇸',
      score: '0 - 0',
      time: 'Today • 19:00',
      isLive: false,
    },
  ]

  const featuredMarkets: Market[] = [
    {
      id: 'mk1',
      matchId: 'm1',
      titleKey: 'markets.matchWinner',
      options: [
        { label: 'Brazil', odds: 1.25, probability: 78 },
        { label: 'Draw', odds: 5.4, probability: 15 },
        { label: 'Japan', odds: 9.2, probability: 7 },
      ],
      volume: 125430,
      isLive: true,
    },
    {
      id: 'mk2',
      matchId: 'm1',
      titleKey: 'markets.overUnderGoals',
      options: [
        { label: 'over.2.5', odds: 1.68, probability: 62 },
        { label: 'under.2.5', odds: 2.15, probability: 38 },
      ],
      volume: 98210,
      isLive: true,
    },
    {
      id: 'mk3',
      matchId: 'm1',
      titleKey: 'markets.firstGoal',
      options: [
        { label: 'Brazil', odds: 1.85, probability: 55 },
        { label: 'Japan', odds: 2.35, probability: 38 },
        { label: 'none', odds: 15.0, probability: 15 },
      ],
      volume: 45330,
      isLive: true,
    },
    {
      id: 'mk4',
      matchId: 'm1',
      titleKey: 'markets.totalCorners',
      options: [
        { label: 'over.9.5', odds: 1.9, probability: 53 },
        { label: 'under.9.5', odds: 1.9, probability: 47 },
      ],
      volume: 32660,
      isLive: true,
    },
  ]

  const recentSettlements: Settlement[] = [
    {
      id: 's1',
      matchName: 'Brazil vs Japan',
      marketName: 'Over 2.5 Goals',
      marketType: 'Over25',
      status: 'WINNER',
      payout: 18.75,
      minutesAgo: 2,
    },
    {
      id: 's2',
      matchName: 'Portugal vs Morocco',
      marketName: 'Match Winner',
      marketType: 'MatchWinner',
      status: 'WINNER',
      payout: 12.4,
      minutesAgo: 15,
    },
    {
      id: 's3',
      matchName: 'England vs Senegal',
      marketName: 'First Goal',
      marketType: 'FirstGoal',
      status: 'LOSER',
      payout: -10.0,
      minutesAgo: 28,
    },
  ]

  return { liveMatch, upcomingMatches, featuredMarkets, recentSettlements }
}
