import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'

interface Campaign {
  id: number
  title: string
  target: number
  raised: number
  creator: string
  active: boolean
}

interface ContractStats {
  totalDonations: number
  totalCampaigns: number
  totalOrganizations: number
}

interface DonorDashboardProps {
  onBackToLanding: () => void
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ onBackToLanding }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<ContractStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationModal, setShowDonationModal] = useState(false)
  
  const { activeAddress } = useWallet()
  const { algorandClient, error } = useAppClient()
  const { enqueueSnackbar } = useSnackbar()

  // Load initial data
  useEffect(() => {
    if (activeAddress && algorandClient) {
      loadContractData()
    }
  }, [activeAddress, algorandClient])

  const loadContractData = async () => {
    if (!algorandClient || !activeAddress) {
      enqueueSnackbar('Wallet not connected', { variant: 'warning' })
      return
    }

    setLoading(true)
    try {
      const factory = new AidchainContractsFactory({
        defaultSender: activeAddress,
        algorand: algorandClient,
      })

      const deployResult = await factory.deploy({
        onSchemaBreak: OnSchemaBreak.ReplaceApp,
        onUpdate: OnUpdate.ReplaceApp,
      })

      const { appClient } = deployResult

      // Load contract statistics
      const totalDonations = await appClient.send.getTotalDonations()
      const totalCampaigns = await appClient.send.getCampaignCount()
      const totalOrganizations = await appClient.send.getOrganizationCount()
      
      setStats({
        totalDonations: Number(totalDonations.return),
        totalCampaigns: Number(totalCampaigns.return),
        totalOrganizations: Number(totalOrganizations.return)
      })

      // Load campaigns
      const sampleCampaigns: Campaign[] = []
      for (let i = 1; i <= Number(totalCampaigns.return); i++) {
        try {
          const campaignDetails = await appClient.send.getCampaignDetails({ campaignId: i })
          if (campaignDetails.return) {
            const [id, title, target, raised, creator, active] = campaignDetails.return
            sampleCampaigns.push({
              id: Number(id),
              title: title,
              target: Number(target),
              raised: Number(raised),
              creator: creator,
              active: Number(active) === 1
            })
          }
        } catch (error) {
          console.log(`Campaign ${i} not found:`, error)
        }
      }
      
      setCampaigns(sampleCampaigns)
      enqueueSnackbar('Dashboard loaded successfully!', { variant: 'success' })
      
    } catch (error) {
      enqueueSnackbar(`Error loading dashboard: ${error}`, { variant: 'error' })
      console.error('Dashboard loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setShowDonationModal(true)
  }

  const processDonation = async () => {
    if (!selectedCampaign || !donationAmount || !activeAddress || !algorandClient) return

    setLoading(true)
    try {
      const factory = new AidchainContractsFactory({
        defaultSender: activeAddress,
        algorand: algorandClient,
      })

      const deployResult = await factory.deploy({
        onSchemaBreak: OnSchemaBreak.ReplaceApp,
        onUpdate: OnUpdate.ReplaceApp,
      })

      const { appClient } = deployResult

      // Create donation record
      const result = await appClient.send.createDonation({ 
        campaignId: selectedCampaign.id 
      })

      enqueueSnackbar(`Donation successful! ${result.return}`, { variant: 'success' })
      
      // Refresh data
      await loadContractData()
      
      // Close modal
      setShowDonationModal(false)
      setDonationAmount('')
      setSelectedCampaign(null)
      
    } catch (error) {
      enqueueSnackbar(`Donation failed: ${error}`, { variant: 'error' })
      console.error('Donation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAlgo = (microAlgos: number) => {
    return (microAlgos / 1_000_000).toFixed(6) + ' ALGO'
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2563eb',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    refreshButton: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.375rem'
    },
    address: {
      color: '#2563eb',
      fontSize: '0.875rem'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      textAlign: 'center' as const
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    campaignGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    campaignCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    campaignContent: {
      padding: '1.5rem'
    },
    campaignTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    campaignCreator: {
      color: '#6b7280',
      marginBottom: '1rem'
    },
    progressContainer: {
      marginBottom: '1rem'
    },
    progressLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem'
    },
    progressBar: {
      width: '100%',
      height: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '9999px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      transition: 'width 0.3s ease'
    },
    progressPercent: {
      textAlign: 'center' as const,
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.5rem'
    },
    donateButton: {
      width: '100%',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    disabledButton: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    emptyState: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '3rem',
      textAlign: 'center' as const
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    emptyTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    emptyText: {
      color: '#6b7280',
      marginBottom: '1.5rem'
    },
    modal: {
      display: showDonationModal ? 'flex' : 'none',
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem'
    },
    modalActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '1.5rem'
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer'
    },
    confirmButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    spinner: {
      width: '2rem',
      height: '2rem',
      border: '0.25rem solid #e5e7eb',
      borderTop: '0.25rem solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  }

  // Show connection error
  if (error) {
    return (
      <div style={styles.loading}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Connection Error</p>
          <p style={{ color: '#6b7280' }}>{error.message}</p>
        </div>
      </div>
    )
  }

  // Show loading
  if (loading && !stats) {
    return (
      <div style={styles.loading}>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading dashboard...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.logo} onClick={onBackToLanding}>
          ■ Aidchain
        </button>
        <div style={styles.headerRight}>
          <button 
            style={styles.refreshButton}
            onClick={loadContractData}
            disabled={loading}
          >
            {loading ? '⟳' : '🔄'} Refresh
          </button>
          <div style={styles.address}>
            {activeAddress ? `${activeAddress.slice(0, 8)}...${activeAddress.slice(-6)}` : 'Not Connected'}
          </div>
        </div>
      </div>

      <div style={styles.main}>
        {/* Statistics Cards */}
        {stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#2563eb' }}>
                {formatAlgo(stats.totalDonations)}
              </div>
              <div style={styles.statLabel}>Total Donated</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#059669' }}>
                {stats.totalCampaigns}
              </div>
              <div style={styles.statLabel}>Active Campaigns</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statValue, color: '#7c3aed' }}>
                {stats.totalOrganizations}
              </div>
              <div style={styles.statLabel}>Partner NGOs</div>
            </div>
          </div>
        )}

        {/* Campaign Section */}
        <div>
          <h2 style={styles.sectionTitle}>Active Campaigns</h2>
          
          {campaigns.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏗️</div>
              <h3 style={styles.emptyTitle}>No Campaigns Yet</h3>
              <p style={styles.emptyText}>
                There are no active campaigns at the moment. Check back later or help us create the first one!
              </p>
              <button 
                style={styles.donateButton}
                onClick={loadContractData}
                disabled={loading}
              >
                {loading ? '⟳ Loading...' : 'Refresh Campaigns'}
              </button>
            </div>
          ) : (
            <div style={styles.campaignGrid}>
              {campaigns.map((campaign) => (
                <div key={campaign.id} style={styles.campaignCard}>
                  <div style={styles.campaignContent}>
                    <h3 style={styles.campaignTitle}>{campaign.title}</h3>
                    <p style={styles.campaignCreator}>By: {campaign.creator}</p>
                    
                    <div style={styles.progressContainer}>
                      <div style={styles.progressLabels}>
                        <span>Raised: {formatAlgo(campaign.raised)}</span>
                        <span>Target: {formatAlgo(campaign.target)}</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div 
                          style={{
                            ...styles.progressFill,
                            width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <div style={styles.progressPercent}>
                        {((campaign.raised / campaign.target) * 100).toFixed(1)}% funded
                      </div>
                    </div>

                    <button 
                      style={{
                        ...styles.donateButton,
                        ...(campaign.active ? {} : styles.disabledButton)
                      }}
                      onClick={() => handleDonate(campaign)}
                      disabled={!campaign.active}
                    >
                      {campaign.active ? 'Donate Now' : 'Campaign Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donation Modal */}
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <h3 style={styles.modalTitle}>
            Donate to {selectedCampaign?.title}
          </h3>
          
          {selectedCampaign && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Campaign by: {selectedCampaign.creator}
              </p>
              <p style={{ color: '#6b7280' }}>
                Progress: {formatAlgo(selectedCampaign.raised)} / {formatAlgo(selectedCampaign.target)}
              </p>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Donation Amount (ALGO)</label>
            <input 
              style={styles.input}
              type="number" 
              placeholder="0.000000" 
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              step="0.000001"
              min="0"
            />
          </div>

          <div style={styles.modalActions}>
            <button 
              style={styles.cancelButton}
              onClick={() => {
                setShowDonationModal(false)
                setDonationAmount('')
                setSelectedCampaign(null)
              }}
            >
              Cancel
            </button>
            <button 
              style={{
                ...styles.confirmButton,
                opacity: (loading || !donationAmount || parseFloat(donationAmount) <= 0) ? 0.5 : 1
              }}
              onClick={processDonation}
              disabled={loading || !donationAmount || parseFloat(donationAmount) <= 0}
            >
              {loading ? '⟳ Processing...' : 'Confirm Donation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard