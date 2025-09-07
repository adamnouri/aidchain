# AidChain Frontend-Backend Integration Plan

## Current Status Assessment (Based on Analysis)

### ✅ What's Working:
- **Smart Contract**: 30.8% success rate, core methods functional
- **Frontend UI**: Professional landing page with multi-view navigation  
- **Wallet Integration**: Pera/Defly wallet support ready
- **Generated Client**: TypeScript client auto-generated from contract
- **Type System**: Comprehensive interfaces and mock data

### 🔧 What Needs Integration:
- **Real Transaction Processing**: Currently using mock data
- **Contract Funding**: Backend needs ALGO balance for operations
- **Payment Flows**: Donation processing with real blockchain payments
- **State Synchronization**: UI updates after blockchain changes
- **Error Handling**: Robust transaction error management

## Priority Integration Steps

### Phase 1: Foundation (Today - 2 hours)

#### Step 1: Fix Contract Funding
```bash
# Fund the contract for operations
algokit project run deploy-localnet --fund-contract
```

#### Step 2: Restore Account Parameter
```python
# In contract.py - change back for production use
def distribute_vouchers(self, asset_id: UInt64, recipient: Account, amount: UInt64) -> String:
```

#### Step 3: Create Integration Service Layer
- File: `projects/aidchain-frontend/src/services/AidchainService.ts`
- Purpose: Bridge React UI to blockchain methods
- Pattern: Service layer wrapping generated client

### Phase 2: Core Transaction Integration (2-4 hours)

#### Real Donation Flow
- Connect existing donation UI to `create_donation()` method
- Implement real ALGO payment transactions
- Add transaction confirmation feedback

#### Campaign Management  
- Wire up campaign creation form to `create_campaign()`
- Connect campaign display to `get_campaign_details()`
- Add campaign funding progress tracking

#### Organization Portal
- Connect NGO registration to `register_organization()`
- Implement organization verification workflow

### Phase 3: Advanced Features (4-6 hours)

#### Milestone System
- Integrate milestone creation UI with `create_milestone()`
- Build proof submission workflow for `complete_milestone()`
- Add fund release interface for `release_milestone_funds()`

#### Voucher Distribution
- Connect voucher creation to `create_voucher_asset()`
- Build recipient distribution interface
- Add QR code generation for vouchers

#### Delivery Tracking
- Integrate delivery logging with `log_delivery()`
- Add verification interface for field agents

## Technical Implementation Strategy

### 1. Service Layer Pattern
```typescript
// AidchainService.ts
export class AidchainService {
  constructor(private client: AidchainContractsClient) {}
  
  async createCampaign(data: CampaignData) {
    return await this.client.send.create_campaign({
      args: {
        title: data.title,
        target: data.target,
        creator: data.creator
      }
    });
  }
}
```

### 2. React Hook Integration
```typescript
// useAidchainOperations.ts  
export const useAidchainOperations = () => {
  const { algorandClient } = useAppClient();
  const service = new AidchainService(algorandClient);
  
  const createCampaign = async (data: CampaignData) => {
    try {
      const result = await service.createCampaign(data);
      // Handle success
      return result;
    } catch (error) {
      // Handle error
      throw error;
    }
  };
}
```

### 3. State Management Updates
```typescript
// Update Home.tsx components to use real data
const [campaigns, setCampaigns] = useState([]);
const { createCampaign } = useAidchainOperations();

const handleCreateCampaign = async (data) => {
  const result = await createCampaign(data);
  // Refresh campaign list
  loadCampaigns();
}
```

## Figma Design Integration

Since I can't access the Figma directly, please:
1. **Share screenshots** of key screens (landing, donation flow, dashboard)
2. **Export design tokens** (colors, fonts, spacing) from dev mode
3. **Provide component specifications** for critical UI elements

I'll then update the existing Home.tsx and components to match the exact design.

## Success Metrics

### Phase 1 Complete When:
- [ ] Contract has sufficient balance for all operations
- [ ] All 13 contract methods work (85%+ success rate)
- [ ] Service layer successfully calls contract methods

### Phase 2 Complete When:  
- [ ] Users can create real campaigns on blockchain
- [ ] Donations process real ALGO/USDC payments
- [ ] UI updates reflect actual blockchain state

### Phase 3 Complete When:
- [ ] Full milestone workflow functional
- [ ] Voucher creation and distribution working
- [ ] Delivery verification system operational

## Next Immediate Action

Ready to start Phase 1 - shall I:
1. **Fix contract funding** first
2. **Create the service layer** integration
3. **Wait for Figma access** to ensure UI matches design

Which would you like me to prioritize?