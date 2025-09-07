// Core blockchain types
export interface Campaign {
  id: number
  title: string
  target: number
  raised: number
  creator: string
  active: boolean
}

export interface Organization {
  id: number
  name: string
  walletAddress: string
  verificationLevel: number
}

export interface Milestone {
  id: number
  campaignId: number
  targetAmount: number
  description: string
  completed: boolean
  fundsReleased: boolean
}

export interface Voucher {
  id: number
  assetId: number
  name: string
  totalSupply: number
  issued: number
}

export interface Delivery {
  id: number
  recipient: string
  location: string
  agent: string
  verified: boolean
}

export interface ContractStats {
  totalDonations: number
  totalCampaigns: number
  totalOrganizations: number
}

// Hook return types
export interface DonorDashboardHook {
  loadDashboardData: () => Promise<void>
  makeDonation: (campaignId: number) => Promise<boolean>
  loading: boolean
  error: string | null
  stats: ContractStats | null
  campaigns: Campaign[]
  setError: (error: string | null) => void
}

export interface OrganizationManagementHook {
  loadData: () => Promise<void>
  registerOrganization: (orgName: string, walletAddress: string) => Promise<number | null>
  createCampaign: (title: string, targetAlgo: string, creator: string) => Promise<number | null>
  loading: boolean
  error: string | null
  organizations: Organization[]
  campaigns: Campaign[]
  setError: (error: string | null) => void
}

export interface MilestoneTrackerHook {
  loadData: () => Promise<void>
  createMilestone: (campaignId: number, targetAlgo: string, description: string) => Promise<number | null>
  completeMilestone: (milestoneId: number, proof: string) => Promise<boolean>
  releaseFunds: (milestoneId: number, recipientAddress: string, amountAlgo: string) => Promise<boolean>
  loading: boolean
  error: string | null
  milestones: Milestone[]
  campaigns: Campaign[]
  setError: (error: string | null) => void
}

export interface VoucherSystemHook {
  loadVouchers: () => Promise<void>
  createVoucher: (assetName: string, totalSupply: string) => Promise<number | null>
  distributeVouchers: (assetId: number, recipientAddress: string, amount: string) => Promise<boolean>
  redeemVoucher: (voucherId: number, merchant: string, amount: string) => Promise<boolean>
  loading: boolean
  error: string | null
  vouchers: Voucher[]
  setError: (error: string | null) => void
}

export interface DeliveryTrackerHook {
  loadDeliveries: () => Promise<void>
  logDelivery: (recipient: string, location: string) => Promise<number | null>
  verifyDelivery: (deliveryId: number, agent: string) => Promise<boolean>
  loading: boolean
  error: string | null
  deliveries: Delivery[]
  setError: (error: string | null) => void
}

export interface AppClientManagerHook {
  appClient: any | null // AidchainContractsClient type from generated contracts
  loading: boolean
  error: string | null
  activeAddress: string | null | undefined
  reinitialize: () => Promise<void>
}

// Component prop types
export interface DashboardProps {
  onBackToLanding: () => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

// Form types
export interface CreateCampaignForm {
  title: string
  target: string
  creator: string
}

export interface CreateMilestoneForm {
  campaignId: number
  targetAmount: string
  description: string
}

export interface CreateVoucherForm {
  assetName: string
  totalSupply: string
}

export interface DonationForm {
  campaignId: number
  amount: string
}

// Utility types
export type ViewType = 
  | 'landing' 
  | 'donor' 
  | 'ngo' 
  | 'milestones' 
  | 'vouchers' 
  | 'deliveries' 
  | 'about' 
  | 'how-it-works' 
  | 'get-involved'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export type VerificationLevel = 0 | 1 | 2 | 3 // unverified, basic, verified, partner

// Error types
export interface AppError {
  message: string
  code?: string
  context?: Record<string, any>
}

// Branded types for better type safety
export type CampaignId = number & { readonly __brand: 'CampaignId' }
export type OrganizationId = number & { readonly __brand: 'OrganizationId' }
export type MilestoneId = number & { readonly __brand: 'MilestoneId' }
export type VoucherId = number & { readonly __brand: 'VoucherId' }
export type DeliveryId = number & { readonly __brand: 'DeliveryId' }
export type AssetId = number & { readonly __brand: 'AssetId' }

// Utility functions for branded types
export const createCampaignId = (id: number): CampaignId => id as CampaignId
export const createOrganizationId = (id: number): OrganizationId => id as OrganizationId
export const createMilestoneId = (id: number): MilestoneId => id as MilestoneId
export const createVoucherId = (id: number): VoucherId => id as VoucherId
export const createDeliveryId = (id: number): DeliveryId => id as DeliveryId
export const createAssetId = (id: number): AssetId => id as AssetId

// Constants
export const MICRO_ALGOS_PER_ALGO = 1_000_000
export const DEFAULT_VERIFICATION_LEVEL = 0
export const MAX_CAMPAIGN_TITLE_LENGTH = 100
export const MAX_DESCRIPTION_LENGTH = 500
export const MIN_DONATION_AMOUNT = 0.001 // ALGO