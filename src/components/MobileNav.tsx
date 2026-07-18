import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart2, Swords, Activity, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import useAppStore from '@/stores/main'

export function MobileNav() {
  const location = useLocation()
  const { connectWallet, walletConnected } = useAppStore()
  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Markets', path: '/markets', icon: BarChart2 },
    { name: 'Matches', path: '/matches', icon: Swords },
    { name: 'Settlement', path: '/settlement', icon: Activity },
  ]

  return (
    <div className="h-16 glass-panel border-x-0 border-b-0 rounded-none flex items-center justify-around px-2 bg-background/95 backdrop-blur-xl">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            'flex flex-col items-center gap-1 p-2 min-w-[64px]',
            location.pathname === item.path ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-medium">{item.name}</span>
        </Link>
      ))}
      <button
        onClick={connectWallet}
        className={cn(
          'flex flex-col items-center gap-1 p-2 min-w-[64px]',
          walletConnected ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px] font-medium">Wallet</span>
      </button>
    </div>
  )
}
