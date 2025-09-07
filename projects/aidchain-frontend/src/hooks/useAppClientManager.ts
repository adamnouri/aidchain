import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory, AidchainContractsClient } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'

/**
 * Custom hook to manage the AidchainContracts client instance
 * This hook handles the deployment/connection and provides a ready-to-use client
 */
export function useAppClientManager() {
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
    if (!algorandClient || !activeAddress) return

    setLoading(true)
    setError(null)
    
    try {
      const factory = new AidchainContractsFactory({
        defaultSender: activeAddress,
        algorand: algorandClient,
      })

      const deployResult = await factory.deploy({
        onSchemaBreak: OnSchemaBreak.ReplaceApp,
        onUpdate: OnUpdate.ReplaceApp,
      })

      setAppClient(deployResult.appClient)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize app client')
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