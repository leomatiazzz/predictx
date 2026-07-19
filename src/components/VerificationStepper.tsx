import { Check, Hexagon, FileText, Activity, ShieldCheck, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_STEPS = [
  { id: 1, label: '1 Evento', desc: 'Recebido da TxLINE', icon: Activity },
  { id: 2, label: '2 Assinatura', desc: 'Validada', icon: ShieldCheck },
  { id: 3, label: '3 Merkle Proof', desc: 'Calculada', icon: Hexagon },
  { id: 4, label: '4 validate_stat', desc: 'Executado on-chain', icon: Database },
  { id: 5, label: '5 Liquidação', desc: 'Concluída', icon: Check },
  { id: 6, label: '6 Recibo', desc: 'Gerado', icon: FileText },
]

export interface StepData {
  id: number
  label?: string
  desc?: string
  time?: string
}

export function VerificationStepper({
  activeStep = 6,
  animate = false,
  steps: customSteps,
  timestamps,
}: {
  activeStep?: number
  animate?: boolean
  /** Optional override of step metadata */
  steps?: StepData[]
  /** Optional per-step timestamps, indexed by step id */
  timestamps?: Record<number, string>
}) {
  const steps = DEFAULT_STEPS.map((s) => {
    const custom = customSteps?.find((c) => c.id === s.id)
    return {
      ...s,
      label: custom?.label ?? s.label,
      desc: custom?.desc ?? s.desc,
      time: timestamps?.[s.id] ?? custom?.time ?? '',
    }
  })

  return (
    <div className="flex items-start justify-between relative min-w-[600px] px-4 pt-4 pb-2">
      <div className="absolute top-10 left-12 right-12 h-1 bg-secondary -z-10 rounded-full overflow-hidden">
        <div
          className="h-full bg-success transition-all duration-1000 ease-in-out"
          style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {steps.map((step) => {
        const isCompleted = step.id <= activeStep
        const isActive = step.id === activeStep
        const Icon = step.icon

        return (
          <div key={step.id} className="flex flex-col items-center w-24 text-center">
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 bg-card transition-colors duration-500',
                isCompleted
                  ? 'border-success text-success'
                  : 'border-secondary text-muted-foreground',
                isActive && animate ? 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background' : '',
                animate && isCompleted ? 'animate-slide-down' : '',
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold whitespace-nowrap text-foreground">{step.label}</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{step.desc}</p>
            {step.time && (
              <p className="text-[10px] font-mono text-muted-foreground mt-1">{step.time}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
