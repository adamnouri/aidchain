// components/DonationCategoriesPage.tsx - Design 2: Donation Categories Grid
import React from 'react'
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
    container: { 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
      paddingBottom: '2rem'
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
    navButtons: { 
      display: 'flex', 
      gap: '1.5rem' 
    },
    navButton: { 
      color: 'white', 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '0.5rem'
    },
    main: { 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 1.5rem', 
      paddingTop: '3rem' 
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
      color: 'white'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.125rem',
      opacity: 0.9
    },
    grid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
      gap: '2rem',
      marginBottom: '3rem'
    },
    card: { 
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      borderRadius: '1rem', 
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    imageContainer: {
      position: 'relative' as const,
      height: '200px',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      backgroundColor: '#e5e7eb'
    },
    placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem'
    },
    urgencyBadge: {
      position: 'absolute' as const,
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '2rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase' as const
    },
    urgencyHigh: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    urgencyMedium: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    urgencyLow: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    cardContent: {
      padding: '1.5rem'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    cardLocation: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    progressContainer: {
      marginBottom: '1.5rem'
    },
    progressBar: {
      width: '100%',
      height: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.25rem',
      overflow: 'hidden',
      marginBottom: '0.5rem'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#2563eb',
      borderRadius: '0.25rem',
      transition: 'width 0.3s ease'
    },
    progressText: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    donateButton: {
      width: '100%',
      backgroundColor: '#1f2937',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    donateButtonHover: {
      backgroundColor: '#374151'
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
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button onClick={onBackToLanding} style={styles.logo}>
            <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
            AIDCHAIN
          </button>
          <div style={styles.navButtons}>
            <button onClick={onBackToLanding} style={styles.navButton}>Get Involved</button>
            <button onClick={onBackToLanding} style={styles.navButton}>How it works</button>
            <button onClick={onBackToLanding} style={styles.navButton}>About Us</button>
          </div>
        </nav>
        
        <div style={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button onClick={onBackToLanding} style={styles.logo}>
            <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
            AIDCHAIN
          </button>
        </nav>
        
        <div style={styles.errorContainer}>
          <div style={styles.errorMessage}>Error loading campaigns: {error}</div>
          <button onClick={() => window.location.reload()} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button onClick={onBackToLanding} style={styles.logo}>
          <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
          AIDCHAIN
        </button>
        <div style={styles.navButtons}>
          <button onClick={onBackToLanding} style={styles.navButton}>Get Involved</button>
          <button onClick={onBackToLanding} style={styles.navButton}>How it works</button>
          <button onClick={onBackToLanding} style={styles.navButton}>About Us</button>
        </div>
      </nav>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Choose a Cause</h1>
          <p style={styles.subtitle}>
            Every donation is tracked on the blockchain for complete transparency
          </p>
        </div>

        {displayCampaigns.length === 0 ? (
          <div style={styles.emptyCampaigns}>
            <h2 style={styles.emptyTitle}>No Active Campaigns</h2>
            <p style={styles.emptyText}>
              Be the first to create a campaign and start making a difference
            </p>
            <button onClick={onBackToLanding} style={styles.createButton}>
              Get Started
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {displayCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                style={styles.card}
                onClick={() => onCampaignSelect(campaign.id)}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, styles.cardHover)
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={styles.imageContainer}>
                  <div style={styles.placeholderImage}>
                    {campaign.location === 'Afghanistan' && '🏔️'}
                    {campaign.location === 'Sudan' && '🌍'}
                    {campaign.location === 'Pakistan' && '🌊'}
                    {campaign.location === 'United States' && '🌪️'}
                    {campaign.location === 'Syria' && '🏛️'}
                    {campaign.location === 'Global' && '👶'}
                  </div>
                  <div style={getUrgencyBadgeStyle(campaign.urgency)}>
                    {campaign.urgency} Priority
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{campaign.title}</h3>
                  <div style={styles.cardLocation}>
                    📍 {campaign.location}
                  </div>
                  
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
                      <span>Raised: {formatAmount(campaign.raised)}</span>
                      <span>Goal: {formatAmount(campaign.target)}</span>
                    </div>
                  </div>
                  
                  <button 
                    style={styles.donateButton}
                    onMouseOver={(e) => {
                      Object.assign(e.currentTarget.style, styles.donateButtonHover)
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f2937'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCampaignSelect(campaign.id)
                    }}
                  >
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