// components/DonationConfirmationPage.tsx - Design 4: Thank You/Confirmation Page
import React from 'react'
import { useDonationConfirmation } from '../hooks/useAidChainUI'
import { useWallet } from '@txnlab/use-wallet-react'
import LoadingSpinner from './LoadingSpinner'
import logo from '../assets/logo.png'

interface DonationConfirmationPageProps {
  transactionHash: string
  onBackToLanding: () => void
  onBackToCategories: () => void
}

const DonationConfirmationPage: React.FC<DonationConfirmationPageProps> = ({
  transactionHash,
  onBackToLanding,
  onBackToCategories
}) => {
  const { activeAddress } = useWallet()
  const { confirmation } = useDonationConfirmation(transactionHash)

  const styles = {
    container: { 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    card: {
      maxWidth: '600px',
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
    },
    header: {
      backgroundColor: '#60a5fa',
      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
      padding: '3rem 2rem',
      textAlign: 'center' as const,
      color: 'white',
      position: 'relative' as const
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    logoIcon: {
      width: '4rem',
      height: '4rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      marginRight: '1rem'
    },
    logoText: {
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    thanksTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    thanksMessage: {
      fontSize: '1.125rem',
      lineHeight: '1.7',
      opacity: 0.95
    },
    content: {
      padding: '3rem 2rem'
    },
    transactionSection: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
      marginBottom: '1rem',
      textAlign: 'center' as const
    },
    algorandBranding: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '2rem',
      color: '#6b7280'
    },
    algorandLogo: {
      fontSize: '1.5rem'
    },
    detailsGrid: {
      backgroundColor: '#f8fafc',
      borderRadius: '1rem',
      padding: '2rem',
      marginBottom: '2rem'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '1rem',
      marginBottom: '1rem',
      borderBottom: '1px solid #e5e7eb'
    },
    detailRowLast: {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0
    },
    detailLabel: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    detailValue: {
      fontWeight: '600',
      color: '#1f2937'
    },
    amountValue: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#2563eb'
    },
    mapSection: {
      marginBottom: '2rem'
    },
    mapContainer: {
      backgroundColor: '#60a5fa',
      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    mapContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'white',
      position: 'relative' as const,
      zIndex: 1
    },
    mapNode: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.5rem'
    },
    nodeCircle: {
      width: '4rem',
      height: '4rem',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    nodeLabel: {
      fontSize: '0.875rem',
      textAlign: 'center' as const,
      fontWeight: '600'
    },
    arrow: {
      fontSize: '2rem',
      opacity: 0.7,
      margin: '0 1rem'
    },
    mapBackground: {
      position: 'absolute' as const,
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      opacity: 0.1,
      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap' as const
    },
    primaryButton: {
      flex: 1,
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      padding: '1rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      minWidth: '150px'
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '150px'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    }
  }

  if (confirmation.loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header with Thank You Message */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="AidChain Logo" style={{
              height: '3rem',
              width: 'auto',
              filter: 'brightness(0) saturate(100%) invert(100%)',
              marginRight: '1rem'
            }} />
            <div style={styles.logoText}>AIDCHAIN</div>
          </div>
          
          <h1 style={styles.thanksTitle}>Thank You from AidChain</h1>
          <p style={styles.thanksMessage}>
            Thank you for your donation. Your support is making a direct, 
            transparent impact through blockchain. We appreciate you 
            standing with us.
          </p>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Algorand Branding */}
          <div style={styles.transactionSection}>
            <div style={styles.sectionTitle}>transaction operated by</div>
            <div style={styles.algorandBranding}>
              <div style={styles.algorandLogo}>⚡</div>
              <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>Algorand</span>
            </div>
          </div>

          {/* Transaction Details */}
          <div style={styles.detailsGrid}>
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Email address of the donor:</div>
              <div style={styles.detailValue}>
                {activeAddress ? `${activeAddress.substring(0, 8)}...@wallet.algo` : 'wallet@address.algo'}
              </div>
            </div>
            
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Date of the donation:</div>
              <div style={styles.detailValue}>
                {formatDate(confirmation.donationDate)}
              </div>
            </div>
            
            <div style={styles.detailRow}>
              <div style={styles.detailLabel}>Receiver:</div>
              <div style={styles.detailValue}>
                {confirmation.receiverLocation || 'Global Relief'}
              </div>
            </div>
            
            <div style={{ ...styles.detailRow, ...styles.detailRowLast }}>
              <div style={styles.detailLabel}>Total amount of donation:</div>
              <div style={styles.amountValue}>
                ${confirmation.donationAmount} tokens
              </div>
            </div>
          </div>

          {/* Geographic Visualization */}
          <div style={styles.mapSection}>
            <div style={styles.sectionTitle}>donation flow</div>
            <div style={styles.mapContainer}>
              <div style={styles.mapBackground}></div>
              <div style={styles.mapContent}>
                <div style={styles.mapNode}>
                  <div style={styles.nodeCircle}>🌍</div>
                  <div style={styles.nodeLabel}>
                    Show map of<br />country of the<br />donor
                  </div>
                </div>
                
                <div style={styles.arrow}>→</div>
                
                <div style={styles.mapNode}>
                  <div style={styles.nodeCircle}>🎯</div>
                  <div style={styles.nodeLabel}>
                    Show map of<br />country of the<br />receiver
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              onClick={onBackToCategories}
              style={styles.primaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
            >
              Donate Again
            </button>
            
            <button
              onClick={onBackToLanding}
              style={styles.secondaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#9ca3af'
                e.currentTarget.style.color = '#374151'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationConfirmationPage