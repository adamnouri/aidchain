import { Donation } from '../../types/humanitarian.types'

export const mockDonations: Donation[] = [
  {
    id: 'don_001',
    donor_address: 'DONOR1K4PP8XQMSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG2A',
    donor_name: 'Alice Thompson',
    amount: 500,
    currency: 'ALGO',
    purpose: 'food',
    ngo_id: 'ngo_002',
    ngo_name: 'World Food Programme',
    timestamp: new Date('2024-09-01T10:30:00Z'),
    status: 'completed',
    transaction_hash: 'TXN_ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567',
    distribution_proof: ['proof_hash_001', 'proof_hash_002']
  },
  {
    id: 'don_002',
    donor_address: 'DONOR2M6QQ9YQOSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG3B',
    donor_name: 'Bob Wilson',
    amount: 1000,
    currency: 'USDC',
    purpose: 'medical',
    ngo_id: 'ngo_001',
    ngo_name: 'Doctors Without Borders',
    timestamp: new Date('2024-08-28T14:45:00Z'),
    status: 'distributed',
    transaction_hash: 'TXN_BCD234EFG567HIJ890KLM123NOP456QRS789TUV012WXY345ZAB678',
    distribution_proof: ['proof_hash_003']
  },
  {
    id: 'don_003',
    donor_address: 'DONOR3P8RR2ZQPSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG4C',
    donor_name: 'Carol Davis',
    amount: 250,
    currency: 'ALGO',
    purpose: 'education',
    ngo_id: 'ngo_003',
    ngo_name: 'Save the Children',
    timestamp: new Date('2024-08-25T09:15:00Z'),
    status: 'distributed',
    transaction_hash: 'TXN_CDE345FGH678IJK901LMN234OPQ567RST890UVW123XYZ456ABC789',
    distribution_proof: ['proof_hash_004', 'proof_hash_005']
  },
  {
    id: 'don_004',
    donor_address: 'DONOR1K4PP8XQMSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG2A',
    donor_name: 'Alice Thompson',
    amount: 750,
    currency: 'ALGO',
    purpose: 'shelter',
    ngo_id: 'ngo_004',
    ngo_name: 'Local Relief Initiative',
    timestamp: new Date('2024-08-20T16:20:00Z'),
    status: 'allocated',
    transaction_hash: 'TXN_DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890',
    distribution_proof: []
  },
  {
    id: 'don_005',
    donor_address: 'DONOR4S9TT4AQRSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG5D',
    donor_name: 'David Miller',
    amount: 2000,
    currency: 'USDC',
    purpose: 'emergency',
    ngo_id: 'ngo_001',
    ngo_name: 'Doctors Without Borders',
    timestamp: new Date('2024-08-15T11:30:00Z'),
    status: 'completed',
    transaction_hash: 'TXN_EFG567HIJ890KLM123NOP456QRS789TUV012WXY345ZAB678CDE901',
    distribution_proof: ['proof_hash_006', 'proof_hash_007', 'proof_hash_008']
  },
  {
    id: 'don_006',
    donor_address: 'DONOR5U1VV6BRTSBEREPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG6E',
    donor_name: 'Emma Johnson',
    amount: 150,
    currency: 'ALGO',
    purpose: 'food',
    ngo_id: 'ngo_002',
    ngo_name: 'World Food Programme',
    timestamp: new Date('2024-09-05T13:45:00Z'),
    status: 'pending',
    transaction_hash: 'TXN_FGH678IJK901LMN234OPQ567RST890UVW123XYZ456ABC789DEF012'
  },
  {
    id: 'don_007',
    donor_address: 'DONOR2M6QQ9YQOSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG3B',
    donor_name: 'Bob Wilson',
    amount: 300,
    currency: 'ALGO',
    purpose: 'general',
    ngo_id: 'ngo_005',
    ngo_name: 'Clean Water Foundation',
    timestamp: new Date('2024-08-30T08:00:00Z'),
    status: 'allocated',
    transaction_hash: 'TXN_GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG123'
  }
]

export const getDonationsByDonor = (donorAddress: string): Donation[] => {
  return mockDonations.filter(donation => donation.donor_address === donorAddress)
}

export const getDonationsByNGO = (ngoId: string): Donation[] => {
  return mockDonations.filter(donation => donation.ngo_id === ngoId)
}

export const getDonationsByStatus = (status: Donation['status']): Donation[] => {
  return mockDonations.filter(donation => donation.status === status)
}

export const getDonationsByPurpose = (purpose: Donation['purpose']): Donation[] => {
  return mockDonations.filter(donation => donation.purpose === purpose)
}

export const getTotalDonationAmount = (currency?: 'ALGO' | 'USDC'): number => {
  const filtered = currency ? mockDonations.filter(d => d.currency === currency) : mockDonations
  return filtered.reduce((total, donation) => total + donation.amount, 0)
}