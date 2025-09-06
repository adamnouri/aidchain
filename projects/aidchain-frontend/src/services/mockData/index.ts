// Export all mock data and helper functions
export * from './mockNGOs'
export * from './mockDonations'
export * from './mockCampaigns'
export * from './mockVouchers'
export * from './mockMerchants'

// Dashboard statistics helper
import { mockDonations, getTotalDonationAmount } from './mockDonations'
import { mockCampaigns, getTotalRaisedAcrossAllCampaigns } from './mockCampaigns'
import { mockNGOs, getVerifiedNGOs } from './mockNGOs'
import { mockVouchers, getTotalVoucherValue } from './mockVouchers'
import { mockMerchants, getTotalVouchersRedeemed } from './mockMerchants'
import { DashboardStats } from '../../types/humanitarian.types'

export const getDashboardStats = (): DashboardStats => {
  const completedDonations = mockDonations.filter(d => d.status === 'completed')
  const totalDistributed = completedDonations.reduce((total, d) => total + d.amount, 0)
  
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'active')
  const verifiedNGOs = getVerifiedNGOs()
  
  // Count unique recipients from vouchers
  const uniqueRecipients = new Set(mockVouchers.map(v => v.recipient_address))
  
  const issuedVouchers = mockVouchers.filter(v => v.status === 'issued')
  const redeemedVouchers = mockVouchers.filter(v => v.status === 'redeemed')

  return {
    total_donations: getTotalDonationAmount(),
    total_distributed: totalDistributed,
    active_campaigns: activeCampaigns.length,
    verified_ngos: verifiedNGOs.length,
    beneficiaries_helped: uniqueRecipients.size,
    vouchers_issued: issuedVouchers.length,
    vouchers_redeemed: redeemedVouchers.length,
    currency: 'USDC' // Default display currency
  }
}