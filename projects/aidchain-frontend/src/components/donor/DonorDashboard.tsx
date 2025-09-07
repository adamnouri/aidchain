import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { 
  mockDonations, 
  getDonationsByDonor, 
  mockNGOs,
  getDashboardStats 
} from '../../services/mockData'
import { 
  formatCurrencyAmount, 
  createTransactionTrail, 
  calculateAidImpact 
} from '../../utils/humanitarian'
import { Donation, DashboardStats } from '../../types/humanitarian.types'

interface DonorDashboardProps {
  onOpenDonationForm: () => void
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ onOpenDonationForm }) => {
  const { activeAddress } = useWallet()
  const [userDonations, setUserDonations] = useState<Donation[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    // Simulate loading user's donations
    if (activeAddress) {
      const donations = getDonationsByDonor(activeAddress)
      setUserDonations(donations)
    } else {
      // Show sample donations for demo
      setUserDonations(mockDonations.slice(0, 3))
    }
    
    setStats(getDashboardStats())
  }, [activeAddress])

  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'completed': return 'badge-success'
      case 'distributed': return 'badge-info'
      case 'allocated': return 'badge-warning'
      default: return 'badge-ghost'
    }
  }

  const getPurposeEmoji = (purpose: string) => {
    const emojis = {
      food: '🍞',
      medical: '🏥',
      education: '📚',
      shelter: '🏠',
      emergency: '🚨',
      general: '❤️'
    }
    return emojis[purpose as keyof typeof emojis] || '💝'
  }

  if (!stats) return <div className="loading loading-spinner loading-lg"></div>

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Donor Dashboard</h1>
        <p className="text-gray-600">Welcome back! Track your contributions and their impact.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-blue-600">Your Donations</div>
            <div className="stat-value text-2xl text-blue-800">
              {formatCurrencyAmount(
                userDonations.reduce((sum, d) => sum + d.amount, 0), 
                'USDC'
              )}
            </div>
            <div className="stat-desc">{userDonations.length} contributions</div>
          </div>
        </div>

        <div className="card bg-green-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-green-600">Lives Impacted</div>
            <div className="stat-value text-2xl text-green-800">
              {Math.floor(userDonations.reduce((sum, d) => sum + d.amount, 0) / 25)}
            </div>
            <div className="stat-desc">Estimated beneficiaries</div>
          </div>
        </div>

        <div className="card bg-purple-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-purple-600">Platform Total</div>
            <div className="stat-value text-2xl text-purple-800">
              {formatCurrencyAmount(stats.total_donations, stats.currency)}
            </div>
            <div className="stat-desc">{stats.verified_ngos} verified NGOs</div>
          </div>
        </div>

        <div className="card bg-orange-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-orange-600">Active Campaigns</div>
            <div className="stat-value text-2xl text-orange-800">
              {stats.active_campaigns}
            </div>
            <div className="stat-desc">Fundraising now</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button 
          className="btn btn-primary btn-lg"
          onClick={onOpenDonationForm}
        >
          💝 Make New Donation
        </button>
        <button className="btn btn-outline btn-lg">
          📊 View Impact Report
        </button>
        <button className="btn btn-outline btn-lg">
          🏢 Browse NGOs
        </button>
      </div>

      {/* Recent Donations */}
      <div className="card bg-white shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Your Recent Donations</h2>
          
          {userDonations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No donations yet. Start making a difference!</p>
              <button 
                className="btn btn-primary"
                onClick={onOpenDonationForm}
              >
                Make Your First Donation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>NGO</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {userDonations.map((donation) => {
                    const trail = createTransactionTrail(donation)
                    return (
                      <tr key={donation.id} className="hover">
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getPurposeEmoji(donation.purpose)}</span>
                            <span className="capitalize">{donation.purpose}</span>
                          </div>
                        </td>
                        <td>
                          <div className="font-medium">{donation.ngo_name}</div>
                          <div className="text-sm text-gray-500">Verified NGO</div>
                        </td>
                        <td className="font-mono font-bold">
                          {formatCurrencyAmount(donation.amount, donation.currency)}
                        </td>
                        <td className="text-sm">
                          {donation.timestamp.toLocaleDateString()}
                        </td>
                        <td>
                          <div className={`badge ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div 
                              className="radial-progress text-primary" 
                              style={{"--value": trail.completion_percentage} as React.CSSProperties}
                            >
                              {trail.completion_percentage}%
                            </div>
                            <span className="text-xs">Delivered</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card bg-white shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Your Impact Areas</h3>
            <div className="space-y-3">
              {['food', 'medical', 'education', 'emergency'].map((purpose) => {
                const purposeAmount = userDonations
                  .filter(d => d.purpose === purpose)
                  .reduce((sum, d) => sum + d.amount, 0)
                
                if (purposeAmount === 0) return null
                
                const percentage = Math.round((purposeAmount / userDonations.reduce((sum, d) => sum + d.amount, 0)) * 100)
                
                return (
                  <div key={purpose} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{getPurposeEmoji(purpose)}</span>
                      <span className="capitalize">{purpose}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-mono">
                        {formatCurrencyAmount(purposeAmount, 'USDC')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Platform Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Platform Donations</span>
                <span className="font-bold">{formatCurrencyAmount(stats.total_donations, stats.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Beneficiaries Helped</span>
                <span className="font-bold">{stats.beneficiaries_helped}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Vouchers Issued</span>
                <span className="font-bold">{stats.vouchers_issued}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Vouchers Redeemed</span>
                <span className="font-bold">{stats.vouchers_redeemed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard