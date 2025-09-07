// pages/DonatePage.tsx - Campaign Categories Page
import React from 'react'
import { useNavigate } from 'react-router-dom'
import DonationCategoriesPage from '../components/DonationCategoriesPage'

const DonatePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCampaignSelect = (campaignId: number) => {
    navigate(`/campaign/${campaignId}`)
  }

  const handleBackToLanding = () => {
    navigate('/')
  }

  return (
    <DonationCategoriesPage 
      onCampaignSelect={handleCampaignSelect}
      onBackToLanding={handleBackToLanding}
    />
  )
}

export default DonatePage