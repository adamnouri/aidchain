import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppClientProvider } from './context/AppClientContext'
import ErrorBoundary from './components/ErrorBoundary'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

// Pages
import LandingPage from './pages/LandingPage'
import DonatePage from './pages/DonatePage'
import CampaignPage from './pages/CampaignPage'
import ConfirmationPage from './pages/ConfirmationPage'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import GetInvolvedPage from './pages/GetInvolvedPage'
import NGOPortalPage from './pages/NGOPortalPage'

// Legacy components for compatibility
import DonorDashboard from './components/DonorDashboardRefactored'
import MilestoneTracker from './components/MilestoneTracker'
import VoucherSystem from './components/VoucherSystem'
import DeliveryTracker from './components/DeliveryTracker'
import DebugPanel from './components/DebugPanel'

// Force KMD wallet for development testing
const kmdConfig = getKmdConfigFromViteEnvironment()
const supportedWallets: SupportedWallet[] = [
  {
    id: WalletId.KMD,
    options: {
      baseServer: kmdConfig.server,
      token: String(kmdConfig.token),
      port: String(kmdConfig.port),
    },
  },
]

console.log('🔗 Configured KMD wallet:', {
  server: kmdConfig.server,
  port: kmdConfig.port,
  network: import.meta.env.VITE_ALGOD_NETWORK
})

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  })

  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      // In production, send to error tracking service
      console.error('App Error:', error, errorInfo)
    }}>
      <SnackbarProvider maxSnack={3}>
        <WalletProvider manager={walletManager}>
          <AppClientProvider>
            <Router>
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/campaign/:id" element={<CampaignPage />} />
                <Route path="/confirmation/:hash" element={<ConfirmationPage />} />
                
                {/* Info Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/get-involved" element={<GetInvolvedPage />} />
                
                {/* NGO and Admin Pages */}
                <Route path="/ngo" element={<NGOPortalPage />} />
                
                {/* Legacy Dashboard Pages */}
                <Route path="/donor-dashboard" element={<DonorDashboard onBackToLanding={() => window.location.href = '/'} />} />
                <Route path="/milestones" element={<MilestoneTracker onBackToLanding={() => window.location.href = '/'} />} />
                <Route path="/vouchers" element={<VoucherSystem onBackToLanding={() => window.location.href = '/'} />} />
                <Route path="/deliveries" element={<DeliveryTracker onBackToLanding={() => window.location.href = '/'} />} />
              </Routes>
              
              {/* Debug Panel - always available in development */}
              {import.meta.env.DEV && <DebugPanel />}
            </Router>
          </AppClientProvider>
        </WalletProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  )
}
