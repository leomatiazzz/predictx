import { UpcomingMatches } from '@/components/dashboard/UpcomingMatches'

export default function Matches() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">All Matches</h1>
      <p className="text-muted-foreground mb-8">Browse and filter upcoming verifiable events.</p>
      <UpcomingMatches />
    </div>
  )
}
