/**
 * TxLINE Network Configuration
 *
 * All URLs, program IDs, and network-specific values.
 * Mirrors the official docs table:
 * https://txline.txodds.com/documentation/quickstart
 */

export type TxLineNetwork = 'mainnet' | 'devnet'

export interface TxLineNetworkConfig {
  network: TxLineNetwork
  rpcUrl: string
  apiOrigin: string
  programId: string
  txlTokenMint: string
  guestAuthUrl: string
  apiBaseUrl: string
}

const CONFIGS: Record<TxLineNetwork, TxLineNetworkConfig> = {
  mainnet: {
    network: 'mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    apiOrigin: 'https://txline.txodds.com',
    programId: '9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA',
    txlTokenMint: 'Zhw9TVKp68a1QrftncMSd6ELXKDtpVMNuMGr1jNwdeL',
    guestAuthUrl: 'https://txline.txodds.com/auth/guest/start',
    apiBaseUrl: 'https://txline.txodds.com/api',
  },
  devnet: {
    network: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    apiOrigin: 'https://txline-dev.txodds.com',
    programId: '6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J',
    txlTokenMint: '4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG',
    guestAuthUrl: 'https://txline-dev.txodds.com/auth/guest/start',
    apiBaseUrl: 'https://txline-dev.txodds.com/api',
  },
}

/**
 * Reads network from VITE_TXLINE_NETWORK env var, defaults to 'devnet'.
 */
export function getNetwork(): TxLineNetwork {
  const env = import.meta.env.VITE_TXLINE_NETWORK as string | undefined
  if (env === 'mainnet') return 'mainnet'
  return 'devnet'
}

/**
 * Returns the full config for the active network.
 */
export function getConfig(): TxLineNetworkConfig {
  return CONFIGS[getNetwork()]
}

/**
 * Service level for subscription (free tiers).
 * Devnet: 1 (samplingIntervalSec = 0, real-time)
 * Mainnet: 1 (60s delay) or 12 (real-time)
 */
export const FREE_SERVICE_LEVEL = 1

/**
 * Subscription duration in weeks.
 */
export const SUBSCRIPTION_DURATION_WEEKS = 4
