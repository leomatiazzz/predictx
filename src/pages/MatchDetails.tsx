import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTxLine } from '@/hooks/use-tx-line'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Info, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function MatchDetails() {
  const { id } = useParams()
  const { featuredMarkets, liveMatch } = useTxLine()
  const [explainMode, setExplainMode] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <Button variant="ghost" asChild className="mb-2 -ml-4 text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </Button>

      <div className="glass-panel p-8 text-center bg-gradient-to-t from-background to-secondary/30 border-t-4 border-t-success relative overflow-hidden">
        <div className="absolute top-4 right-4 px-3 py-1 bg-success/20 text-success rounded-full text-xs font-bold animate-pulse">
          LIVE
        </div>
        <div className="flex justify-center items-center gap-8 mb-6">
          <span className="text-6xl">{liveMatch.homeFlag}</span>
          <span className="text-6xl">{liveMatch.awayFlag}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {liveMatch.homeTeam} vs {liveMatch.awayTeam}
        </h1>
        <p className="text-5xl font-mono mb-2 font-bold">{liveMatch.score}</p>
        <p className="text-danger font-semibold">{liveMatch.time}</p>
      </div>

      <div className="glass-panel p-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <TabsList className="bg-background border border-white/5">
              <TabsTrigger value="all">All Markets</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="corners">Corners</TabsTrigger>
            </TabsList>
            <Button
              variant={explainMode ? 'default' : 'outline'}
              onClick={() => setExplainMode(!explainMode)}
              className="gap-2 transition-all"
            >
              <Info className="w-4 h-4" /> Proof Assistant
            </Button>
          </div>

          {explainMode && (
            <Alert className="mb-8 bg-primary/10 border-primary/30 animate-fade-in-down">
              <Info className="w-4 h-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Proof Assistant Active</AlertTitle>
              <AlertDescription className="mt-2 text-muted-foreground leading-relaxed">
                Odds are dynamically calculated based on liquidity pools. Settlement triggers
                immediately when TxLINE API broadcasts a signed event containing match final state,
                fully verifiable via Merkle Proofs on Solana.{' '}
                <strong>No manual intervention possible.</strong>
              </AlertDescription>
            </Alert>
          )}

          <TabsContent
            value="all"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
          >
            {featuredMarkets.map((market) => (
              <div
                key={market.id}
                className="p-6 rounded-2xl bg-secondary/20 border border-white/5 hover:border-white/10 transition-colors"
              >
                <h3 className="font-semibold mb-6 text-lg">{market.title}</h3>
                <div className="space-y-3">
                  {market.options.map((opt) => (
                    <Button
                      key={opt.label}
                      variant="outline"
                      className="w-full justify-between h-auto py-4 bg-background/50 hover:bg-primary/20 hover:text-primary transition-all border-white/5 group"
                    >
                      <span className="font-medium">{opt.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground text-xs">{opt.probability}%</span>
                        <span className="font-mono text-lg font-bold group-hover:text-primary">
                          {opt.odds.toFixed(2)}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
