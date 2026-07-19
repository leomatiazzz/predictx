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
    ? `Liquidação Verificada — ${receipt.matchName}`
    : `Verified Settlement — ${receipt.matchName}`

  const summary = isPt
    ? `O resultado de "${receipt.eventDescription}" foi verificado criptograficamente usando Merkle Proofs ancorados na blockchain Solana. ${receipt.proofNodes} nós de prova foram validados com sucesso.`
    : `The result "${receipt.eventDescription}" has been cryptographically verified using Merkle Proofs anchored on the Solana blockchain. ${receipt.proofNodes} proof nodes were successfully validated.`

  const steps: ExplainableStep[] = [
    {
      icon: '📡',
      title: isPt ? 'Dados Coletados' : 'Data Collected',
      description: isPt
        ? `Os dados do jogo ${receipt.matchName} foram coletados em tempo real pela TxLINE API.`
        : `Game data for ${receipt.matchName} was collected in real-time by the TxLINE API.`,
      technicalDetail: `Fixture ID: ${receipt.fixtureId}, Stat Key: ${receipt.statKey}`,
    },
    {
      icon: '🌳',
      title: isPt ? 'Árvore de Merkle Construída' : 'Merkle Tree Built',
      description: isPt
        ? `Uma árvore de Merkle foi construída a partir de todos os eventos do jogo. A raiz desta árvore é um hash único que representa todos os dados.`
        : `A Merkle tree was built from all game events. The root of this tree is a unique hash representing all the data.`,
      technicalDetail: `Root: ${receipt.merkleRoot}`,
    },
    {
      icon: '⛓️',
      title: isPt ? 'Raiz Ancorada na Solana' : 'Root Anchored on Solana',
      description: isPt
        ? `A raiz da Merkle Tree foi registrada no programa TxLINE na blockchain Solana. Isso torna os dados imutáveis e verificáveis publicamente.`
        : `The Merkle tree root was recorded on the TxLINE program on the Solana blockchain. This makes the data immutable and publicly verifiable.`,
      technicalDetail: `TX: ${receipt.txSignature}`,
    },
    {
      icon: '✅',
      title: isPt ? 'Prova Verificada' : 'Proof Verified',
      description: isPt
        ? `Usando ${receipt.proofNodes} nós de prova, confirmamos que "${receipt.eventDescription}" está incluído na árvore e corresponde à raiz on-chain.`
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

  if (diffMin < 1) return isPt ? 'agora' : 'just now'
  if (diffMin < 60) return isPt ? `${diffMin}m atrás` : `${diffMin}m ago`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return isPt ? `${diffHours}h atrás` : `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return isPt ? `${diffDays}d atrás` : `${diffDays}d ago`
}
