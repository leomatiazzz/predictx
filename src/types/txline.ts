/**
 * TxLINE API — TypeScript Type Definitions
 *
 * Derived from the official TxLINE documentation:
 * - https://txline.txodds.com/documentation/quickstart
 * - https://txline.txodds.com/documentation/examples/fetching-snapshots
 * - https://txline.txodds.com/documentation/examples/streaming-data
 * - https://txline.txodds.com/documentation/examples/onchain-validation
 * - https://txline.txodds.com/documentation/scores/soccer-feed
 */

// ============================================================
// Auth
// ============================================================

/** Response from POST /auth/guest/start */
export interface GuestAuthResponse {
  token: string
}

/** Response from POST /api/token/activate */
export interface ActivateTokenResponse {
  token: string
}

/** Auth credentials stored in the app */
export interface TxLineCredentials {
  guestJwt: string
  apiToken: string
  expiresAt?: number
}

export type AuthStatus = 'idle' | 'connecting' | 'subscribing' | 'activating' | 'ready' | 'error'

// ============================================================
// Fixtures
// ============================================================

/** Response item from GET /api/fixtures/snapshot */
export interface TxLineFixture {
  FixtureId: number
  Participant1: string
  Participant2: string
  Participant1IsHome: boolean
  StartTime: string // ISO 8601 timestamp
  CompetitionId: number
  CompetitionName?: string
  GameState?: number // 1 = scheduled, 6 = cancelled
  gameState?: number // alternative casing from API
}

/** Normalized fixture for internal use */
export interface NormalizedFixture {
  id: string
  fixtureId: number
  homeTeam: string
  awayTeam: string
  startTime: Date
  competitionId: number
  competitionName: string
  gameState: number
  isLive: boolean
  isFinished: boolean
  isUpcoming: boolean
}

// ============================================================
// Odds
// ============================================================

/** Response item from GET /api/odds/snapshot/:fixtureId */
export interface TxLineOddsEntry {
  FixtureId?: number
  fixtureId?: number
  MarketType?: string
  marketType?: string
  Odds?: TxLineOddsValue[]
  odds?: TxLineOddsValue[]
  Timestamp?: string
  timestamp?: string
}

export interface TxLineOddsValue {
  Label?: string
  label?: string
  Value?: number
  value?: number
  Probability?: number
  probability?: number
}

/** Normalized market derived from TxLINE odds */
export interface NormalizedMarket {
  id: string
  fixtureId: number
  title: string
  marketType: string
  options: NormalizedMarketOption[]
  volume: number
  isLive: boolean
}

export interface NormalizedMarketOption {
  label: string
  odds: number
  probability: number
}

// ============================================================
// Scores
// ============================================================

/** Response item from GET /api/scores/snapshot/:fixtureId */
export interface TxLineScoreEntry {
  FixtureId?: number
  fixtureId?: number
  Seq?: number
  seq?: number
  Timestamp?: string
  ts?: number
  GameState?: number
  gameState?: number
  StatusId?: number
  statusId?: number
  Period?: number
  period?: number
  Action?: string
  action?: string
  Stats?: Record<string, number>
  stats?: Record<string, number>
  Data?: Record<string, unknown>
  data?: Record<string, unknown>
}

/**
 * Soccer Game Phase Encoding (from Soccer Feed docs)
 * Used for interpreting gameState / statusId
 */
export const SOCCER_PHASES = {
  NS: 1,    // Not started
  H1: 2,    // First half in play
  HT: 3,    // Halftime
  H2: 4,    // Second half in play
  F: 5,     // Ended (finished)
  WET: 6,   // Waiting for Extra Time
  ET1: 7,   // Extra Time first half
  HTET: 8,  // Extra Time halftime
  ET2: 9,   // Extra Time second half
  FET: 10,  // Ended after Extra Time
  WPE: 11,  // Waiting for Penalty Shootout
  PE: 12,   // Penalty Shootout in progress
  FPE: 13,  // Ended after Penalty Shootout
  I: 14,    // Interrupted
  A: 15,    // Abandoned
  C: 16,    // Cancelled
  TXCC: 17, // TX Coverage Cancelled
  TXCS: 18, // TX Coverage Suspended
  P: 19,    // Postponed
} as const

export const SOCCER_PHASE_LABELS: Record<number, string> = {
  1: 'Not Started',
  2: '1st Half',
  3: 'Halftime',
  4: '2nd Half',
  5: 'Finished',
  6: 'Awaiting Extra Time',
  7: 'Extra Time 1st Half',
  8: 'Extra Time Halftime',
  9: 'Extra Time 2nd Half',
  10: 'Finished (AET)',
  11: 'Awaiting Penalties',
  12: 'Penalty Shootout',
  13: 'Finished (Pen)',
  14: 'Interrupted',
  15: 'Abandoned',
  16: 'Cancelled',
  17: 'Coverage Cancelled',
  18: 'Coverage Suspended',
  19: 'Postponed',
}

/**
 * Soccer Stat Keys (from Soccer Feed docs)
 *
 * Full Game (prefix 0):
 *   1 = P1 Total Goals, 2 = P2 Total Goals
 *   3 = P1 Total Yellow Cards, 4 = P2 Total Yellow Cards
 *   5 = P1 Total Red Cards, 6 = P2 Total Red Cards
 *   7 = P1 Total Corners, 8 = P2 Total Corners
 *
 * Period prefixes: 1000=H1, 2000=HT, 3000=H2, 4000=ET1, 5000=ET2, 6000=PE, 7000=ETTotal
 */
export const STAT_KEYS = {
  P1_TOTAL_GOALS: 1,
  P2_TOTAL_GOALS: 2,
  P1_TOTAL_YELLOW_CARDS: 3,
  P2_TOTAL_YELLOW_CARDS: 4,
  P1_TOTAL_RED_CARDS: 5,
  P2_TOTAL_RED_CARDS: 6,
  P1_TOTAL_CORNERS: 7,
  P2_TOTAL_CORNERS: 8,
  P1_H1_GOALS: 1001,
  P2_H1_GOALS: 1002,
  P1_H2_GOALS: 3001,
  P2_H2_GOALS: 3002,
} as const

/** Normalized score for the UI */
export interface NormalizedScore {
  fixtureId: number
  seq: number
  timestamp: number
  gamePhase: number
  gamePhaseName: string
  homeGoals: number
  awayGoals: number
  homeCorners: number
  awayCorners: number
  homeYellowCards: number
  awayYellowCards: number
  homeRedCards: number
  awayRedCards: number
  action?: string
}

// ============================================================
// Validation / Proofs
// ============================================================

/** Response from GET /api/scores/stat-validation */
export interface TxLineValidation {
  summary: {
    fixtureId: number
    updateStats: {
      updateCount: number
      minTimestamp: number
      maxTimestamp: number
    }
    eventStatsSubTreeRoot: string
  }
  subTreeProof: ProofNode[]
  mainTreeProof: ProofNode[]
  statToProve: {
    key: number
    value: number
  }
  statToProve2?: {
    key: number
    value: number
  }
  eventStatRoot: string
  statProof: ProofNode[]
  statProof2?: ProofNode[]
  // V2 multi-stat fields
  statsToProve?: Array<{ key: number; value: number }>
  statProofs?: ProofNode[][]
}

export interface ProofNode {
  hash: string | number[] | Uint8Array
  isRightSibling: boolean
}

/** Verifiable Receipt (normalized for the UI) */
export interface VerifiableReceipt {
  fixtureId: number
  matchName: string
  timestamp: number
  eventDescription: string
  merkleRoot: string
  txSignature: string
  proofNodes: number
  validationStatus: 'valid' | 'invalid' | 'pending'
  statKey: number
  statValue: number
  gamePhase: string
}

// ============================================================
// Settlement
// ============================================================

export type SettlementStatus = 'WINNER' | 'LOSER' | 'PUSH' | 'PENDING'

export interface NormalizedSettlement {
  id: string
  fixtureId: number
  matchName: string
  marketName: string
  marketType: string
  status: SettlementStatus
  payout: number
  timestamp: number
  timeAgo: string
  receipt?: VerifiableReceipt
}

// ============================================================
// SSE Stream
// ============================================================

export interface SseMessage {
  id?: string
  event?: string
  data: string
  retry?: number
}

// ============================================================
// Verification Stepper
// ============================================================

export interface VerificationStep {
  id: number
  label: string
  description: string
  timestamp?: string
  status: 'pending' | 'active' | 'completed' | 'error'
}

// ============================================================
// API Error
// ============================================================

export interface TxLineApiError {
  status: number
  message: string
  code?: string
}
