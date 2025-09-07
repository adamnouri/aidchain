import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'

interface Organization {
  id: number
  name: string
  walletAddress: string
  verificationLevel: number
}

interface Campaign {
  id: number
  title: string
  target: number
  raised: number
  creator: string
  active: boolean
}

interface OrganizationPortalProps {
  onBackToLanding: () => void
}

const OrganizationPortal: React.FC<OrganizationPortalProps> = ({ onBackToLanding }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false)
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    walletAddress: ''
  })
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    target: '',
    creator: ''
  })
  
  const { activeAddress } = useWallet()
  const { algorandClient, error } = useAppClient()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (activeAddress && algorandClient) {
      loadData()
    }
  }, [activeAddress, algorandClient])

  const loadData = async () => {
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

      // Load organizations
      const orgCount = await appClient.send.getOrganizationCount()
      const loadedOrgs: Organization[] = []
      
      for (let i = 1; i <= Number(orgCount.return); i++) {
        try {
          const orgDetails = await appClient.send.getOrganizationDetails({ orgId: i })
          if (orgDetails.return) {
            const [id, name, walletAddress, verificationLevel] = orgDetails.return
            loadedOrgs.push({
              id: Number(id),
              name: name,
              walletAddress: walletAddress,
              verificationLevel: Number(verificationLevel)
            })
          }
        } catch (error) {
          console.log(`Organization ${i} not found:`, error)
        }
      }
      setOrganizations(loadedOrgs)

      // Load campaigns
      const campaignCount = await appClient.send.getCampaignCount()
      const loadedCampaigns: Campaign[] = []
      
      for (let i = 1; i <= Number(campaignCount.return); i++) {
        try {
          const campaignDetails = await appClient.send.getCampaignDetails({ campaignId: i })
          if (campaignDetails.return) {
            const [id, title, target, raised, creator, active] = campaignDetails.return
            loadedCampaigns.push({
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
      setCampaigns(loadedCampaigns)
      
      enqueueSnackbar('Data loaded successfully!', { variant: 'success' })
      
    } catch (error) {
      enqueueSnackbar(`Error loading data: ${error}`, { variant: 'error' })
      console.error('Data loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterOrganization = async () => {
    if (!registrationForm.name.trim() || !algorandClient || !activeAddress) return

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

      const walletAddr = registrationForm.walletAddress.trim() || activeAddress
      
      const result = await appClient.send.registerOrganization({
        orgName: registrationForm.name.trim(),
        walletAddress: walletAddr
      })

      enqueueSnackbar(`Organization registered! ID: ${result.return}`, { variant: 'success' })
      
      // Reset form and close modal
      setRegistrationForm({ name: '', walletAddress: '' })
      setShowRegisterModal(false)
      
      // Reload data
      await loadData()
      
    } catch (error) {
      enqueueSnackbar(`Registration failed: ${error}`, { variant: 'error' })
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    if (!campaignForm.title.trim() || !campaignForm.target || !campaignForm.creator.trim() || !algorandClient || !activeAddress) return

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

      const targetMicroAlgos = Math.round(parseFloat(campaignForm.target) * 1_000_000)
      
      const result = await appClient.send.createCampaign({
        title: campaignForm.title.trim(),
        target: targetMicroAlgos,
        creator: campaignForm.creator.trim()
      })

      enqueueSnackbar(`Campaign created! ID: ${result.return}`, { variant: 'success' })
      
      // Reset form and close modal
      setCampaignForm({ title: '', target: '', creator: '' })
      setShowCreateCampaignModal(false)
      
      // Reload data
      await loadData()
      
    } catch (error) {
      enqueueSnackbar(`Campaign creation failed: ${error}`, { variant: 'error' })
      console.error('Campaign creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAlgo = (microAlgos: number) => {
    return (microAlgos / 1_000_000).toFixed(6) + ' ALGO'
  }

  const getVerificationBadge = (level: number) => {
    switch (level) {
      case 0: return { text: 'Unverified', color: '#6b7280' }
      case 1: return { text: 'Basic', color: '#059669' }
      case 2: return { text: 'Verified', color: '#2563eb' }
      case 3: return { text: 'Partner', color: '#7c3aed' }
      default: return { text: 'Unknown', color: '#6b7280' }
    }
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
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
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
    section: {
      marginBottom: '3rem'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem'
    },
    cardSubtitle: {
      color: '#6b7280',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    },
    badge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'white',
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
    emptyState: {
      textAlign: 'center' as const,
      padding: '3rem',
      color: '#6b7280'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    modal: {
      display: 'flex',
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
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#1f2937'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical' as const
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
    }
  }

  if (error) {
    return (
      <div style={{ ...styles.container, ...styles.emptyState }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Connection Error</p>
        <p>{error.message}</p>
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
            style={styles.button}
            onClick={() => setShowRegisterModal(true)}
          >
            Register Organization
          </button>
          <button 
            style={styles.button}
            onClick={() => setShowCreateCampaignModal(true)}
          >
            Create Campaign
          </button>
          <button 
            style={styles.refreshButton}
            onClick={loadData}
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
        {/* Organizations Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Registered Organizations</h2>
          </div>
          
          {organizations.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🏢</div>
              <h3>No Organizations Registered</h3>
              <p>Be the first to register your humanitarian organization!</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {organizations.map((org) => {
                const badge = getVerificationBadge(org.verificationLevel)
                return (
                  <div key={org.id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{org.name}</h3>
                    <div 
                      style={{ ...styles.badge, backgroundColor: badge.color }}
                    >
                      {badge.text}
                    </div>
                    <p style={styles.cardSubtitle}>
                      Wallet: {org.walletAddress.slice(0, 8)}...{org.walletAddress.slice(-6)}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Organization ID: {org.id}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Campaigns Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Active Campaigns</h2>
          </div>
          
          {campaigns.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎯</div>
              <h3>No Campaigns Created</h3>
              <p>Create your first fundraising campaign!</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {campaigns.map((campaign) => (
                <div key={campaign.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{campaign.title}</h3>
                  <p style={styles.cardSubtitle}>By: {campaign.creator}</p>
                  
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
                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      {((campaign.raised / campaign.target) * 100).toFixed(1)}% funded
                    </div>
                  </div>

                  <div style={{ 
                    padding: '0.5rem', 
                    borderRadius: '0.375rem',
                    backgroundColor: campaign.active ? '#dcfce7' : '#fef2f2',
                    color: campaign.active ? '#166534' : '#991b1b',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {campaign.active ? '✅ Active' : '❌ Inactive'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Register Organization Modal */}
      {showRegisterModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Register Organization</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Organization Name *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., International Red Cross" 
                value={registrationForm.name}
                onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Wallet Address (Optional)</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder={`Leave empty to use current: ${activeAddress?.slice(0, 20)}...`}
                value={registrationForm.walletAddress}
                onChange={(e) => setRegistrationForm({...registrationForm, walletAddress: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowRegisterModal(false)
                  setRegistrationForm({ name: '', walletAddress: '' })
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!registrationForm.name.trim() || loading) ? 0.5 : 1
                }}
                onClick={handleRegisterOrganization}
                disabled={!registrationForm.name.trim() || loading}
              >
                {loading ? '⟳ Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaignModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Create Campaign</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Campaign Title *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., Hurricane Relief Fund" 
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Target Amount (ALGO) *</label>
              <input 
                style={styles.input}
                type="number" 
                placeholder="e.g., 1000" 
                value={campaignForm.target}
                onChange={(e) => setCampaignForm({...campaignForm, target: e.target.value})}
                step="0.000001"
                min="0"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Creator/Organization Name *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., Red Cross" 
                value={campaignForm.creator}
                onChange={(e) => setCampaignForm({...campaignForm, creator: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowCreateCampaignModal(false)
                  setCampaignForm({ title: '', target: '', creator: '' })
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!campaignForm.title.trim() || !campaignForm.target || !campaignForm.creator.trim() || loading) ? 0.5 : 1
                }}
                onClick={handleCreateCampaign}
                disabled={!campaignForm.title.trim() || !campaignForm.target || !campaignForm.creator.trim() || loading}
              >
                {loading ? '⟳ Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationPortal