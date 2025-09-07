// components/DonationDetailPage.tsx - Design 3: Individual Donation Detail
import React, { useState } from 'react'
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
    container: { 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'
    },
    nav: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logo: { 
      color: 'white', 
      fontSize: '1.25rem', 
      fontWeight: 'bold', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer' 
    },
    logoImage: { 
      height: '1.5rem', 
      width: 'auto', 
      filter: 'brightness(0) saturate(100%) invert(100%)'
    },
    backButton: {
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    main: { 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '0 1.5rem'
    },
    heroSection: {
      position: 'relative' as const,
      height: '400px',
      borderRadius: '1rem',
      overflow: 'hidden',
      marginTop: '2rem',
      marginBottom: '3rem'
    },
    heroImage: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    heroPlaceholder: {
      fontSize: '6rem',
      opacity: 0.7
    },
    heroOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
      display: 'flex',
      alignItems: 'flex-end'
    },
    heroContent: {
      padding: '2rem',
      color: 'white'
    },
    heroTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    heroSubtitle: {
      fontSize: '1.125rem',
      color: '#fbbf24',
      fontWeight: '600',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em'
    },
    contentSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      padding: '3rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem',
      textAlign: 'center' as const
    },
    description: {
      fontSize: '1.125rem',
      lineHeight: '1.7',
      color: '#374151',
      marginBottom: '2rem',
      textAlign: 'center' as const
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    statCard: {
      textAlign: 'center' as const,
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#2563eb',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      textTransform: 'uppercase' as const
    },
    progressContainer: {
      marginBottom: '2rem'
    },
    progressBar: {
      width: '100%',
      height: '1rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      marginBottom: '0.5rem'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      borderRadius: '0.5rem',
      transition: 'width 0.3s ease'
    },
    progressText: {
      textAlign: 'center' as const,
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    donationSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      padding: '3rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    amountGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    amountButton: {
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      background: 'white',
      fontSize: '1.25rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center' as const
    },
    amountButtonSelected: {
      borderColor: '#2563eb',
      backgroundColor: '#2563eb',
      color: 'white'
    },
    customAmountContainer: {
      marginBottom: '2rem'
    },
    customAmountLabel: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    customAmountInput: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '1.25rem',
      textAlign: 'center' as const
    },
    customAmountInputFocused: {
      borderColor: '#2563eb',
      outline: 'none'
    },
    donateButton: {
      width: '100%',
      backgroundColor: '#1f2937',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '1.25rem 2rem',
      fontSize: '1.25rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginBottom: '1rem'
    },
    donateButtonHover: {
      backgroundColor: '#374151'
    },
    donateButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    walletWarning: {
      textAlign: 'center' as const,
      color: '#dc2626',
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
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
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button onClick={onBackToCategories} style={styles.backButton}>
            ← Back
          </button>
          <button onClick={onBackToLanding} style={styles.logo}>
            <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
            AIDCHAIN
          </button>
        </nav>
        
        <div style={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (state.error || !state.campaign) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button onClick={onBackToCategories} style={styles.backButton}>
            ← Back
          </button>
          <button onClick={onBackToLanding} style={styles.logo}>
            <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
            AIDCHAIN
          </button>
        </nav>
        
        <div style={styles.errorContainer}>
          <div style={styles.errorMessage}>
            {state.error || 'Campaign not found'}
          </div>
          <button onClick={onBackToCategories} style={styles.retryButton}>
            Back to Campaigns
          </button>
        </div>
      </div>
    )
  }

  const { campaign } = state

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button onClick={onBackToCategories} style={styles.backButton}>
          ← Back
        </button>
        <button onClick={onBackToLanding} style={styles.logo}>
          <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
          AIDCHAIN
        </button>
      </nav>

      <div style={styles.main}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.heroImage}>
            <div style={styles.heroPlaceholder}>
              {getPlaceholderIcon(campaign.title)}
            </div>
          </div>
          <div style={styles.heroOverlay}>
            <div style={styles.heroContent}>
              <div style={styles.heroSubtitle}>EMERGENCY</div>
              <h1 style={styles.heroTitle}>{campaign.title}</h1>
            </div>
          </div>
        </div>

        {/* Campaign Description */}
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Help {campaign.location} with Blockchain Donations.</h2>
          <p style={styles.description}>
            {campaign.location} is facing a growing humanitarian crisis. Using blockchain, 
            your donation reaches trusted partners quickly and transparently, 
            delivering food, shelter, and medical aid where it's needed most. Every 
            contribution makes an impact. Stand with {campaign.location} today.
          </p>

          {/* Campaign Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{formatAmount(campaign.raised)}</div>
              <div style={styles.statLabel}>Raised</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{formatAmount(campaign.target)}</div>
              <div style={styles.statLabel}>Goal</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{Math.round(calculateProgress(campaign.raised, campaign.target))}%</div>
              <div style={styles.statLabel}>Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${calculateProgress(campaign.raised, campaign.target)}%`
                }}
              ></div>
            </div>
            <div style={styles.progressText}>
              {formatAmount(campaign.target - campaign.raised)} remaining to reach goal
            </div>
          </div>
        </div>

        {/* Donation Section */}
        <div style={styles.donationSection}>
          <h2 style={styles.sectionTitle}>Choose Your Donation Amount</h2>

          {/* Preset Amounts */}
          <div style={styles.amountGrid}>
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                style={{
                  ...styles.amountButton,
                  ...(state.selectedAmount === amount && !state.customAmount 
                    ? styles.amountButtonSelected 
                    : {}
                  )
                }}
                onClick={() => setSelectedAmount(amount)}
              >
                ${amount}
              </button>
            ))}
            <button
              style={{
                ...styles.amountButton,
                ...(state.customAmount ? styles.amountButtonSelected : {})
              }}
              onClick={() => setCustomAmount('100')}
            >
              Other Amount
            </button>
          </div>

          {/* Custom Amount Input */}
          {state.customAmount !== '' && (
            <div style={styles.customAmountContainer}>
              <label style={styles.customAmountLabel}>Enter Custom Amount</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount in USD"
                value={state.customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={styles.customAmountInput}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.customAmountInputFocused)
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>
          )}

          {/* Donate Button */}
          <button
            onClick={handleDonation}
            disabled={!activeAddress || getSelectedAmount() <= 0 || isProcessing}
            style={{
              ...styles.donateButton,
              ...(!activeAddress || getSelectedAmount() <= 0 || isProcessing 
                ? styles.donateButtonDisabled 
                : {}
              )
            }}
            onMouseOver={(e) => {
              if (!e.currentTarget.disabled) {
                Object.assign(e.currentTarget.style, styles.donateButtonHover)
              }
            }}
            onMouseOut={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#1f2937'
              }
            }}
          >
            {isProcessing ? 'Processing...' : `Donate $${getSelectedAmount()}`}
          </button>

          {!activeAddress && (
            <div style={styles.walletWarning}>
              Please connect your wallet to make a donation
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationDetailPage