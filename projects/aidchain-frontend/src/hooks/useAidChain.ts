import { useState } from 'react'
import { AidchainContractsClient } from '../contracts/AidchainContracts'

interface Campaign {
  id: number
  title: string
  target: number
  raised: number
  creator: string
  active: boolean
}

interface Organization {
  id: number
  name: string
  walletAddress: string
  verificationLevel: number
}

interface ContractStats {
  totalDonations: number
  totalCampaigns: number
  totalOrganizations: number
}

/**
 * Custom hook for donor dashboard operations
 */
export function useDonorDashboard(appClient: AidchainContractsClient | null, activeAddress: string | null | undefined) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<ContractStats | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const loadDashboardData = async () => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Load contract statistics
      const totalDonations = await appClient.send.getTotalDonations()
      const totalCampaigns = await appClient.send.getCampaignCount()
      const totalOrganizations = await appClient.send.getOrganizationCount()
      
      setStats({
        totalDonations: Number(totalDonations.return),
        totalCampaigns: Number(totalCampaigns.return),
        totalOrganizations: Number(totalOrganizations.return)
      })

      // Load campaigns
      const loadedCampaigns: Campaign[] = []
      for (let i = 1; i <= Number(totalCampaigns.return); i++) {
        try {
          const campaignDetails = await appClient.send.getCampaignDetails({ campaignId: i })
          if (campaignDetails.return) {
            const [id, title, target, raised, creator, active] = campaignDetails.return
            loadedCampaigns.push({
              id: Number(id),
              title: title,
              target: Number(target),
              raised: Number(raised),
              creator: creator,
              active: Number(active) === 1
            })
          }
        } catch (error) {
          console.log(`Campaign ${i} not found:`, error)
        }
      }
      setCampaigns(loadedCampaigns)
      
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const makeDonation = async (campaignId: number) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return false
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await appClient.send.createDonation({ campaignId })
      await loadDashboardData() // Refresh data
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to make donation')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { 
    loadDashboardData, 
    makeDonation, 
    loading, 
    error, 
    stats, 
    campaigns,
    setError 
  }
}

/**
 * Custom hook for organization management operations
 */
export function useOrganizationManagement(appClient: AidchainContractsClient | null, activeAddress: string | null | undefined) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const loadData = async () => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Load organizations
      const orgCount = await appClient.send.getOrganizationCount()
      const loadedOrgs: Organization[] = []
      
      for (let i = 1; i <= Number(orgCount.return); i++) {
        try {
          const orgDetails = await appClient.send.getOrganizationDetails({ orgId: i })
          if (orgDetails.return) {
            const [id, name, walletAddress, verificationLevel] = orgDetails.return
            loadedOrgs.push({
              id: Number(id),
              name: name,
              walletAddress: walletAddress,
              verificationLevel: Number(verificationLevel)
            })
          }
        } catch (error) {
          console.log(`Organization ${i} not found:`, error)
        }
      }
      setOrganizations(loadedOrgs)

      // Load campaigns
      const campaignCount = await appClient.send.getCampaignCount()
      const loadedCampaigns: Campaign[] = []
      
      for (let i = 1; i <= Number(campaignCount.return); i++) {
        try {
          const campaignDetails = await appClient.send.getCampaignDetails({ campaignId: i })
          if (campaignDetails.return) {
            const [id, title, target, raised, creator, active] = campaignDetails.return
            loadedCampaigns.push({
              id: Number(id),
              title: title,
              target: Number(target),
              raised: Number(raised),
              creator: creator,
              active: Number(active) === 1
            })
          }
        } catch (error) {
          console.log(`Campaign ${i} not found:`, error)
        }
      }
      setCampaigns(loadedCampaigns)
      
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const registerOrganization = async (orgName: string, walletAddress: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await appClient.send.registerOrganization({
        orgName: orgName.trim(),
        walletAddress: walletAddress.trim() || activeAddress
      })
      
      await loadData() // Refresh data
      return Number(result.return)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to register organization')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (title: string, targetAlgo: string, creator: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const targetMicroAlgos = Math.round(parseFloat(targetAlgo) * 1_000_000)
      
      const result = await appClient.send.createCampaign({
        title: title.trim(),
        target: targetMicroAlgos,
        creator: creator.trim()
      })
      
      await loadData() // Refresh data
      return Number(result.return)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create campaign')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { 
    loadData, 
    registerOrganization, 
    createCampaign, 
    loading, 
    error, 
    organizations, 
    campaigns,
    setError 
  }
}