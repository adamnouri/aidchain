// hooks/useAidChainUI.ts - UI-specific blockchain interactions for Figma designs
import { useState, useEffect, useCallback } from 'react'
import { useAppClientManager } from './useAppClientManager'
import { AidchainContractsClient } from '../contracts/AidchainContracts'

export interface LandingPageStats {
  totalDonations: number
  activeCampaigns: number
  totalOrganizations: number
  loading: boolean
  error: string | null
}

export interface CampaignCategory {
  id: number
  title: string
  location: string
  imageUrl: string
  raised: number
  target: number
  urgency: 'high' | 'medium' | 'low'
  description?: string
}

export interface DonationDetailState {
  campaign: CampaignCategory | null
  selectedAmount: number
  customAmount: string
  processing: boolean
  loading: boolean
  error: string | null
}

export interface ConfirmationState {
  transactionHash: string
  donationAmount: number
  campaignId: number
  donorEmail?: string
  donationDate: Date
  receiverLocation: string
  loading: boolean
  error: string | null
}

// Landing page stats hook
export const useLandingPageStats = () => {
  const [stats, setStats] = useState<LandingPageStats>({
    totalDonations: 0,
    activeCampaigns: 0,
    totalOrganizations: 0,
    loading: true,
    error: null
  })

  const { appClient } = useAppClientManager()

  const loadStats = useCallback(async () => {
    console.log('📈 Loading landing page stats:', { appClient: !!appClient })
    
    setStats(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Try blockchain first
      if (appClient) {
        console.log('🔗 Loading stats from blockchain...')
        const [totalDonationsRes, campaignCountRes, orgCountRes] = await Promise.all([
          appClient.send.getTotalDonations(),
          appClient.send.getCampaignCount(),
          appClient.send.getOrganizationCount()
        ])

        setStats({
          totalDonations: Number(totalDonationsRes.return),
          activeCampaigns: Number(campaignCountRes.return),
          totalOrganizations: Number(orgCountRes.return),
          loading: false,
          error: null
        })
        return
      }

      throw new Error('No blockchain connection')
    } catch (error) {
      console.error('❌ Blockchain stats loading failed:', error)
      console.log('🎭 Using mock stats for demo')
      
      // Fallback to mock stats for hackathon demo
      setStats({
        totalDonations: 1365000, // $1.365M
        activeCampaigns: 5,
        totalOrganizations: 12,
        loading: false,
        error: null
      })
    }
  }, [appClient])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return { stats, loadStats }
}

// Campaign categories hook
export const useCampaignCategories = () => {
  const [categories, setCategories] = useState<CampaignCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { appClient } = useAppClientManager()

  const extractLocation = (title: string): string => {
    const locations = ['Afghanistan', 'Sudan', 'Pakistan', 'Syria', 'Ukraine', 'Haiti']
    const found = locations.find(loc => title.toLowerCase().includes(loc.toLowerCase()))
    return found || 'Global'
  }

  const getCategoryImage = (title: string): string => {
    // Map campaign types to placeholder images - user can replace with actual assets
    const imageMap: Record<string, string> = {
      'afghanistan': '/assets/afghanistan-aid.jpg',
      'sudan': '/assets/sudan-aid.jpg',
      'pakistan': '/assets/pakistan-aid.jpg',
      'syria': '/assets/syria-aid.jpg',
      'hurricane': '/assets/hurricane-aid.jpg',
      'orphan': '/assets/orphan-support.jpg'
    }
    
    const key = Object.keys(imageMap).find(k => 
      title.toLowerCase().includes(k)
    )
    
    return key ? imageMap[key] : '/assets/default-aid.jpg'
  }

  const calculateUrgency = (raised: number, target: number): 'high' | 'medium' | 'low' => {
    const percentage = target > 0 ? (raised / target) * 100 : 0
    if (percentage < 25) return 'high'
    if (percentage < 75) return 'medium'
    return 'low'
  }

  const loadCategories = useCallback(async () => {
    console.log('📊 Loading campaign categories:', { appClient: !!appClient })
    
    setLoading(true)
    setError(null)

    try {
      // Try blockchain first
      if (appClient) {
        console.log('🔗 Loading categories from blockchain...')
        const campaignCountRes = await appClient.send.getCampaignCount()
        const campaignCount = Number(campaignCountRes.return)

        if (campaignCount === 0) {
          console.log('📭 No campaigns found on blockchain, using mock data')
          throw new Error('No campaigns on blockchain')
        }

        // Load all campaigns
        const campaignPromises = []
        for (let i = 1; i <= campaignCount; i++) {
          campaignPromises.push(
            appClient.send.getCampaignDetails({ args: { campaignId: i } })
          )
        }

        const campaignResults = await Promise.all(campaignPromises)
        
        const campaigns: CampaignCategory[] = campaignResults.map(result => {
          const campaign = result.return
          return {
            id: Number(campaign.id),
            title: campaign.title,
            location: extractLocation(campaign.title),
            imageUrl: getCategoryImage(campaign.title),
            raised: Number(campaign.raised),
            target: Number(campaign.target),
            urgency: calculateUrgency(Number(campaign.raised), Number(campaign.target)),
            description: `Help provide emergency aid and support for ${extractLocation(campaign.title)}`
          }
        })

        setCategories(campaigns)
        setLoading(false)
        return
      }

      throw new Error('No blockchain connection')
    } catch (error) {
      console.error('❌ Blockchain categories loading failed:', error)
      console.log('🎭 Using mock campaign data for demo')
      
      // Fallback to mock data for hackathon demo
      const mockCategories: CampaignCategory[] = [
        {
          id: 1,
          title: 'Afghanistan Emergency Relief',
          location: 'Afghanistan',
          imageUrl: getCategoryImage('afghanistan'),
          raised: 245000,
          target: 500000,
          urgency: 'high',
          description: 'Help provide emergency aid and support for Afghanistan'
        },
        {
          id: 2,
          title: 'Sudan Crisis Support',
          location: 'Sudan',
          imageUrl: getCategoryImage('sudan'),
          raised: 180000,
          target: 400000,
          urgency: 'high',
          description: 'Help provide emergency aid and support for Sudan'
        },
        {
          id: 3,
          title: 'Pakistan Flood Recovery',
          location: 'Pakistan',
          imageUrl: getCategoryImage('pakistan'),
          raised: 320000,
          target: 600000,
          urgency: 'medium',
          description: 'Help provide emergency aid and support for Pakistan'
        },
        {
          id: 4,
          title: 'Hurricane Maria Relief',
          location: 'Puerto Rico',
          imageUrl: getCategoryImage('hurricane'),
          raised: 150000,
          target: 300000,
          urgency: 'medium',
          description: 'Help provide emergency aid and support for Puerto Rico'
        },
        {
          id: 5,
          title: 'Syria Orphan Support',
          location: 'Syria',
          imageUrl: getCategoryImage('syria'),
          raised: 420000,
          target: 800000,
          urgency: 'medium',
          description: 'Help provide emergency aid and support for Syria'
        }
      ]

      setCategories(mockCategories)
      setError(null) // Clear error since we have fallback data
      setLoading(false)
    }
  }, [appClient])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  return { categories, loading, error, loadCategories }
}

// Donation detail hook
export const useDonationDetail = (campaignId: number) => {
  const [state, setState] = useState<DonationDetailState>({
    campaign: null,
    selectedAmount: 50,
    customAmount: '',
    processing: false,
    loading: true,
    error: null
  })

  const { appClient, activeAddress } = useAppClientManager()

  const loadCampaignDetails = useCallback(async () => {
    console.log('📋 Loading campaign details:', { campaignId, appClient: !!appClient })
    
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Try blockchain first
      if (appClient && campaignId) {
        console.log('🔗 Loading from blockchain...')
        const campaignRes = await appClient.send.getCampaignDetails({ args: { campaignId } })
        const campaign = campaignRes.return

        const extractLocation = (title: string): string => {
          const locations = ['Afghanistan', 'Sudan', 'Pakistan', 'Syria', 'Ukraine', 'Haiti']
          const found = locations.find(loc => title.toLowerCase().includes(loc.toLowerCase()))
          return found || 'Global'
        }

        const getCategoryImage = (title: string): string => {
          const imageMap: Record<string, string> = {
            'afghanistan': '/assets/afghanistan-aid.jpg',
            'sudan': '/assets/sudan-aid.jpg',
            'pakistan': '/assets/pakistan-aid.jpg',
            'syria': '/assets/syria-aid.jpg',
            'hurricane': '/assets/hurricane-aid.jpg',
            'orphan': '/assets/orphan-support.jpg'
          }
          
          const key = Object.keys(imageMap).find(k => 
            title.toLowerCase().includes(k)
          )
          
          return key ? imageMap[key] : '/assets/default-aid.jpg'
        }

        const calculateUrgency = (raised: number, target: number): 'high' | 'medium' | 'low' => {
          const percentage = target > 0 ? (raised / target) * 100 : 0
          if (percentage < 25) return 'high'
          if (percentage < 75) return 'medium'
          return 'low'
        }

        const campaignData: CampaignCategory = {
          id: Number(campaign.id),
          title: campaign.title,
          location: extractLocation(campaign.title),
          imageUrl: getCategoryImage(campaign.title),
          raised: Number(campaign.raised),
          target: Number(campaign.target),
          urgency: calculateUrgency(Number(campaign.raised), Number(campaign.target)),
          description: `Help provide emergency aid and support for ${extractLocation(campaign.title)}`
        }

        setState(prev => ({ ...prev, campaign: campaignData, loading: false }))
        return
      }

      throw new Error('No blockchain connection available')
    } catch (error) {
      console.error('❌ Blockchain loading failed:', error)
      console.log('🎭 Using mock campaign data for demo')
      
      // Fallback to mock data for hackathon demo
      const mockCampaigns = [
        { id: 1, title: 'Afghanistan Emergency Relief', location: 'Afghanistan', raised: 245000, target: 500000 },
        { id: 2, title: 'Sudan Crisis Support', location: 'Sudan', raised: 180000, target: 400000 },
        { id: 3, title: 'Pakistan Flood Recovery', location: 'Pakistan', raised: 320000, target: 600000 },
        { id: 4, title: 'Hurricane Maria Relief', location: 'Puerto Rico', raised: 150000, target: 300000 },
        { id: 5, title: 'Syria Orphan Support', location: 'Syria', raised: 420000, target: 800000 }
      ]

      const mockCampaign = mockCampaigns.find(c => c.id === campaignId) || mockCampaigns[0]
      
      const calculateUrgency = (raised: number, target: number): 'high' | 'medium' | 'low' => {
        const percentage = target > 0 ? (raised / target) * 100 : 0
        if (percentage < 25) return 'high'
        if (percentage < 75) return 'medium'
        return 'low'
      }

      const campaignData: CampaignCategory = {
        id: mockCampaign.id,
        title: mockCampaign.title,
        location: mockCampaign.location,
        imageUrl: '/assets/default-aid.jpg',
        raised: mockCampaign.raised,
        target: mockCampaign.target,
        urgency: calculateUrgency(mockCampaign.raised, mockCampaign.target),
        description: `Help provide emergency aid and support for ${mockCampaign.location}`
      }

      setState(prev => ({ ...prev, campaign: campaignData, loading: false }))
    }
  }, [appClient, campaignId])

  const processDonation = async (amount: number): Promise<string | null> => {
    console.log('💰 Processing donation:', { amount, appClient: !!appClient, activeAddress })
    
    setState(prev => ({ ...prev, processing: true, error: null }))

    try {
      // PRIORITY: Real blockchain transaction first
      if (appClient && activeAddress) {
        console.log('🔗 Processing REAL blockchain donation...')
        
        // Validate donation first
        const validation = await appClient.send.validateDonation({
          args: {
            amount: amount * 1_000_000, // Convert to microAlgos  
            donor: activeAddress
          }
        })

        if (!validation.return.includes('Valid')) {
          throw new Error('Invalid donation amount')
        }

        // Process real blockchain donation
        const result = await appClient.send.createDonation({ args: { campaignId } })
        console.log('✅ REAL blockchain donation successful:', result.return)
        
        // Reload campaign details to get updated blockchain stats
        await loadCampaignDetails()
        
        setState(prev => ({ ...prev, processing: false }))
        return result.return
      }

      // Only use mock if no blockchain connection at all
      console.log('⚠️ No blockchain connection - using demo mode')
      throw new Error('No blockchain connection available')
      
    } catch (error) {
      console.error('❌ Blockchain donation error:', error)
      
      // Only fall back to mock after blockchain attempt fails
      console.log('🎭 Blockchain failed - falling back to mock for demo continuity')
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update campaign with mock data
      if (state.campaign) {
        const updatedCampaign = {
          ...state.campaign,
          raised: state.campaign.raised + amount
        }
        setState(prev => ({ ...prev, campaign: updatedCampaign, processing: false }))
      }
      
      return `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    }
  }

  const setSelectedAmount = (amount: number) => {
    setState(prev => ({ ...prev, selectedAmount: amount, customAmount: '' }))
  }

  const setCustomAmount = (amount: string) => {
    setState(prev => ({ ...prev, customAmount: amount, selectedAmount: 0 }))
  }

  useEffect(() => {
    loadCampaignDetails()
  }, [loadCampaignDetails])

  return {
    state,
    processDonation,
    setSelectedAmount,
    setCustomAmount,
    loadCampaignDetails
  }
}

// Donation confirmation hook
export const useDonationConfirmation = (transactionHash?: string) => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    transactionHash: transactionHash || '',
    donationAmount: 0,
    campaignId: 0,
    donationDate: new Date(),
    receiverLocation: '',
    loading: true,
    error: null
  })

  const { appClient } = useAppClientManager()

  const loadConfirmationDetails = useCallback(async () => {
    if (!appClient || !transactionHash) return

    setConfirmation(prev => ({ ...prev, loading: true, error: null }))

    try {
      // In a real implementation, you'd get transaction details from Algorand Indexer
      // For now, we'll use mock data based on the most recent campaign
      const campaignCountRes = await appClient.send.getCampaignCount()
      const campaignCount = Number(campaignCountRes.return)

      if (campaignCount > 0) {
        const campaignRes = await appClient.send.getCampaignDetails({ args: { campaignId: campaignCount } })
        const campaign = campaignRes.return

        const extractLocation = (title: string): string => {
          const locations = ['Afghanistan', 'Sudan', 'Pakistan', 'Syria', 'Ukraine', 'Haiti']
          const found = locations.find(loc => title.toLowerCase().includes(loc.toLowerCase()))
          return found || 'Global'
        }

        setConfirmation({
          transactionHash: transactionHash,
          donationAmount: 50, // Default amount - would come from transaction in real implementation
          campaignId: Number(campaign.id),
          donationDate: new Date(),
          receiverLocation: extractLocation(campaign.title),
          loading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Error loading confirmation details:', error)
      setConfirmation(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load confirmation details'
      }))
    }
  }, [appClient, transactionHash])

  useEffect(() => {
    loadConfirmationDetails()
  }, [loadConfirmationDetails])

  return { confirmation, loadConfirmationDetails }
}

// Main UI hook that combines all functionality
export const useAidChainUI = () => {
  return {
    useLandingPageStats,
    useCampaignCategories,
    useDonationDetail,
    useDonationConfirmation
  }
}