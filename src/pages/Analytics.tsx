import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', volume: 12000, active: 450 },
  { name: 'Tue', volume: 18000, active: 520 },
  { name: 'Wed', volume: 15000, active: 480 },
  { name: 'Thu', volume: 22000, active: 610 },
  { name: 'Fri', volume: 28000, active: 750 },
  { name: 'Sat', volume: 35000, active: 920 },
  { name: 'Sun', volume: 42000, active: 1100 },
]

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform transparency and usage metrics.</p>

      <div className="glass-panel p-6 md:p-8 h-[500px]">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          Total Trading Volume (7D)
          <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-md font-mono">
            +14.2%
          </span>
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={{ volume: { label: 'Volume (USDC)', color: 'hsl(var(--primary))' } }}
            className="h-full w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-volume)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-volume)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="currentColor"
                strokeOpacity={0.5}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                stroke="currentColor"
                strokeOpacity={0.5}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="var(--color-volume)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVol)"
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
