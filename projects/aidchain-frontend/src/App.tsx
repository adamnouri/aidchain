import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import { AppClientProvider } from './context/AppClientContext'
import ErrorBoundary from './components/ErrorBoundary'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import Home from './Home'

// Configure KMD wallet only if env vars are present
let supportedWallets: SupportedWallet[] = [
  // Browser wallets (TestNet/MainNet)
  { id: WalletId.PERA },
  { id: WalletId.DEFLY },
  { id: WalletId.EXODUS },
  { id: WalletId.DAFFI },
]
try {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    ...supportedWallets,
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
    network: import.meta.env.VITE_ALGOD_NETWORK,
  })
} catch (e) {
  console.warn('KMD env vars not set; skipping KMD wallet configuration')
}


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
            <Home />
          </AppClientProvider>
        </WalletProvider>
      </SnackbarProvider>
    </ErrorBoundary>
  )
}
