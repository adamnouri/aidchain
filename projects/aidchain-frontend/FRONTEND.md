# Aidchain Frontend Development Guide

## Overview
This document details all frontend changes, additions, and the roadmap for completing the Aidchain humanitarian aid platform frontend. The project uses React + TypeScript + Vite with Algorand blockchain integration.

---

## Current Foundation (Completed ✅)

### 1. TypeScript Interfaces & Types
**File:** `src/types/humanitarian.types.ts`
**Purpose:** Complete type definitions for all humanitarian data structures

#### Core Interfaces Added:
- **`Donation`** - Donor contributions with tracking and status
- **`Voucher`** - Aid distribution tokens (food, medical, general)
- **`Campaign`** - Milestone-based fundraising campaigns
- **`NGO`** - Humanitarian organizations with verification status
- **`Merchant`** - Voucher redemption partners
- **`Recipient`** - Aid beneficiaries
- **`Milestone`** - Campaign progress tracking
- **`ProofSubmission`** - Evidence for milestone completion
- **`TransactionTrail`** - End-to-end aid tracking
- **`DashboardStats`** - Platform statistics
- **`User`** - Platform user profiles with role-based access

#### Key Features:
- Status tracking for all entities (`pending`, `completed`, etc.)
- Blockchain integration fields (wallet addresses, transaction hashes)
- Comprehensive metadata for audit trails
- Support for ALGO and USDC currencies

### 2. Mock Data Services
**Location:** `src/services/mockData/`
**Purpose:** Realistic test data for development and demos

#### Mock Data Files:
- **`mockNGOs.ts`** - 5 verified humanitarian organizations
  - Doctors Without Borders, World Food Programme, Save the Children
  - Local Relief Initiative, Clean Water Foundation
  - Credibility scores, focus areas, financial tracking
  
- **`mockDonations.ts`** - 7 sample donations across all statuses
  - Various purposes: food, medical, education, shelter, emergency
  - Different donors and amounts in ALGO/USDC
  - Transaction hashes and distribution proof
  
- **`mockCampaigns.ts`** - 5 active humanitarian campaigns
  - Syrian refugee medical emergency
  - East Africa drought relief
  - Children's education recovery
  - Refugee camp winterization
  - Clean water infrastructure
  
- **`mockVouchers.ts`** - 8 vouchers showing complete lifecycle
  - Food, medical, and general vouchers
  - Issued, redeemed, and expired statuses
  - QR codes and merchant restrictions
  
- **`mockMerchants.ts`** - 11 verified merchants
  - Groceries, pharmacies, medical clinics
  - Business types and voucher acceptance
  - Earnings and redemption tracking

#### Helper Functions:
- Data filtering by status, type, location
- Statistics calculation
- Dashboard aggregation functions

### 3. Utility Functions
**Location:** `src/utils/humanitarian/`
**Purpose:** Reusable functions for humanitarian operations

#### Currency Utilities (`formatCurrency.ts`):
```typescript
- formatAlgoAmount() - Display ALGO with proper decimals
- formatUSDCAmount() - Display USDC with $ symbol
- formatCurrencyAmount() - Generic currency formatting
- formatCompactAmount() - Compact notation (1.2K, 5.8M)
- parseCurrencyInput() - Parse user input to amount + currency
- convertCurrency() - ALGO ↔ USDC conversion
- formatPercentage() - Progress indicators
```

#### QR Code Utilities (`generateQRCodes.ts`):
```typescript
- generateVoucherQRData() - Voucher redemption QR codes
- generateRecipientQRData() - Beneficiary identification
- generateDonationTrackingQRData() - Donation trail QR codes
- encodeQRData() / decodeQRData() - Base64 encoding
- validateQRData() - Data integrity checking
```

#### Tracking Utilities (`trackingHelpers.ts`):
```typescript
- generateTrailSteps() - Create donation → distribution steps
- createTransactionTrail() - Complete audit trail
- calculateAidImpact() - Beneficiaries reached, areas served
- generateImpactMessage() - Donation impact descriptions
- getTrailStatusColor() / getTrailStatusIcon() - UI helpers
```

#### Wallet Utilities (`walletHelpers.ts`):
```typescript
- detectUserRole() - Auto-detect user type from address
- formatWalletAddress() - Truncated display format
- validateSufficientBalance() - Transaction validation
- createTransactionMetadata() - Blockchain metadata
- estimateTransactionFee() - Gas estimation
```

---

## Required Components for Frontend Completion

### Phase 1: Core Layout Components (Post-Figma)

#### Navigation & Layout
```
src/components/layout/
├── Header.tsx              - Main navigation with wallet status
├── Sidebar.tsx             - Role-based menu system  
├── RoleSelector.tsx        - Switch between donor/NGO/recipient/merchant views
├── PageLayout.tsx          - Common page wrapper with header/sidebar
├── Footer.tsx              - Platform info and links
└── BreadcrumbNav.tsx       - Navigation breadcrumbs
```

#### Landing & Authentication
```
src/components/auth/
├── LandingPage.tsx         - Replace current AlgoKit welcome
├── RoleSelection.tsx       - Choose user role on first visit
├── WalletConnect.tsx       - Enhanced wallet connection (already exists)
└── UserProfile.tsx         - Profile management
```

### Phase 2: Donor Experience Components

#### Donation Interface
```
src/components/donor/
├── DonorDashboard.tsx      - Main donor overview
├── DonationForm.tsx        - Amount, purpose, NGO selection
├── DonationHistory.tsx     - Personal donation tracking
├── ImpactTracker.tsx       - Real-time aid distribution updates
├── NGODirectory.tsx        - Browse and select NGOs
├── NGOProfile.tsx          - Detailed NGO information
└── DonationReceipt.tsx     - Transaction confirmation
```

#### Transparency Features
```
src/components/tracking/
├── TransactionTrail.tsx    - Visual donation → distribution flow
├── TrailStep.tsx           - Individual step in trail
├── ImpactMap.tsx           - Geographic aid distribution (optional)
├── ImpactStats.tsx         - Platform-wide statistics
└── ProofViewer.tsx         - View distribution evidence
```

### Phase 3: NGO/Field Worker Components

#### Campaign Management
```
src/components/ngo/
├── NGODashboard.tsx        - NGO main interface
├── CampaignBuilder.tsx     - Create milestone-based campaigns
├── CampaignList.tsx        - Manage active campaigns
├── CampaignDetails.tsx     - Individual campaign view
├── MilestoneManager.tsx    - Milestone progress tracking
├── ProofUploader.tsx       - Evidence submission for milestones
└── FundingOverview.tsx     - Financial management
```

#### Aid Distribution
```
src/components/distribution/
├── VoucherIssuer.tsx       - Generate ASA vouchers for recipients
├── BeneficiaryRegistry.tsx - Recipient management
├── QRScanner.tsx           - Scan recipient QR codes
├── DistributionLogger.tsx  - Record aid delivery
├── InventoryTracker.tsx    - Supplies management
└── FieldReport.tsx         - Distribution reporting
```

### Phase 4: Recipient Components

#### Recipient Interface
```
src/components/recipient/
├── RecipientDashboard.tsx  - Recipient main view
├── VoucherWallet.tsx       - Available aid credits
├── QRGenerator.tsx         - Personal QR code for aid collection
├── AidHistory.tsx          - Track received assistance
├── VoucherDetails.tsx      - Individual voucher information
└── NearbyMerchants.tsx     - Find redemption locations
```

### Phase 5: Merchant Components

#### Merchant Portal
```
src/components/merchant/
├── MerchantDashboard.tsx   - Merchant main interface
├── VoucherRedemption.tsx   - Scan and redeem vouchers
├── VoucherScanner.tsx      - QR code scanning interface
├── EarningsTracker.tsx     - Track payments from redeemed vouchers
├── TransactionHistory.tsx  - Redemption history
└── MerchantVerification.tsx - Verification status and requirements
```

### Phase 6: Shared UI Components

#### Common Components
```
src/components/common/
├── LoadingSpinner.tsx      - Loading states
├── ErrorBoundary.tsx       - Error handling (already exists)
├── Modal.tsx               - Reusable modal wrapper
├── Card.tsx                - Consistent card layouts
├── Button.tsx              - Standardized buttons
├── Input.tsx               - Form inputs with validation
├── Select.tsx              - Dropdown selections
├── ProgressBar.tsx         - Campaign/milestone progress
├── StatusBadge.tsx         - Status indicators
├── CurrencyDisplay.tsx     - Formatted currency amounts
├── AddressDisplay.tsx      - Wallet address formatting
├── QRCode.tsx              - QR code generation component
├── ImageUploader.tsx       - Proof/evidence uploads
└── DataTable.tsx           - Sortable/filterable tables
```

---

## Integration Tasks (Post-Backend Delivery)

### Smart Contract Integration
**Replace mock data calls with real blockchain interactions:**

1. **Donation Contract Integration**
   - Replace `mockDonations` with actual contract calls
   - Handle transaction confirmations
   - Listen for blockchain events

2. **Voucher Management Integration**
   - ASA token operations (issue, transfer, redeem)
   - Merchant verification checks
   - Expiration handling

3. **Campaign Contract Integration**
   - Milestone escrow functionality
   - Proof verification workflows
   - Automated fund release

4. **Real-time Updates**
   - WebSocket connections for live updates
   - Blockchain event listeners
   - Notification system

### State Management Setup
```typescript
// Context providers for global state
src/context/
├── UserContext.tsx         - Current user and role
├── WalletContext.tsx       - Wallet connection state
├── NotificationContext.tsx - Toast notifications
└── ThemeContext.tsx        - Dark/light mode
```

---

## Demo Preparation Tasks

### Demo Flow Components
```
src/components/demo/
├── GuidedTour.tsx          - Step-by-step demo for judges
├── DemoScenarios.tsx       - Pre-built use cases
├── MockDataReset.tsx       - Reset demo state
├── DemoControls.tsx        - Demo navigation controls
└── StoryMode.tsx           - Narrative-driven demonstrations
```

### Performance Optimizations
- Code splitting for faster loading
- Image optimization
- Bundle size analysis
- Mobile responsiveness testing

---

## Development Workflow

### When Figma Designs Are Ready:

1. **Request Component Creation:**
   ```
   "Create the DonorDashboard component based on the Figma design"
   "Build the donation form with the specified UI elements"
   "Implement the transaction trail visualization"
   ```

2. **Data Integration:**
   ```
   "Connect the dashboard to display real data from our mock services"
   "Add loading states and error handling to all forms"
   "Implement search and filtering for the NGO directory"
   ```

3. **Interactive Features:**
   ```
   "Add the donation flow from form submission to confirmation"
   "Implement voucher redemption workflow"
   "Create the campaign creation and milestone tracking"
   ```

4. **Smart Contract Integration (When Ready):**
   ```
   "Replace mock donation service with real Algorand smart contract calls"
   "Integrate ASA voucher operations with the new contracts"
   "Add real-time blockchain event listeners"
   ```

5. **Demo Preparation:**
   ```
   "Create a guided demo flow showing donor → NGO → recipient journey"
   "Add realistic test scenarios for the hackathon presentation"
   "Optimize the demo for judge evaluation"
   ```

---

## File Structure Overview

```
src/
├── types/
│   └── humanitarian.types.ts          ✅ Completed
├── services/
│   └── mockData/                      ✅ Completed
│       ├── index.ts
│       ├── mockNGOs.ts
│       ├── mockDonations.ts
│       ├── mockCampaigns.ts
│       ├── mockVouchers.ts
│       └── mockMerchants.ts
├── utils/
│   └── humanitarian/                  ✅ Completed
│       ├── index.ts
│       ├── formatCurrency.ts
│       ├── generateQRCodes.ts
│       ├── trackingHelpers.ts
│       └── walletHelpers.ts
├── components/                        📋 To Be Built
│   ├── layout/
│   ├── donor/
│   ├── ngo/
│   ├── recipient/
│   ├── merchant/
│   ├── common/
│   ├── tracking/
│   └── demo/
├── pages/                            📋 To Be Built
│   ├── DonorDashboard.tsx
│   ├── NGOPortal.tsx
│   ├── RecipientView.tsx
│   └── MerchantPortal.tsx
├── context/                          📋 To Be Built
├── hooks/                            📋 To Be Built
└── assets/                           📋 To Be Built
```

---

## Success Metrics for Hackathon

### Core Deliverables:
- ✅ Complete donor experience (donation → tracking)
- ✅ NGO campaign management with milestones
- ✅ Voucher issuance and redemption flow
- ✅ Real blockchain integration with Algorand
- ✅ Mobile-responsive design
- ✅ Live demo with realistic data

### Bonus Features (if time permits):
- QR code scanning functionality
- Geolocation mapping
- Multi-language support
- Advanced analytics dashboard
- Real-time notifications

---

## Next Steps

1. **Wait for Figma designs** from your designer teammate
2. **Coordinate with backend** teammate on smart contract specifications
3. **Request component implementation** based on designs
4. **Integrate with real blockchain calls** when contracts are ready
5. **Prepare demo flows** for hackathon presentation

The foundation is solid and ready for rapid UI development once designs are available!