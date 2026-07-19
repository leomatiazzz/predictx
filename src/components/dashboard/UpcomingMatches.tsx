import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useTxLine } from '@/hooks/use-tx-line'

export function UpcomingMatches() {
  const { upcomingMatches, loading, error } = useTxLine()

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-secondary/20">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-3 w-24 mx-auto mt-2" />
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
        <span className="text-sm">Could not load upcoming matches</span>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase">Upcoming Matches</h3>
      </div>
      <div className="space-y-3">
        {upcomingMatches.map((match) => (
          <Link key={match.id} to={`/match/${match.id}`}>
            <div className="p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{match.homeFlag}</span>
                  <span className="text-sm font-medium">{match.homeTeam}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{match.awayTeam}</span>
                  <span className="text-lg">{match.awayFlag}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">{match.time}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link to="/matches" className="text-primary text-sm hover:underline">
          View all matches →
        </Link>
      </div>
    </div>
  )
}
