import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'

interface Milestone {
  id: number
  campaignId: number
  targetAmount: number
  description: string
  completed: boolean
  fundsReleased: boolean
}

interface Campaign {
  id: number
  title: string
  target: number
  raised: number
  creator: string
  active: boolean
}

interface MilestoneTrackerProps {
  onBackToLanding: () => void
}

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ onBackToLanding }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateMilestoneModal, setShowCreateMilestoneModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showReleaseModal, setShowReleaseModal] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  
  const [milestoneForm, setMilestoneForm] = useState({
    campaignId: '',
    targetAmount: '',
    description: ''
  })
  
  const [proofForm, setProofForm] = useState({
    proof: ''
  })
  
  const [releaseForm, setReleaseForm] = useState({
    recipientAddress: '',
    amount: ''
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

      // Load campaigns first
      const campaignCount = await appClient.send.get_campaign_count()
      const loadedCampaigns: Campaign[] = []
      
      for (let i = 1; i <= Number(campaignCount.return); i++) {
        try {
          const campaignDetails = await appClient.send.get_campaign_details({ campaign_id: i })
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

      // Load milestones
      const milestoneCount = await appClient.send.get_milestone_count()
      const loadedMilestones: Milestone[] = []
      
      for (let i = 1; i <= Number(milestoneCount.return); i++) {
        try {
          const milestoneDetails = await appClient.send.get_milestone_details({ milestone_id: i })
          if (milestoneDetails.return) {
            const [id, campaignId, targetAmount, description, completed, fundsReleased] = milestoneDetails.return
            loadedMilestones.push({
              id: Number(id),
              campaignId: Number(campaignId),
              targetAmount: Number(targetAmount),
              description: description,
              completed: Number(completed) === 1,
              fundsReleased: Number(fundsReleased) === 1
            })
          }
        } catch (error) {
          console.log(`Milestone ${i} not found:`, error)
        }
      }
      setMilestones(loadedMilestones)
      
      enqueueSnackbar('Data loaded successfully!', { variant: 'success' })
      
    } catch (error) {
      enqueueSnackbar(`Error loading data: ${error}`, { variant: 'error' })
      console.error('Data loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMilestone = async () => {
    if (!milestoneForm.campaignId || !milestoneForm.targetAmount || !milestoneForm.description.trim() || !algorandClient || !activeAddress) return

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

      const targetMicroAlgos = Math.round(parseFloat(milestoneForm.targetAmount) * 1_000_000)
      
      const result = await appClient.send.create_milestone({
        campaign_id: parseInt(milestoneForm.campaignId),
        target_amount: targetMicroAlgos,
        description: milestoneForm.description.trim()
      })

      enqueueSnackbar(`Milestone created! ID: ${result.return}`, { variant: 'success' })
      
      setMilestoneForm({ campaignId: '', targetAmount: '', description: '' })
      setShowCreateMilestoneModal(false)
      await loadData()
      
    } catch (error) {
      enqueueSnackbar(`Milestone creation failed: ${error}`, { variant: 'error' })
      console.error('Milestone creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteMilestone = async () => {
    if (!selectedMilestone || !proofForm.proof.trim() || !algorandClient || !activeAddress) return

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
      
      const result = await appClient.send.complete_milestone({
        milestone_id: selectedMilestone.id,
        proof: proofForm.proof.trim()
      })

      enqueueSnackbar(`Milestone completed! ${result.return}`, { variant: 'success' })
      
      setProofForm({ proof: '' })
      setShowCompleteModal(false)
      setSelectedMilestone(null)
      await loadData()
      
    } catch (error) {
      enqueueSnackbar(`Milestone completion failed: ${error}`, { variant: 'error' })
      console.error('Milestone completion error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReleaseFunds = async () => {
    if (!selectedMilestone || !releaseForm.recipientAddress.trim() || !releaseForm.amount || !algorandClient || !activeAddress) return

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

      const amountMicroAlgos = Math.round(parseFloat(releaseForm.amount) * 1_000_000)
      
      const result = await appClient.send.release_milestone_funds({
        milestone_id: selectedMilestone.id,
        recipient: releaseForm.recipientAddress.trim(),
        amount: amountMicroAlgos
      })

      enqueueSnackbar(`Funds released! ${result.return}`, { variant: 'success' })
      
      setReleaseForm({ recipientAddress: '', amount: '' })
      setShowReleaseModal(false)
      setSelectedMilestone(null)
      await loadData()
      
    } catch (error) {
      enqueueSnackbar(`Fund release failed: ${error}`, { variant: 'error' })
      console.error('Fund release error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAlgo = (microAlgos: number) => {
    return (microAlgos / 1_000_000).toFixed(6) + ' ALGO'
  }

  const getCampaignTitle = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    return campaign ? campaign.title : `Campaign #${campaignId}`
  }

  const getStatusColor = (milestone: Milestone) => {
    if (milestone.fundsReleased) return '#10b981' // green
    if (milestone.completed) return '#3b82f6' // blue
    return '#6b7280' // gray
  }

  const getStatusText = (milestone: Milestone) => {
    if (milestone.fundsReleased) return '✅ Funds Released'
    if (milestone.completed) return '🏆 Completed'
    return '⏳ Pending'
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
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
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
    statusBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'white',
      marginBottom: '1rem'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const
    },
    actionButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    primaryActionButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    successActionButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '3rem',
      color: '#6b7280'
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
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      backgroundColor: 'white'
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
            onClick={() => setShowCreateMilestoneModal(true)}
          >
            Create Milestone
          </button>
          <button 
            style={styles.refreshButton}
            onClick={loadData}
            disabled={loading}
          >
            {loading ? '⟳' : '🔄'} Refresh
          </button>
          <div style={{ color: '#2563eb', fontSize: '0.875rem' }}>
            {activeAddress ? `${activeAddress.slice(0, 8)}...${activeAddress.slice(-6)}` : 'Not Connected'}
          </div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Milestone Tracking</h2>
        </div>
        
        {milestones.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            <h3>No Milestones Created</h3>
            <p>Create your first milestone to start tracking campaign progress!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {milestones.map((milestone) => (
              <div key={milestone.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{milestone.description}</h3>
                <p style={styles.cardSubtitle}>
                  {getCampaignTitle(milestone.campaignId)} • Target: {formatAlgo(milestone.targetAmount)}
                </p>
                
                <div 
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(milestone)
                  }}
                >
                  {getStatusText(milestone)}
                </div>

                <div style={styles.actionButtons}>
                  {!milestone.completed && (
                    <button 
                      style={{...styles.actionButton, ...styles.primaryActionButton}}
                      onClick={() => {
                        setSelectedMilestone(milestone)
                        setShowCompleteModal(true)
                      }}
                    >
                      Complete Milestone
                    </button>
                  )}
                  
                  {milestone.completed && !milestone.fundsReleased && (
                    <button 
                      style={{...styles.actionButton, ...styles.successActionButton}}
                      onClick={() => {
                        setSelectedMilestone(milestone)
                        setReleaseForm({ 
                          recipientAddress: activeAddress || '', 
                          amount: (milestone.targetAmount / 1_000_000).toString() 
                        })
                        setShowReleaseModal(true)
                      }}
                    >
                      Release Funds
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1rem' }}>
                  Milestone ID: {milestone.id} • Campaign ID: {milestone.campaignId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Milestone Modal */}
      {showCreateMilestoneModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Create New Milestone</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Campaign *</label>
              <select 
                style={styles.select}
                value={milestoneForm.campaignId}
                onChange={(e) => setMilestoneForm({...milestoneForm, campaignId: e.target.value})}
              >
                <option value="">Select a campaign...</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title} (ID: {campaign.id})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Target Amount (ALGO) *</label>
              <input 
                style={styles.input}
                type="number" 
                placeholder="e.g., 250" 
                value={milestoneForm.targetAmount}
                onChange={(e) => setMilestoneForm({...milestoneForm, targetAmount: e.target.value})}
                step="0.000001"
                min="0"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea 
                style={styles.textarea}
                placeholder="e.g., Phase 1: Emergency supplies delivered to 100 families" 
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowCreateMilestoneModal(false)
                  setMilestoneForm({ campaignId: '', targetAmount: '', description: '' })
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!milestoneForm.campaignId || !milestoneForm.targetAmount || !milestoneForm.description.trim() || loading) ? 0.5 : 1
                }}
                onClick={handleCreateMilestone}
                disabled={!milestoneForm.campaignId || !milestoneForm.targetAmount || !milestoneForm.description.trim() || loading}
              >
                {loading ? '⟳ Creating...' : 'Create Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Milestone Modal */}
      {showCompleteModal && selectedMilestone && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Complete Milestone</h3>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{selectedMilestone.description}</h4>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
                Target: {formatAlgo(selectedMilestone.targetAmount)}
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Proof of Completion *</label>
              <textarea 
                style={styles.textarea}
                placeholder="Provide proof of milestone completion (e.g., IPFS hash, receipt, photo URL, verification details...)" 
                value={proofForm.proof}
                onChange={(e) => setProofForm({...proofForm, proof: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowCompleteModal(false)
                  setProofForm({ proof: '' })
                  setSelectedMilestone(null)
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!proofForm.proof.trim() || loading) ? 0.5 : 1
                }}
                onClick={handleCompleteMilestone}
                disabled={!proofForm.proof.trim() || loading}
              >
                {loading ? '⟳ Completing...' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Release Funds Modal */}
      {showReleaseModal && selectedMilestone && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Release Milestone Funds</h3>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{selectedMilestone.description}</h4>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
                Available: {formatAlgo(selectedMilestone.targetAmount)}
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Address *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="Recipient wallet address" 
                value={releaseForm.recipientAddress}
                onChange={(e) => setReleaseForm({...releaseForm, recipientAddress: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount to Release (ALGO) *</label>
              <input 
                style={styles.input}
                type="number" 
                placeholder="Amount in ALGO" 
                value={releaseForm.amount}
                onChange={(e) => setReleaseForm({...releaseForm, amount: e.target.value})}
                step="0.000001"
                min="0"
                max={selectedMilestone.targetAmount / 1_000_000}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowReleaseModal(false)
                  setReleaseForm({ recipientAddress: '', amount: '' })
                  setSelectedMilestone(null)
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!releaseForm.recipientAddress.trim() || !releaseForm.amount || loading) ? 0.5 : 1,
                  backgroundColor: '#10b981'
                }}
                onClick={handleReleaseFunds}
                disabled={!releaseForm.recipientAddress.trim() || !releaseForm.amount || loading}
              >
                {loading ? '⟳ Releasing...' : 'Release Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MilestoneTracker