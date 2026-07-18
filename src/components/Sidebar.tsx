import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ShieldCheck,
  Home,
  BarChart2,
  Swords,
  Activity,
  History,
  PieChart,
  Accessibility,
  Bell,
  Settings,
} from 'lucide-react'
import useAppStore from '@/stores/main'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Markets', path: '/markets', icon: BarChart2 },
  { name: 'Matches', path: '/matches', icon: Swords },
  { name: 'Settlement Engine', path: '/settlement', icon: Activity },
  { name: 'Verification', path: '/verification', icon: ShieldCheck },
  { name: 'History', path: '/history', icon: History },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Accessibility', path: '/accessibility', icon: Accessibility },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const { walletConnected, walletAddress, disconnectWallet } = useAppStore()

  return (
    <div className="h-full border-r border-border/50 glass-panel border-y-0 border-l-0 rounded-none flex flex-col bg-background/80">
      <div className="p-6">
        <Link
          to="/welcome"
          className="flex items-center gap-3 text-primary font-bold text-xl tracking-tight"
        >
          <ShieldCheck className="w-8 h-8" />
          <div>
            <div>ProofLens</div>
            <div className="text-[10px] font-normal text-muted-foreground uppercase tracking-wider -mt-1">
              Don't Trust. Verify.
            </div>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </div>
      {walletConnected && (
        <div className="p-4 border-t border-border/50">
          <div className="glass-panel p-4 rounded-xl bg-secondary/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">Wallet</span>
              <span className="text-xs font-mono">{walletAddress}</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">USDC</span>
                <span className="text-sm">1,250.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">SOL</span>
                <span className="text-sm text-muted-foreground">4.32</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8"
              onClick={disconnectWallet}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
