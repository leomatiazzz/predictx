import { BellRing } from 'lucide-react'

export default function Alerts() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in text-center">
      <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
        <BellRing className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No Active Alerts</h2>
      <p className="text-muted-foreground">You will be notified here when your markets settle.</p>
    </div>
  )
}
