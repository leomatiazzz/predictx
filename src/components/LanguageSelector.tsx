import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'

export function LanguageSelector() {
  const isMobile = useIsMobile()
  const { language, setLanguage, languages } = useI18n()
  const current = languages.find((l) => l.code === language) ?? languages[0]

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Globe className="w-5 h-5 text-muted-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-center">🌍 Language</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 mt-6 pb-8">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl transition-colors',
                  lang.code === language
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-secondary/50 border border-transparent',
                )}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-xs text-muted-foreground">{lang.native}</p>
                </div>
                {lang.code === language && <Check className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 rounded-full px-3">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-lg">{current.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-3 cursor-pointer py-2"
          >
            <span className="text-xl">{lang.flag}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{lang.name}</p>
              <p className="text-xs text-muted-foreground">{lang.native}</p>
            </div>
            {lang.code === language && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
