import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

const App = () => (
  <SolanaProvider>
    <I18nProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/welcome" element={<Landing />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/settlement" element={<SettlementEngine />} />
              <Route path="/verification" element={<SettlementEngine />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </I18nProvider>
  </SolanaProvider>
)

export default App
