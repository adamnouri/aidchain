import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useAppClient } from '../context/AppClientContext'
import { AidchainContractsFactory } from '../contracts/AidchainContracts'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'

interface Voucher {
  id: number
  assetId: number
  name: string
  totalSupply: number
  issued: number
}

interface VoucherSystemProps {
  onBackToLanding: () => void
}

const VoucherSystem: React.FC<VoucherSystemProps> = ({ onBackToLanding }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateVoucherModal, setShowCreateVoucherModal] = useState(false)
  const [showDistributeModal, setShowDistributeModal] = useState(false)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  
  const [createForm, setCreateForm] = useState({
    assetName: '',
    totalSupply: ''
  })
  
  const [distributeForm, setDistributeForm] = useState({
    recipientAddress: '',
    amount: ''
  })
  
  const [redeemForm, setRedeemForm] = useState({
    merchant: '',
    amount: ''
  })
  
  const { activeAddress } = useWallet()
  const { algorandClient, error } = useAppClient()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (activeAddress && algorandClient) {
      loadVouchers()
    }
  }, [activeAddress, algorandClient])

  const loadVouchers = async () => {
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

      // Load vouchers
      const voucherCount = await appClient.send.get_voucher_count()
      const loadedVouchers: Voucher[] = []
      
      for (let i = 1; i <= Number(voucherCount.return); i++) {
        try {
          const voucherDetails = await appClient.send.get_voucher_details({ voucher_id: i })
          if (voucherDetails.return) {
            const [id, assetId, name, totalSupply, issued] = voucherDetails.return
            loadedVouchers.push({
              id: Number(id),
              assetId: Number(assetId),
              name: name,
              totalSupply: Number(totalSupply),
              issued: Number(issued)
            })
          }
        } catch (error) {
          console.log(`Voucher ${i} not found:`, error)
        }
      }
      setVouchers(loadedVouchers)
      
      enqueueSnackbar('Vouchers loaded successfully!', { variant: 'success' })
      
    } catch (error) {
      enqueueSnackbar(`Error loading vouchers: ${error}`, { variant: 'error' })
      console.error('Voucher loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVoucher = async () => {
    if (!createForm.assetName.trim() || !createForm.totalSupply || !algorandClient || !activeAddress) return

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

      const totalSupply = parseInt(createForm.totalSupply)
      
      const result = await appClient.send.create_voucher_asset({
        asset_name: createForm.assetName.trim(),
        total_supply: totalSupply
      })

      enqueueSnackbar(`Voucher asset created! Asset ID: ${result.return}`, { variant: 'success' })
      
      setCreateForm({ assetName: '', totalSupply: '' })
      setShowCreateVoucherModal(false)
      await loadVouchers()
      
    } catch (error) {
      enqueueSnackbar(`Voucher creation failed: ${error}`, { variant: 'error' })
      console.error('Voucher creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDistributeVouchers = async () => {
    if (!selectedVoucher || !distributeForm.recipientAddress.trim() || !distributeForm.amount || !algorandClient || !activeAddress) return

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

      const amount = parseInt(distributeForm.amount)
      
      const result = await appClient.send.distribute_vouchers({
        asset_id: selectedVoucher.assetId,
        recipient: distributeForm.recipientAddress.trim(),
        amount: amount
      })

      enqueueSnackbar(`Vouchers distributed! ${result.return}`, { variant: 'success' })
      
      setDistributeForm({ recipientAddress: '', amount: '' })
      setShowDistributeModal(false)
      setSelectedVoucher(null)
      await loadVouchers()
      
    } catch (error) {
      enqueueSnackbar(`Voucher distribution failed: ${error}`, { variant: 'error' })
      console.error('Voucher distribution error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemVoucher = async () => {
    if (!selectedVoucher || !redeemForm.merchant.trim() || !redeemForm.amount || !algorandClient || !activeAddress) return

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

      const amount = parseInt(redeemForm.amount)
      
      const result = await appClient.send.redeem_voucher({
        voucher_id: selectedVoucher.id,
        merchant: redeemForm.merchant.trim(),
        amount: amount
      })

      enqueueSnackbar(`Voucher redeemed! ${result.return}`, { variant: 'success' })
      
      setRedeemForm({ merchant: '', amount: '' })
      setShowRedeemModal(false)
      setSelectedVoucher(null)
      await loadVouchers()
      
    } catch (error) {
      enqueueSnackbar(`Voucher redemption failed: ${error}`, { variant: 'error' })
      console.error('Voucher redemption error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUtilizationPercentage = (voucher: Voucher) => {
    if (voucher.totalSupply === 0) return 0
    return (voucher.issued / voucher.totalSupply) * 100
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
      marginBottom: '0.5rem',
      color: '#1f2937'
    },
    cardSubtitle: {
      color: '#6b7280',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    },
    metricRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
      fontSize: '0.875rem'
    },
    progressContainer: {
      marginBottom: '1rem'
    },
    progressBar: {
      width: '100%',
      height: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '9999px',
      overflow: 'hidden',
      marginTop: '0.5rem'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      transition: 'width 0.3s ease'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap' as const,
      marginTop: '1rem'
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
    primaryButton: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    successButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    warningButton: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    assetBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      marginBottom: '1rem'
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
            onClick={() => setShowCreateVoucherModal(true)}
          >
            Create Voucher Asset
          </button>
          <button 
            style={styles.refreshButton}
            onClick={loadVouchers}
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
          <h2 style={styles.sectionTitle}>Voucher Distribution System</h2>
        </div>

        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem', color: '#1e40af' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>🎫 ASA Token Vouchers</h3>
          <p style={{ margin: '0', fontSize: '0.875rem' }}>
            Create, distribute, and redeem Algorand Standard Asset (ASA) tokens for humanitarian aid distribution. 
            Each voucher is a real blockchain token that can be transferred and redeemed by approved merchants.
          </p>
        </div>
        
        {vouchers.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎫</div>
            <h3>No Voucher Assets Created</h3>
            <p>Create your first ASA token voucher for aid distribution!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {vouchers.map((voucher) => (
              <div key={voucher.id} style={styles.card}>
                <div style={styles.assetBadge}>
                  ASA ID: {voucher.assetId}
                </div>
                
                <h3 style={styles.cardTitle}>{voucher.name}</h3>
                <p style={styles.cardSubtitle}>Voucher ID: {voucher.id}</p>
                
                <div style={styles.metricRow}>
                  <span>Total Supply:</span>
                  <span style={{ fontWeight: '600' }}>{voucher.totalSupply.toLocaleString()}</span>
                </div>
                
                <div style={styles.metricRow}>
                  <span>Issued:</span>
                  <span style={{ fontWeight: '600', color: '#10b981' }}>{voucher.issued.toLocaleString()}</span>
                </div>
                
                <div style={styles.metricRow}>
                  <span>Available:</span>
                  <span style={{ fontWeight: '600', color: '#2563eb' }}>{(voucher.totalSupply - voucher.issued).toLocaleString()}</span>
                </div>

                <div style={styles.progressContainer}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Utilization: {getUtilizationPercentage(voucher).toFixed(1)}%
                  </div>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${getUtilizationPercentage(voucher)}%`
                      }}
                    />
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  <button 
                    style={{...styles.actionButton, ...styles.primaryButton}}
                    onClick={() => {
                      setSelectedVoucher(voucher)
                      setDistributeForm({ recipientAddress: '', amount: '' })
                      setShowDistributeModal(true)
                    }}
                    disabled={voucher.totalSupply - voucher.issued <= 0}
                  >
                    Distribute
                  </button>
                  
                  <button 
                    style={{...styles.actionButton, ...styles.warningButton}}
                    onClick={() => {
                      setSelectedVoucher(voucher)
                      setRedeemForm({ merchant: '', amount: '' })
                      setShowRedeemModal(true)
                    }}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Voucher Modal */}
      {showCreateVoucherModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Create Voucher Asset (ASA Token)</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Asset Name *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., Food Aid Voucher, Medicine Token" 
                value={createForm.assetName}
                onChange={(e) => setCreateForm({...createForm, assetName: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Total Supply *</label>
              <input 
                style={styles.input}
                type="number" 
                placeholder="e.g., 10000" 
                value={createForm.totalSupply}
                onChange={(e) => setCreateForm({...createForm, totalSupply: e.target.value})}
                min="1"
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowCreateVoucherModal(false)
                  setCreateForm({ assetName: '', totalSupply: '' })
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!createForm.assetName.trim() || !createForm.totalSupply || loading) ? 0.5 : 1
                }}
                onClick={handleCreateVoucher}
                disabled={!createForm.assetName.trim() || !createForm.totalSupply || loading}
              >
                {loading ? '⟳ Creating...' : 'Create ASA Token'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Distribute Vouchers Modal */}
      {showDistributeModal && selectedVoucher && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Distribute Vouchers</h3>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{selectedVoucher.name}</h4>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
                Available: {(selectedVoucher.totalSupply - selectedVoucher.issued).toLocaleString()} tokens
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Address *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="Recipient wallet address" 
                value={distributeForm.recipientAddress}
                onChange={(e) => setDistributeForm({...distributeForm, recipientAddress: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount *</label>
              <input 
                style={styles.input}
                type="number" 
                placeholder="Number of tokens to distribute" 
                value={distributeForm.amount}
                onChange={(e) => setDistributeForm({...distributeForm, amount: e.target.value})}
                min="1"
                max={selectedVoucher.totalSupply - selectedVoucher.issued}
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowDistributeModal(false)
                  setDistributeForm({ recipientAddress: '', amount: '' })
                  setSelectedVoucher(null)
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  opacity: (!distributeForm.recipientAddress.trim() || !distributeForm.amount || loading) ? 0.5 : 1
                }}
                onClick={handleDistributeVouchers}
                disabled={!distributeForm.recipientAddress.trim() || !distributeForm.amount || loading}
              >
                {loading ? '⟳ Distributing...' : 'Distribute Tokens'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Voucher Modal */}
      {showRedeemModal && selectedVoucher && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Redeem Vouchers</h3>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>{selectedVoucher.name}</h4>
              <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
                Total Issued: {selectedVoucher.issued.toLocaleString()} tokens
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Merchant/Location *</label>
              <input 
                style={styles.input}
                type="text" 
                placeholder="e.g., Central Food Market, Local Pharmacy" 
                value={redeemForm.merchant}
                onChange={(e) => setRedeemForm({...redeemForm, merchant: e.target.value})}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount to Redeem *</label>
              <input 
                style={styles.input}
                type="number" 
                placeholder="Number of tokens to redeem" 
                value={redeemForm.amount}
                onChange={(e) => setRedeemForm({...redeemForm, amount: e.target.value})}
                min="1"
              />
            </div>

            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowRedeemModal(false)
                  setRedeemForm({ merchant: '', amount: '' })
                  setSelectedVoucher(null)
                }}
              >
                Cancel
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  backgroundColor: '#f59e0b',
                  opacity: (!redeemForm.merchant.trim() || !redeemForm.amount || loading) ? 0.5 : 1
                }}
                onClick={handleRedeemVoucher}
                disabled={!redeemForm.merchant.trim() || !redeemForm.amount || loading}
              >
                {loading ? '⟳ Redeeming...' : 'Redeem Tokens'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoucherSystem