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
    if (!appClient) return

    setStats(prev => ({ ...prev, loading: true, error: null }))

    try {
      const [totalDonationsRes, campaignCountRes, orgCountRes] = await Promise.all([
        appClient.send.getTotalDonations({}),
        appClient.send.getCampaignCount({}),
        appClient.send.getOrganizationCount({})
      ])

      setStats({
        totalDonations: Number(totalDonationsRes.return),
        activeCampaigns: Number(campaignCountRes.return),
        totalOrganizations: Number(orgCountRes.return),
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading landing page stats:', error)
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load stats'
      }))
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
    if (!appClient) return

    setLoading(true)
    setError(null)

    try {
      const campaignCountRes = await appClient.send.getCampaignCount({})
      const campaignCount = Number(campaignCountRes.return)

      if (campaignCount === 0) {
        setCategories([])
        setLoading(false)
        return
      }

      // Load all campaigns
      const campaignPromises = []
      for (let i = 1; i <= campaignCount; i++) {
        campaignPromises.push(
          appClient.send.getCampaignDetails({ campaignId: i })
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
    } catch (error) {
      console.error('Error loading campaign categories:', error)
      setError(error instanceof Error ? error.message : 'Failed to load campaigns')
    } finally {
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
    if (!appClient || !campaignId) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const campaignRes = await appClient.send.getCampaignDetails({ campaignId })
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
    } catch (error) {
      console.error('Error loading campaign details:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load campaign details'
      }))
    }
  }, [appClient, campaignId])

  const processDonation = async (amount: number): Promise<string | null> => {
    if (!appClient || !activeAddress) return null

    setState(prev => ({ ...prev, processing: true, error: null }))

    try {
      // Validate donation first
      const validation = await appClient.send.validateDonation({
        amount: amount * 1_000_000, // Convert to microAlgos
        donor: activeAddress
      })

      if (!validation.return.includes('Valid')) {
        throw new Error('Invalid donation amount')
      }

      // Process donation
      const result = await appClient.send.createDonation({ campaignId })
      
      // Reload campaign details to get updated stats
      await loadCampaignDetails()
      
      setState(prev => ({ ...prev, processing: false }))
      return result.return
    } catch (error) {
      console.error('Error processing donation:', error)
      setState(prev => ({
        ...prev,
        processing: false,
        error: error instanceof Error ? error.message : 'Failed to process donation'
      }))
      return null
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

  const { client } = useAppClientManager()

  const loadConfirmationDetails = useCallback(async () => {
    if (!appClient || !transactionHash) return

    setConfirmation(prev => ({ ...prev, loading: true, error: null }))

    try {
      // In a real implementation, you'd get transaction details from Algorand Indexer
      // For now, we'll use mock data based on the most recent campaign
      const campaignCountRes = await appClient.send.getCampaignCount({})
      const campaignCount = Number(campaignCountRes.return)

      if (campaignCount > 0) {
        const campaignRes = await appClient.send.getCampaignDetails({ campaignId: campaignCount })
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
  }, [client, transactionHash])

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