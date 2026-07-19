/**
 * Explainable Settlement — Human-readable explanations
 *
 * Transforms cryptographic proof data (hash, signature, proof, timestamp)
 * into clear, natural language text for users.
 *
 * This is a KEY differentiator of PredictX: making crypto verification
 * accessible to non-technical users.
 */

import type { VerifiableReceipt, TxLineValidation } from '@/types/txline'

export interface ExplainableSettlement {
  title: string
  summary: string
  steps: ExplainableStep[]
  receipt: VerifiableReceipt
}

export interface ExplainableStep {
  icon: string
  title: string
  description: string
  technicalDetail?: string
}

/**
 * Generate a human-readable explanation of a settlement.
 *
 * @param receipt - The verifiable receipt
 * @param validation - The raw validation data (optional, for technical details)
 * @param locale - Language ('en' or 'pt-BR')
 */
export function explainSettlement(
  receipt: VerifiableReceipt,
  validation?: TxLineValidation | null,
  locale: string = 'en',
): ExplainableSettlement {
  const isPt = locale.startsWith('pt')

  const title = isPt
    ? `Verified Settlement — ${receipt.matchName}`
    : `Verified Settlement — ${receipt.matchName}`

  const summary = isPt
    ? `The result "${receipt.eventDescription}" was cryptographically verified using Merkle proofs anchored on the Solana blockchain. ${receipt.proofNodes} proof nodes were validated successfully.`
    : `The result "${receipt.eventDescription}" has been cryptographically verified using Merkle proofs anchored on the Solana blockchain. ${receipt.proofNodes} proof nodes were successfully validated.`

  const steps: ExplainableStep[] = [
    {
      icon: '📡',
      title: isPt ? 'Data Collected' : 'Data Collected',
      description: isPt
        ? `Game data for ${receipt.matchName} was collected in real time by the TxLINE API.`
        : `Game data for ${receipt.matchName} was collected in real time by the TxLINE API.`,
      technicalDetail: `Fixture ID: ${receipt.fixtureId}, Stat Key: ${receipt.statKey}`,
    },
    {
      icon: '🌳',
      title: isPt ? 'Merkle Tree Built' : 'Merkle Tree Built',
      description: isPt
        ? `A Merkle tree was built from all game events. The root of this tree is a unique hash representing all the data.`
        : `A Merkle tree was built from all game events. The root of this tree is a unique hash representing all the data.`,
      technicalDetail: `Root: ${receipt.merkleRoot}`,
    },
    {
      icon: '⛓️',
      title: isPt ? 'Root Anchored on Solana' : 'Root Anchored on Solana',
      description: isPt
        ? `The Merkle tree root was recorded on the TxLINE program on the Solana blockchain. This makes the data immutable and publicly verifiable.`
        : `The Merkle tree root was recorded on the TxLINE program on the Solana blockchain. This makes the data immutable and publicly verifiable.`,
      technicalDetail: `TX: ${receipt.txSignature}`,
    },
    {
      icon: '✅',
      title: isPt ? 'Proof Verified' : 'Proof Verified',
      description: isPt
        ? `Using ${receipt.proofNodes} proof nodes, we confirmed that "${receipt.eventDescription}" is included in the tree and matches the on-chain root.`
        : `Using ${receipt.proofNodes} proof nodes, we confirmed that "${receipt.eventDescription}" is included in the tree and matches the on-chain root.`,
      technicalDetail: `Validation: ${receipt.validationStatus.toUpperCase()}`,
    },
  ]

  return {
    title,
    summary,
    steps,
    receipt,
  }
}

/**
 * Format a timestamp into a human-readable settlement time.
 */
export function formatSettlementTime(timestamp: number, locale: string = 'en'): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  const isPt = locale.startsWith('pt')

  if (diffMin < 1) return isPt ? 'just now' : 'just now'
  if (diffMin < 60) return isPt ? `${diffMin}m ago` : `${diffMin}m ago`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return isPt ? `${diffHours}h ago` : `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return isPt ? `${diffDays}d ago` : `${diffDays}d ago`
}
