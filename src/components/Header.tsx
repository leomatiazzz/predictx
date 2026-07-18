import { Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/LanguageSelector'
import useAppStore from '@/stores/main'
import { useI18n } from '@/i18n/context'

function StatusPill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground">
      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
      {label}
    </div>
  )
}

export function Header() {
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useAppStore()
  const { t } = useI18n()

  return (
    <header className="h-16 border-b border-border/50 glass-panel border-x-0 border-t-0 rounded-none px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-background/80">
      <div className="hidden md:flex gap-4">
        <StatusPill label={t('header.txlineApi')} />
        <StatusPill label={t('header.solana')} />
        <StatusPill label={t('header.settlementEngine')} />
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-secondary/30 border-none rounded-full h-9 text-sm"
            placeholder={t('header.searchPlaceholder')}
          />
        </div>
        <LanguageSelector />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </Button>
        {walletConnected ? (
          <Button
            variant="outline"
            className="rounded-full font-mono bg-secondary/30 hidden sm:flex"
            onClick={disconnectWallet}
          >
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </Button>
        ) : (
          <Button
            className="rounded-full bg-primary hover:bg-primary/90 text-white hidden sm:flex"
            onClick={connectWallet}
          >
            {t('header.connectWallet')}
          </Button>
        )}
      </div>
    </header>
  )
}
