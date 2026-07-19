import { Link } from 'react-router-dom'
import { useTxLine } from '@/hooks/use-tx-line'

export function RecentSettlements() {
  const { recentSettlements } = useTxLine()

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase">
          Liquidações Recentes
        </h3>
      </div>
      <div className="space-y-4">
        {recentSettlements.map((settlement) => (
          <div
            key={settlement.id}
            className="flex justify-between items-center pb-4 border-b border-border/50 last:border-0 last:pb-0"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-sm">
                ⚽
              </div>
              <div>
                <p className="text-sm font-medium">{settlement.matchName}</p>
                <p className="text-xs text-muted-foreground">{settlement.marketName}</p>
                <p
                  className={`text-[10px] font-bold mt-1 ${settlement.status === 'WINNER' ? 'text-success' : 'text-danger'}`}
                >
                  {settlement.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Payout</p>
              <p
                className={`text-sm font-bold ${settlement.payout > 0 ? 'text-success' : 'text-danger'}`}
              >
                {settlement.payout > 0 ? '+' : ''}
                {settlement.payout.toFixed(2)} USDC
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{settlement.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 text-center">
        <Link to="/history" className="text-primary text-sm hover:underline">
          Ver histórico completo →
        </Link>
      </div>
    </div>
  )
}
