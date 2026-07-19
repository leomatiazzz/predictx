import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useTxLine } from '@/hooks/use-tx-line'

export function LiveMatch() {
  const { liveMatch, loading, error } = useTxLine()

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex justify-between items-center px-2 md:px-8">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-10 w-24 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-10 h-1.5 w-full rounded-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-6 flex items-center gap-3 text-muted-foreground">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
        <span className="text-sm">Could not load live match: {error}</span>
      </div>
    )
  }

  return (
    <Link to={`/match/${liveMatch.id}`} className="block">
      <div className="glass-panel p-6 hover:bg-card/80 transition-colors cursor-pointer group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase group-hover:text-foreground transition-colors">
            Ao Vivo Agora
          </h3>
          <Badge variant="outline" className="text-success border-success/30 bg-success/10">
            AO VIVO
          </Badge>
        </div>
        <div className="flex justify-between items-center px-2 md:px-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{liveMatch.homeFlag}</span>
            <span className="text-xl md:text-2xl font-bold">{liveMatch.homeTeam}</span>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-mono">{liveMatch.score}</div>
            <div className="text-danger font-semibold mt-1">{liveMatch.time}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl md:text-2xl font-bold">{liveMatch.awayTeam}</span>
            <span className="text-4xl">{liveMatch.awayFlag}</span>
          </div>
        </div>
        <div className="mt-10 relative h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-success rounded-full w-[95%]" />
        </div>
      </div>
    </Link>
  )
}
