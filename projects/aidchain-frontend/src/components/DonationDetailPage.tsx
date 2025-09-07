// components/DonationDetailPage.tsx - Design 3: Individual Donation Detail
import React, { useState } from 'react'
import '../styles/donation.css'
import { useDonationDetail } from '../hooks/useAidChainUI'
import { useWallet } from '@txnlab/use-wallet-react'
import LoadingSpinner from './LoadingSpinner'
import logo from '../assets/logo.png'

interface DonationDetailPageProps {
  campaignId: number
  onBackToCategories: () => void
  onDonationComplete: (transactionHash: string) => void
  onBackToLanding: () => void
}

const DonationDetailPage: React.FC<DonationDetailPageProps> = ({
  campaignId,
  onBackToCategories,
  onDonationComplete,
  onBackToLanding
}) => {
  const { activeAddress } = useWallet()
  const { state, processDonation, setSelectedAmount, setCustomAmount } = useDonationDetail(campaignId)
  const [isProcessing, setIsProcessing] = useState(false)

  const styles = {
    container: { },
    nav: { },
    logo: { },
    logoImage: { },
    backButton: { },
    main: { },
    heroSection: { },
    heroImage: { },
    heroPlaceholder: { },
    heroOverlay: { },
    heroContent: { },
    heroTitle: { },
    heroSubtitle: { },
    contentSection: { },
    sectionTitle: { },
    description: { },
    statsGrid: { },
    statCard: { },
    statValue: { },
    statLabel: { },
    progressContainer: { },
    progressBar: { },
    progressFill: { },
    progressText: { },
    donationSection: { },
    amountGrid: { },
    amountButton: { },
    amountButtonSelected: { },
    customAmountContainer: { },
    customAmountLabel: { },
    customAmountInput: { },
    customAmountInputFocused: { },
    donateButton: { },
    donateButtonHover: { },
    donateButtonDisabled: { },
    walletWarning: { },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      color: 'white'
    },
    errorContainer: {
      textAlign: 'center' as const,
      color: 'white',
      padding: '2rem'
    },
    errorMessage: {
      fontSize: '1.125rem',
      marginBottom: '1rem'
    },
    retryButton: {
      backgroundColor: 'white',
      color: '#2563eb',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '600'
    }
  }

  const presetAmounts = [50, 100, 250, 500]

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const calculateProgress = (raised: number, target: number) => {
    return target > 0 ? Math.min((raised / target) * 100, 100) : 0
  }

  const getSelectedAmount = () => {
    if (state.customAmount && !isNaN(parseFloat(state.customAmount))) {
      return parseFloat(state.customAmount)
    }
    return state.selectedAmount
  }

  const handleDonation = async () => {
    if (!activeAddress) return

    const amount = getSelectedAmount()
    if (amount <= 0) return

    setIsProcessing(true)
    
    try {
      const result = await processDonation(amount)
      if (result) {
        // Create a mock transaction hash for demo purposes
        const mockTxnHash = `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        onDonationComplete(mockTxnHash)
      }
    } catch (error) {
      console.error('Donation failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getPlaceholderIcon = (title: string) => {
    if (title.toLowerCase().includes('afghanistan')) return '🏔️'
    if (title.toLowerCase().includes('sudan')) return '🌍'
    if (title.toLowerCase().includes('pakistan')) return '🌊'
    if (title.toLowerCase().includes('hurricane')) return '🌪️'
    if (title.toLowerCase().includes('syria')) return '🏛️'
    if (title.toLowerCase().includes('orphan')) return '👶'
    return '🤝'
  }

  if (state.loading) {
    return (
      <div className="donation-container donation-gradient">
        <nav className="donation-nav">
          <button onClick={onBackToCategories} className="donation-nav-button">
            ← Back
          </button>
          <button onClick={onBackToLanding} className="donation-logo">
            <img src={logo} alt="AidChain Logo" />
            AIDCHAIN
          </button>
        </nav>
        
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'400px',color:'#fff'}}>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (state.error || !state.campaign) {
    return (
      <div className="donation-container donation-gradient">
        <nav className="donation-nav">
          <button onClick={onBackToCategories} className="donation-nav-button">
            ← Back
          </button>
          <button onClick={onBackToLanding} className="donation-logo">
            <img src={logo} alt="AidChain Logo" />
            AIDCHAIN
          </button>
        </nav>
        
        <div style={{textAlign:'center',color:'#fff',padding:'2rem'}}>
          <div style={{fontSize:'1.125rem',marginBottom:'1rem'}}>
            {state.error || 'Campaign not found'}
          </div>
          <button onClick={onBackToCategories} className="btn btn-primary">
            Back to Campaigns
          </button>
        </div>
      </div>
    )
  }

  const { campaign } = state

  return (
    <div className="donation-container donation-gradient">
      <nav className="donation-nav">
        <button onClick={onBackToCategories} className="donation-nav-button">← Back</button>
        <button onClick={onBackToLanding} className="donation-logo">
          <img src={logo} alt="AidChain Logo" />
          AIDCHAIN
        </button>
      </nav>

      <div className="donation-main">
        {/* Hero Section */}
        <div className="detail-hero">
          <div className="detail-hero-image">
            <div className="detail-hero-placeholder">{getPlaceholderIcon(campaign.title)}</div>
          </div>
          <div className="detail-hero-overlay">
            <div className="detail-hero-content">
              <div className="detail-hero-kicker">EMERGENCY</div>
              <h1 className="detail-hero-title">{campaign.title}</h1>
            </div>
          </div>
        </div>

        {/* Campaign Description */}
        <div className="detail-section">
          <h2 className="detail-section-title">Help {campaign.location} with Blockchain Donations.</h2>
          <p className="detail-description">
            {campaign.location} is facing a growing humanitarian crisis. Using blockchain, 
            your donation reaches trusted partners quickly and transparently, 
            delivering food, shelter, and medical aid where it's needed most. Every 
            contribution makes an impact. Stand with {campaign.location} today.
          </p>

          {/* Campaign Stats */}
          <div className="detail-stats-grid">
            <div className="detail-stat">
              <div className="detail-stat-value">{formatAmount(campaign.raised)}</div>
              <div className="detail-stat-label">Raised</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value">{formatAmount(campaign.target)}</div>
              <div className="detail-stat-label">Goal</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value">{Math.round(calculateProgress(campaign.raised, campaign.target))}%</div>
              <div className="detail-stat-label">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="detail-progress">
            <div className="detail-progress-bar">
              <div className="detail-progress-fill" style={{ width: `${calculateProgress(campaign.raised, campaign.target)}%` }}></div>
            </div>
            <div className="detail-progress-text">
              {formatAmount(campaign.target - campaign.raised)} remaining to reach goal
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div className="detail-section">
          <h2 className="detail-section-title">Choose Your Donation Amount</h2>

          {/* Preset Amounts */}
          <div className="detail-amount-grid">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                className={`detail-amount ${state.selectedAmount === amount && !state.customAmount ? 'selected' : ''}`}
                onClick={() => setSelectedAmount(amount)}
              >
                ${amount}
              </button>
            ))}
            <button
              className={`detail-amount ${state.customAmount ? 'selected' : ''}`}
              onClick={() => setCustomAmount('100')}
            >
              Other Amount
            </button>
          </div>

          {/* Custom Amount Input */}
          {state.customAmount !== '' && (
            <div>
              <label className="detail-input-label">Enter Custom Amount</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount in USD"
                value={state.customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="detail-input"
              />
            </div>
          )}

          {/* Donate Button */}
          <button
            onClick={handleDonation}
            disabled={!activeAddress || getSelectedAmount() <= 0 || isProcessing}
            className="detail-cta"
          >
            {isProcessing ? 'Processing...' : `Donate $${getSelectedAmount()}`}
          </button>

          {!activeAddress && (
            <div className="detail-warning">
              Please connect your wallet to make a donation
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationDetailPage