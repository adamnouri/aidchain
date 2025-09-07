import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  fullscreen?: boolean
  color?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message, 
  fullscreen = false,
  color = '#2563eb'
}) => {
  const sizeMap = {
    small: { width: '1.5rem', height: '1.5rem', borderWidth: '0.125rem' },
    medium: { width: '2rem', height: '2rem', borderWidth: '0.25rem' },
    large: { width: '3rem', height: '3rem', borderWidth: '0.375rem' }
  }

  const spinnerSize = sizeMap[size]

  const styles = {
    container: fullscreen ? {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999
    } : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1rem',
      ...(fullscreen ? {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      } : {})
    },
    spinner: {
      width: spinnerSize.width,
      height: spinnerSize.height,
      border: `${spinnerSize.borderWidth} solid #e5e7eb`,
      borderTop: `${spinnerSize.borderWidth} solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    message: {
      color: fullscreen ? '#6b7280' : '#374151',
      fontSize: size === 'large' ? '1.125rem' : '1rem',
      fontWeight: '500',
      textAlign: 'center' as const
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.spinner}></div>
        {message && (
          <div style={styles.message}>{message}</div>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default LoadingSpinner