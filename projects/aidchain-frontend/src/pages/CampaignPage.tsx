// pages/CampaignPage.tsx - Individual Campaign Detail Page
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DonationDetailPage from '../components/DonationDetailPage'

const CampaignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const campaignId = id ? parseInt(id, 10) : 1

  const handleBackToCategories = () => {
    navigate('/donate')
  }

  const handleDonationComplete = (transactionHash: string) => {
    navigate(`/confirmation/${transactionHash}`)
  }

  const handleBackToLanding = () => {
    navigate('/')
  }

  return (
    <DonationDetailPage
      campaignId={campaignId}
      onBackToCategories={handleBackToCategories}
      onDonationComplete={handleDonationComplete}
      onBackToLanding={handleBackToLanding}
    />
  )
}

export default CampaignPage