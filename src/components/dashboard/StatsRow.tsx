import { ChartContainer } from '@/components/ui/chart'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

function Sparkline({ data, color }: { data: any[]; color: string }) {
  return (
    <ChartContainer config={{ value: { color } }} className="h-10 w-20 opacity-80">
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill="var(--color-value)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function StatsRow() {
  const defaultData = [{ value: 10 }, { value: 15 }, { value: 8 }, { value: 20 }, { value: 25 }]
  const stats = [
    {
      label: 'VOLUME TOTAL',
      value: '$2,450,291',
      change: '+12.4%',
      up: true,
      color: 'hsl(var(--success))',
    },
    {
      label: 'MERCADOS ATIVOS',
      value: '1,248',
      change: '+8.1%',
      up: true,
      color: 'hsl(var(--success))',
    },
    {
      label: 'LIQUIDAÇÕES (24H)',
      value: '532',
      change: '+15.3%',
      up: true,
      color: 'hsl(var(--success))',
    },
    {
      label: 'TEMPO MÉDIO LIQUIDAÇÃO',
      value: '1.8s',
      change: '-22.7%',
      up: false,
      color: 'hsl(var(--danger))',
    },
    {
      label: 'TAXA DE SUCESSO',
      value: '99.71%',
      change: '+0.5%',
      up: true,
      color: 'hsl(var(--success))',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-panel p-4 flex flex-col justify-between">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-2">
            {stat.label}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.up ? 'text-success' : 'text-danger'}`}>
                {stat.change}
              </p>
            </div>
            <Sparkline data={defaultData} color={stat.color} />
          </div>
        </div>
      ))}
    </div>
  )
}
