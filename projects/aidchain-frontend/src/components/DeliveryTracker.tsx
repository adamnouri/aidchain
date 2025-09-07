import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'

interface Delivery {
  id: number
  recipient: string
  location: string
  agent: string
  verified: boolean
}

interface DeliveryTrackerProps {
  onBackToLanding: () => void
}

const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ onBackToLanding }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)
  const [showLogDeliveryModal, setShowLogDeliveryModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  
  const [logForm, setLogForm] = useState({
    recipient: '',
    location: ''
  })
  
  const [verifyForm, setVerifyForm] = useState({
    agent: ''
  })
  
  const { activeAddress } = useWallet()
  const { algorandClient, error } = useAppClient()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (activeAddress && algorandClient) {
      loadDeliveries()
    }
  }, [activeAddress, algorandClient])

  const loadDeliveries = async () => {
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

      // Load deliveries
      const deliveryCount = await appClient.send.get_delivery_count()
      const loadedDeliveries: Delivery[] = []
      
      for (let i = 1; i <= Number(deliveryCount.return); i++) {
        try {
          const deliveryDetails = await appClient.send.get_delivery_details({ delivery_id: i })
          if (deliveryDetails.return) {
            const [id, recipient, location, agent, verified] = deliveryDetails.return
            loadedDeliveries.push({
              id: Number(id),
              recipient: recipient,
              location: location,
              agent: agent,
              verified: Number(verified) === 1
            })
          }
        } catch (error) {
          console.log(`Delivery ${i} not found:`, error)
        }
      }
      setDeliveries(loadedDeliveries)
      
      enqueueSnackbar('Deliveries loaded successfully!', { variant: 'success' })
      
    } catch (error) {
      enqueueSnackbar(`Error loading deliveries: ${error}`, { variant: 'error' })
      console.error('Delivery loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogDelivery = async () => {
    if (!logForm.recipient.trim() || !logForm.location.trim() || !algorandClient || !activeAddress) return

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
      
      const result = await appClient.send.log_delivery({
        recipient: logForm.recipient.trim(),
        location: logForm.location.trim()
      })

      enqueueSnackbar(`Delivery logged! ID: ${result.return}`, { variant: 'success' })
      
      setLogForm({ recipient: '', location: '' })
      setShowLogDeliveryModal(false)
      await loadDeliveries()
      
    } catch (error) {
      enqueueSnackbar(`Delivery logging failed: ${error}`, { variant: 'error' })
      console.error('Delivery logging error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyDelivery = async () => {
    if (!selectedDelivery || !verifyForm.agent.trim() || !algorandClient || !activeAddress) return

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
      
      const result = await appClient.send.verify_delivery({
        delivery_id: selectedDelivery.id,
        agent: verifyForm.agent.trim()
      })

      enqueueSnackbar(`Delivery verified! ${result.return}`, { variant: 'success' })
      
      setVerifyForm({ agent: '' })
      setShowVerifyModal(false)
      setSelectedDelivery(null)
      await loadDeliveries()
      
    } catch (error) {
      enqueueSnackbar(`Delivery verification failed: ${error}`, { variant: 'error' })
      console.error('Delivery verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (verified: boolean) => {
    return verified ? '#10b981' : '#f59e0b'
  }

  const getStatusText = (verified: boolean) => {
    return verified ? '✅ Verified' : '⏳ Pending Verification'
  }

  const getVerifiedCount = () => {
    return deliveries.filter(d => d.verified).length
  }

  const getPendingCount = () => {
    return deliveries.filter(d => !d.verified).length
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
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
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
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.25rem'
    },
    cardId: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'white'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      marginBottom: '0.75rem',
      fontSize: '0.875rem'
    },
    infoLabel: {
      fontWeight: '500',
      color: '#374151',
      minWidth: '80px'
    },
    infoValue: {
      color: '#6b7280',
      flex: 1
    },
    actionButton: {
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      marginTop: '1rem'
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
            onClick={() => setShowLogDeliveryModal(true)}
          >
            Log Delivery
          </button>
          <button 
            style={styles.refreshButton}
            onClick={loadDeliveries}
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
        {/* Statistics */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#2563eb' }}>
              {deliveries.length}
            </div>
            <div style={styles.statLabel}>Total Deliveries</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#10b981' }}>
              {getVerifiedCount()}
            </div>
            <div style={styles.statLabel}>Verified</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#f59e0b' }}>
              {getPendingCount()}
            </div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: '#7c3aed' }}>
              {deliveries.length > 0 ? Math.round((getVerifiedCount() / deliveries.length) * 100) : 0}%
            </div>
            <div style={styles.statLabel}>Verification Rate</div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '0.5rem', color: '#166534' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>📦 Delivery Tracking System</h3>
          <p style={{ margin: '0', fontSize: '0.875rem' }}>
            Log aid deliveries and verify them with field agents. Each delivery is recorded on the blockchain 
            with recipient details, location data, and verification status for complete transparency.
          </p>
        </div>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Delivery Records</h2>
        </div>
        
        {deliveries.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>No Deliveries Logged</h3>
            <p>Start tracking aid deliveries by logging your first delivery!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {deliveries.map((delivery) => (
              <div key={delivery.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>Delivery #{delivery.id}</h3>
                    <div style={styles.cardId}>ID: {delivery.id}</div>
                  </div>
                  <div 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(delivery.verified)
                    }}
                  >
                    {getStatusText(delivery.verified)}
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Recipient:</span>
                  <span style={styles.infoValue}>{delivery.recipient}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Location:</span>
                  <span style={styles.infoValue}>{delivery.location}</span>
                </div>

                {delivery.agent && (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Agent:</span>
                    <span style={styles.infoValue}>{delivery.agent}</span>
                  </div>
                )}

                {!delivery.verified && (
                  <button 
                    style={styles.actionButton}
                    onClick={() => {
                      setSelectedDelivery(delivery)
                      setVerifyForm({ agent: '' })
                      setShowVerifyModal(true)
                    }}
                  >
                    Verify Delivery
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Delivery Modal */}
      {showLogDeliveryModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Log New Delivery</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., Refugee Camp A - Family #1247, Local Clinic" 
                value={logForm.recipient}
                onChange={(e) => setLogForm({...logForm, recipient: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <textarea 
                style={styles.textarea}
                placeholder="e.g., GPS: 40.7128,-74.0060, Building 5 Room 201, Central Distribution Point" 
                value={logForm.location}
                onChange={(e) => setLogForm({...logForm, location: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowLogDeliveryModal(false)
                  setLogForm({ recipient: '', location: '' })
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!logForm.recipient.trim() || !logForm.location.trim() || loading) ? 0.5 : 1
                }}
                onClick={handleLogDelivery}
                disabled={!logForm.recipient.trim() || !logForm.location.trim() || loading}
              >
                {loading ? '⟳ Logging...' : 'Log Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Delivery Modal */}
      {showVerifyModal && selectedDelivery && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Verify Delivery</h3>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>Delivery #{selectedDelivery.id}</h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                <strong>Recipient:</strong> {selectedDelivery.recipient}
              </p>
              <p style={{ margin: '0', fontSize: '0.875rem' }}>
                <strong>Location:</strong> {selectedDelivery.location}
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Verifying Agent *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., Field Agent Sarah Johnson, Local Coordinator Mike Chen" 
                value={verifyForm.agent}
                onChange={(e) => setVerifyForm({...verifyForm, agent: e.target.value})}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowVerifyModal(false)
                  setVerifyForm({ agent: '' })
                  setSelectedDelivery(null)
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  backgroundColor: '#10b981',
                  opacity: (!verifyForm.agent.trim() || loading) ? 0.5 : 1
                }}
                onClick={handleVerifyDelivery}
                disabled={!verifyForm.agent.trim() || loading}
              >
                {loading ? '⟳ Verifying...' : 'Verify Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryTracker