import { useState, useEffect } from 'react'
import { VerificationStepper } from '@/components/VerificationStepper'
import { Button } from '@/components/ui/button'
import { ShieldCheck, FileText, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function SettlementEngine() {
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s >= 6 ? 6 : s + 1))
    }, 1200)
    return () => clearInterval(timer)
  }, [])

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
            <p className="text-sm text-muted-foreground font-mono mt-1">Tx: 0x9a7b...4c21</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-secondary/50 border border-border">
            <span
              className={
                activeStep < 6
                  ? 'w-2 h-2 rounded-full bg-primary animate-pulse'
                  : 'w-2 h-2 rounded-full bg-success'
              }
            />
            {activeStep < 6 ? 'Processing Verification...' : 'Settlement Completed'}
          </div>
        </div>

        <div className="overflow-x-auto pb-8 no-scrollbar bg-background/50 p-6 rounded-2xl border border-white/5">
          <VerificationStepper activeStep={activeStep} animate={true} />
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
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">
                          Transaction Hash (Solana)
                        </p>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-primary break-all font-medium">
                        5Wj8XzWkyy9q3aM1vBwLKjZ8P9gXmN7TqRc5vF4
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                        Merkle Root
                      </p>
                      <p className="break-all text-emerald-400">
                        0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-background border border-white/5">
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                        TxLINE Signature payload
                      </p>
                      <p className="break-all text-xs text-muted-foreground leading-relaxed">
                        3044022012a9e3d922a84e3e602738b52f6f4c39050d2db8cfbc8f9b90c91834213794dc02207a6a4d7d13b7f2f1837c3db3dc8d12384a22b3952f4477fcb39a48f4989b6a93
                      </p>
                    </div>
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
