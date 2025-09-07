// This context provider gives the rest of the app access to a generic Algorand blockchain client.
// Any component in the app can use this context to interact with the blockchain (for example, to send transactions or query data).

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
// This utility helps us connect to the Algorand blockchain network
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
// useWallet is a React hook that lets us connect to the user's Algorand wallet (like Pera or Lute)
// It gives us access to the user's address and a function to sign transactions
import { useWallet } from '@txnlab/use-wallet-react'
// These helpers get the necessary configuration to connect to Algorand nodes from our environment
import {
  getAlgodConfigFromViteEnvironment,
  getIndexerConfigFromViteEnvironment,
} from '../utils/network/getAlgoClientConfigs'

type AppClientContextType = {
  algorandClient: AlgorandClient | null
  error: Error | null
}

const AppClientContext = createContext<AppClientContextType>({
  algorandClient: null,
  error: null,
})

export const AppClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // useWallet gives us the user's wallet address and a function to sign transactions
  // transactionSigner: used to sign blockchain transactions
  // activeAddress: the user's current Algorand address
  const { transactionSigner, activeAddress } = useWallet()
  // stableSigner ensures we always use the correct signer for the current address
  const stableSigner = useMemo(() => transactionSigner, [activeAddress])

  const [algorandClient, setAlgorandClient] = useState<AlgorandClient | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log('🌐 AppClientContext effect triggered:', {
      activeAddress: activeAddress?.slice(0, 8) + '...',
      stableSigner: !!stableSigner
    })
    
    // This effect sets up the connection to the Algorand blockchain client
    if (!activeAddress || !stableSigner) {
      console.log('⏳ AppClientContext - missing prerequisites')
      setAlgorandClient(null)
      return
    }

    setError(null)

    try {
      console.log('🔧 AppClientContext - creating AlgorandClient...')
      // Create a client for the Algorand blockchain using configuration from our environment
      const algodConfig = getAlgodConfigFromViteEnvironment()
      const indexerConfig = getIndexerConfigFromViteEnvironment()
      console.log('🔧 Configs:', { algodConfig, indexerConfig })
      
      const algorand = AlgorandClient.fromConfig({ algodConfig, indexerConfig })

      // Set the default signer for the Algorand client, so it knows how to sign transactions
      algorand.setDefaultSigner(stableSigner)

      console.log('✅ AlgorandClient created successfully')
      setAlgorandClient(algorand)
    } catch (e) {
      console.error('❌ Error creating AlgorandClient:', e)
      setError(e as Error)
      setAlgorandClient(null)
    }
  }, [activeAddress, stableSigner])

  return <AppClientContext.Provider value={{ algorandClient, error }}>{children}</AppClientContext.Provider>
}

export const useAppClient = () => useContext(AppClientContext)

