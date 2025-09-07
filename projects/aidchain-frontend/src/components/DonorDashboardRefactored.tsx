import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useAppClientManager } from '../hooks/useAppClientManager'
import { useDonorDashboard } from '../hooks/useAidChain'

interface DonorDashboardProps {
  onBackToLanding: () => void
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ onBackToLanding }) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [showDonationModal, setShowDonationModal] = useState(false)
  
  const { enqueueSnackbar } = useSnackbar()
  const { appClient, loading: clientLoading, error: clientError, activeAddress } = useAppClientManager()
  const { 
    loadDashboardData, 
    makeDonation, 
    loading, 
    error, 
    stats, 
    campaigns,
    setError 
  } = useDonorDashboard(appClient, activeAddress)

  // Load data when client is ready
  useEffect(() => {
    if (appClient) {
      loadDashboardData()
    }
  }, [appClient])

  // Handle errors from hooks
  useEffect(() => {
    if (clientError) {
      enqueueSnackbar(`Connection error: ${clientError}`, { variant: 'error' })
    }
    if (error) {
      enqueueSnackbar(`Error: ${error}`, { variant: 'error' })
    }
  }, [clientError, error])

  const handleDonate = (campaignId: number) => {
    setSelectedCampaignId(campaignId)
    setShowDonationModal(true)
  }

  const processDonation = async () => {
    if (!selectedCampaignId || !donationAmount) return

    const success = await makeDonation(selectedCampaignId)
    if (success) {
      enqueueSnackbar('Donation successful!', { variant: 'success' })
      setShowDonationModal(false)
      setDonationAmount('')
      setSelectedCampaignId(null)
    }
  }

  const formatAlgo = (microAlgos: number) => {
    return (microAlgos / 1_000_000).toFixed(6) + ' ALGO'
  }

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId)
  const isLoading = clientLoading || loading

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

  if (isLoading && !stats) {
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
            onClick={() => {
              setError(null)
              loadDashboardData()
            }}
            disabled={isLoading}
          >
            {isLoading ? '⟳' : '🔄'} Refresh
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

        {/* Campaign Grid */}
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
                onClick={loadDashboardData}
                disabled={isLoading}
              >
                {isLoading ? '⟳ Loading...' : 'Refresh Campaigns'}
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
                      onClick={() => handleDonate(campaign.id)}
                      disabled={!campaign.active || isLoading}
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
                setSelectedCampaignId(null)
              }}
            >
              Cancel
            </button>
            <button 
              style={{
                ...styles.confirmButton,
                opacity: (isLoading || !donationAmount || parseFloat(donationAmount) <= 0) ? 0.5 : 1
              }}
              onClick={processDonation}
              disabled={isLoading || !donationAmount || parseFloat(donationAmount) <= 0}
            >
              {isLoading ? '⟳ Processing...' : 'Confirm Donation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard