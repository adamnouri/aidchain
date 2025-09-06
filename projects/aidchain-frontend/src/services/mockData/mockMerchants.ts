import { Merchant } from '../../types/humanitarian.types'

export const mockMerchants: Merchant[] = [
  {
    id: 'merchant_001',
    name: 'Amman Fresh Market',
    wallet_address: 'MERCH1G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5',
    business_type: 'grocery',
    location: 'Amman, Jordan - Downtown District',
    verification_status: 'verified',
    voucher_types_accepted: ['food', 'general'],
    total_vouchers_redeemed: 156,
    total_earnings: 6240,
    registration_date: new Date('2023-11-15T00:00:00Z'),
    last_redemption: new Date('2024-09-05T16:30:00Z')
  },
  {
    id: 'merchant_002',
    name: 'City Medical Pharmacy',
    wallet_address: 'MERCH2H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6',
    business_type: 'pharmacy',
    location: 'Ankara, Turkey - Medical District',
    verification_status: 'verified',
    voucher_types_accepted: ['medical'],
    total_vouchers_redeemed: 89,
    total_earnings: 8925,
    registration_date: new Date('2023-10-22T00:00:00Z'),
    last_redemption: new Date('2024-09-04T11:45:00Z')
  },
  {
    id: 'merchant_003',
    name: 'Refugee Camp Supply Store',
    wallet_address: 'MERCH3I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7',
    business_type: 'general_store',
    location: 'Zaatari Camp, Jordan',
    verification_status: 'verified',
    voucher_types_accepted: ['food', 'general'],
    total_vouchers_redeemed: 234,
    total_earnings: 7020,
    registration_date: new Date('2024-01-08T00:00:00Z'),
    last_redemption: new Date('2024-09-06T09:20:00Z')
  },
  {
    id: 'merchant_004',
    name: 'Health Plus Clinic',
    wallet_address: 'MERCH4J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8',
    business_type: 'medical_clinic',
    location: 'Istanbul, Turkey - Humanitarian Quarter',
    verification_status: 'verified',
    voucher_types_accepted: ['medical'],
    total_vouchers_redeemed: 67,
    total_earnings: 10050,
    registration_date: new Date('2023-12-03T00:00:00Z'),
    last_redemption: new Date('2024-09-03T14:15:00Z')
  },
  {
    id: 'merchant_005',
    name: 'Community Food Hub',
    wallet_address: 'MERCH5K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9',
    business_type: 'grocery',
    location: 'Beirut, Lebanon - Refugee Services Area',
    verification_status: 'verified',
    voucher_types_accepted: ['food'],
    total_vouchers_redeemed: 178,
    total_earnings: 5340,
    registration_date: new Date('2024-02-14T00:00:00Z'),
    last_redemption: new Date('2024-09-05T13:40:00Z')
  },
  {
    id: 'merchant_006',
    name: 'Family Corner Store',
    wallet_address: 'MERCH6L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0',
    business_type: 'general_store',
    location: 'Gaza Strip, Palestine',
    verification_status: 'pending',
    voucher_types_accepted: ['food', 'general'],
    total_vouchers_redeemed: 45,
    total_earnings: 1575,
    registration_date: new Date('2024-08-20T00:00:00Z'),
    last_redemption: new Date('2024-09-01T10:25:00Z')
  },
  {
    id: 'merchant_007',
    name: 'School Supplies Plus',
    wallet_address: 'MERCH7M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1',
    business_type: 'general_store',
    location: 'Hatay, Turkey - Near Syrian Border',
    verification_status: 'verified',
    voucher_types_accepted: ['general'],
    total_vouchers_redeemed: 92,
    total_earnings: 2760,
    registration_date: new Date('2024-03-10T00:00:00Z'),
    last_redemption: new Date('2024-09-04T15:50:00Z')
  },
  {
    id: 'merchant_008',
    name: 'Children\'s Care Center',
    wallet_address: 'MERCH8N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2',
    business_type: 'medical_clinic',
    location: 'Erbil, Iraq - Refugee Support Zone',
    verification_status: 'verified',
    voucher_types_accepted: ['medical', 'general'],
    total_vouchers_redeemed: 128,
    total_earnings: 6400,
    registration_date: new Date('2024-01-25T00:00:00Z'),
    last_redemption: new Date('2024-09-02T08:35:00Z')
  },
  {
    id: 'merchant_009',
    name: 'Emergency Medicine Depot',
    wallet_address: 'MERCH9O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3',
    business_type: 'pharmacy',
    location: 'Damascus, Syria - Medical District',
    verification_status: 'verified',
    voucher_types_accepted: ['medical'],
    total_vouchers_redeemed: 73,
    total_earnings: 9490,
    registration_date: new Date('2023-09-18T00:00:00Z'),
    last_redemption: new Date('2024-09-01T12:10:00Z')
  },
  {
    id: 'merchant_010',
    name: 'Neighborhood Grocers',
    wallet_address: 'MERCH10P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4',
    business_type: 'grocery',
    location: 'Cairo, Egypt - Refugee Quarter',
    verification_status: 'verified',
    voucher_types_accepted: ['food', 'general'],
    total_vouchers_redeemed: 201,
    total_earnings: 8040,
    registration_date: new Date('2023-08-30T00:00:00Z'),
    last_redemption: new Date('2024-09-06T17:25:00Z')
  },
  {
    id: 'merchant_011',
    name: 'Community Resource Center',
    wallet_address: 'MERCH11Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5',
    business_type: 'general_store',
    location: 'Nairobi, Kenya - Aid Distribution Hub',
    verification_status: 'verified',
    voucher_types_accepted: ['general'],
    total_vouchers_redeemed: 56,
    total_earnings: 1400,
    registration_date: new Date('2024-06-12T00:00:00Z'),
    last_redemption: new Date('2024-09-02T14:20:00Z')
  }
]

export const getMerchantById = (id: string): Merchant | undefined => {
  return mockMerchants.find(merchant => merchant.id === id)
}

export const getVerifiedMerchants = (): Merchant[] => {
  return mockMerchants.filter(merchant => merchant.verification_status === 'verified')
}

export const getMerchantsByVoucherType = (voucherType: 'food' | 'medical' | 'general'): Merchant[] => {
  return mockMerchants.filter(merchant => 
    merchant.voucher_types_accepted.includes(voucherType)
  )
}

export const getMerchantsByBusinessType = (businessType: Merchant['business_type']): Merchant[] => {
  return mockMerchants.filter(merchant => merchant.business_type === businessType)
}

export const getMerchantsByLocation = (location: string): Merchant[] => {
  return mockMerchants.filter(merchant => 
    merchant.location.toLowerCase().includes(location.toLowerCase())
  )
}

export const getTotalMerchantEarnings = (): number => {
  return mockMerchants.reduce((total, merchant) => total + merchant.total_earnings, 0)
}

export const getTotalVouchersRedeemed = (): number => {
  return mockMerchants.reduce((total, merchant) => total + merchant.total_vouchers_redeemed, 0)
}