import { RecentSettlements } from '@/components/dashboard/RecentSettlements'

export default function History() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Settlement History</h1>
      <p className="text-muted-foreground mb-8">Full cryptographic log of past settlements.</p>
      <RecentSettlements />
    </div>
  )
}
