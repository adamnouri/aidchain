import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantToStyle: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-neutral-700)', color: '#fff', border: 'none' },
  secondary: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-surface-contrast)', border: '1px solid var(--color-border)' },
  danger: { backgroundColor: '#ef4444', color: '#fff', border: 'none' },
}

const sizeToStyle: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.5rem 0.875rem', fontSize: '0.875rem', lineHeight: '1.25rem' },
  md: { padding: '0.75rem 1rem', fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { padding: '1rem 1.5rem', fontSize: '1.125rem', lineHeight: '1.75rem' },
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  children,
  ...rest
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-sm)',
    fontWeight: 'var(--font-weight-medium)' as unknown as number,
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)'
  }

  return (
    <button
      style={{
        ...baseStyle,
        ...(variantToStyle[variant] || {}),
        ...(sizeToStyle[size] || {}),
        ...(fullWidth ? { width: '100%' } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button


