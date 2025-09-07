import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: string) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error: error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo: errorInfo.componentStack
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack)
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  getErrorMessage = (error: Error | null): string => {
    if (!error) return 'An unknown error occurred'
    
    if (error.message.includes('Attempt to get default algod configuration')) {
      return 'Please make sure to set up your environment variables correctly. Create a .env file based on .env.template and fill in the required values. This controls the network and credentials for connections with Algod and Indexer.'
    }
    
    return error.message
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const styles = {
        container: {
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#14b8a6',
          padding: '2rem'
        },
        card: {
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center' as const
        },
        icon: {
          fontSize: '4rem',
          marginBottom: '1rem',
          color: '#ef4444'
        },
        title: {
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        },
        message: {
          color: '#6b7280',
          marginBottom: '1.5rem',
          lineHeight: '1.6',
          padding: '1.5rem 0'
        },
        buttonGroup: {
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap' as const,
          marginTop: '1rem'
        },
        primaryButton: {
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        },
        secondaryButton: {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: 'none',
          borderRadius: '0.375rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        },
        errorDetails: {
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fef2f2',
          borderRadius: '0.375rem',
          border: '1px solid #fecaca',
          textAlign: 'left' as const
        },
        errorText: {
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          color: '#dc2626',
          whiteSpace: 'pre-wrap' as const,
          wordBreak: 'break-word' as const
        }
      }

      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Error occurred</h1>
            <p style={styles.message}>
              {this.getErrorMessage(this.state.error)}
            </p>
            
            <div style={styles.buttonGroup}>
              <button 
                style={styles.primaryButton}
                onClick={this.handleReset}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Try Again
              </button>
              <button 
                style={styles.secondaryButton}
                onClick={() => window.location.reload()}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={styles.errorDetails}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#dc2626' }}>
                  Error Details (Development Only)
                </h3>
                <div style={styles.errorText}>
                  <strong>Error:</strong> {this.state.error.message}
                  <br />
                  <strong>Stack:</strong> {this.state.error.stack}
                  {this.state.errorInfo && (
                    <>
                      <br /><br />
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
