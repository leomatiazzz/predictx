import { FeaturedMarkets } from '@/components/dashboard/FeaturedMarkets'

export default function Markets() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">All Markets</h1>
      <p className="text-muted-foreground mb-8">
        Discover live prediction markets ready for settlement.
      </p>
      <FeaturedMarkets />
    </div>
  )
}
