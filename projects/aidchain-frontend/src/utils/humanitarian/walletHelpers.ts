/**
 * Humanitarian-specific wallet operations and utilities
 */

import { UserRole } from '../../types/humanitarian.types'

export interface WalletConnection {
  address: string
  isConnected: boolean
  balance: number
  currency: 'ALGO' | 'USDC'
}

export const detectUserRole = async (walletAddress: string): Promise<UserRole> => {
  // In a real implementation, this would check blockchain records or a registry
  // For mock purposes, we'll use address patterns
  
  if (walletAddress.includes('NGO') || walletAddress.includes('MSW') || 
      walletAddress.includes('WFP') || walletAddress.includes('STC')) {
    return 'ngo'
  }
  
  if (walletAddress.includes('MERCH')) {
    return 'merchant'
  }
  
  if (walletAddress.includes('RECIP')) {
    return 'recipient'
  }
  
  if (walletAddress.includes('ADMIN')) {
    return 'admin'
  }
  
  // Default to donor for regular wallets
  return 'donor'
}

export const validateWalletForRole = (walletAddress: string, requiredRole: UserRole): boolean => {
  // This would check if the wallet is authorized for specific operations
  // For now, we'll allow all operations for demo purposes
  return true
}

export const formatWalletAddress = (address: string, length: number = 8): string => {
  if (address.length <= length * 2) {
    return address
  }
  
  const start = address.slice(0, length)
  const end = address.slice(-length)
  return `${start}...${end}`
}

export const generateMockWalletAddress = (role: UserRole, index: number = 1): string => {
  const prefixes = {
    donor: 'DONOR',
    ngo: 'NGO',
    recipient: 'RECIP',
    merchant: 'MERCH',
    admin: 'ADMIN'
  }
  
  const prefix = prefixes[role]
  const randomSuffix = Math.random().toString(36).substring(2, 15).toUpperCase()
  
  return `${prefix}${index}${randomSuffix}HUMANITARIAN${index}`
}

export const createWalletDisplayName = (address: string, role: UserRole): string => {
  const roleNames = {
    donor: 'Donor Wallet',
    ngo: 'NGO Wallet',
    recipient: 'Recipient Wallet',
    merchant: 'Merchant Wallet',
    admin: 'Admin Wallet'
  }
  
  return `${roleNames[role]} (${formatWalletAddress(address)})`
}

export const estimateTransactionFee = (
  transactionType: 'donation' | 'voucher_issue' | 'voucher_redeem' | 'campaign_create'
): number => {
  // Mock transaction fees in ALGO
  const fees = {
    donation: 0.001,
    voucher_issue: 0.002,
    voucher_redeem: 0.001,
    campaign_create: 0.005
  }
  
  return fees[transactionType]
}

export const validateSufficientBalance = (
  balance: number,
  amount: number,
  transactionType: 'donation' | 'voucher_issue' | 'voucher_redeem' | 'campaign_create'
): { isValid: boolean; message: string } => {
  const fee = estimateTransactionFee(transactionType)
  const totalRequired = amount + fee
  
  if (balance < totalRequired) {
    return {
      isValid: false,
      message: `Insufficient balance. Required: ${totalRequired} ALGO (including ${fee} ALGO fee), Available: ${balance} ALGO`
    }
  }
  
  return {
    isValid: true,
    message: 'Sufficient balance'
  }
}

export const createTransactionMetadata = (
  type: 'donation' | 'voucher_issue' | 'voucher_redeem' | 'campaign_create',
  data: Record<string, any>
): Record<string, any> => {
  const baseMetadata = {
    timestamp: new Date().toISOString(),
    platform: 'aidchain',
    version: '1.0'
  }
  
  switch (type) {
    case 'donation':
      return {
        ...baseMetadata,
        type: 'humanitarian_donation',
        purpose: data.purpose,
        ngo_id: data.ngo_id,
        donor_message: data.message
      }
    
    case 'voucher_issue':
      return {
        ...baseMetadata,
        type: 'aid_voucher_issue',
        voucher_type: data.voucher_type,
        recipient_count: data.recipient_count,
        issuer_ngo: data.issuer_ngo
      }
    
    case 'voucher_redeem':
      return {
        ...baseMetadata,
        type: 'aid_voucher_redeem',
        voucher_id: data.voucher_id,
        merchant_id: data.merchant_id
      }
    
    case 'campaign_create':
      return {
        ...baseMetadata,
        type: 'humanitarian_campaign',
        category: data.category,
        target_amount: data.target_amount,
        milestone_count: data.milestones?.length
      }
    
    default:
      return baseMetadata
  }
}

export const isHumanitarianWallet = (address: string): boolean => {
  const humanitarianPrefixes = ['NGO', 'MERCH', 'RECIP', 'DONOR']
  return humanitarianPrefixes.some(prefix => address.includes(prefix))
}

export const getWalletTypeIcon = (role: UserRole): string => {
  const icons = {
    donor: '💝',
    ngo: '🏥',
    recipient: '🙏',
    merchant: '🏪',
    admin: '⚙️'
  }
  
  return icons[role]
}