// components/DonationConfirmationPage.tsx - Design 4: Thank You/Confirmation Page
import React from 'react'
import '../styles/donation.css'
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
    container: { },
    card: { },
    header: { },
    logoContainer: { },
    logoIcon: { },
    logoText: { },
    thanksTitle: { },
    thanksMessage: { },
    content: { },
    transactionSection: { },
    sectionTitle: { },
    algorandBranding: { },
    algorandLogo: { },
    detailsGrid: { },
    detailRow: { },
    detailRowLast: { },
    detailLabel: { },
    detailValue: { },
    amountValue: { },
    mapSection: { },
    mapContainer: { },
    mapContent: { },
    mapNode: { },
    nodeCircle: { },
    nodeLabel: { },
    arrow: { },
    mapBackground: { },
    buttonGroup: { },
    primaryButton: { },
    secondaryButton: { },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    }
  }

  if (confirmation.loading) {
    return (
      <div className="confirm-container">
        <div className="confirm-card">
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'200px'}}>
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
    <div className="confirm-container">
      <div className="confirm-card">
        {/* Header with Thank You Message */}
        <div className="confirm-header">
          <div className="confirm-logo">
            <img src={logo} alt="AidChain Logo" />
            <div className="confirm-logo-text">AIDCHAIN</div>
          </div>
          
          <h1 className="confirm-title">Thank You from AidChain</h1>
          <p className="confirm-message">
            Thank you for your donation. Your support is making a direct, 
            transparent impact through blockchain. We appreciate you 
            standing with us.
          </p>
        </div>

        {/* Content */}
        <div className="confirm-content">
          {/* Algorand Branding */}
          <div className="confirm-section" style={{marginBottom:'2rem'}}>
            <div className="confirm-section-title">transaction operated by</div>
            <div className="confirm-algo" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',marginBottom:'2rem',color:'var(--color-neutral-500)'}}>
              <div style={{fontSize:'1.5rem'}}>⚡</div>
              <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>Algorand</span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="confirm-details">
            <div className="confirm-row">
              <div className="confirm-label">Email address of the donor:</div>
              <div className="confirm-value">
                {activeAddress ? `${activeAddress.substring(0, 8)}...@wallet.algo` : 'wallet@address.algo'}
              </div>
            </div>
            
            <div className="confirm-row">
              <div className="confirm-label">Date of the donation:</div>
              <div className="confirm-value">
                {formatDate(confirmation.donationDate)}
              </div>
            </div>
            
            <div className="confirm-row">
              <div className="confirm-label">Receiver:</div>
              <div className="confirm-value">
                {confirmation.receiverLocation || 'Global Relief'}
              </div>
            </div>
            
            <div className="confirm-row last">
              <div className="confirm-label">Total amount of donation:</div>
              <div className="confirm-amount">
                ${confirmation.donationAmount} tokens
              </div>
            </div>
          </div>

          {/* Geographic Visualization */}
          <div>
            <div className="confirm-section-title">donation flow</div>
            <div className="confirm-map">
              <div className="confirm-map-content">
                <div className="confirm-node">
                  <div className="confirm-node-circle">🌍</div>
                  <div className="confirm-node-label">Show map of<br />country of the<br />donor</div>
                </div>
                
                <div className="confirm-arrow">→</div>
                
                <div className="confirm-node">
                  <div className="confirm-node-circle">🎯</div>
                  <div className="confirm-node-label">Show map of<br />country of the<br />receiver</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirm-actions">
            <button onClick={onBackToCategories} className="confirm-primary">Donate Again</button>
            <button onClick={onBackToLanding} className="confirm-secondary">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonationConfirmationPage