import React, { useEffect, useState } from 'react'
import { useAppClientManager } from '../hooks/useAppClientManager'
import { useDonorDashboard, useOrganizationManagement } from '../hooks/useAidChain'
import { useMilestoneTracker } from '../hooks/useAidChainAdvanced'

interface ContractTestProps {
  onClose: () => void
}

const ContractTest: React.FC<ContractTestProps> = ({ onClose }) => {
  const { appClient, activeAddress } = useAppClientManager()
  const [testResults, setTestResults] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  // Initialize hooks
  const donorHook = useDonorDashboard(appClient, activeAddress)
  const orgHook = useOrganizationManagement(appClient, activeAddress)
  const milestoneHook = useMilestoneTracker(appClient, activeAddress)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, message])
  }

  const runTests = async () => {
    setTesting(true)
    setTestResults([])
    addResult('🚀 Starting contract integration tests...')
    
    if (!appClient || !activeAddress) {
      addResult('❌ Wallet not connected or app client not ready')
      setTesting(false)
      return
    }
    
    try {
      // Test 1: Basic read operations
      addResult('📊 Testing basic read operations...')
      
      // Test get counts
      const totalDonations = await appClient.send.getTotalDonations()
      addResult(`✅ Total donations: ${totalDonations.return}`)
      
      const campaignCount = await appClient.send.getCampaignCount()
      addResult(`✅ Campaign count: ${campaignCount.return}`)
      
      const orgCount = await appClient.send.getOrganizationCount()
      addResult(`✅ Organization count: ${orgCount.return}`)
      
      // Test 2: Load dashboard data using hooks
      addResult('📋 Testing dashboard data loading...')
      await donorHook.loadDashboardData()
      if (donorHook.error) {
        addResult(`❌ Dashboard error: ${donorHook.error}`)
      } else {
        addResult(`✅ Dashboard loaded: ${donorHook.campaigns.length} campaigns, ${donorHook.stats?.totalOrganizations} orgs`)
      }
      
      // Test 3: Test validation method (read-only)
      addResult('🔍 Testing donation validation...')
      const validation = await appClient.send.validateDonation({
        args: {
          amount: 1000000, // 1 ALGO in microALGOs
          donor: activeAddress
        }
      })
      addResult(`✅ Validation result: ${validation.return}`)
      
      // Test 4: Test contract stats
      addResult('📈 Testing contract statistics...')
      const stats = await appClient.send.getContractStats()
      addResult(`✅ Contract stats: ${stats.return}`)
      
      addResult('🎉 All read-only tests completed successfully!')
      addResult('ℹ️ Write operations would require contract funding')
      
    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('Contract test error:', error)
    }
    
    setTesting(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        width: '90%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ margin: 0, color: '#1a202c' }}>Contract Integration Test</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
            This test verifies that the React frontend can communicate with the deployed AidChain smart contract on LocalNet.
          </p>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Connection Status:</strong><br/>
            App Client: {appClient ? '✅ Connected' : '❌ Not connected'}<br/>
            Active Address: {activeAddress ? `✅ ${activeAddress.slice(0, 8)}...` : '❌ Not connected'}<br/>
            Contract App ID: {appClient?.appId || 'Unknown'}
          </div>
          
          <button
            onClick={runTests}
            disabled={testing || !appClient || !activeAddress}
            style={{
              backgroundColor: testing ? '#ccc' : '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: testing || !appClient || !activeAddress ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              marginBottom: '1rem'
            }}
          >
            {testing ? 'Running Tests...' : 'Run Contract Tests'}
          </button>
        </div>
        
        <div style={{
          backgroundColor: '#f7fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '200px',
          fontFamily: 'monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          overflow: 'auto'
        }}>
          {testResults.length === 0 ? (
            <span style={{ color: '#666' }}>Click "Run Contract Tests" to start testing...</span>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '0.25rem' }}>
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ContractTest