/**
 * TxLINE Fixtures Service
 *
 * Fetches fixture data from TxLINE API and normalizes it
 * for consumption by UI components.
 */

import { txGet } from './apiClient'
import type { TxLineFixture, NormalizedFixture } from '@/types/txline'
import { SOCCER_PHASES } from '@/types/txline'

/**
 * Get all fixtures (or filtered by competition).
 * For the World Cup Hackathon free tier, we MUST request competitionId 72
 * otherwise the TxLINE API will return 403 Forbidden.
 */
export async function getFixtures(competitionId: number = 72): Promise<TxLineFixture[]> {
  const params = { competitionId, startEpochDay: 20624 }
  return txGet<TxLineFixture[]>('/fixtures/snapshot', params)
}

/**
 * Get a single fixture by ID from the full snapshot.
 */
export async function getFixtureById(fixtureId: number): Promise<TxLineFixture | null> {
  const fixtures = await getFixtures()
  return fixtures.find((f) => f.FixtureId === fixtureId) ?? null
}

/**
 * Determine if a game phase represents a live match.
 */
function isLivePhase(gameState: number): boolean {
  return [
    SOCCER_PHASES.H1,
    SOCCER_PHASES.HT,
    SOCCER_PHASES.H2,
    SOCCER_PHASES.WET,
    SOCCER_PHASES.ET1,
    SOCCER_PHASES.HTET,
    SOCCER_PHASES.ET2,
    SOCCER_PHASES.WPE,
    SOCCER_PHASES.PE,
  ].includes(gameState)
}

/**
 * Determine if a game phase represents a finished match.
 */
function isFinishedPhase(gameState: number): boolean {
  return [
    SOCCER_PHASES.F,
    SOCCER_PHASES.FET,
    SOCCER_PHASES.FPE,
    SOCCER_PHASES.A,
    SOCCER_PHASES.C,
  ].includes(gameState)
}

/**
 * Normalize a TxLINE fixture for internal use.
 */
export function normalizeFixture(fixture: TxLineFixture): NormalizedFixture {
  const gameState = fixture.GameState ?? fixture.gameState ?? 1
  const startTime = new Date(fixture.StartTime)
  const now = new Date()

  return {
    id: String(fixture.FixtureId),
    fixtureId: fixture.FixtureId,
    homeTeam: fixture.Participant1IsHome ? fixture.Participant1 : fixture.Participant2,
    awayTeam: fixture.Participant1IsHome ? fixture.Participant2 : fixture.Participant1,
    startTime,
    competitionId: fixture.CompetitionId,
    competitionName: fixture.CompetitionName ?? 'FIFA World Cup 2026',
    gameState,
    isLive: isLivePhase(gameState),
    isFinished: isFinishedPhase(gameState),
    isUpcoming: gameState === SOCCER_PHASES.NS && startTime > now,
  }
}

/**
 * Fetch and normalize all fixtures.
 */
export async function getNormalizedFixtures(): Promise<NormalizedFixture[]> {
  const fixtures = await getFixtures()
  return fixtures.map(normalizeFixture)
}
