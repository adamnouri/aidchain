// pages/GetInvolvedPage.tsx - Get Involved Page
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ConnectWallet from '../components/ConnectWallet'

const GetInvolvedPage: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' },
    logo: { color: 'white', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
    logoIcon: { width: '1.5rem', height: '1.5rem', backgroundColor: 'white', borderRadius: '0.25rem' },
    navButtons: { display: 'flex', gap: '1.5rem' },
    navButton: { color: 'white', textDecoration: 'none', fontSize: '1rem', padding: '0.5rem' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', paddingTop: '4rem' },
    content: { maxWidth: '64rem', margin: '0 auto', textAlign: 'center' as const, color: 'white' },
    title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '0.5rem', padding: '2rem' },
    cardTitle: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' },
    cardText: { marginBottom: '1.5rem' },
    button: { backgroundColor: 'white', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer', fontWeight: '500', textDecoration: 'none', display: 'inline-block' },
    bigButton: { backgroundColor: 'white', color: '#2563eb', border: 'none', borderRadius: '0.375rem', padding: '1rem 2rem', fontSize: '1.125rem', cursor: 'pointer', fontWeight: '500' }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoIcon}>🤝</div>
          AIDCHAIN
        </Link>
        <div style={styles.navButtons}>
          <Link to="/get-involved" style={styles.navButton}>Get Involved</Link>
          <Link to="/how-it-works" style={styles.navButton}>How it works</Link>
          <Link to="/about" style={styles.navButton}>About Us</Link>
        </div>
      </nav>
      
      <div style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.title}>Get Involved</h1>
          
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🎯 For Donors</h3>
              <p style={styles.cardText}>Make transparent donations and track their real-world impact</p>
              <Link to="/donate" style={styles.button}>
                Start Donating
              </Link>
            </div>
            
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🏥 For NGOs</h3>
              <p style={styles.cardText}>Manage campaigns and distribute aid with full transparency</p>
              <Link to="/ngo" style={styles.button}>
                NGO Portal
              </Link>
            </div>
          </div>
          
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Ready to make a difference?</h3>
            <button onClick={toggleWalletModal} style={styles.bigButton}>
              Connect Your Wallet
            </button>
          </div>
        </div>
      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
    </div>
  )
}

export default GetInvolvedPage