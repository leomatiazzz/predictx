import { Link } from 'react-router-dom'
import { useTxLine } from '@/hooks/use-tx-line'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export function FeaturedMarkets() {
  const { featuredMarkets, loading, error } = useTxLine()

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="flex justify-between pt-2 border-t border-border/30">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-6 flex items-center gap-3 text-muted-foreground">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
        <span className="text-sm">Could not load markets: {error}</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase">
          Featured Markets
        </h3>
        <Link to="/markets" className="text-primary text-sm hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {featuredMarkets.map((market) => (
          <div
            key={market.id}
            className="glass-panel p-4 flex flex-col justify-between hover:bg-card/80 transition-colors"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-sm truncate pr-2">{market.title}</h4>
                <Badge
                  variant="outline"
                  className="text-success border-success/30 bg-success/10 text-[10px] shrink-0"
                >
                  LIVE
                </Badge>
              </div>
              <div className="space-y-2">
                {market.options.map((opt) => (
                  <div
                    key={opt.label}
                    className="flex justify-between items-center p-2 rounded-lg bg-secondary/30 hover:bg-secondary/70 cursor-pointer transition-colors border border-transparent hover:border-primary/30"
                  >
                    <span className="text-sm text-muted-foreground">{opt.label}</span>
                    <div className="flex gap-3 text-sm">
                      <span className="font-semibold">{opt.odds.toFixed(2)}</span>
                      <span className="text-muted-foreground w-8 text-right text-xs">
                        {opt.probability}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Vol. ${market.volume.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] bg-success/10 text-success border-0 uppercase"
              >
                Auto-settlement ✓
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
