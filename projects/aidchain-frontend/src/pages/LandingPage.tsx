// pages/LandingPage.tsx - Landing Page matching Figma Design
import React from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import { useLandingPageStats } from '../hooks/useAidChainUI'
import ConnectWallet from '../components/ConnectWallet'
import logo from '../assets/logo.png'

const LandingPage: React.FC = () => {
  const { activeAddress } = useWallet()
  const { stats } = useLandingPageStats()
  const [openWalletModal, setOpenWalletModal] = React.useState<boolean>(false)

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const styles = {
    container: { 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)'
    },
    nav: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '2rem 3rem'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textDecoration: 'none'
    },
    logoImage: {
      height: '2.5rem',
      width: 'auto',
      filter: 'brightness(0) saturate(100%) invert(100%)'
    },
    navButtons: { 
      display: 'flex', 
      gap: '2rem',
      alignItems: 'center'
    },
    navButton: { 
      color: 'white', 
      background: 'none', 
      border: 'none', 
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      fontWeight: '500'
    },
    mainContent: {
      padding: '4rem 3rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '4rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    leftSection: {
      flex: 1,
      color: 'white'
    },
    heroTitle: {
      fontSize: '4rem',
      fontWeight: 'bold',
      lineHeight: '1.1',
      marginBottom: '2rem',
      fontStyle: 'italic'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem'
    },
    donateButton: {
      backgroundColor: '#374151',
      color: 'white',
      border: 'none',
      borderRadius: '2rem',
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center' as const
    },
    learnButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '2rem',
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center' as const
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const
    },
    illustration: {
      fontSize: '12rem',
      opacity: 0.8
    },
    bottomCard: {
      margin: '2rem 3rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '2rem',
      padding: '3rem',
      position: 'relative' as const
    },
    cardTitle: {
      textAlign: 'center' as const,
      fontSize: '2rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '2rem'
    },
    stepsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '3rem'
    },
    dollarIcon: {
      fontSize: '3rem',
      color: '#10b981',
      marginBottom: '1rem'
    },
    arrow: {
      fontSize: '2rem',
      color: '#6b7280',
      margin: '0 1rem'
    },
    stepCircle: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      color: 'white',
      position: 'relative' as const
    },
    stepLabel: {
      position: 'absolute' as const,
      bottom: '-2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1f2937',
      whiteSpace: 'nowrap' as const
    },
    placeholderText: {
      textAlign: 'center' as const,
      color: '#6b7280',
      fontSize: '0.875rem',
      marginBottom: '2rem'
    },
    partnersSection: {
      textAlign: 'center' as const,
      marginTop: '2rem'
    },
    partnersTitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      marginBottom: '1rem',
      fontStyle: 'italic'
    },
    algorandLogo: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    impactIcon: {
      position: 'absolute' as const,
      bottom: '-1rem',
      right: '-1rem',
      fontSize: '4rem',
      opacity: 0.6
    }
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logoContainer}>
          <img src={logo} alt="AidChain Logo" style={styles.logoImage} />
          <span>AIDCHAIN</span>
        </Link>
        <div style={styles.navButtons}>
          <Link 
            to="/get-involved" 
            style={styles.navButton}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Get Involved
          </Link>
          <Link 
            to="/how-it-works" 
            style={styles.navButton}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            How it works
          </Link>
          <Link 
            to="/about" 
            style={styles.navButton}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            About Us
          </Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <div style={styles.mainContent}>
        <div style={styles.leftSection}>
          <h1 style={styles.heroTitle}>
            Every token visible,<br />
            every hand accounted for.
          </h1>
          <div style={styles.buttonGroup}>
            {activeAddress ? (
              <Link 
                to="/donate"
                style={styles.donateButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151'
                  e.currentTarget.style.transform = 'translateY(0px)'
                }}
              >
                Donate Now
              </Link>
            ) : (
              <button 
                onClick={toggleWalletModal}
                style={styles.donateButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151'
                  e.currentTarget.style.transform = 'translateY(0px)'
                }}
              >
                Donate Now
              </button>
            )}
            <Link 
              to="/about"
              style={styles.learnButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              }}
            >
              Learn More
            </Link>
          </div>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.illustration}>
            👥
          </div>
        </div>
      </div>

      {/* Bottom Information Card */}
      <div style={styles.bottomCard}>
        <h2 style={styles.cardTitle}>from you to impact</h2>
        
        <div style={styles.stepsContainer}>
          {/* Dollar Sign */}
          <div style={styles.dollarIcon}>💰</div>
          
          {/* Arrow */}
          <div style={styles.arrow}>→</div>
          
          {/* Step 1 */}
          <div style={{position: 'relative' as const}}>
            <div style={styles.stepCircle}>
              ◆
              <div style={styles.stepLabel}>Step 1</div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div style={{position: 'relative' as const}}>
            <div style={styles.stepCircle}>
              📋
              <div style={styles.stepLabel}>Step 2</div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div style={{position: 'relative' as const}}>
            <div style={styles.stepCircle}>
              🏠
              <div style={styles.stepLabel}>Step 3</div>
            </div>
          </div>
          
          {/* Arrow */}
          <div style={styles.arrow}>→</div>
          
          {/* Impact Icon */}
          <div style={{position: 'relative' as const}}>
            <span style={{fontSize: '4rem', opacity: 0.6}}>💝</span>
          </div>
        </div>

        <div style={styles.placeholderText}>
          Lorem ipsum
        </div>
        
        {/* Partners Section */}
        <div style={styles.partnersSection}>
          <div style={styles.partnersTitle}>our partners</div>
          <div style={styles.algorandLogo}>Algorand</div>
        </div>

        {/* Impact decoration */}
        <div style={styles.impactIcon}>
          💙
        </div>
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

export default LandingPage