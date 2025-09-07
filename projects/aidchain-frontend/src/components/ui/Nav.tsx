import React from 'react'

export interface NavProps {
  left?: React.ReactNode
  right?: React.ReactNode
  transparent?: boolean
}

export const Nav: React.FC<NavProps> = ({ left, right, transparent = true }) => {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'var(--space-6)',
      background: transparent ? 'transparent' : '#fff',
      borderBottom: transparent ? '1px solid rgba(255,255,255,0.12)' : `1px solid var(--color-border)`
    }}>
      <div>{left}</div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>{right}</div>
    </nav>
  )}

export default Nav


