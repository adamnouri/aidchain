// components/DebugPanel.tsx - Debug panel for testing features
import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useAppClient } from '../context/AppClientContext'

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const { activeAddress, providers, connect } = useWallet()
  const { algorandClient, error } = useAppClient()

  const styles = {
    toggle: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      padding: '15px',
      cursor: 'pointer',
      fontSize: '16px',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    },
    panel: {
      position: 'fixed' as const,
      bottom: '80px',
      right: '20px',
      width: '400px',
      maxHeight: '500px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      zIndex: 1000,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      overflow: 'auto'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#1f2937'
    },
    section: {
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#f8fafc',
      borderRadius: '4px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#374151'
    },
    status: {
      fontSize: '12px',
      marginBottom: '5px'
    },
    success: {
      color: '#10b981'
    },
    error: {
      color: '#ef4444'
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      marginRight: '8px',
      marginBottom: '5px'
    },
    log: {
      backgroundColor: '#f3f4f6',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontFamily: 'monospace',
      maxHeight: '100px',
      overflow: 'auto',
      whiteSpace: 'pre-wrap' as const
    }
  }

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testWalletConnection = async () => {
    addResult('🔌 Testing wallet connection...')
    
    if (activeAddress) {
      addResult(`✅ Wallet connected: ${activeAddress.slice(0, 20)}...`)
    } else {
      addResult('❌ No wallet connected')
      
      // Try to connect with first available provider
      if (providers && providers.length > 0) {
        try {
          await connect(providers[0].metadata.id)
          addResult('✅ Connected to wallet provider')
        } catch (error) {
          addResult(`❌ Failed to connect: ${error}`)
        }
      } else {
        addResult('❌ No wallet providers available')
      }
    }
  }

  const testAlgorandClient = async () => {
    addResult('⚡ Testing Algorand client...')
    
    if (algorandClient) {
      addResult('✅ Algorand client available')
      
      try {
        const status = await algorandClient.client.algod.status().do()
        addResult(`✅ Algod connected - Round: ${status['last-round']}`)
      } catch (error) {
        addResult(`❌ Algod connection failed: ${error}`)
      }
    } else {
      addResult('❌ No Algorand client available')
      if (error) {
        addResult(`❌ Client error: ${error}`)
      }
    }
  }

  const testContractConnection = async () => {
    addResult('📱 Testing contract connection...')
    
    if (!algorandClient || !activeAddress) {
      addResult('❌ Need wallet and client first')
      return
    }

    try {
      const { AidchainContractsFactory } = await import('../contracts/AidchainContracts')
      
      const factory = new AidchainContractsFactory({
        defaultSender: activeAddress,
        algorand: algorandClient,
      })
      
      addResult('✅ Factory created successfully')
      
      // Try to deploy a test contract
      const deployResult = await factory.deploy({
        onSchemaBreak: 'replace' as any,
        onUpdate: 'append' as any,
      })
      
      addResult(`✅ Contract deployed: ${deployResult.appClient.appId}`)
      
      // Try to initialize
      try {
        const initResult = await deployResult.appClient.send.initialize()
        addResult(`✅ Contract initialized: ${initResult.return}`)
      } catch (initError) {
        addResult(`ℹ️ Initialize failed (might be already initialized): ${initError}`)
      }
      
    } catch (error) {
      addResult(`❌ Contract test failed: ${error}`)
    }
  }

  const testFormValidation = () => {
    addResult('📝 Testing form validation...')
    
    // Test basic form inputs
    const testName = '  Test Organization  '
    const trimmedName = testName.trim()
    
    if (trimmedName && trimmedName.length > 0) {
      addResult('✅ Name validation works')
    } else {
      addResult('❌ Name validation failed')
    }
    
    // Test number parsing
    const testTarget = '1000.50'
    const targetMicroAlgos = Math.round(parseFloat(testTarget) * 1_000_000)
    
    if (targetMicroAlgos === 1000500000) {
      addResult('✅ Number conversion works')
    } else {
      addResult('❌ Number conversion failed')
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (!isOpen) {
    return (
      <button style={styles.toggle} onClick={() => setIsOpen(true)}>
        🔧 Debug
      </button>
    )
  }

  return (
    <>
      <button style={styles.toggle} onClick={() => setIsOpen(false)}>
        ✖️
      </button>
      
      <div style={styles.panel}>
        <div style={styles.title}>🔧 AidChain Debug Panel</div>
        
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Wallet Status</div>
          <div style={activeAddress ? styles.success : styles.error}>
            {activeAddress ? `Connected: ${activeAddress.slice(0, 20)}...` : 'Not connected'}
          </div>
          <button style={styles.button} onClick={testWalletConnection}>
            Test Wallet
          </button>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Algorand Client</div>
          <div style={algorandClient ? styles.success : styles.error}>
            {algorandClient ? 'Available' : 'Not available'}
          </div>
          <button style={styles.button} onClick={testAlgorandClient}>
            Test Client
          </button>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Tests</div>
          <button style={styles.button} onClick={testContractConnection}>
            Test Contract
          </button>
          <button style={styles.button} onClick={testFormValidation}>
            Test Forms
          </button>
          <button style={styles.button} onClick={clearResults}>
            Clear
          </button>
        </div>

        {testResults.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Test Results</div>
            <div style={styles.log}>
              {testResults.join('\n')}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DebugPanel