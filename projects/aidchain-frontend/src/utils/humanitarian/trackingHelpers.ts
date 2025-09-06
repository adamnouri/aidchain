/**
 * Utility functions for aid trail visualization and tracking
 */

import { TransactionTrail, TrailStep, Donation } from '../../types/humanitarian.types'

export const generateTrailSteps = (donation: Donation): TrailStep[] => {
  const steps: TrailStep[] = [
    {
      step_number: 1,
      title: 'Donation Received',
      description: `${donation.donor_name || 'Anonymous'} donated ${donation.amount} ${donation.currency} for ${donation.purpose}`,
      timestamp: donation.timestamp,
      status: 'completed',
      transaction_hash: donation.transaction_hash
    },
    {
      step_number: 2,
      title: 'Funds Allocated',
      description: `Funds allocated to ${donation.ngo_name} for ${donation.purpose} aid`,
      status: donation.status === 'pending' ? 'pending' : 'completed',
      timestamp: donation.status !== 'pending' ? new Date(donation.timestamp.getTime() + 1000 * 60 * 60) : undefined
    },
    {
      step_number: 3,
      title: 'Aid Purchased',
      description: `NGO purchased ${donation.purpose} supplies using donated funds`,
      status: ['distributed', 'completed'].includes(donation.status) ? 'completed' : 'pending',
      timestamp: ['distributed', 'completed'].includes(donation.status) 
        ? new Date(donation.timestamp.getTime() + 1000 * 60 * 60 * 24) 
        : undefined
    },
    {
      step_number: 4,
      title: 'Aid Distributed',
      description: 'Aid supplies distributed to beneficiaries',
      status: donation.status === 'completed' ? 'completed' : 'pending',
      timestamp: donation.status === 'completed' 
        ? new Date(donation.timestamp.getTime() + 1000 * 60 * 60 * 24 * 3) 
        : undefined,
      proof_hash: donation.distribution_proof?.[0]
    }
  ]

  return steps
}

export const createTransactionTrail = (donation: Donation): TransactionTrail => {
  const steps = generateTrailSteps(donation)
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const currentStep = completedSteps < steps.length ? completedSteps : steps.length - 1
  
  return {
    donation_id: donation.id,
    steps,
    current_step: currentStep,
    completion_percentage: Math.round((completedSteps / steps.length) * 100)
  }
}

export const getTrailStatusColor = (status: TrailStep['status']): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600'
    case 'in_progress':
      return 'text-blue-600'
    case 'pending':
      return 'text-gray-400'
    default:
      return 'text-gray-400'
  }
}

export const getTrailStatusIcon = (status: TrailStep['status']): string => {
  switch (status) {
    case 'completed':
      return '✅'
    case 'in_progress':
      return '🔄'
    case 'pending':
      return '⏳'
    default:
      return '❓'
  }
}

export const formatTrailTimestamp = (timestamp?: Date): string => {
  if (!timestamp) return 'Pending'
  
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }
}

export const calculateAidImpact = (donations: Donation[]): {
  totalAmount: number
  beneficiariesReached: number
  areasServed: string[]
  purposeBreakdown: Record<string, number>
} => {
  const completedDonations = donations.filter(d => d.status === 'completed')
  
  const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0)
  
  // Mock beneficiaries calculation (in reality would come from distribution records)
  const beneficiariesReached = Math.floor(totalAmount / 50) // Assume $50 helps 1 person
  
  // Mock areas served (would come from actual distribution data)
  const areasServed = [
    'Syrian Refugee Camps',
    'East African Drought Zones',
    'Turkish Earthquake Areas',
    'Palestinian Territories',
    'Iraqi Displacement Centers'
  ]
  
  const purposeBreakdown = completedDonations.reduce((breakdown, donation) => {
    breakdown[donation.purpose] = (breakdown[donation.purpose] || 0) + donation.amount
    return breakdown
  }, {} as Record<string, number>)
  
  return {
    totalAmount,
    beneficiariesReached,
    areasServed,
    purposeBreakdown
  }
}

export const generateImpactMessage = (
  amount: number,
  purpose: string,
  currency: 'ALGO' | 'USDC'
): string => {
  const impactMessages = {
    food: {
      ALGO: `${amount} ALGO can provide nutritious meals for ${Math.floor(amount / 5)} people for one week`,
      USDC: `$${amount} can feed ${Math.floor(amount / 25)} families for one month`
    },
    medical: {
      ALGO: `${amount} ALGO can provide medical care for ${Math.floor(amount / 10)} patients`,
      USDC: `$${amount} can supply medical equipment for ${Math.floor(amount / 100)} healthcare workers`
    },
    education: {
      ALGO: `${amount} ALGO can provide school supplies for ${Math.floor(amount / 2)} children`,
      USDC: `$${amount} can support education for ${Math.floor(amount / 50)} students for one semester`
    },
    shelter: {
      ALGO: `${amount} ALGO can provide temporary shelter for ${Math.floor(amount / 20)} people`,
      USDC: `$${amount} can help rebuild homes for ${Math.floor(amount / 500)} families`
    },
    emergency: {
      ALGO: `${amount} ALGO can provide emergency aid for ${Math.floor(amount / 15)} people`,
      USDC: `$${amount} can supply emergency kits for ${Math.floor(amount / 75)} families`
    },
    general: {
      ALGO: `${amount} ALGO can provide essential aid for ${Math.floor(amount / 10)} people`,
      USDC: `$${amount} can make a significant difference in ${Math.floor(amount / 30)} lives`
    }
  }
  
  return impactMessages[purpose as keyof typeof impactMessages]?.[currency] || 
         `${amount} ${currency} will make a meaningful impact in humanitarian aid`
}