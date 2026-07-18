import { useState, useEffect } from 'react'

type AppState = {
  walletConnected: boolean
  walletAddress: string | null
  visionMode: 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  uiScale: number
}

let state: AppState = {
  walletConnected: false,
  walletAddress: null,
  visionMode: 'default',
  uiScale: 1,
}

const listeners = new Set<(state: AppState) => void>()

export const updateAppState = (updates: Partial<AppState>) => {
  state = { ...state, ...updates }
  listeners.forEach((listener) => listener(state))
}

export default function useAppStore() {
  const [localState, setLocalState] = useState(state)

  useEffect(() => {
    listeners.add(setLocalState)
    return () => {
      listeners.delete(setLocalState)
    }
  }, [])

  return {
    ...localState,
    connectWallet: () => updateAppState({ walletConnected: true, walletAddress: '0x7a3F...e82B' }),
    disconnectWallet: () => updateAppState({ walletConnected: false, walletAddress: null }),
    setVisionMode: (mode: AppState['visionMode']) => updateAppState({ visionMode: mode }),
    setUiScale: (scale: number) => updateAppState({ uiScale: scale }),
  }
}
