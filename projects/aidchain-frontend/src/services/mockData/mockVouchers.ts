import { Voucher } from '../../types/humanitarian.types'

export const mockVouchers: Voucher[] = [
  {
    id: 'voucher_001',
    recipient_address: 'RECIP1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9',
    recipient_name: 'Fatima Al-Hassan',
    issuer_ngo: 'World Food Programme',
    merchant_restrictions: ['merchant_001', 'merchant_003', 'merchant_005'],
    amount: 50,
    currency: 'USDC',
    voucher_type: 'food',
    status: 'issued',
    issue_date: new Date('2024-09-01T10:00:00Z'),
    expiry_date: new Date('2024-10-01T23:59:59Z'),
    qr_code: 'QR_VOUCHER_001_ABCD1234EFGH5678'
  },
  {
    id: 'voucher_002',
    recipient_address: 'RECIP2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0',
    recipient_name: 'Ahmed Mohamed',
    issuer_ngo: 'Doctors Without Borders',
    merchant_restrictions: ['merchant_002', 'merchant_004'],
    amount: 75,
    currency: 'USDC',
    voucher_type: 'medical',
    status: 'redeemed',
    issue_date: new Date('2024-08-25T14:30:00Z'),
    expiry_date: new Date('2024-09-25T23:59:59Z'),
    redemption_date: new Date('2024-08-28T09:15:00Z'),
    redeemed_at_merchant: 'merchant_002',
    qr_code: 'QR_VOUCHER_002_IJKL9012MNOP3456'
  },
  {
    id: 'voucher_003',
    recipient_address: 'RECIP3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1',
    recipient_name: 'Maria Santos',
    issuer_ngo: 'Local Relief Initiative',
    merchant_restrictions: ['merchant_001', 'merchant_003', 'merchant_006'],
    amount: 40,
    currency: 'ALGO',
    voucher_type: 'food',
    status: 'redeemed',
    issue_date: new Date('2024-08-20T11:45:00Z'),
    expiry_date: new Date('2024-09-20T23:59:59Z'),
    redemption_date: new Date('2024-08-22T16:30:00Z'),
    redeemed_at_merchant: 'merchant_001',
    qr_code: 'QR_VOUCHER_003_QRST7890UVWX1234'
  },
  {
    id: 'voucher_004',
    recipient_address: 'RECIP1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9',
    recipient_name: 'Fatima Al-Hassan',
    issuer_ngo: 'Save the Children',
    merchant_restrictions: ['merchant_007', 'merchant_008'],
    amount: 30,
    currency: 'USDC',
    voucher_type: 'general',
    status: 'issued',
    issue_date: new Date('2024-09-03T08:20:00Z'),
    expiry_date: new Date('2024-10-03T23:59:59Z'),
    qr_code: 'QR_VOUCHER_004_YZAB5678CDEF9012'
  },
  {
    id: 'voucher_005',
    recipient_address: 'RECIP4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2',
    recipient_name: 'Omar Khalil',
    issuer_ngo: 'Doctors Without Borders',
    merchant_restrictions: ['merchant_002', 'merchant_004', 'merchant_009'],
    amount: 100,
    currency: 'USDC',
    voucher_type: 'medical',
    status: 'issued',
    issue_date: new Date('2024-09-04T13:10:00Z'),
    expiry_date: new Date('2024-10-04T23:59:59Z'),
    qr_code: 'QR_VOUCHER_005_GHIJ3456KLMN7890'
  },
  {
    id: 'voucher_006',
    recipient_address: 'RECIP5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3',
    recipient_name: 'Chen Wei',
    issuer_ngo: 'World Food Programme',
    merchant_restrictions: ['merchant_001', 'merchant_005', 'merchant_010'],
    amount: 60,
    currency: 'ALGO',
    voucher_type: 'food',
    status: 'expired',
    issue_date: new Date('2024-08-01T07:00:00Z'),
    expiry_date: new Date('2024-09-01T23:59:59Z'),
    qr_code: 'QR_VOUCHER_006_NOPQ1234RSTU5678'
  },
  {
    id: 'voucher_007',
    recipient_address: 'RECIP2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0',
    recipient_name: 'Ahmed Mohamed',
    issuer_ngo: 'Local Relief Initiative',
    merchant_restrictions: ['merchant_003', 'merchant_006'],
    amount: 35,
    currency: 'USDC',
    voucher_type: 'food',
    status: 'issued',
    issue_date: new Date('2024-09-05T15:45:00Z'),
    expiry_date: new Date('2024-10-05T23:59:59Z'),
    qr_code: 'QR_VOUCHER_007_VWXY9012ZABC3456'
  },
  {
    id: 'voucher_008',
    recipient_address: 'RECIP6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4',
    recipient_name: 'Priya Sharma',
    issuer_ngo: 'Clean Water Foundation',
    merchant_restrictions: ['merchant_011'],
    amount: 25,
    currency: 'ALGO',
    voucher_type: 'general',
    status: 'redeemed',
    issue_date: new Date('2024-08-30T12:30:00Z'),
    expiry_date: new Date('2024-09-30T23:59:59Z'),
    redemption_date: new Date('2024-09-02T14:20:00Z'),
    redeemed_at_merchant: 'merchant_011',
    qr_code: 'QR_VOUCHER_008_DEFG7890HIJK1234'
  }
]

export const getVoucherById = (id: string): Voucher | undefined => {
  return mockVouchers.find(voucher => voucher.id === id)
}

export const getVouchersByRecipient = (recipientAddress: string): Voucher[] => {
  return mockVouchers.filter(voucher => voucher.recipient_address === recipientAddress)
}

export const getActiveVouchers = (): Voucher[] => {
  return mockVouchers.filter(voucher => voucher.status === 'issued')
}

export const getVouchersByType = (type: Voucher['voucher_type']): Voucher[] => {
  return mockVouchers.filter(voucher => voucher.voucher_type === type)
}

export const getVouchersByNGO = (ngoName: string): Voucher[] => {
  return mockVouchers.filter(voucher => voucher.issuer_ngo === ngoName)
}

export const getRedeemedVouchers = (): Voucher[] => {
  return mockVouchers.filter(voucher => voucher.status === 'redeemed')
}

export const getTotalVoucherValue = (currency?: 'ALGO' | 'USDC', status?: Voucher['status']): number => {
  let filtered = mockVouchers
  
  if (currency) {
    filtered = filtered.filter(v => v.currency === currency)
  }
  
  if (status) {
    filtered = filtered.filter(v => v.status === status)
  }
  
  return filtered.reduce((total, voucher) => total + voucher.amount, 0)
}

export const getExpiredVouchers = (): Voucher[] => {
  const now = new Date()
  return mockVouchers.filter(voucher => 
    voucher.status === 'issued' && voucher.expiry_date < now
  )
}