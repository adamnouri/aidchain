import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory, AidchainContractsClient } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { AppClientManagerHook } from '../types'

/**
 * Custom hook to manage the AidchainContracts client instance
 * This hook handles the deployment/connection and provides a ready-to-use client
 */
export function useAppClientManager(): AppClientManagerHook {
  const [appClient, setAppClient] = useState<AidchainContractsClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { activeAddress } = useWallet()
  const { algorandClient, error: contextError } = useAppClient()

  useEffect(() => {
    if (contextError) {
      setError(contextError.message)
      return
    }

    if (activeAddress && algorandClient) {
      initializeAppClient()
    } else {
      setAppClient(null)
      setError(null)
    }
  }, [activeAddress, algorandClient, contextError])

  const initializeAppClient = async () => {
    console.log('🚀 initializeAppClient called')
    if (!algorandClient || !activeAddress) {
      console.log('❌ Missing prerequisites in initializeAppClient')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🏭 Creating AidchainContractsFactory...')
      const factory = new AidchainContractsFactory({
        defaultSender: activeAddress,
        algorand: algorandClient,
      })

      console.log('🔌 Connecting to deployed contract (App ID: 1184)...')
      // Connect to existing deployed contract (App ID: 1184)
      const appClient = factory.getAppClientById({
        appId: 1184n, // The deployed contract ID from LocalNet
      })

      console.log('✅ App client created successfully:', { appId: appClient.appId })
      setAppClient(appClient)
    } catch (e) {
      console.error('❌ Error in initializeAppClient:', e)
      setError(e instanceof Error ? e.message : 'Failed to connect to app client')
      setAppClient(null)
    } finally {
      setLoading(false)
    }
  }

  return {
    appClient,
    loading,
    error,
    activeAddress,
    reinitialize: initializeAppClient
  }
}
