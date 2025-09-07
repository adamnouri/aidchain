// src/Home.tsx - New Aidchain Landing Page
import { useWallet } from '@txnlab/use-wallet-react'
import { AppClientProvider } from './context/AppClientContext'
import React, { useState } from 'react'
import './styles/home.css'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'
import DonorDashboard from './components/DonorDashboardRefactored'
import OrganizationPortal from './components/OrganizationPortal'
import MilestoneTracker from './components/MilestoneTracker'
import VoucherSystem from './components/VoucherSystem'
import DeliveryTracker from './components/DeliveryTracker'
import DonationCategoriesPage from './components/DonationCategoriesPage'
import DonationDetailPage from './components/DonationDetailPage'
import DonationConfirmationPage from './components/DonationConfirmationPage'
import ContractTest from './components/ContractTest'
import { useLandingPageStats } from './hooks/useAidChainUI'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [openDonationForm, setOpenDonationForm] = useState<boolean>(false)
  const [showContractTest, setShowContractTest] = useState<boolean>(false)
  const [currentView, setCurrentView] = useState<'landing' | 'donor' | 'ngo' | 'milestones' | 'vouchers' | 'deliveries' | 'about' | 'how-it-works' | 'get-involved' | 'donation-categories' | 'donation-detail' | 'donation-confirmation'>('landing')
  const [selectedCampaignId, setSelectedCampaignId] = useState<number>(1)
  const [transactionHash, setTransactionHash] = useState<string>('')
  const { activeAddress } = useWallet()
  const { stats } = useLandingPageStats()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }

  const handleDonateNow = () => {
    if (!activeAddress) {
      // If wallet not connected, prompt connection first
      setOpenWalletModal(true)
    } else {
      // If wallet connected, go to donation categories
      setCurrentView('donation-categories')
    }
  }

  const handleCampaignSelect = (campaignId: number) => {
    setSelectedCampaignId(campaignId)
    setCurrentView('donation-detail')
  }

  const handleDonationComplete = (txnHash: string) => {
    setTransactionHash(txnHash)
    setCurrentView('donation-confirmation')
  }

  // Donor Portal View - Functional Dashboard
  if (currentView === 'donor') {
    return <DonorDashboard onBackToLanding={() => setCurrentView('landing')} />
  }

  // NGO Portal View - Organization Management
  if (currentView === 'ngo') {
    return <OrganizationPortal onBackToLanding={() => setCurrentView('landing')} />
  }

  // Milestone Tracker View
  if (currentView === 'milestones') {
    return <MilestoneTracker onBackToLanding={() => setCurrentView('landing')} />
  }

  // Voucher System View
  if (currentView === 'vouchers') {
    return <VoucherSystem onBackToLanding={() => setCurrentView('landing')} />
  }

  // Delivery Tracker View
  if (currentView === 'deliveries') {
    return <DeliveryTracker onBackToLanding={() => setCurrentView('landing')} />
  }

  // New Figma Design Views
  // Donation Categories View (Design 2)
  if (currentView === 'donation-categories') {
    return (
      <DonationCategoriesPage 
        onCampaignSelect={handleCampaignSelect}
        onBackToLanding={() => setCurrentView('landing')}
      />
    )
  }

  // Donation Detail View (Design 3)
  if (currentView === 'donation-detail') {
    return (
      <DonationDetailPage 
        campaignId={selectedCampaignId}
        onBackToCategories={() => setCurrentView('donation-categories')}
        onDonationComplete={handleDonationComplete}
        onBackToLanding={() => setCurrentView('landing')}
      />
    )
  }

  // Donation Confirmation View (Design 4)
  if (currentView === 'donation-confirmation') {
    return (
      <DonationConfirmationPage 
        transactionHash={transactionHash}
        onBackToLanding={() => setCurrentView('landing')}
        onBackToCategories={() => setCurrentView('donation-categories')}
      />
    )
  }

  // About Us View
  if (currentView === 'about') {
    const aboutStyles = {
      container: { minHeight: '100vh', background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' },
      nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' },
      logo: { color: 'white', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' },
      logoIcon: { width: '1.5rem', height: '1.5rem', backgroundColor: 'black', borderRadius: '0.25rem' },
      navButtons: { display: 'flex', gap: '1.5rem' },
      navButton: { color: 'white', background: 'none', border: 'none', cursor: 'pointer' },
      main: { maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', paddingTop: '4rem' },
      content: { maxWidth: '64rem', margin: '0 auto', textAlign: 'center' as const, color: 'white' },
      title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' },
      card: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '0.5rem', padding: '2rem' },
      text: { fontSize: '1.25rem', marginBottom: '1.5rem' },
      smallText: { fontSize: '1.125rem' }
    }

    return (
      <div style={aboutStyles.container}>
        <nav style={aboutStyles.nav}>
          <button onClick={() => setCurrentView('landing')} style={aboutStyles.logo}>
            <div style={aboutStyles.logoIcon}></div>
            Aidchain
          </button>
          <div style={aboutStyles.navButtons}>
            <button onClick={() => setCurrentView('get-involved')} style={aboutStyles.navButton}>Get Involved</button>
            <button onClick={() => setCurrentView('how-it-works')} style={aboutStyles.navButton}>How it works</button>
            <button onClick={() => setCurrentView('about')} style={aboutStyles.navButton}>About Us</button>
          </div>
        </nav>
        
        <div style={aboutStyles.main}>
          <div style={aboutStyles.content}>
            <h1 style={aboutStyles.title}>About Aidchain</h1>
            <div style={aboutStyles.card}>
              <p style={aboutStyles.text}>
                Aidchain revolutionizes humanitarian aid through blockchain transparency. 
                Every donation is tracked from donor to beneficiary, ensuring complete accountability.
              </p>
              <p style={aboutStyles.smallText}>
                Built on Algorand for fast, low-cost transactions that make every token count 
                in the fight against poverty and humanitarian crises.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'how-it-works') {
    const howItWorksStyles = {
      container: { minHeight: '100vh', background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' },
      nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' },
      logo: { color: 'white', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' },
      logoIcon: { width: '1.5rem', height: '1.5rem', backgroundColor: 'black', borderRadius: '0.25rem' },
      navButtons: { display: 'flex', gap: '1.5rem' },
      navButton: { color: 'white', background: 'none', border: 'none', cursor: 'pointer' },
      main: { maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', paddingTop: '4rem' },
      content: { maxWidth: '64rem', margin: '0 auto', textAlign: 'center' as const, color: 'white' },
      title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' },
      card: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '0.5rem', padding: '2rem' },
      text: { fontSize: '1.25rem', marginBottom: '2rem' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' as const },
      stepCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', padding: '1.5rem' },
      stepIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
      stepTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' },
      placeholder: { marginTop: '2rem', fontSize: '1.125rem', fontStyle: 'italic' }
    }

    return (
      <div style={howItWorksStyles.container}>
        <nav style={howItWorksStyles.nav}>
          <button onClick={() => setCurrentView('landing')} style={howItWorksStyles.logo}>
            <div style={howItWorksStyles.logoIcon}></div>
            Aidchain
          </button>
          <div style={howItWorksStyles.navButtons}>
            <button onClick={() => setCurrentView('get-involved')} style={howItWorksStyles.navButton}>Get Involved</button>
            <button onClick={() => setCurrentView('how-it-works')} style={howItWorksStyles.navButton}>How it works</button>
            <button onClick={() => setCurrentView('about')} style={howItWorksStyles.navButton}>About Us</button>
          </div>
        </nav>
        
        <div style={howItWorksStyles.main}>
          <div style={howItWorksStyles.content}>
            <h1 style={howItWorksStyles.title}>How It Works</h1>
            <div style={howItWorksStyles.card}>
              <p style={howItWorksStyles.text}>
                Transparent humanitarian aid in three simple steps:
              </p>
              
              <div style={howItWorksStyles.grid}>
                <div style={howItWorksStyles.stepCard}>
                  <div style={howItWorksStyles.stepIcon}>💝</div>
                  <h3 style={howItWorksStyles.stepTitle}>1. Donate</h3>
                  <p>Make secure donations using ALGO or USDC cryptocurrency</p>
                </div>
                
                <div style={howItWorksStyles.stepCard}>
                  <div style={howItWorksStyles.stepIcon}>🏥</div>
                  <h3 style={howItWorksStyles.stepTitle}>2. Track</h3>
                  <p>Follow your donation's journey from NGO to beneficiary in real-time</p>
                </div>
                
                <div style={howItWorksStyles.stepCard}>
                  <div style={howItWorksStyles.stepIcon}>🤝</div>
                  <h3 style={howItWorksStyles.stepTitle}>3. Impact</h3>
                  <p>See the direct impact of your contribution on real lives</p>
                </div>
              </div>
              
              <p style={howItWorksStyles.placeholder}>
                <em>Content placeholder - you can provide detailed workflow information later</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'get-involved') {
    const getInvolvedStyles = {
      container: { minHeight: '100vh', background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' },
      nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' },
      logo: { color: 'white', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' },
      logoIcon: { width: '1.5rem', height: '1.5rem', backgroundColor: 'black', borderRadius: '0.25rem' },
      navButtons: { display: 'flex', gap: '1.5rem' },
      navButton: { color: 'white', background: 'none', border: 'none', cursor: 'pointer' },
      main: { maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', paddingTop: '4rem' },
      content: { maxWidth: '64rem', margin: '0 auto', textAlign: 'center' as const, color: 'white' },
      title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' },
      card: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '0.5rem', padding: '2rem' },
      cardTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' },
      cardText: { marginBottom: '1.5rem' },
      button: { backgroundColor: 'white', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', fontWeight: '500' },
      bigButton: { backgroundColor: 'white', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '1rem 2rem', fontSize: '1.125rem', cursor: 'pointer', fontWeight: '500' }
    }

    return (
      <div style={getInvolvedStyles.container}>
        <nav style={getInvolvedStyles.nav}>
          <button onClick={() => setCurrentView('landing')} style={getInvolvedStyles.logo}>
            <div style={getInvolvedStyles.logoIcon}></div>
            Aidchain
          </button>
          <div style={getInvolvedStyles.navButtons}>
            <button onClick={() => setCurrentView('get-involved')} style={getInvolvedStyles.navButton}>Get Involved</button>
            <button onClick={() => setCurrentView('how-it-works')} style={getInvolvedStyles.navButton}>How it works</button>
            <button onClick={() => setCurrentView('about')} style={getInvolvedStyles.navButton}>About Us</button>
          </div>
        </nav>
        
        <div style={getInvolvedStyles.main}>
          <div style={getInvolvedStyles.content}>
            <h1 style={getInvolvedStyles.title}>Get Involved</h1>
            
            <div style={getInvolvedStyles.grid}>
              <div style={getInvolvedStyles.card}>
                <h3 style={getInvolvedStyles.cardTitle}>🎯 For Donors</h3>
                <p style={getInvolvedStyles.cardText}>Make transparent donations and track their real-world impact</p>
                <button onClick={handleDonateNow} style={getInvolvedStyles.button}>
                  Start Donating
                </button>
              </div>
              
              <div style={getInvolvedStyles.card}>
                <h3 style={getInvolvedStyles.cardTitle}>🏥 For NGOs</h3>
                <p style={getInvolvedStyles.cardText}>Manage campaigns and distribute aid with full transparency</p>
                <button onClick={() => setCurrentView('ngo')} style={getInvolvedStyles.button}>
                  NGO Portal
                </button>
              </div>
            </div>
            
            <div style={getInvolvedStyles.card}>
              <h3 style={getInvolvedStyles.cardTitle}>Ready to make a difference?</h3>
              <button onClick={toggleWalletModal} style={getInvolvedStyles.bigButton}>
                Connect Your Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Landing Page
  const landingStyles = {}

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="logo">
          <div className="logo-icon"></div>
          Aidchain
        </div>
        <div className="nav-buttons">
          <button onClick={() => setCurrentView('get-involved')} className="nav-button">
            Get Involved
          </button>
          <button onClick={() => setCurrentView('how-it-works')} className="nav-button">
            How it works
          </button>
          <button onClick={() => setCurrentView('about')} className="nav-button">
            About Us
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          
          {/* Left Content */}
          <div className="left-content">
            <h1 className="hero-title">
              Every token visible,<br />
              every hand accounted for.
            </h1>
            
            <div className="button-group">
              <button onClick={handleDonateNow} className="btn-primary">
                Donate Now
              </button>
              <button onClick={() => setCurrentView('about')} className="btn-secondary">
                About Us
              </button>
              <button onClick={() => setShowContractTest(true)} className="btn-secondary" style={{ backgroundColor: '#10b981', borderColor: '#10b981', color: 'white' }}>
                🧪 Test Contract
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="right-content">
            <div className="illustration">
              <div className="main-circle">
                <div className="main-icon">🤝</div>
              </div>
              <div className="sparkle">
                <div className="sparkle-icon">✨</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="stats-section">
        <div className="stats-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                {stats?.loading ? '...' : stats?.totalDonations ? `$${(stats.totalDonations / 1000000).toFixed(1)}M` : '$0'}
              </div>
              <div className="stat-label">Total Donated</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats?.loading ? '...' : stats?.activeCampaigns || 0}
              </div>
              <div className="stat-label">Active Campaigns</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats?.loading ? '...' : stats?.totalOrganizations || 0}
              </div>
              <div className="stat-label">Partner NGOs</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-section">
        <div className="how-content">
          <h2 className="section-title">See how it works</h2>
          
          <div className="workflow-card">
            <h3 className="workflow-title">How does it work?</h3>
            
            <div className="workflow-text">
              <p className="placeholder">
                <em>This section will contain your detailed workflow content. For now, here's a placeholder:</em>
              </p>
              
              <div className="workflow-grid">
                <div className="workflow-step">
                  <div className="step-icon">💝</div>
                  <h4 className="step-title">Transparent Donations</h4>
                  <p className="step-text">Every donation is recorded on the blockchain</p>
                </div>
                
                <div className="workflow-step">
                  <div className="step-icon">🔍</div>
                  <h4 className="step-title">Real-Time Tracking</h4>
                  <p className="step-text">Follow your contribution from donor to beneficiary</p>
                </div>
                
                <div className="workflow-step">
                  <div className="step-icon">📊</div>
                  <h4 className="step-title">Impact Reporting</h4>
                  <p className="step-text">See the measurable difference you've made</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
      {showContractTest && <ContractTest onClose={() => setShowContractTest(false)} />}

      {/* Developer Tools (Hidden in bottom) */}
      <div className="dev-tools">
        <div className="dropdown">
          <button className="dropdown-button">⚙️</button>
          <div className="dropdown-menu">
            <button onClick={toggleDemoModal}>Transaction Demo</button>
            <button onClick={toggleAppCallsModal}>Contract Demo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
