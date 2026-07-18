import { Link } from 'react-router-dom'
import { VerificationStepper } from '@/components/VerificationStepper'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

export function ReplaySection() {
  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase">
          Replay da Liquidação
        </h3>
        <span className="text-xs text-muted-foreground">Mais recente</span>
      </div>
      <div className="py-4 overflow-x-auto no-scrollbar">
        <VerificationStepper activeStep={6} animate={false} />
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 flex items-center gap-2"
        >
          <Link to="/settlement">
            Assistir Replay Completo <Play className="w-4 h-4 fill-current ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
