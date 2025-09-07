/**
 * Utility functions for formatting currency amounts in humanitarian contexts
 */

export const formatAlgoAmount = (amount: number, decimals: number = 2): string => {
  return `${amount.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })} ALGO`
}

export const formatUSDCAmount = (amount: number, decimals: number = 2): string => {
  return `$${amount.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })} USDC`
}

export const formatCurrencyAmount = (
  amount: number, 
  currency: 'ALGO' | 'USDC', 
  decimals: number = 2
): string => {
  if (currency === 'ALGO') {
    return formatAlgoAmount(amount, decimals)
  }
  return formatUSDCAmount(amount, decimals)
}

export const formatCompactAmount = (amount: number, currency: 'ALGO' | 'USDC'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  })
  
  const formattedNumber = formatter.format(amount)
  return currency === 'ALGO' ? `${formattedNumber} ALGO` : `$${formattedNumber}`
}

export const parseCurrencyInput = (input: string): { amount: number; currency: 'ALGO' | 'USDC' } => {
  const cleanInput = input.trim().toUpperCase()
  
  if (cleanInput.includes('ALGO')) {
    const amount = parseFloat(cleanInput.replace(/[^0-9.]/g, ''))
    return { amount: isNaN(amount) ? 0 : amount, currency: 'ALGO' }
  }
  
  if (cleanInput.includes('USDC') || cleanInput.includes('$')) {
    const amount = parseFloat(cleanInput.replace(/[^0-9.]/g, ''))
    return { amount: isNaN(amount) ? 0 : amount, currency: 'USDC' }
  }
  
  // Default to USDC if no currency specified
  const amount = parseFloat(cleanInput)
  return { amount: isNaN(amount) ? 0 : amount, currency: 'USDC' }
}

export const convertCurrency = (
  amount: number,
  fromCurrency: 'ALGO' | 'USDC',
  toCurrency: 'ALGO' | 'USDC',
  exchangeRate: number = 0.15 // Mock rate: 1 ALGO = 0.15 USDC
): number => {
  if (fromCurrency === toCurrency) {
    return amount
  }
  
  if (fromCurrency === 'ALGO' && toCurrency === 'USDC') {
    return amount * exchangeRate
  }
  
  if (fromCurrency === 'USDC' && toCurrency === 'ALGO') {
    return amount / exchangeRate
  }
  
  return amount
}

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}