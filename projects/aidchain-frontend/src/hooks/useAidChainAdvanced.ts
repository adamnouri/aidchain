import { useState } from 'react'
import { AidchainContractsClient } from '../contracts/AidchainContracts'
import { 
  Milestone, 
  Voucher, 
  Delivery, 
  Campaign, 
  MilestoneTrackerHook, 
  VoucherSystemHook, 
  DeliveryTrackerHook,
  MICRO_ALGOS_PER_ALGO
} from '../types'

/**
 * Custom hook for milestone management operations
 */
export function useMilestoneTracker(appClient: AidchainContractsClient | null, activeAddress: string | null | undefined): MilestoneTrackerHook {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const loadData = async () => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Load campaigns first
      const campaignCount = await appClient.send.getCampaignCount()
      const loadedCampaigns: Campaign[] = []
      
      for (let i = 1; i <= Number(campaignCount.return); i++) {
        try {
          const campaignDetails = await appClient.send.getCampaignDetails({ campaignId: i })
          if (campaignDetails.return) {
            const campaign = campaignDetails.return
            loadedCampaigns.push({
              id: Number(campaign.id),
              title: campaign.title,
              target: Number(campaign.target),
              raised: Number(campaign.raised),
              creator: campaign.creator,
              active: Number(campaign.active) === 1
            })
          }
        } catch (error) {
          console.log(`Campaign ${i} not found:`, error)
        }
      }
      setCampaigns(loadedCampaigns)

      // Load milestones
      const milestoneCount = await appClient.send.getMilestoneCount()
      const loadedMilestones: Milestone[] = []
      
      for (let i = 1; i <= Number(milestoneCount.return); i++) {
        try {
          const milestoneDetails = await appClient.send.getMilestoneDetails({ milestoneId: i })
          if (milestoneDetails.return) {
            const milestone = milestoneDetails.return
            loadedMilestones.push({
              id: Number(milestone.id),
              campaignId: Number(milestone.campaignId),
              targetAmount: Number(milestone.targetAmount),
              description: milestone.description,
              completed: Number(milestone.completed) === 1,
              fundsReleased: Number(milestone.fundsReleased) === 1
            })
          }
        } catch (error) {
          console.log(`Milestone ${i} not found:`, error)
        }
      }
      setMilestones(loadedMilestones)
      
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load milestone data')
    } finally {
      setLoading(false)
    }
  }

  const createMilestone = async (campaignId: number, targetAlgo: string, description: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const targetMicroAlgos = Math.round(parseFloat(targetAlgo) * 1_000_000)
      
      const result = await appClient.send.createMilestone({
        campaignId,
        targetAmount: targetMicroAlgos,
        description: description.trim()
      })
      
      await loadData() // Refresh data
      return Number(result.return)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create milestone')
      return null
    } finally {
      setLoading(false)
    }
  }

  const completeMilestone = async (milestoneId: number, proof: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return false
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await appClient.send.completeMilestone({
        milestoneId,
        proof: proof.trim()
      })
      
      await loadData() // Refresh data
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to complete milestone')
      return false
    } finally {
      setLoading(false)
    }
  }

  const releaseFunds = async (milestoneId: number, recipientAddress: string, amountAlgo: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return false
    }

    setLoading(true)
    setError(null)
    
    try {
      const amountMicroAlgos = Math.round(parseFloat(amountAlgo) * 1_000_000)
      
      const result = await appClient.send.releaseMilestoneFunds({
        milestoneId,
        recipient: recipientAddress.trim(),
        amount: amountMicroAlgos
      })
      
      await loadData() // Refresh data
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to release funds')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { 
    loadData, 
    createMilestone, 
    completeMilestone, 
    releaseFunds, 
    loading, 
    error, 
    milestones, 
    campaigns,
    setError 
  }
}

/**
 * Custom hook for voucher system operations
 */
export function useVoucherSystem(appClient: AidchainContractsClient | null, activeAddress: string | null | undefined): VoucherSystemHook {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vouchers, setVouchers] = useState<Voucher[]>([])

  const loadVouchers = async () => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const voucherCount = await appClient.send.getVoucherCount()
      const loadedVouchers: Voucher[] = []
      
      for (let i = 1; i <= Number(voucherCount.return); i++) {
        try {
          const voucherDetails = await appClient.send.getVoucherDetails({ voucherId: i })
          if (voucherDetails.return) {
            const voucher = voucherDetails.return
            loadedVouchers.push({
              id: Number(voucher.id),
              assetId: Number(voucher.assetId),
              name: voucher.name,
              totalSupply: Number(voucher.totalSupply),
              issued: Number(voucher.issued)
            })
          }
        } catch (error) {
          console.log(`Voucher ${i} not found:`, error)
        }
      }
      setVouchers(loadedVouchers)
      
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vouchers')
    } finally {
      setLoading(false)
    }
  }

  const createVoucher = async (assetName: string, totalSupply: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const supply = parseInt(totalSupply)
      
      const result = await appClient.send.createVoucherAsset({
        assetName: assetName.trim(),
        totalSupply: supply
      })
      
      await loadVouchers() // Refresh data
      return Number(result.return)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create voucher')
      return null
    } finally {
      setLoading(false)
    }
  }

  const distributeVouchers = async (assetId: number, recipientAddress: string, amount: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return false
    }

    setLoading(true)
    setError(null)
    
    try {
      const amountInt = parseInt(amount)
      
      const result = await appClient.send.distributeVouchers({
        assetId,
        recipient: recipientAddress.trim(),
        amount: amountInt
      })
      
      await loadVouchers() // Refresh data
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to distribute vouchers')
      return false
    } finally {
      setLoading(false)
    }
  }

  const redeemVoucher = async (voucherId: number, merchant: string, amount: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return false
    }

    setLoading(true)
    setError(null)
    
    try {
      const amountInt = parseInt(amount)
      
      const result = await appClient.send.redeemVoucher({
        voucherId,
        merchant: merchant.trim(),
        amount: amountInt
      })
      
      await loadVouchers() // Refresh data
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to redeem voucher')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { 
    loadVouchers, 
    createVoucher, 
    distributeVouchers, 
    redeemVoucher, 
    loading, 
    error, 
    vouchers,
    setError 
  }
}

/**
 * Custom hook for delivery tracking operations
 */
export function useDeliveryTracker(appClient: AidchainContractsClient | null, activeAddress: string | null | undefined): DeliveryTrackerHook {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])

  const loadDeliveries = async () => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const deliveryCount = await appClient.send.getDeliveryCount()
      const loadedDeliveries: Delivery[] = []
      
      for (let i = 1; i <= Number(deliveryCount.return); i++) {
        try {
          const deliveryDetails = await appClient.send.getDeliveryDetails({ deliveryId: i })
          if (deliveryDetails.return) {
            const delivery = deliveryDetails.return
            loadedDeliveries.push({
              id: Number(delivery.id),
              recipient: delivery.recipient,
              location: delivery.location,
              agent: delivery.agent,
              verified: Number(delivery.verified) === 1
            })
          }
        } catch (error) {
          console.log(`Delivery ${i} not found:`, error)
        }
      }
      setDeliveries(loadedDeliveries)
      
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load deliveries')
    } finally {
      setLoading(false)
    }
  }

  const logDelivery = async (recipient: string, location: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return null
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await appClient.send.logDelivery({
        recipient: recipient.trim(),
        location: location.trim()
      })
      
      await loadDeliveries() // Refresh data
      return Number(result.return)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to log delivery')
      return null
    } finally {
      setLoading(false)
    }
  }

  const verifyDelivery = async (deliveryId: number, agent: string) => {
    if (!appClient || !activeAddress) {
      setError('App not ready or wallet not connected')
      return false
    }

    setLoading(true)
    setError(null)
    
    try {
      const result = await appClient.send.verifyDelivery({
        deliveryId,
        agent: agent.trim()
      })
      
      await loadDeliveries() // Refresh data
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to verify delivery')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { 
    loadDeliveries, 
    logDelivery, 
    verifyDelivery, 
    loading, 
    error, 
    deliveries,
    setError 
  }
}