import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { 
  mockCampaigns, 
  mockDonations, 
  mockVouchers,
  getCampaignsByNGO,
  getDonationsByNGO,
  getVouchersByNGO,
  mockNGOs
} from '../../services/mockData'
import { formatCurrencyAmount, formatPercentage } from '../../utils/humanitarian'
import { Campaign, Donation, Voucher, NGO } from '../../types/humanitarian.types'

const NGOPortal: React.FC = () => {
  const { activeAddress } = useWallet()
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'donations' | 'vouchers'>('overview')
  const [ngoData, setNGOData] = useState<NGO | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])

  useEffect(() => {
    // Simulate finding NGO by wallet address or use first NGO for demo
    const currentNGO = mockNGOs.find(ngo => 
      ngo.wallet_address === activeAddress
    ) || mockNGOs[0] // Use first NGO for demo

    setNGOData(currentNGO)

    if (currentNGO) {
      setCampaigns(getCampaignsByNGO(currentNGO.name))
      setDonations(getDonationsByNGO(currentNGO.id))
      setVouchers(getVouchersByNGO(currentNGO.name))
    }
  }, [activeAddress])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'verified': case 'completed': case 'redeemed': 
        return 'badge-success'
      case 'pending': case 'issued': case 'awaiting_verification':
        return 'badge-warning'
      case 'cancelled': case 'expired': case 'rejected':
        return 'badge-error'
      default:
        return 'badge-ghost'
    }
  }

  const getMilestoneProgress = (campaign: Campaign) => {
    const completedMilestones = campaign.milestones.filter(m => m.status === 'completed').length
    const totalMilestones = campaign.milestones.length
    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  }

  if (!ngoData) {
    return <div className="loading loading-spinner loading-lg"></div>
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{ngoData.name}</h1>
            <p className="text-gray-600 mb-4">{ngoData.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="badge badge-primary">{ngoData.location}</span>
              <span className="badge badge-secondary">Credibility: {ngoData.credibility_score}/10</span>
              <span className={`badge ${getStatusColor(ngoData.verification_status)}`}>
                {ngoData.verification_status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Received</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrencyAmount(ngoData.total_received, 'USDC')}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-blue-600">Active Campaigns</div>
            <div className="stat-value text-2xl text-blue-800">{campaigns.length}</div>
            <div className="stat-desc">Fundraising projects</div>
          </div>
        </div>

        <div className="card bg-green-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-green-600">Total Donations</div>
            <div className="stat-value text-2xl text-green-800">{donations.length}</div>
            <div className="stat-desc">{formatCurrencyAmount(donations.reduce((sum, d) => sum + d.amount, 0), 'USDC')}</div>
          </div>
        </div>

        <div className="card bg-purple-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-purple-600">Vouchers Issued</div>
            <div className="stat-value text-2xl text-purple-800">{vouchers.length}</div>
            <div className="stat-desc">{vouchers.filter(v => v.status === 'redeemed').length} redeemed</div>
          </div>
        </div>

        <div className="card bg-orange-50 shadow-sm">
          <div className="card-body">
            <div className="stat-title text-orange-600">Distribution Rate</div>
            <div className="stat-value text-2xl text-orange-800">
              {formatPercentage(ngoData.total_distributed, ngoData.total_received)}
            </div>
            <div className="stat-desc">Funds distributed</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs tabs-bordered mb-6">
        <button 
          className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'campaigns' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          🎯 Campaigns ({campaigns.length})
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'donations' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          💝 Donations ({donations.length})
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'vouchers' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('vouchers')}
        >
          🎫 Vouchers ({vouchers.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Focus Areas */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {ngoData.focus_areas.map((area) => (
                  <span key={area} className="badge badge-outline badge-lg capitalize">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Last activity: {ngoData.last_activity.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Registered: {ngoData.registration_date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">{ngoData.active_campaigns} active campaigns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="card bg-white shadow-lg lg:col-span-2">
            <div className="card-body">
              <h3 className="card-title">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Total Received</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrencyAmount(ngoData.total_received, 'USDC')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Distributed</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrencyAmount(ngoData.total_distributed, 'USDC')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Available for Distribution</div>
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrencyAmount(ngoData.total_received - ngoData.total_distributed, 'USDC')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Campaign Management</h3>
            <button className="btn btn-primary">+ Create New Campaign</button>
          </div>

          {campaigns.length === 0 ? (
            <div className="card bg-white shadow-lg">
              <div className="card-body text-center py-12">
                <h4 className="text-xl font-semibold mb-2">No Active Campaigns</h4>
                <p className="text-gray-600 mb-4">Create your first campaign to start fundraising</p>
                <button className="btn btn-primary">Create Campaign</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="card bg-white shadow-lg">
                  <div className="card-body">
                    <h4 className="card-title">{campaign.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Progress</span>
                        <span>{formatPercentage(campaign.total_raised, campaign.target_amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{width: `${Math.min((campaign.total_raised / campaign.target_amount) * 100, 100)}%`}}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Raised: {formatCurrencyAmount(campaign.total_raised, campaign.currency)}</span>
                        <span>Goal: {formatCurrencyAmount(campaign.target_amount, campaign.currency)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`badge ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {campaign.donors_count} donors
                        </span>
                      </div>

                      <div className="text-sm">
                        <div>Milestones: {getMilestoneProgress(campaign)}% complete</div>
                        <div>End Date: {campaign.end_date.toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-sm btn-outline">View Details</button>
                      <button className="btn btn-sm btn-primary">Manage</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="card bg-white shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Received Donations</h3>
            
            {donations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No donations received yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td>{donation.timestamp.toLocaleDateString()}</td>
                        <td>
                          <div>
                            <div className="font-medium">{donation.donor_name || 'Anonymous'}</div>
                            <div className="text-xs text-gray-500 font-mono">
                              {donation.donor_address.slice(0, 8)}...
                            </div>
                          </div>
                        </td>
                        <td className="font-mono font-bold">
                          {formatCurrencyAmount(donation.amount, donation.currency)}
                        </td>
                        <td>
                          <span className="badge badge-outline capitalize">
                            {donation.purpose}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-xs btn-outline">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'vouchers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Voucher Management</h3>
            <button className="btn btn-primary">+ Issue New Vouchers</button>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h4 className="card-title">Issued Vouchers</h4>
              
              {vouchers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No vouchers issued yet</p>
                  <button className="btn btn-primary">Issue First Voucher</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Recipient</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Issue Date</th>
                        <th>Expiry</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vouchers.map((voucher) => (
                        <tr key={voucher.id}>
                          <td className="font-mono text-xs">
                            {voucher.id.split('_')[1]}
                          </td>
                          <td>
                            <div>
                              <div className="font-medium">{voucher.recipient_name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500 font-mono">
                                {voucher.recipient_address.slice(0, 8)}...
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-outline capitalize">
                              {voucher.voucher_type}
                            </span>
                          </td>
                          <td className="font-mono font-bold">
                            {formatCurrencyAmount(voucher.amount, voucher.currency)}
                          </td>
                          <td>
                            <span className={`badge ${getStatusColor(voucher.status)}`}>
                              {voucher.status}
                            </span>
                          </td>
                          <td>{voucher.issue_date.toLocaleDateString()}</td>
                          <td>{voucher.expiry_date.toLocaleDateString()}</td>
                          <td>
                            <button className="btn btn-xs btn-outline">
                              View QR
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NGOPortal