import React from 'react'

export interface CardProps {
  title?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  headerExtra?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, children, style, headerExtra }) => {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-sm)', ...style }}>
      {(title || headerExtra) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          {title && <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</div>}
          {headerExtra}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card


