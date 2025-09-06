import { Campaign, Milestone, ProofSubmission } from '../../types/humanitarian.types'

const mockProofSubmissions: ProofSubmission[] = [
  {
    id: 'proof_001',
    milestone_id: 'milestone_001',
    submitter_address: 'MSW7GP2KK2HQJRCGQTPBDOXP4LGDPZ3WYVZVCFM3PCFXJFTHCPJQXRQF5E',
    submission_date: new Date('2024-08-20T14:30:00Z'),
    proof_type: 'photo',
    content_hash: 'QmX4j8aZvU9K5m2nR7L8oP3tY6wE1qA5s9D8fG3hJ7kM6vB',
    description: 'Medical supplies distributed to 150 families in refugee camp',
    verification_notes: 'Verified by local UN representative'
  },
  {
    id: 'proof_002',
    milestone_id: 'milestone_003',
    submitter_address: 'WFP6KL8MM4TQJRCGQTPBDOXP4LGDPZ3WYVZVCFM3PCFXJFTHCPJQXRQF9A',
    submission_date: new Date('2024-09-01T10:15:00Z'),
    proof_type: 'receipt',
    content_hash: 'QmY5k9bAwV0L6n3oS8M9pQ4uZ7xF2rB6t0E9gH4iK8lN7wC',
    description: 'Purchase receipts for 2000 food parcels from local suppliers',
    verification_notes: 'Receipts verified, delivery pending'
  }
]

const mockMilestones: Milestone[] = [
  {
    id: 'milestone_001',
    campaign_id: 'campaign_001',
    title: 'Emergency Medical Supplies',
    description: 'Procure and distribute medical supplies for 200 families',
    target_amount: 5000,
    raised_amount: 5000,
    deadline: new Date('2024-08-25T23:59:59Z'),
    status: 'completed',
    proof_required: true,
    proof_submitted: [mockProofSubmissions[0]],
    verification_status: 'approved'
  },
  {
    id: 'milestone_002',
    campaign_id: 'campaign_001',
    title: 'Mobile Medical Clinic Setup',
    description: 'Establish mobile clinic operations for ongoing healthcare',
    target_amount: 10000,
    raised_amount: 7500,
    deadline: new Date('2024-09-15T23:59:59Z'),
    status: 'in_progress',
    proof_required: true,
    proof_submitted: [],
    verification_status: 'pending'
  },
  {
    id: 'milestone_003',
    campaign_id: 'campaign_002',
    title: 'Food Distribution - Phase 1',
    description: 'Distribute emergency food supplies to 500 displaced families',
    target_amount: 8000,
    raised_amount: 8000,
    deadline: new Date('2024-09-05T23:59:59Z'),
    status: 'awaiting_verification',
    proof_required: true,
    proof_submitted: [mockProofSubmissions[1]],
    verification_status: 'pending'
  },
  {
    id: 'milestone_004',
    campaign_id: 'campaign_002',
    title: 'Sustainable Food Program Setup',
    description: 'Establish local partnerships for ongoing food security',
    target_amount: 15000,
    raised_amount: 3200,
    deadline: new Date('2024-10-01T23:59:59Z'),
    status: 'pending',
    proof_required: true,
    proof_submitted: [],
    verification_status: 'pending'
  },
  {
    id: 'milestone_005',
    campaign_id: 'campaign_003',
    title: 'School Reconstruction',
    description: 'Rebuild damaged classrooms for 300 students',
    target_amount: 20000,
    raised_amount: 12500,
    deadline: new Date('2024-11-30T23:59:59Z'),
    status: 'in_progress',
    proof_required: true,
    proof_submitted: [],
    verification_status: 'pending'
  }
]

export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign_001',
    title: 'Syrian Refugee Medical Emergency Response',
    description: 'Urgent medical assistance needed for Syrian refugee families displaced by recent conflict escalation. Funds will provide emergency medical supplies, establish mobile clinics, and ensure ongoing healthcare access.',
    organizer_ngo: 'Doctors Without Borders',
    organizer_address: 'MSW7GP2KK2HQJRCGQTPBDOXP4LGDPZ3WYVZVCFM3PCFXJFTHCPJQXRQF5E',
    milestones: [mockMilestones[0], mockMilestones[1]],
    total_raised: 12500,
    target_amount: 15000,
    currency: 'USDC',
    start_date: new Date('2024-08-10T00:00:00Z'),
    end_date: new Date('2024-10-10T23:59:59Z'),
    status: 'active',
    donors_count: 23,
    location: 'Jordan/Syria Border',
    category: 'medical_emergency'
  },
  {
    id: 'campaign_002',
    title: 'East Africa Drought Relief - Food Security',
    description: 'Severe drought has left over 2000 families without reliable food access. This campaign will provide immediate food relief and establish sustainable food programs with local partners.',
    organizer_ngo: 'World Food Programme',
    organizer_address: 'WFP6KL8MM4TQJRCGQTPBDOXP4LGDPZ3WYVZVCFM3PCFXJFTHCPJQXRQF9A',
    milestones: [mockMilestones[2], mockMilestones[3]],
    total_raised: 11200,
    target_amount: 23000,
    currency: 'ALGO',
    start_date: new Date('2024-08-15T00:00:00Z'),
    end_date: new Date('2024-11-15T23:59:59Z'),
    status: 'active',
    donors_count: 47,
    location: 'Kenya/Somalia Border',
    category: 'disaster_relief'
  },
  {
    id: 'campaign_003',
    title: 'Children\'s Education Recovery - Post Earthquake',
    description: 'Recent earthquake destroyed 12 schools affecting 800+ children. Campaign will rebuild facilities, provide educational materials, and support teacher training programs.',
    organizer_ngo: 'Save the Children',
    organizer_address: 'STC9PQ3NN5VQLSBDRAPCEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG8B',
    milestones: [mockMilestones[4]],
    total_raised: 12500,
    target_amount: 35000,
    currency: 'USDC',
    start_date: new Date('2024-08-20T00:00:00Z'),
    end_date: new Date('2024-12-31T23:59:59Z'),
    status: 'active',
    donors_count: 31,
    location: 'Northern Turkey',
    category: 'education'
  },
  {
    id: 'campaign_004',
    title: 'Refugee Camp Shelter Winterization',
    description: 'Preparing refugee shelters for harsh winter conditions. Funds will provide insulation, heating solutions, and weatherproofing for 150 family units.',
    organizer_ngo: 'Local Relief Initiative',
    organizer_address: 'LRI4RT7PP8XQMSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG2C',
    milestones: [],
    total_raised: 4500,
    target_amount: 12000,
    currency: 'ALGO',
    start_date: new Date('2024-09-01T00:00:00Z'),
    end_date: new Date('2024-11-30T23:59:59Z'),
    status: 'active',
    donors_count: 18,
    location: 'Zaatari Camp, Jordan',
    category: 'refugee_aid'
  },
  {
    id: 'campaign_005',
    title: 'Clean Water Infrastructure - Rural Villages',
    description: 'Building sustainable water access for 5 remote villages. Project includes well drilling, water purification systems, and community training programs.',
    organizer_ngo: 'Clean Water Foundation',
    organizer_address: 'CWF8UV2QQ6YQOSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG4D',
    milestones: [],
    total_raised: 1800,
    target_amount: 25000,
    currency: 'USDC',
    start_date: new Date('2024-08-25T00:00:00Z'),
    end_date: new Date('2025-02-28T23:59:59Z'),
    status: 'active',
    donors_count: 9,
    location: 'Rural Kenya',
    category: 'infrastructure'
  }
]

export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id)
}

export const getActiveCampaigns = (): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.status === 'active')
}

export const getCampaignsByCategory = (category: Campaign['category']): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.category === category)
}

export const getCampaignsByNGO = (ngoName: string): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.organizer_ngo === ngoName)
}

export const getTotalRaisedAcrossAllCampaigns = (currency?: 'ALGO' | 'USDC'): number => {
  const filtered = currency ? mockCampaigns.filter(c => c.currency === currency) : mockCampaigns
  return filtered.reduce((total, campaign) => total + campaign.total_raised, 0)
}