import { LiveMatch } from '@/components/dashboard/LiveMatch'
import { FeaturedMarkets } from '@/components/dashboard/FeaturedMarkets'
import { ReplaySection } from '@/components/dashboard/ReplaySection'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { RecentSettlements } from '@/components/dashboard/RecentSettlements'
import { UpcomingMatches } from '@/components/dashboard/UpcomingMatches'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function VerificationBanner() {
  return (
    <div className="glass-panel p-6 bg-gradient-to-br from-primary/30 to-background border-primary/30 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 pr-12">Every settlement is verifiable.</h3>
        <p className="text-primary-foreground/80 mb-6 font-medium">Don't Trust. Verify.</p>
        <Button
          variant="secondary"
          asChild
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <Link to="/verification">Learn Verification</Link>
        </Button>
      </div>
      <ShieldCheck className="absolute -right-4 -bottom-4 w-40 h-40 text-primary opacity-20 group-hover:scale-110 transition-transform duration-700 rotate-12" />
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      <div className="col-span-1 lg:col-span-8 space-y-6">
        <LiveMatch />
        <FeaturedMarkets />
        <ReplaySection />
        <StatsRow />
      </div>
      <div className="col-span-1 lg:col-span-4 space-y-6">
        <UpcomingMatches />
        <VerificationBanner />
        <RecentSettlements />
      </div>
    </div>
  )
}
