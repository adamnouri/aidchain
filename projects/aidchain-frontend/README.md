# AidChain Frontend

AidChain is a transparent humanitarian aid platform. Donors fund campaigns, NGOs manage distribution, and everyone can trace impact end‑to‑end on Algorand.

## What this app does
- Landing page: explain mission, CTA to donate, live stats
- Donation flow: browse categories, view campaign details, donate, confirmation
- NGO portal: register organizations, create campaigns, view progress (demo and on-chain via app client)
- Wallet integration: connect and transact with supported Algorand wallets

## Why it exists (purpose)
Increase trust and efficiency in humanitarian aid by making funds traceable, verifiable, and fast. AidChain aims to reduce overhead, fraud, and opacity with a transparent, low-cost rails.

## Tech stack
- React + TypeScript + Vite
- Design system: CSS variables (tokens) with modular CSS (`home.css`, `donation.css`, `ngo.css`)
- Wallets: `@txnlab/use-wallet-react`
- Notifications: `notistack`
- Testing/automation (repo includes): Playwright
- Contracts/app client (monorepo): see `projects/aidchain-contracts`

## Notable frontend modules
- `src/utils/network/getAlgoClientConfigs.ts`: Reads Algod/Indexer/KMD env configs
- `src/context/AppClientContext.tsx`: Provides generated app client
- `src/components/ui/`: Reusable UI primitives (`Button`, `Input`, `Card`, `Nav`)
- `src/styles/tokens.css`: Design tokens (colors, type scale, spacing, radii, shadows, focus styles)

## Environment
Create a `.env` based on `.env.template`. Minimum for Algod:

```
VITE_ALGOD_SERVER=
VITE_ALGOD_PORT=
VITE_ALGOD_TOKEN=
VITE_ALGOD_NETWORK=localnet|testnet|mainnet
```

Optional (only if using KMD for local wallets):

```
VITE_KMD_SERVER=
VITE_KMD_PORT=
VITE_KMD_TOKEN=
VITE_KMD_WALLET=
VITE_KMD_PASSWORD=
```

Indexer (optional):

```
VITE_INDEXER_SERVER=
VITE_INDEXER_PORT=
VITE_INDEXER_TOKEN=
```

The app gracefully skips KMD configuration if these variables are not present.

## Getting started
1) Install prerequisites: Node 18+, npm, AlgoKit CLI (optional)
2) Install dependencies:
```
npm install
```
3) Create `.env` and configure Algod (and optionally KMD/Indexer)
4) Start dev server:
```
npm run dev
```

## Common scripts
- `npm run dev`: Start Vite dev server
- `npm run build`: Production build
- `npm run preview`: Preview production build locally

## Design system and accessibility
- Centralized tokens in `src/styles/tokens.css` (brand gradient, neutrals, typography, spacing, radii, shadows)
- Page styles: `home.css` (landing), `donation.css` (donation flow), `ngo.css` (NGO portal)
- Global `:focus-visible` outline and reduced-motion rules
- Inter font for consistent typographic scale

## Project structure (frontend)
```
src/
  components/
    ui/              # Button, Input, Card, Nav
    ...              # Feature components
  context/           # App client provider
  hooks/             # UI/data hooks
  services/          # API/adapters
  styles/            # tokens + page styles
  utils/             # network configs, helpers
```

## Contracts and typed clients
This repository includes smart contracts in `projects/aidchain-contracts`. If an ARC-34 app spec is available, generate a TypeScript client and place it under `src/contracts/`, then wire it via `AppClientContext`.

## Notes
- KMD is optional; when env vars are absent, the app won’t crash and will skip KMD setup.
- Demo states are shown when blockchain connectivity isn’t available.

## License
MIT (unless otherwise specified)
