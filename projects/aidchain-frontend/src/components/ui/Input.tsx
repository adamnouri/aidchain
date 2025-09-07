import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, hint, error, style, id, ...rest }) => {
  const inputId = id || rest.name || `input-${Math.random().toString(36).slice(2, 7)}`
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={inputId} style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: '1rem',
        }}
        aria-invalid={!!error}
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {hint && !error && (
        <div id={`${inputId}-hint`} style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#6b7280' }}>{hint}</div>
      )}
      {error && (
        <div style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#ef4444' }}>{error}</div>
      )}
    </div>
  )
}

export default Input


