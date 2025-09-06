/**
 * Utility functions for generating QR codes for voucher distribution and recipient identification
 */

export interface QRCodeData {
  type: 'voucher' | 'recipient' | 'donation' | 'campaign'
  id: string
  metadata: Record<string, any>
}

export const generateVoucherQRData = (
  voucherId: string,
  recipientAddress: string,
  amount: number,
  currency: 'ALGO' | 'USDC',
  voucherType: 'food' | 'medical' | 'general'
): QRCodeData => {
  return {
    type: 'voucher',
    id: voucherId,
    metadata: {
      recipient: recipientAddress,
      amount,
      currency,
      voucherType,
      timestamp: Date.now(),
      version: '1.0'
    }
  }
}

export const generateRecipientQRData = (
  recipientAddress: string,
  name?: string
): QRCodeData => {
  return {
    type: 'recipient',
    id: recipientAddress,
    metadata: {
      name,
      timestamp: Date.now(),
      version: '1.0'
    }
  }
}

export const generateDonationTrackingQRData = (
  donationId: string,
  transactionHash: string
): QRCodeData => {
  return {
    type: 'donation',
    id: donationId,
    metadata: {
      transactionHash,
      timestamp: Date.now(),
      version: '1.0'
    }
  }
}

export const generateCampaignQRData = (
  campaignId: string,
  campaignTitle: string
): QRCodeData => {
  return {
    type: 'campaign',
    id: campaignId,
    metadata: {
      title: campaignTitle,
      timestamp: Date.now(),
      version: '1.0'
    }
  }
}

export const encodeQRData = (data: QRCodeData): string => {
  // In a real implementation, this would use a proper QR code library
  // For now, we'll return a base64-encoded JSON string
  const jsonString = JSON.stringify(data)
  return btoa(jsonString)
}

export const decodeQRData = (encodedData: string): QRCodeData | null => {
  try {
    const jsonString = atob(encodedData)
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error decoding QR data:', error)
    return null
  }
}

export const generateQRCodeString = (data: QRCodeData): string => {
  const encoded = encodeQRData(data)
  return `aidchain://scan?data=${encoded}`
}

export const parseQRCodeString = (qrString: string): QRCodeData | null => {
  try {
    const url = new URL(qrString)
    if (url.protocol !== 'aidchain:' || url.pathname !== '//scan') {
      return null
    }
    
    const dataParam = url.searchParams.get('data')
    if (!dataParam) {
      return null
    }
    
    return decodeQRData(dataParam)
  } catch (error) {
    console.error('Error parsing QR code string:', error)
    return null
  }
}

export const validateQRData = (data: QRCodeData): boolean => {
  if (!data.type || !data.id || !data.metadata) {
    return false
  }
  
  const validTypes = ['voucher', 'recipient', 'donation', 'campaign']
  if (!validTypes.includes(data.type)) {
    return false
  }
  
  // Type-specific validation
  switch (data.type) {
    case 'voucher':
      return !!(data.metadata.recipient && 
                data.metadata.amount && 
                data.metadata.currency && 
                data.metadata.voucherType)
    
    case 'recipient':
      return !!data.id
    
    case 'donation':
      return !!data.metadata.transactionHash
    
    case 'campaign':
      return !!data.metadata.title
    
    default:
      return false
  }
}