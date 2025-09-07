// pages/HowItWorksPage.tsx - How It Works Page
import React from 'react'
import { Link } from 'react-router-dom'

const HowItWorksPage: React.FC = () => {
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
    card: { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '0.5rem', padding: '2rem' },
    text: { fontSize: '1.25rem', marginBottom: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' as const },
    stepCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', padding: '1.5rem' },
    stepIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
    stepTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' },
    stepText: { fontSize: '0.875rem' }
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
          <h1 style={styles.title}>How It Works</h1>
          <div style={styles.card}>
            <p style={styles.text}>
              Transparent humanitarian aid in three simple steps:
            </p>
            
            <div style={styles.grid}>
              <div style={styles.stepCard}>
                <div style={styles.stepIcon}>💝</div>
                <h3 style={styles.stepTitle}>1. Donate</h3>
                <p style={styles.stepText}>Make secure donations using ALGO or USDC cryptocurrency</p>
              </div>
              
              <div style={styles.stepCard}>
                <div style={styles.stepIcon}>🏥</div>
                <h3 style={styles.stepTitle}>2. Track</h3>
                <p style={styles.stepText}>Follow your donation's journey from NGO to beneficiary in real-time</p>
              </div>
              
              <div style={styles.stepCard}>
                <div style={styles.stepIcon}>🤝</div>
                <h3 style={styles.stepTitle}>3. Impact</h3>
                <p style={styles.stepText}>See the direct impact of your contribution on real lives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage