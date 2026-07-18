import useAppStore from '@/stores/main'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Accessibility as AccIcon } from 'lucide-react'

export default function Accessibility() {
  const { visionMode, setVisionMode, uiScale, setUiScale } = useAppStore()

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in mt-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <AccIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Accessibility Center</h1>
          <p className="text-muted-foreground">Customize your ProofLens experience.</p>
        </div>
      </div>

      <div className="glass-panel p-8 space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-6 flex items-center justify-between">
            Vision Simulation Modes
            <Badge variant="outline" className="font-normal text-xs">
              Live Preview
            </Badge>
          </h3>
          <RadioGroup
            value={visionMode}
            onValueChange={(val: any) => setVisionMode(val)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {['default', 'protanopia', 'deuteranopia', 'tritanopia'].map((mode) => (
              <div
                key={mode}
                className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${visionMode === mode ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-secondary/20'}`}
              >
                <RadioGroupItem value={mode} id={mode} />
                <Label htmlFor={mode} className="flex-1 cursor-pointer capitalize font-medium">
                  {mode === 'default' ? 'Default Vision' : `${mode} Mode`}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="mt-6 p-4 rounded-xl bg-background border border-border/50 flex gap-4">
            <div className="flex-1 text-center p-3 rounded bg-success/20 text-success font-bold">
              Success Indicator
            </div>
            <div className="flex-1 text-center p-3 rounded bg-danger/20 text-danger font-bold">
              Danger Indicator
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <h3 className="text-lg font-medium mb-6">UI Scaling ({Math.round(uiScale * 100)}%)</h3>
          <Slider
            value={[uiScale]}
            min={0.8}
            max={1.5}
            step={0.1}
            onValueChange={(val) => setUiScale(val[0])}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Adjust the global interface size. Elements will scale proportionally using root REM
            adjustments, ensuring layouts remain perfectly intact.
          </p>
        </div>
      </div>
    </div>
  )
}
