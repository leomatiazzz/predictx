/**
 * TxLINE Services — Barrel Export
 */

export { getConfig, getNetwork } from './config'
export type { TxLineNetwork, TxLineNetworkConfig } from './config'

export {
  txGet,
  txPost,
  txStream,
  setCredentials,
  getCredentials,
  clearCredentials,
  isAuthenticated,
} from './apiClient'

export {
  getGuestJwt,
  activateApiToken,
  fullAuthFlow,
  usePreActivatedCredentials,
} from './auth'

export {
  getFixtures,
  getFixtureById,
  getNormalizedFixtures,
  normalizeFixture,
} from './fixtures'

export {
  getOddsSnapshot,
  getOddsUpdates,
  normalizeOddsToMarket,
} from './odds'

export {
  getScoresSnapshot,
  getScoresUpdates,
  getHistoricalScores,
  getLatestScore,
  normalizeScore,
} from './scores'

export {
  connectOddsStream,
  connectScoresStream,
  connectAllStreams,
} from './stream'

export {
  getStatValidation,
  getStatValidationV2,
  buildVerifiableReceipt,
  generateVerificationSteps,
} from './validation'

export {
  explainSettlement,
  formatSettlementTime,
} from './explainable'
