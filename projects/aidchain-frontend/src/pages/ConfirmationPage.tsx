// pages/ConfirmationPage.tsx - Donation Confirmation Page
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DonationConfirmationPage from '../components/DonationConfirmationPage'

const ConfirmationPage: React.FC = () => {
  const { hash } = useParams<{ hash: string }>()
  const navigate = useNavigate()

  const transactionHash = hash || ''

  const handleBackToLanding = () => {
    navigate('/')
  }

  const handleBackToCategories = () => {
    navigate('/donate')
  }

  return (
    <DonationConfirmationPage
      transactionHash={transactionHash}
      onBackToLanding={handleBackToLanding}
      onBackToCategories={handleBackToCategories}
    />
  )
}

export default ConfirmationPage