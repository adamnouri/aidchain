export interface Donation {
  id: string
  donor_address: string
  donor_name?: string
  amount: number
  currency: 'ALGO' | 'USDC'
  purpose: 'food' | 'medical' | 'shelter' | 'education' | 'emergency' | 'general'
  ngo_id: string
  ngo_name: string
  timestamp: Date
  status: 'pending' | 'allocated' | 'distributed' | 'completed'
  transaction_hash?: string
  distribution_proof?: string[]
}

export interface Voucher {
  id: string
  recipient_address: string
  recipient_name?: string
  issuer_ngo: string
  merchant_restrictions: string[]
  amount: number
  currency: 'ALGO' | 'USDC'
  voucher_type: 'food' | 'medical' | 'general'
  status: 'issued' | 'redeemed' | 'expired'
  issue_date: Date
  expiry_date: Date
  redemption_date?: Date
  redeemed_at_merchant?: string
  qr_code?: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  organizer_ngo: string
  organizer_address: string
  milestones: Milestone[]
  total_raised: number
  target_amount: number
  currency: 'ALGO' | 'USDC'
  start_date: Date
  end_date: Date
  status: 'active' | 'completed' | 'cancelled' | 'paused'
  donors_count: number
  location?: string
  category: 'disaster_relief' | 'refugee_aid' | 'medical_emergency' | 'education' | 'infrastructure'
}

export interface Milestone {
  id: string
  campaign_id: string
  title: string
  description: string
  target_amount: number
  raised_amount: number
  deadline: Date
  status: 'pending' | 'in_progress' | 'awaiting_verification' | 'completed' | 'failed'
  proof_required: boolean
  proof_submitted?: ProofSubmission[]
  verification_status?: 'pending' | 'approved' | 'rejected'
}

export interface ProofSubmission {
  id: string
  milestone_id: string
  submitter_address: string
  submission_date: Date
  proof_type: 'photo' | 'receipt' | 'report' | 'third_party_verification'
  content_hash: string
  description: string
  verification_notes?: string
}

export interface NGO {
  id: string
  name: string
  wallet_address: string
  description: string
  location: string
  focus_areas: string[]
  verification_status: 'pending' | 'verified' | 'rejected'
  credibility_score: number
  total_received: number
  total_distributed: number
  active_campaigns: number
  contact_info: {
    email?: string
    phone?: string
    website?: string
  }
  registration_date: Date
  last_activity: Date
}

export interface Merchant {
  id: string
  name: string
  wallet_address: string
  business_type: 'grocery' | 'pharmacy' | 'restaurant' | 'medical_clinic' | 'general_store'
  location: string
  verification_status: 'pending' | 'verified' | 'suspended'
  voucher_types_accepted: ('food' | 'medical' | 'general')[]
  total_vouchers_redeemed: number
  total_earnings: number
  registration_date: Date
  last_redemption: Date
}

export interface Recipient {
  id: string
  wallet_address: string
  name?: string
  registration_date: Date
  total_aid_received: number
  active_vouchers: number
  aid_history: AidRecord[]
  location?: string
  family_size?: number
  special_needs?: string[]
}

export interface AidRecord {
  id: string
  recipient_id: string
  type: 'voucher' | 'direct_transfer' | 'in_kind'
  amount: number
  currency?: 'ALGO' | 'USDC'
  description: string
  source_ngo: string
  distribution_date: Date
  location?: string
  proof_of_delivery?: string
}

export interface TransactionTrail {
  donation_id: string
  steps: TrailStep[]
  current_step: number
  completion_percentage: number
}

export interface TrailStep {
  step_number: number
  title: string
  description: string
  timestamp?: Date
  status: 'pending' | 'in_progress' | 'completed'
  transaction_hash?: string
  proof_hash?: string
  location?: string
}

export interface DashboardStats {
  total_donations: number
  total_distributed: number
  active_campaigns: number
  verified_ngos: number
  beneficiaries_helped: number
  vouchers_issued: number
  vouchers_redeemed: number
  currency: 'ALGO' | 'USDC'
}

export type UserRole = 'donor' | 'ngo' | 'recipient' | 'merchant' | 'admin'

export interface User {
  wallet_address: string
  role: UserRole
  profile?: NGO | Merchant | Recipient
  preferences: {
    currency: 'ALGO' | 'USDC'
    notifications: boolean
    theme: 'light' | 'dark'
  }
}