// pages/NGOPortalPage.tsx - NGO Portal Page
import React from 'react'
import { useNavigate } from 'react-router-dom'
import OrganizationPortal from '../components/OrganizationPortal'

const NGOPortalPage: React.FC = () => {
  const navigate = useNavigate()

  const handleBackToLanding = () => {
    navigate('/')
  }

  return (
    <OrganizationPortal onBackToLanding={handleBackToLanding} />
  )
}

export default NGOPortalPage