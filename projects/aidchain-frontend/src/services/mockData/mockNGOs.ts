import { NGO } from '../../types/humanitarian.types'

export const mockNGOs: NGO[] = [
  {
    id: 'ngo_001',
    name: 'Doctors Without Borders',
    wallet_address: 'MSW7GP2KK2HQJRCGQTPBDOXP4LGDPZ3WYVZVCFM3PCFXJFTHCPJQXRQF5E',
    description: 'International medical humanitarian organization providing emergency medical aid in conflict zones and areas affected by disasters.',
    location: 'Geneva, Switzerland (Global Operations)',
    focus_areas: ['medical', 'emergency', 'disaster_relief'],
    verification_status: 'verified',
    credibility_score: 9.8,
    total_received: 2847500,
    total_distributed: 2743200,
    active_campaigns: 4,
    contact_info: {
      email: 'info@msf.org',
      phone: '+41-22-849-8400',
      website: 'https://www.doctorswithoutborders.org'
    },
    registration_date: new Date('2023-01-15'),
    last_activity: new Date('2024-09-05')
  },
  {
    id: 'ngo_002',
    name: 'World Food Programme',
    wallet_address: 'WFP6KL8MM4TQJRCGQTPBDOXP4LGDPZ3WYVZVCFM3PCFXJFTHCPJQXRQF9A',
    description: 'Leading humanitarian organization fighting hunger worldwide, providing food assistance in emergencies.',
    location: 'Rome, Italy (Global Operations)',
    focus_areas: ['food', 'emergency', 'education'],
    verification_status: 'verified',
    credibility_score: 9.9,
    total_received: 5673200,
    total_distributed: 5412800,
    active_campaigns: 7,
    contact_info: {
      email: 'info@wfp.org',
      phone: '+39-06-65131',
      website: 'https://www.wfp.org'
    },
    registration_date: new Date('2023-02-01'),
    last_activity: new Date('2024-09-06')
  },
  {
    id: 'ngo_003',
    name: 'Save the Children',
    wallet_address: 'STC9PQ3NN5VQLSBDRAPCEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG8B',
    description: 'International organization working to improve the lives of children through better education, healthcare, and emergency relief.',
    location: 'London, UK (Global Operations)',
    focus_areas: ['education', 'medical', 'shelter'],
    verification_status: 'verified',
    credibility_score: 9.6,
    total_received: 1923400,
    total_distributed: 1847300,
    active_campaigns: 3,
    contact_info: {
      email: 'info@savethechildren.org',
      phone: '+44-20-7012-6400',
      website: 'https://www.savethechildren.org'
    },
    registration_date: new Date('2023-03-10'),
    last_activity: new Date('2024-09-04')
  },
  {
    id: 'ngo_004',
    name: 'Local Relief Initiative',
    wallet_address: 'LRI4RT7PP8XQMSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG2C',
    description: 'Community-based organization focused on providing immediate relief to displaced families in the Middle East.',
    location: 'Amman, Jordan',
    focus_areas: ['shelter', 'food', 'general'],
    verification_status: 'verified',
    credibility_score: 8.7,
    total_received: 456700,
    total_distributed: 423100,
    active_campaigns: 2,
    contact_info: {
      email: 'contact@localrelief.org',
      phone: '+962-6-123-4567',
      website: 'https://www.localrelief.org'
    },
    registration_date: new Date('2023-06-15'),
    last_activity: new Date('2024-09-03')
  },
  {
    id: 'ngo_005',
    name: 'Clean Water Foundation',
    wallet_address: 'CWF8UV2QQ6YQOSBERAPDEQXQ5MHELQ4WYZWDGL4QDLNYKMUIDSKRYTRG4D',
    description: 'Dedicated to providing clean water access and sanitation infrastructure to underserved communities.',
    location: 'Nairobi, Kenya',
    focus_areas: ['infrastructure', 'medical', 'general'],
    verification_status: 'pending',
    credibility_score: 7.9,
    total_received: 234500,
    total_distributed: 198600,
    active_campaigns: 1,
    contact_info: {
      email: 'info@cleanwaterfoundation.org',
      phone: '+254-20-123-4567',
      website: 'https://www.cleanwaterfoundation.org'
    },
    registration_date: new Date('2023-08-20'),
    last_activity: new Date('2024-08-30')
  }
]

export const getNGOById = (id: string): NGO | undefined => {
  return mockNGOs.find(ngo => ngo.id === id)
}

export const getVerifiedNGOs = (): NGO[] => {
  return mockNGOs.filter(ngo => ngo.verification_status === 'verified')
}

export const getNGOsByFocusArea = (focusArea: string): NGO[] => {
  return mockNGOs.filter(ngo => ngo.focus_areas.includes(focusArea))
}