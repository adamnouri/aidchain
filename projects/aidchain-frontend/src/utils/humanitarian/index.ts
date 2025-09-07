/**
 * Humanitarian utility functions - main export file
 */

// Export all utility functions
export * from './formatCurrency'
export * from './generateQRCodes'
export * from './trackingHelpers'
export * from './walletHelpers'

// Re-export commonly used functions for convenience
export {
  formatCurrencyAmount,
  formatCompactAmount,
  parseCurrencyInput
} from './formatCurrency'

export {
  generateVoucherQRData,
  generateRecipientQRData,
  encodeQRData,
  decodeQRData
} from './generateQRCodes'

export {
  createTransactionTrail,
  calculateAidImpact,
  generateImpactMessage
} from './trackingHelpers'

export {
  detectUserRole,
  formatWalletAddress,
  validateSufficientBalance,
  createTransactionMetadata
} from './walletHelpers'