// pages/AboutPage.tsx - About Us Page
import React from 'react'
import { Link } from 'react-router-dom'

const AboutPage: React.FC = () => {
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
    text: { fontSize: '1.25rem', marginBottom: '1.5rem' },
    smallText: { fontSize: '1.125rem' }
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
          <h1 style={styles.title}>About Aidchain</h1>
          <div style={styles.card}>
            <p style={styles.text}>
              Aidchain revolutionizes humanitarian aid through blockchain transparency. 
              Every donation is tracked from donor to beneficiary, ensuring complete accountability.
            </p>
            <p style={styles.smallText}>
              Built on Algorand for fast, low-cost transactions that make every token count 
              in the fight against poverty and humanitarian crises.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage