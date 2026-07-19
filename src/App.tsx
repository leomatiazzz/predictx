import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { I18nProvider } from '@/i18n/context'
import { SolanaProvider } from '@/services/txline/wallet'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import SettlementEngine from './pages/SettlementEngine'
import Analytics from './pages/Analytics'
import Accessibility from './pages/Accessibility'
import Matches from './pages/Matches'
import Markets from './pages/Markets'
import History from './pages/History'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import MatchDetails from './pages/MatchDetails'

const router = createBrowserRouter([
  {
    path: '/welcome',
    element: <Landing />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/markets', element: <Markets /> },
      { path: '/matches', element: <Matches /> },
      { path: '/match/:id', element: <MatchDetails /> },
      { path: '/settlement', element: <SettlementEngine /> },
      { path: '/verification', element: <SettlementEngine /> },
      { path: '/history', element: <History /> },
      { path: '/analytics', element: <Analytics /> },
      { path: '/accessibility', element: <Accessibility /> },
      { path: '/alerts', element: <Alerts /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

const App = () => (
  <SolanaProvider>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </I18nProvider>
  </SolanaProvider>
)

export default App
