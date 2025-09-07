// components/DonationCategoriesPage.tsx - Design 2: Donation Categories Grid
import React from 'react'
import '../styles/donation.css'
import { useCampaignCategories } from '../hooks/useAidChainUI'
import LoadingSpinner from './LoadingSpinner'
import logo from '../assets/logo.png'

interface DonationCategoriesPageProps {
  onCampaignSelect: (campaignId: number) => void
  onBackToLanding: () => void
}

const DonationCategoriesPage: React.FC<DonationCategoriesPageProps> = ({
  onCampaignSelect,
  onBackToLanding
}) => {
  const { categories, loading, error } = useCampaignCategories()

  const styles = {
    container: { },
    nav: { },
    logo: { },
    logoImage: { },
    navButtons: { },
    navButton: { },
    main: { },
    header: { },
    title: { },
    subtitle: { },
    grid: { },
    card: { },
    cardHover: { },
    imageContainer: { },
    image: { },
    placeholderImage: { },
    urgencyBadge: { },
    urgencyHigh: { },
    urgencyMedium: { },
    urgencyLow: { },
    cardContent: { },
    cardTitle: { },
    cardLocation: { },
    progressContainer: { },
    progressBar: { },
    progressFill: { },
    progressText: { },
    donateButton: { },
    donateButtonHover: { },
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
    },
    emptyCampaigns: {
      textAlign: 'center' as const,
      color: 'white',
      padding: '4rem 2rem'
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    emptyText: {
      fontSize: '1.125rem',
      marginBottom: '2rem',
      opacity: 0.8
    },
    createButton: {
      backgroundColor: 'white',
      color: '#2563eb',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '1rem 2rem',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: '600'
    }
  }

  const getUrgencyBadgeStyle = (urgency: 'high' | 'medium' | 'low') => {
    const baseStyle = styles.urgencyBadge
    switch (urgency) {
      case 'high':
        return { ...baseStyle, ...styles.urgencyHigh }
      case 'medium':
        return { ...baseStyle, ...styles.urgencyMedium }
      case 'low':
        return { ...baseStyle, ...styles.urgencyLow }
    }
  }

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

  // Default campaigns if none exist
  const defaultCampaigns = [
    {
      id: 1,
      title: 'Afghanistan Earthquake Emergency',
      location: 'Afghanistan',
      imageUrl: '/assets/afghanistan-aid.jpg',
      raised: 125000,
      target: 500000,
      urgency: 'high' as const,
      description: 'Emergency aid for earthquake victims'
    },
    {
      id: 2,
      title: 'Sudan Aid Relief',
      location: 'Sudan',
      imageUrl: '/assets/sudan-aid.jpg',
      raised: 80000,
      target: 300000,
      urgency: 'high' as const,
      description: 'Food and medical supplies for refugees'
    },
    {
      id: 3,
      title: 'Pakistan Flood Relief',
      location: 'Pakistan',
      imageUrl: '/assets/pakistan-aid.jpg',
      raised: 200000,
      target: 400000,
      urgency: 'medium' as const,
      description: 'Disaster relief and rebuilding efforts'
    },
    {
      id: 4,
      title: 'US Hurricane Aid',
      location: 'United States',
      imageUrl: '/assets/hurricane-aid.jpg',
      raised: 150000,
      target: 250000,
      urgency: 'medium' as const,
      description: 'Hurricane recovery assistance'
    },
    {
      id: 5,
      title: 'Syria Aid Relief',
      location: 'Syria',
      imageUrl: '/assets/syria-aid.jpg',
      raised: 300000,
      target: 600000,
      urgency: 'high' as const,
      description: 'Humanitarian aid for conflict zones'
    },
    {
      id: 6,
      title: 'Orphan Support Program',
      location: 'Global',
      imageUrl: '/assets/orphan-support.jpg',
      raised: 180000,
      target: 350000,
      urgency: 'low' as const,
      description: 'Education and care for orphaned children'
    }
  ]

  const displayCampaigns = categories.length > 0 ? categories : defaultCampaigns

  if (loading) {
    return (
      <div className="donation-container donation-gradient">
        <nav className="donation-nav">
          <button onClick={onBackToLanding} className="donation-logo">
            <img src={logo} alt="AidChain Logo" />
            AIDCHAIN
          </button>
          <div className="donation-nav-buttons">
            <button onClick={onBackToLanding} className="donation-nav-button">Get Involved</button>
            <button onClick={onBackToLanding} className="donation-nav-button">How it works</button>
            <button onClick={onBackToLanding} className="donation-nav-button">About Us</button>
          </div>
        </nav>
        
        <div className="donation-main" style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'400px',color:'#fff'}}>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="donation-container donation-gradient">
        <nav className="donation-nav">
          <button onClick={onBackToLanding} className="donation-logo">
            <img src={logo} alt="AidChain Logo" />
            AIDCHAIN
          </button>
        </nav>
        
        <div className="donation-main" style={{textAlign:'center',color:'#fff',padding:'2rem'}}>
          <div style={{fontSize:'1.125rem',marginBottom:'1rem'}}>Error loading campaigns: {error}</div>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="donation-container donation-gradient">
      <nav className="donation-nav">
        <button onClick={onBackToLanding} className="donation-logo">
          <img src={logo} alt="AidChain Logo" />
          AIDCHAIN
        </button>
        <div className="donation-nav-buttons">
          <button onClick={onBackToLanding} className="donation-nav-button">Get Involved</button>
          <button onClick={onBackToLanding} className="donation-nav-button">How it works</button>
          <button onClick={onBackToLanding} className="donation-nav-button">About Us</button>
        </div>
      </nav>

      <div className="donation-main">
        <div className="donation-header">
          <h1 className="donation-title">Choose a Cause</h1>
          <p className="donation-subtitle">Every donation is tracked on the blockchain for complete transparency</p>
        </div>

        {displayCampaigns.length === 0 ? (
          <div style={{textAlign:'center',color:'#fff',padding:'4rem 2rem'}}>
            <h2 style={{fontSize:'1.5rem',fontWeight:'bold',marginBottom:'1rem'}}>No Active Campaigns</h2>
            <p style={{fontSize:'1.125rem',marginBottom:'2rem',opacity:0.8}}>Be the first to create a campaign and start making a difference</p>
            <button onClick={onBackToLanding} className="btn btn-primary">Get Started</button>
          </div>
        ) : (
          <div className="donation-grid">
            {displayCampaigns.map((campaign) => (
              <div key={campaign.id} className="donation-card" onClick={() => onCampaignSelect(campaign.id)}>
                <div className="donation-image">
                  <div className="placeholder">
                    {campaign.location === 'Afghanistan' && '🏔️'}
                    {campaign.location === 'Sudan' && '🌍'}
                    {campaign.location === 'Pakistan' && '🌊'}
                    {campaign.location === 'United States' && '🌪️'}
                    {campaign.location === 'Syria' && '🏛️'}
                    {campaign.location === 'Global' && '👶'}
                  </div>
                  <div className={`donation-urgency ${campaign.urgency === 'high' ? 'urgency-high' : campaign.urgency === 'medium' ? 'urgency-medium' : 'urgency-low'}`}>
                    {campaign.urgency} Priority
                  </div>
                </div>

                <div className="donation-card-content">
                  <h3 className="donation-card-title">{campaign.title}</h3>
                  <div className="donation-location">📍 {campaign.location}</div>

                  <div className="donation-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${calculateProgress(campaign.raised, campaign.target)}%` }}></div>
                    </div>
                    <div className="progress-text">
                      <span>Raised: {formatAmount(campaign.raised)}</span>
                      <span>Goal: {formatAmount(campaign.target)}</span>
                    </div>
                  </div>

                  <button className="donation-btn" onClick={(e) => { e.stopPropagation(); onCampaignSelect(campaign.id); }}>
                    Donate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationCategoriesPage