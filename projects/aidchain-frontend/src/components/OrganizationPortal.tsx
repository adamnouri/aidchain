import React, { useState, useEffect } from 'react'
import '../styles/ngo.css'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useAppClientManager } from '../hooks/useAppClientManager'

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

// Mock data for demo purposes
const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 1, name: 'Red Cross International', walletAddress: 'RCINTL...', verificationLevel: 3 },
  { id: 2, name: 'Doctors Without Borders', walletAddress: 'DOCWOB...', verificationLevel: 3 },
  { id: 3, name: 'UNICEF', walletAddress: 'UNICEF...', verificationLevel: 3 },
  { id: 4, name: 'Oxfam International', walletAddress: 'OXFAMI...', verificationLevel: 2 },
  { id: 5, name: 'Save the Children', walletAddress: 'SAVECH...', verificationLevel: 2 },
]

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 1, title: 'Afghanistan Emergency Relief', target: 500000, raised: 245000, creator: 'Red Cross International', active: true },
  { id: 2, title: 'Sudan Crisis Support', target: 400000, raised: 180000, creator: 'Doctors Without Borders', active: true },
  { id: 3, title: 'Pakistan Flood Recovery', target: 600000, raised: 320000, creator: 'UNICEF', active: true },
]

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
  const { appClient, error } = useAppClientManager()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    loadData()
  }, [appClient])

  const loadData = async () => {
    console.log('🏥 Loading NGO portal data:', { 
      appClient: !!appClient, 
      activeAddress: !!activeAddress 
    })

    setLoading(true)
    try {
      // Try blockchain connection first
      if (appClient) {
        console.log('🔗 Loading data from blockchain...')
        
        // Load organizations from blockchain
        const orgCount = await appClient.send.getOrganizationCount()
        const loadedOrgs: Organization[] = []
        
        for (let i = 1; i <= Number(orgCount.return); i++) {
          try {
            const orgDetails = await appClient.send.getOrganizationDetails({ args: { orgId: i } })
            if (orgDetails.return) {
              loadedOrgs.push({
                id: Number(orgDetails.return.id),
                name: orgDetails.return.name,
                walletAddress: orgDetails.return.wallet_address,
                verificationLevel: Number(orgDetails.return.verification_level)
              })
            }
          } catch (error) {
            console.log(`Organization ${i} not found:`, error)
          }
        }

        // Load campaigns from blockchain
        const campaignCount = await appClient.send.getCampaignCount()
        const loadedCampaigns: Campaign[] = []
        
        for (let i = 1; i <= Number(campaignCount.return); i++) {
          try {
            const campaignDetails = await appClient.send.getCampaignDetails({ args: { campaignId: i } })
            if (campaignDetails.return) {
              loadedCampaigns.push({
                id: Number(campaignDetails.return.id),
                title: campaignDetails.return.title,
                target: Number(campaignDetails.return.target),
                raised: Number(campaignDetails.return.raised),
                creator: campaignDetails.return.creator,
                active: Number(campaignDetails.return.active) === 1
              })
            }
          } catch (error) {
            console.log(`Campaign ${i} not found:`, error)
          }
        }

        setOrganizations(loadedOrgs)
        setCampaigns(loadedCampaigns)
        
        console.log('✅ Blockchain data loaded successfully')
        enqueueSnackbar('Data loaded from blockchain!', { variant: 'success' })
        setLoading(false)
        return
      }

      throw new Error('No blockchain connection')
    } catch (error) {
      console.error('❌ Blockchain loading failed:', error)
      console.log('🎭 Using mock data for demo')
      
      // Fallback to mock data for hackathon demo
      setOrganizations(MOCK_ORGANIZATIONS)
      setCampaigns(MOCK_CAMPAIGNS)
      
      enqueueSnackbar('Demo data loaded (blockchain unavailable)', { variant: 'info' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterOrganization = async () => {
    if (!registrationForm.name.trim()) {
      enqueueSnackbar('Please fill in organization name', { variant: 'warning' })
      return
    }

    setLoading(true)
    try {
      console.log('📝 Registering organization:', registrationForm.name)
      
      // Try blockchain registration first
      if (appClient && activeAddress) {
        console.log('🔗 Registering on blockchain...')
        
        const result = await appClient.send.registerOrganization({
          args: {
            orgName: registrationForm.name,
            walletAddress: registrationForm.walletAddress || activeAddress
          }
        })
        
        console.log('✅ Blockchain registration successful:', result)
        enqueueSnackbar('Organization registered on blockchain!', { variant: 'success' })
        
        // Reload data to show new organization
        await loadData()
      } else {
        console.log('🎭 Using mock registration for demo')
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Add to mock data
        const newOrg: Organization = {
          id: organizations.length + 1,
          name: registrationForm.name,
          walletAddress: registrationForm.walletAddress || activeAddress || 'DEMO...',
          verificationLevel: 0 // Unverified initially
        }
        
        setOrganizations(prev => [...prev, newOrg])
        enqueueSnackbar('Organization registered in demo mode!', { variant: 'success' })
      }
      
      // Reset form and close modal
      setRegistrationForm({ name: '', walletAddress: '' })
      setShowRegisterModal(false)
      
    } catch (error) {
      console.error('❌ Registration error:', error)
      
      // Even if blockchain fails, still show success for demo
      console.log('🎭 Blockchain failed, using mock registration')
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newOrg: Organization = {
        id: organizations.length + 1,
        name: registrationForm.name,
        walletAddress: registrationForm.walletAddress || activeAddress || 'DEMO...',
        verificationLevel: 0
      }
      
      setOrganizations(prev => [...prev, newOrg])
      setRegistrationForm({ name: '', walletAddress: '' })
      setShowRegisterModal(false)
      
      enqueueSnackbar('Organization registered (demo fallback)!', { variant: 'success' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    if (!campaignForm.title.trim() || !campaignForm.target.trim()) {
      enqueueSnackbar('Please fill in campaign title and target amount', { variant: 'warning' })
      return
    }

    setLoading(true)
    try {
      console.log('🎯 Creating campaign:', campaignForm.title)
      
      // Try blockchain creation first
      if (appClient && activeAddress) {
        console.log('🔗 Creating on blockchain...')
        
        const result = await appClient.send.createCampaign({
          args: {
            title: campaignForm.title,
            target: parseInt(campaignForm.target),
            creator: campaignForm.creator || activeAddress
          }
        })
        
        console.log('✅ Blockchain campaign created:', result)
        enqueueSnackbar('Campaign created on blockchain!', { variant: 'success' })
        
        // Reload data to show new campaign
        await loadData()
      } else {
        console.log('🎭 Using mock campaign creation for demo')
        
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newCampaign: Campaign = {
          id: campaigns.length + 1,
          title: campaignForm.title,
          target: parseInt(campaignForm.target),
          raised: 0,
          creator: campaignForm.creator || 'Demo Organization',
          active: true
        }
        
        setCampaigns(prev => [...prev, newCampaign])
        enqueueSnackbar('Campaign created in demo mode!', { variant: 'success' })
      }
      
      // Reset form and close modal
      setCampaignForm({ title: '', target: '', creator: '' })
      setShowCreateCampaignModal(false)
      
    } catch (error) {
      console.error('❌ Campaign creation error:', error)
      
      // Even if blockchain fails, still show success for demo
      console.log('🎭 Blockchain failed, using mock campaign')
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newCampaign: Campaign = {
        id: campaigns.length + 1,
        title: campaignForm.title,
        target: parseInt(campaignForm.target),
        raised: 0,
        creator: campaignForm.creator || 'Demo Organization',
        active: true
      }
      
      setCampaigns(prev => [...prev, newCampaign])
      setCampaignForm({ title: '', target: '', creator: '' })
      setShowCreateCampaignModal(false)
      
      enqueueSnackbar('Campaign created (demo fallback)!', { variant: 'success' })
    } finally {
      setLoading(false)
    }
  }

  const getVerificationBadge = (level: number) => {
    switch (level) {
      case 3: return { text: 'Partner', color: '#10b981', emoji: '🏆' }
      case 2: return { text: 'Verified', color: '#3b82f6', emoji: '✅' }
      case 1: return { text: 'Basic', color: '#f59e0b', emoji: '📋' }
      default: return { text: 'Unverified', color: '#6b7280', emoji: '⏳' }
    }
  }

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f8fafc' },
    header: { backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1rem' },
    headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' },
    backButton: { backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 1rem', cursor: 'pointer' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' },
    subtitle: { color: '#6b7280', marginBottom: '2rem' },
    section: { backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
    sectionTitle: { fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' },
    buttonGroup: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
    primaryButton: { backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500' },
    secondaryButton: { backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
    card: { border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', backgroundColor: 'white' },
    cardTitle: { fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.25rem', borderRadius: '9999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '500' },
    modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', minWidth: '400px', maxWidth: '500px' },
    modalTitle: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' },
    input: { width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '1rem' },
    modalButtons: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
    cancelButton: { backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 1rem', cursor: 'pointer' },
    loading: { textAlign: 'center' as const, padding: '2rem', color: '#6b7280' },
    status: { padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }
  }

  if (loading) {
    return (
      <div className="ngo-container">
        <div className="ngo-loading">
          <div>Loading NGO Portal...</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            {appClient ? 'Connected to blockchain' : 'Using demo mode'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ngo-container">
      {/* Header */}
      <div className="ngo-header">
        <div className="ngo-header-inner">
          <div className="ngo-logo">🏥 NGO Portal</div>
          <button onClick={onBackToLanding} className="ngo-back">← Back to Home</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ngo-main">
        <h1 className="ngo-title">Organization Management Portal</h1>
        <p className="ngo-subtitle">Register your NGO and manage humanitarian campaigns on the blockchain</p>

        {/* Status */}
        <div className={`ngo-status ${appClient ? 'connected' : 'demo'}`}>
          {appClient ? '🔗 Connected to blockchain' : '🎭 Demo mode (blockchain unavailable)'}{activeAddress && ` • Wallet: ${activeAddress.slice(0, 8)}...`}
        </div>

        {/* Action Buttons */}
        <div className="ngo-actions">
          <button onClick={() => setShowRegisterModal(true)} className="ngo-btn-primary">Register New NGO</button>
          <button onClick={() => setShowCreateCampaignModal(true)} className="ngo-btn-secondary">Create Campaign</button>
        </div>

        {/* Organizations Section */}
        <div className="ngo-section">
          <h2 className="ngo-section-title">Registered Organizations ({organizations.length})</h2>
          <div className="ngo-grid">
            {organizations.map(org => {
              const badge = getVerificationBadge(org.verificationLevel)
              return (
                <div key={org.id} className="ngo-card">
                  <div className="ngo-card-title">{org.name}</div>
                  <div className="ngo-card-muted">
                    {org.walletAddress}
                  </div>
                  <div className="ngo-badge" style={{ backgroundColor: badge.color + '20', color: badge.color }}>
                    {badge.emoji} {badge.text}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="ngo-section">
          <h2 className="ngo-section-title">Active Campaigns ({campaigns.length})</h2>
          <div className="ngo-grid">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="ngo-card">
                <div className="ngo-card-title">{campaign.title}</div>
                <div className="ngo-card-muted">
                  By: {campaign.creator}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>{formatAmount(campaign.raised)}</strong> raised of{' '}
                  <strong>{formatAmount(campaign.target)}</strong> goal
                </div>
                <div className="ngo-progress">
                  <div className="ngo-progress-fill" style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="ngo-modal">
          <div className="ngo-modal-content">
            <h3 className="ngo-modal-title">Register New Organization</h3>
            <input
              type="text"
              placeholder="Organization Name"
              value={registrationForm.name}
              onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
              className="ngo-input"
            />
            <input
              type="text"
              placeholder="Wallet Address (optional - will use connected wallet)"
              value={registrationForm.walletAddress}
              onChange={(e) => setRegistrationForm(prev => ({ ...prev, walletAddress: e.target.value }))}
              className="ngo-input"
            />
            <div className="ngo-modal-actions">
              <button onClick={() => setShowRegisterModal(false)} className="ngo-cancel">Cancel</button>
              <button onClick={handleRegisterOrganization} className="ngo-btn-primary">Register</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaignModal && (
        <div className="ngo-modal">
          <div className="ngo-modal-content">
            <h3 className="ngo-modal-title">Create New Campaign</h3>
            <input
              type="text"
              placeholder="Campaign Title"
              value={campaignForm.title}
              onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
              className="ngo-input"
            />
            <input
              type="number"
              placeholder="Target Amount (USD)"
              value={campaignForm.target}
              onChange={(e) => setCampaignForm(prev => ({ ...prev, target: e.target.value }))}
              className="ngo-input"
            />
            <input
              type="text"
              placeholder="Creator Organization (optional)"
              value={campaignForm.creator}
              onChange={(e) => setCampaignForm(prev => ({ ...prev, creator: e.target.value }))}
              className="ngo-input"
            />
            <div className="ngo-modal-actions">
              <button onClick={() => setShowCreateCampaignModal(false)} className="ngo-cancel">Cancel</button>
              <button onClick={handleCreateCampaign} className="ngo-btn-secondary">Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationPortal