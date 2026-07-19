import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import type { AuthStatus } from '@/types/txline'

type AppState = {
  /** TxLINE auth status */
  authStatus: AuthStatus
  authError: string | null
  guestJwt: string | null
  apiToken: string | null
  /** Accessibility */
  visionMode: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  uiScale: number
  /** SOL balance (in SOL, not lamports) */
  solBalance: number | null
}

let state: AppState = {
  authStatus: 'idle',
  authError: null,
  guestJwt: null,
  apiToken: null,
  visionMode: 'default',
  uiScale: 1,
  solBalance: null,
}

const listeners = new Set<(state: AppState) => void>()

export const updateAppState = (updates: Partial<AppState>) => {
  state = { ...state, ...updates }
  listeners.forEach((listener) => listener(state))
}

const setVisionMode = (mode: AppState['visionMode']) => updateAppState({ visionMode: mode })
const setUiScale = (scale: number) => updateAppState({ uiScale: scale })
const setAuthStatus = (status: AuthStatus) => updateAppState({ authStatus: status })
const setAuthError = (error: string | null) => updateAppState({ authError: error })
const setCredentials = (jwt: string, token: string) =>
  updateAppState({ guestJwt: jwt, apiToken: token, authStatus: 'ready', authError: null })
const clearCredentials = () =>
  updateAppState({ guestJwt: null, apiToken: null, authStatus: 'idle', authError: null })

/**
 * Hook that combines the custom app state with Solana wallet-adapter state.
 *
 * - `walletConnected` / `walletAddress` are now derived from the real wallet
 * - `connectWallet()` opens the Solana wallet modal (Phantom/Solflare)
 * - `disconnectWallet()` disconnects the real wallet
 * - SOL balance is fetched automatically when wallet connects
 */
export default function useAppStore() {
  const [localState, setLocalState] = useState(state)
  const wallet = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    listeners.add(setLocalState)
    return () => {
      listeners.delete(setLocalState)
    }
  }, [])

  // Fetch SOL balance when wallet connects
  useEffect(() => {
    if (wallet.publicKey && connection) {
      connection
        .getBalance(wallet.publicKey)
        .then((lamports) => {
          updateAppState({ solBalance: lamports / LAMPORTS_PER_SOL })
        })
        .catch(() => {
          updateAppState({ solBalance: null })
        })
    } else {
      updateAppState({ solBalance: null })
    }
  }, [wallet.publicKey, connection])

  const walletAddress = wallet.publicKey?.toBase58() ?? null

  return {
    ...localState,
    // Wallet state (real, from Solana adapter)
    walletConnected: wallet.connected,
    walletAddress,
    walletPublicKey: wallet.publicKey,
    walletConnecting: wallet.connecting,
    signMessage: wallet.signMessage,
    signTransaction: wallet.signTransaction,
    // Wallet actions
    connectWallet: () => setVisible(true),
    disconnectWallet: () => wallet.disconnect(),
    // App state actions
    setVisionMode,
    setUiScale,
    setAuthStatus,
    setAuthError,
    setCredentials,
    clearCredentials,
  }
}
