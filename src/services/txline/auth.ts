/**
 * TxLINE Authentication Service
 *
 * Implements the full auth flow:
 * 1. Get Guest JWT (POST /auth/guest/start)
 * 2. Subscribe on-chain (Solana program.methods.subscribe)
 * 3. Sign activation message with wallet
 * 4. Activate API token (POST /api/token/activate)
 *
 * Based on: https://txline.txodds.com/documentation/worldcup
 */

import { getConfig, FREE_SERVICE_LEVEL, SUBSCRIPTION_DURATION_WEEKS } from './config'
import { setCredentials, setJwtRefreshHandler } from './apiClient'
import type { GuestAuthResponse, TxLineCredentials } from '@/types/txline'

/**
 * Step 1: Get a guest JWT from TxLINE.
 * No auth required — this is the bootstrap call.
 */
export async function getGuestJwt(): Promise<string> {
  const config = getConfig()
  const response = await fetch(config.guestAuthUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Guest auth failed: ${response.status} ${response.statusText}`)
  }

  const data: GuestAuthResponse = await response.json()
  return data.token
}

/**
 * Step 2: Subscribe on-chain (Free World Cup Tier).
 *
 * This requires @coral-xyz/anchor and @solana/spl-token.
 * For the hackathon MVP, we provide a simplified version that
 * can be bypassed with a pre-activated token (Plan B).
 *
 * Returns the transaction signature.
 */
export async function subscribeOnChain(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallet: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: any,
): Promise<string> {
  // Dynamic import to avoid bundling Anchor when not needed
  const anchor = await import('@coral-xyz/anchor')
  const {
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
  } = await import('@solana/spl-token')
  const { PublicKey, SystemProgram, Transaction } = await import('@solana/web3.js')

  const config = getConfig()
  const programId = new PublicKey(config.programId)
  const txlTokenMint = new PublicKey(config.txlTokenMint)

  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })
  anchor.setProvider(provider)

  // Load the official IDL from the checked-in artifact first, then fall back to the remote source.
  const idlCandidates = [
    new URL('./txoracle.json', import.meta.url).href,
    'https://raw.githubusercontent.com/txodds/tx-on-chain/main/examples/devnet/idl/txoracle.json',
  ]

  let idl: Record<string, unknown> | null = null
  for (const idlUrl of idlCandidates) {
    try {
      const idlResponse = await fetch(idlUrl)
      if (idlResponse.ok) {
        idl = await idlResponse.json()
        break
      }
    } catch {
      // Try the next candidate.
    }
  }

  if (!idl) {
    throw new Error('Failed to load TxLINE IDL from the local artifact or remote source.')
  }

  const program = new anchor.Program(idl as any, provider)

  const [tokenTreasuryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('token_treasury_v2')],
    programId,
  )

  const tokenTreasuryVault = getAssociatedTokenAddressSync(
    txlTokenMint,
    tokenTreasuryPda,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  const [pricingMatrixPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('pricing_matrix')],
    programId,
  )

  const userTokenAccount = getAssociatedTokenAddressSync(
    txlTokenMint,
    wallet.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  const tx = new Transaction()

  // Create the ATA if it doesn't exist
  const accountInfo = await connection.getAccountInfo(userTokenAccount)
  if (!accountInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        userTokenAccount,
        wallet.publicKey,
        txlTokenMint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      )
    )
  }

  const subscribeIx = await program.methods
    .subscribe(FREE_SERVICE_LEVEL, SUBSCRIPTION_DURATION_WEEKS)
    .accounts({
      user: wallet.publicKey,
      pricingMatrix: pricingMatrixPda,
      tokenMint: txlTokenMint,
      userTokenAccount,
      tokenTreasuryVault,
      tokenTreasuryPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .instruction()

  tx.add(subscribeIx)

  const latestBlockhash = await connection.getLatestBlockhash('confirmed')
  tx.recentBlockhash = latestBlockhash.blockhash
  tx.feePayer = wallet.publicKey

  const txSig = await provider.sendAndConfirm(tx)

  return txSig
}

/**
 * Step 3: Activate API token after on-chain subscription.
 *
 * Signs message `${txSig}::${jwt}` with wallet and POSTs to /api/token/activate.
 */
export async function activateApiToken(
  txSig: string,
  jwt: string,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
): Promise<string> {
  const config = getConfig()

  // Build the message to sign: `${txSig}::${jwt}` (empty leagues = double colon)
  const messageString = `${txSig}::${jwt}`
  const message = new TextEncoder().encode(messageString)

  // Sign with wallet
  const signatureBytes = await signMessage(message)
  const walletSignature = btoa(String.fromCharCode(...signatureBytes))

  // Activate
  const response = await fetch(`${config.apiBaseUrl}/token/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      txSig,
      walletSignature,
      leagues: [],
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      `Activation failed: ${response.status} — ${body.message || body.error || response.statusText}`,
    )
  }

  const data = await response.json()
  return data.token || data
}

/**
 * Full auth flow: JWT → Subscribe → Activate → Store credentials.
 *
 * Returns the credentials object ready for API calls.
 */
export async function fullAuthFlow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallet: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: any,
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  onStatusChange?: (status: string) => void,
): Promise<TxLineCredentials> {
  onStatusChange?.('connecting')

  // Step 1: Get guest JWT
  const jwt = await getGuestJwt()
  onStatusChange?.('subscribing')

  // Step 2: Subscribe on-chain
  const txSig = await subscribeOnChain(wallet, connection)
  onStatusChange?.('activating')

  // Step 3: Activate API token
  const apiToken = await activateApiToken(txSig, jwt, signMessage)

  // Store credentials in the API client
  const credentials: TxLineCredentials = { guestJwt: jwt, apiToken }
  setCredentials(credentials)

  // Set up JWT refresh handler
  setJwtRefreshHandler(getGuestJwt)

  onStatusChange?.('ready')
  return credentials
}

/**
 * Plan B: Use pre-activated credentials from environment variables.
 * Useful when on-chain subscription has already been done via CLI.
 */
export function usePreActivatedCredentials(): TxLineCredentials | null {
  const jwt = import.meta.env.VITE_TXLINE_JWT as string | undefined
  const token = import.meta.env.VITE_TXLINE_API_TOKEN as string | undefined

  if (jwt && token) {
    const credentials: TxLineCredentials = { guestJwt: jwt, apiToken: token }
    setCredentials(credentials)
    setJwtRefreshHandler(getGuestJwt)
    return credentials
  }
  return null
}
