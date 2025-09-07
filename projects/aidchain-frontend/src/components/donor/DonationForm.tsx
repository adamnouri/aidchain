import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { mockNGOs, getVerifiedNGOs } from '../../services/mockData'
import { formatCurrencyAmount, generateImpactMessage, validateSufficientBalance } from '../../utils/humanitarian'
import { NGO, Donation } from '../../types/humanitarian.types'

interface DonationFormProps {
  isOpen: boolean
  onClose: () => void
  onDonationComplete?: (donation: Donation) => void
}

const DonationForm: React.FC<DonationFormProps> = ({ isOpen, onClose, onDonationComplete }) => {
  const { activeAddress } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  
  // Form state
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<'ALGO' | 'USDC'>('USDC')
  const [purpose, setPurpose] = useState<'food' | 'medical' | 'education' | 'shelter' | 'emergency' | 'general'>('food')
  const [selectedNGO, setSelectedNGO] = useState('')
  const [donorMessage, setDonorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Data
  const verifiedNGOs = getVerifiedNGOs()

  const purposeOptions = [
    { value: 'food', label: '🍞 Food & Nutrition', description: 'Meals and nutritional support' },
    { value: 'medical', label: '🏥 Medical Aid', description: 'Healthcare and medical supplies' },
    { value: 'education', label: '📚 Education', description: 'School supplies and education programs' },
    { value: 'shelter', label: '🏠 Shelter', description: 'Housing and accommodation' },
    { value: 'emergency', label: '🚨 Emergency Relief', description: 'Immediate disaster response' },
    { value: 'general', label: '❤️ General Support', description: 'Flexible aid allocation' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!activeAddress) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      enqueueSnackbar('Please enter a valid donation amount', { variant: 'error' })
      return
    }

    if (!selectedNGO) {
      enqueueSnackbar('Please select an NGO to support', { variant: 'error' })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      const selectedNGOData = verifiedNGOs.find(ngo => ngo.id === selectedNGO)
      
      // Create mock donation record
      const donation: Donation = {
        id: `don_${Date.now()}`,
        donor_address: activeAddress,
        donor_name: 'Anonymous Donor',
        amount: parseFloat(amount),
        currency,
        purpose,
        ngo_id: selectedNGO,
        ngo_name: selectedNGOData?.name || 'Unknown NGO',
        timestamp: new Date(),
        status: 'pending',
        transaction_hash: `TXN_${Math.random().toString(36).substring(2, 15).toUpperCase()}`
      }

      // Simulate successful transaction
      enqueueSnackbar(
        `Successfully donated ${formatCurrencyAmount(donation.amount, currency)} to ${donation.ngo_name}!`,
        { variant: 'success' }
      )

      // Reset form
      setAmount('')
      setSelectedNGO('')
      setDonorMessage('')
      
      // Notify parent component
      onDonationComplete?.(donation)
      
      // Close modal
      onClose()

    } catch (error) {
      enqueueSnackbar('Donation failed. Please try again.', { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const impactMessage = amount && parseFloat(amount) > 0 
    ? generateImpactMessage(parseFloat(amount), purpose, currency)
    : null

  if (!isOpen) return null

  return (
    <div className="modal modal-open bg-black bg-opacity-50">
      <div className="modal-box w-11/12 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount and Currency */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Donation Amount</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                className="input input-bordered flex-1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <select 
                className="select select-bordered w-24"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'ALGO' | 'USDC')}
              >
                <option value="USDC">USDC</option>
                <option value="ALGO">ALGO</option>
              </select>
            </div>
            {impactMessage && (
              <div className="alert alert-info mt-2">
                <span className="text-sm">{impactMessage}</span>
              </div>
            )}
          </div>

          {/* Purpose Selection */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Donation Purpose</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {purposeOptions.map((option) => (
                <label 
                  key={option.value} 
                  className={`card card-compact cursor-pointer border-2 transition-all ${
                    purpose === option.value 
                      ? 'border-primary bg-primary bg-opacity-10' 
                      : 'border-base-300 hover:border-primary hover:border-opacity-50'
                  }`}
                >
                  <div className="card-body">
                    <input
                      type="radio"
                      name="purpose"
                      value={option.value}
                      checked={purpose === option.value}
                      onChange={(e) => setPurpose(e.target.value as any)}
                      className="hidden"
                    />
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* NGO Selection */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Select NGO</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={selectedNGO}
              onChange={(e) => setSelectedNGO(e.target.value)}
              required
            >
              <option value="">Choose an NGO to support</option>
              {verifiedNGOs.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name} - {ngo.location} (Score: {ngo.credibility_score}/10)
                </option>
              ))}
            </select>
            
            {/* NGO Details */}
            {selectedNGO && (
              <div className="card bg-base-100 border mt-3">
                <div className="card-body p-4">
                  {(() => {
                    const ngo = verifiedNGOs.find(n => n.id === selectedNGO)
                    if (!ngo) return null
                    
                    return (
                      <>
                        <h4 className="font-semibold">{ngo.name}</h4>
                        <p className="text-sm text-gray-600">{ngo.description}</p>
                        <div className="flex justify-between text-xs mt-2">
                          <span>Focus: {ngo.focus_areas.join(', ')}</span>
                          <span>Credibility: {ngo.credibility_score}/10</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Received: {formatCurrencyAmount(ngo.total_received, 'USDC')} | 
                          Distributed: {formatCurrencyAmount(ngo.total_distributed, 'USDC')}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <label className="label">
              <span className="label-text">Personal Message (Optional)</span>
            </label>
            <textarea
              placeholder="Share why you're donating or any message for the NGO..."
              className="textarea textarea-bordered w-full"
              rows={3}
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
            />
          </div>

          {/* Wallet Connection Status */}
          {!activeAddress && (
            <div className="alert alert-warning">
              <span>Please connect your wallet to make a donation</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="modal-action">
            <button 
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={!activeAddress || isSubmitting}
            >
              {isSubmitting 
                ? 'Processing Donation...' 
                : `Donate ${amount ? formatCurrencyAmount(parseFloat(amount), currency) : ''}`
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DonationForm