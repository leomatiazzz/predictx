import { Languages, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/context'
import { getLanguageInfo } from '@/i18n/config'

export function LanguageBanner() {
  const { showBanner, detectedLanguage, setLanguage, dismissBanner, neverAskAgain } = useI18n()

  if (!showBanner || !detectedLanguage) return null

  const info = getLanguageInfo(detectedLanguage)
  const langName = info.native

  return (
    <div className="fixed top-16 left-0 right-0 z-50 px-4 py-3 bg-primary/95 backdrop-blur-xl shadow-lg animate-fade-in-down md:left-64">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Languages className="w-5 h-5 text-white shrink-0" />
          <p className="text-sm text-white font-medium text-center sm:text-left">
            🌍 We noticed your preferred language is {langName}. Would you like to switch?
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setLanguage(detectedLanguage)}
            className="bg-white text-primary hover:bg-white/90 h-8 px-4 rounded-full text-xs font-semibold"
          >
            Switch
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={dismissBanner}
            className="text-white hover:bg-white/10 h-8 px-4 rounded-full text-xs"
          >
            Not now
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={neverAskAgain}
            className="text-white/70 hover:bg-white/10 h-8 px-3 rounded-full text-xs"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
