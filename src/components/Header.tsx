import { Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSelector } from '@/components/LanguageSelector'
import useAppStore from '@/stores/main'
import { useI18n } from '@/i18n/context'
import { useTxLine } from '@/hooks/use-tx-line'
import { Link, useNavigate } from 'react-router-dom'

function StatusPill({ label, status = 'ok' }: { label: string; status?: 'ok' | 'warn' | 'error' | 'loading' }) {
  const colorMap = {
    ok: 'bg-success animate-pulse',
    warn: 'bg-yellow-500',
    error: 'bg-destructive',
    loading: 'bg-blue-500 animate-pulse',
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground">
      <span className={`w-2 h-2 rounded-full ${colorMap[status]}`} />
      {label}
    </div>
  )
}

export function Header() {
  const { walletConnected, walletAddress, walletConnecting, authStatus, connectWallet, disconnectWallet } = useAppStore()
  const { t } = useI18n()
  const navigate = useNavigate()

  const { isFallback, isConnected } = useTxLine()

  // Derive status pill states from real auth status
  const apiPillStatus = isConnected ? 'ok' : isFallback ? 'warn' : 'loading'
  const solanaPillStatus = walletConnected ? 'ok' : walletConnecting ? 'loading' : 'warn'

  // Truncate Solana address for display (base58)
  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null

  return (
    <header className="h-16 border-b border-border/50 glass-panel border-x-0 border-t-0 rounded-none px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-background/80">
      <div className="hidden md:flex gap-4">
        <StatusPill label={t('header.txlineApi')} status={apiPillStatus} />
        {isFallback && (
          <StatusPill label="MOCK DATA (FALLBACK)" status="warn" />
        )}
        <StatusPill label={t('header.solana')} status={solanaPillStatus} />
        <StatusPill label={t('header.settlementEngine')} />
      </div>
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-secondary/30 border-none rounded-full h-9 text-sm"
            placeholder={t('header.searchPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/markets?q=${encodeURIComponent(e.currentTarget.value)}`)
              }
            }}
          />
        </div>
        <LanguageSelector />
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/alerts">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </Link>
        </Button>
        {walletConnected ? (
          <Button
            variant="outline"
            className="rounded-full font-mono bg-secondary/30 hidden sm:flex"
            onClick={disconnectWallet}
          >
            {displayAddress}
          </Button>
        ) : (
          <Button
            className="rounded-full bg-primary hover:bg-primary/90 text-white hidden sm:flex"
            onClick={connectWallet}
            disabled={walletConnecting}
          >
            {walletConnecting ? t('header.connecting') || 'Connecting...' : t('header.connectWallet')}
          </Button>
        )}
      </div>
    </header>
  )
}
