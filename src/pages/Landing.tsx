import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden text-foreground">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 text-center max-w-3xl glass-panel p-10 md:p-16 rounded-3xl animate-fade-in-up border-primary/20 bg-background/50">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 animate-float">
          <ShieldCheck className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Don't Trust.{' '}
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
            Verify.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          The first prediction market where every settlement is cryptographically verifiable. Say
          goodbye to opaque odds and hello to transparent, on-chain execution powered by TxLINE on
          Solana.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg px-8 h-14 rounded-xl">
            <Link to="/">
              Explore Markets <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-lg px-8 h-14 rounded-xl bg-transparent border-white/20 hover:bg-white/5"
          >
            <Link to="/verification">Learn Verification</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
