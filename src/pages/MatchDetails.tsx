import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTxLine } from '@/hooks/use-tx-line'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Info, ArrowLeft, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>()
  const { liveMatch, upcomingMatches, featuredMarkets, loading, allFixtures } = useTxLine()
  const [explainMode, setExplainMode] = useState(false)

  // Find the specific match by id (could be live or upcoming)
  const allMatches = [liveMatch, ...upcomingMatches]
  const match = allMatches.find((m) => m.id === id) ?? liveMatch

  // Only show markets that belong to this fixture
  const matchMarkets = featuredMarkets.filter((m) => m.matchId === id) ?? featuredMarkets

  // Show loading state while data is fetching
  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="mb-2 -ml-4 text-muted-foreground">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </Button>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <Button variant="ghost" asChild className="mb-2 -ml-4 text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </Button>

      {/* Match Header */}
      <div className="glass-panel p-8 text-center bg-gradient-to-t from-background to-secondary/30 border-t-4 border-t-success relative overflow-hidden">
        {match.isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-success/20 text-success rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            LIVE
          </div>
        )}
        <div className="flex justify-center items-center gap-8 mb-6">
          <span className="text-6xl">{match.homeFlag}</span>
          <span className="text-6xl">{match.awayFlag}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {match.homeTeam} vs {match.awayTeam}
        </h1>
        <p className="text-5xl font-mono mb-2 font-bold">{match.score}</p>
        <p className={match.isLive ? 'text-success font-semibold' : 'text-muted-foreground font-semibold'}>
          {match.time}
        </p>
      </div>

      {/* Markets */}
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
                Odds are dynamically calculated based on on-chain liquidity. Settlement triggers
                automatically when TxLINE API broadcasts a signed event with the match final state,
                fully verifiable via Merkle Proofs on Solana.{' '}
                <strong>No manual intervention possible.</strong>
              </AlertDescription>
            </Alert>
          )}

          <TabsContent
            value="all"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
          >
            {matchMarkets.length === 0 ? (
              /* Empty state when no markets for this fixture */
              <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin opacity-40" />
                <p className="text-sm">Loading markets for this fixture...</p>
              </div>
            ) : (
              matchMarkets.map((market) => (
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
              ))
            )}
          </TabsContent>

          <TabsContent value="goals" className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {matchMarkets
              .filter((m) => m.title.toLowerCase().includes('goal') || m.title.toLowerCase().includes('over'))
              .map((market) => (
                <div
                  key={market.id}
                  className="p-6 rounded-2xl bg-secondary/20 border border-white/5"
                >
                  <h3 className="font-semibold mb-4">{market.title}</h3>
                  <div className="space-y-3">
                    {market.options.map((opt) => (
                      <Button
                        key={opt.label}
                        variant="outline"
                        className="w-full justify-between h-auto py-3 bg-background/50 border-white/5 hover:bg-primary/10"
                      >
                        <span>{opt.label}</span>
                        <span className="font-mono font-bold">{opt.odds.toFixed(2)}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="corners" className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {matchMarkets
              .filter((m) => m.title.toLowerCase().includes('corner'))
              .map((market) => (
                <div
                  key={market.id}
                  className="p-6 rounded-2xl bg-secondary/20 border border-white/5"
                >
                  <h3 className="font-semibold mb-4">{market.title}</h3>
                  <div className="space-y-3">
                    {market.options.map((opt) => (
                      <Button
                        key={opt.label}
                        variant="outline"
                        className="w-full justify-between h-auto py-3 bg-background/50 border-white/5 hover:bg-primary/10"
                      >
                        <span>{opt.label}</span>
                        <span className="font-mono font-bold">{opt.odds.toFixed(2)}</span>
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
