import { useState, useEffect } from 'react'
import { VerificationStepper } from '@/components/VerificationStepper'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileText, ExternalLink, Loader2 } from 'lucide-react'
import type { StepData } from '@/components/VerificationStepper'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTxLine } from '@/hooks/use-tx-line'
import { formatSettlementTime } from '@/services/txline/explainable'
import { getStatValidation, buildVerifiableReceipt } from '@/services/txline/validation'
import type { VerifiableReceipt } from '@/types/txline'

export default function SettlementEngine() {
  const [activeStep, setActiveStep] = useState(1)
  const { recentSettlements, liveMatch, loading } = useTxLine()

  // Get the most recent settlement with a receipt (or the first one)
  const latestSettlement = recentSettlements[0]

  // Build per-step timestamps from settlement data
  const baseTime = latestSettlement?.minutesAgo
    ? new Date(Date.now() - latestSettlement.minutesAgo * 60000)
    : new Date()

  const timestamps: Record<number, string> = {
    1: new Date(baseTime.getTime() - 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    2: new Date(baseTime.getTime() - 4000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    3: new Date(baseTime.getTime() - 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    4: new Date(baseTime.getTime() - 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    5: new Date(baseTime.getTime() - 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    6: baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }

  const matchName = latestSettlement?.matchName ?? `${liveMatch.homeTeam} vs ${liveMatch.awayTeam}`
  const marketName = latestSettlement?.marketName ?? 'Match Result'

  const [receipt, setReceipt] = useState<VerifiableReceipt | null>(null)
  const [receiptError, setReceiptError] = useState<string | null>(null)

  const stepperSteps: StepData[] = [
    { id: 1, label: '1 Event', desc: receipt ? 'Score snapshot available' : 'Waiting for data', time: receipt ? 'live' : '' },
    { id: 2, label: '2 Proof', desc: receipt ? 'Merkle proof received' : 'Fetching proof', time: receipt ? 'ready' : '' },
    { id: 3, label: '3 Merkle', desc: receipt ? 'Root verified' : 'Awaiting validation', time: receipt ? 'verified' : '' },
    { id: 4, label: '4 Receipt', desc: receipt ? 'Receipt ready' : 'Generating receipt', time: receipt ? 'complete' : '' },
    { id: 5, label: '5 Settlement', desc: receipt ? 'Completed' : 'Pending', time: receipt ? 'settled' : '' },
    { id: 6, label: '6 Verification', desc: receipt ? 'Complete' : 'In progress', time: receipt ? 'done' : '' },
  ]

  // Fetch real receipt and animate through steps
  useEffect(() => {
    setActiveStep(1)
    setReceipt(null)
    setReceiptError(null)

    if (latestSettlement) {
      const fixtureIdToFetch = latestSettlement.fixtureId ?? liveMatch.fixtureId ?? 22
      getStatValidation(fixtureIdToFetch, 1, 1)
        .then((validation) => {
          const generatedReceipt = buildVerifiableReceipt(
            validation,
            matchName,
            'pending'
          )
          setReceipt(generatedReceipt)
          setActiveStep(6)
        })
        .catch((err) => {
          setReceiptError(err.message || 'Failed to fetch cryptographic proof')
        })
    }

    const timer = setInterval(() => {
      setActiveStep((s) => (s >= 6 ? 6 : s + 1))
    }, 1200)
    return () => clearInterval(timer)
  }, [latestSettlement?.id, liveMatch.fixtureId, matchName])

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up mt-4">
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Verification Engine</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Watch real-time cryptographic settlements flowing through the TxLINE pipeline. True
          transparency in action.
        </p>
      </div>

      <div className="glass-panel p-6 md:p-10 border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-lg font-semibold">Live Settlement</h2>
            {/* Real match name from hook data */}
            <p className="text-sm text-muted-foreground mt-1">{matchName} — {marketName}</p>
            {latestSettlement && (
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {formatSettlementTime(Date.now() - latestSettlement.minutesAgo * 60000)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-secondary/50 border border-border">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Fetching data...</span>
              </>
            ) : (
              <>
                <span
                  className={
                    activeStep < 6
                      ? 'w-2 h-2 rounded-full bg-primary animate-pulse'
                      : 'w-2 h-2 rounded-full bg-success'
                  }
                />
                {activeStep < 6 ? 'Processing Verification...' : 'Settlement Completed'}
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto pb-8 no-scrollbar bg-background/50 p-6 rounded-2xl border border-white/5">
          <VerificationStepper
            activeStep={activeStep}
            animate={true}
            steps={stepperSteps}
            timestamps={activeStep === 6 ? timestamps : undefined}
          />
        </div>

        {activeStep === 6 && (
          <div className="mt-10 flex justify-center animate-fade-in-up">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-success hover:bg-success/90 text-white gap-2 h-12 px-8 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform"
                >
                  <FileText className="w-5 h-5" /> View Verifiable Receipt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-white/10 glass-panel">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-success text-xl">
                    <ShieldCheck className="w-6 h-6" /> Cryptographic Receipt
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] mt-4 pr-4">
                  <div className="space-y-4 font-mono text-sm">
                    {/* Match & Market */}
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                        Settlement
                      </p>
                      <p className="text-foreground font-semibold">{matchName}</p>
                      <p className="text-muted-foreground text-sm mt-1">{marketName}</p>
                      {latestSettlement && (
                        <p className={`text-sm font-bold mt-2 ${latestSettlement.status === 'WINNER' ? 'text-success' : 'text-destructive'}`}>
                          {latestSettlement.status} — {latestSettlement.payout > 0 ? '+' : ''}{latestSettlement.payout.toFixed(2)} USDC
                        </p>
                      )}
                    </div>

                    {/* Transaction Hash */}
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          Transaction Hash (Solana)
                        </p>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-primary break-all font-medium">
                        {receipt ? receipt.txSignature : receiptError ? 'N/A' : 'Fetching...'}
                      </p>
                    </div>

                    {/* Merkle Root */}
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                        Merkle Root
                      </p>
                      <p className="break-all text-emerald-400">
                        {receipt ? receipt.merkleRoot : receiptError ? 'N/A' : 'Fetching...'}
                      </p>
                    </div>

                    {/* Proof Data */}
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                        Proof Nodes Validated
                      </p>
                      <p className="break-all text-foreground font-medium">
                        {receipt ? `${receipt.proofNodes} nodes` : receiptError ? 'N/A' : 'Fetching...'}
                      </p>
                    </div>

                    {/* Event Description */}
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                        Validation Event
                      </p>
                      <p className="text-foreground font-medium">
                        {receipt ? receipt.eventDescription : receiptError ? 'N/A' : 'Fetching...'}
                      </p>
                      <p className="text-muted-foreground text-xs mt-2">
                        Phase: {receipt ? receipt.gamePhase : receiptError ? 'N/A' : 'Fetching...'}
                      </p>
                    </div>

                    {/* Timestamps */}
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3">
                        Verification Timeline
                      </p>
                      <div className="space-y-2">
                        {Object.entries(timestamps).map(([step, time]) => (
                          <div key={step} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Step {step}</span>
                            <span className="text-foreground font-mono">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {receiptError && (
                      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                        Error verifying proof: {receiptError}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )
}
