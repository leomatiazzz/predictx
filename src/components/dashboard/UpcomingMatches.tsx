import { Link } from 'react-router-dom'
import { useTxLine } from '@/hooks/use-tx-line'

export function UpcomingMatches() {
  const { upcomingMatches } = useTxLine()

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase">Próximos Jogos</h3>
      </div>
      <div className="space-y-3">
        {upcomingMatches.map((match) => (
          <div
            key={match.id}
            className="p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
          >
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
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link to="/matches" className="text-primary text-sm hover:underline">
          Ver todos os jogos →
        </Link>
      </div>
    </div>
  )
}
