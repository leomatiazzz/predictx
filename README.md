# PredictX (ProofLens) 🔍⚽

> **Don't trust. Verify.** A fully transparent Prediction Market Viewer and Verifiable Resolution UI built for the TxLINE World Cup Hackathon.

## 🏆 The Challenge

In traditional and even some decentralized prediction markets, the settlement process is a **black box**. When a match ends, platforms simply declare "You won" or "You lost". Users are forced to blindly trust the platform or the oracle, often without any way to verify:
- Who confirmed the result?
- Was there a delay in settlement?
- Were the odds or data manipulated?
- What exact event triggered the payout?

**The Superteam & TxLINE World Cup Hackathon** challenged developers to utilize TxLINE's high-performance data layer—providing real-time sports data and consensus betting odds backed by cryptographic signatures anchored on **Solana**.

## 💡 Our Solution

**PredictX** is a modern, accessible **Prediction Market Viewer and Verifiable Resolution UI**. 

Instead of hiding the settlement process, we expose it through an **Explainable Settlement Engine**. We consume TxLINE's live Server-Sent Events (SSE) and provide a dashboard where users can not only track live odds and fixtures but also cryptographically audit every single match outcome.

### Key Features
- **Real-Time Market Viewer:** Track live matches, upcoming fixtures, and dynamic odds for the World Cup directly from the TxLINE data streams.
- **Verifiable Resolution UI:** A step-by-step cryptographic auditing interface that displays the exact Match Event, Timestamp, Signature, and Merkle Proof used to settle a market.
- **Explainable Settlement:** Translating complex on-chain proofs (Hashes, Merkle Roots) into human-readable timelines. We don't just prove it; we explain it so anyone can understand.
- **Web3 Native Authentication:** Fully decentralized login flow. Users subscribe to the TxLINE Oracle directly via their Solana wallets, securing their API access on-chain.
- **Deep Accessibility:** Designed with multiple vision modes (Protanopia, Deuteranopia, Tritanopia), high contrast, and simplified navigation for total inclusivity.

## 🛠️ Core Technology Stack

- **Frontend:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Recharts
- **Web3 / Blockchain:** Solana Web3.js, Wallet Adapter, `@coral-xyz/anchor` (for TxLINE CPI parsing)
- **Data Layer:** TxLINE REST API & SSE Streams (Real-time Odds, Scores, and Fixtures)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Solana Wallet (Phantom, Solflare, etc.) for Devnet authentication.

### Installation

```bash
pnpm install
```

### Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. 

### Production Build

```bash
npm run build
```

Optimized artifacts will be generated in the `dist/` folder.

## 📁 Repository Structure

```text
.
├── src/
│   ├── components/       # UI Components (Dashboard, Stepper, Shadcn)
│   ├── hooks/            # Custom React hooks (TxLINE integration)
│   ├── i18n/             # Internationalization (11+ languages)
│   ├── pages/            # App routing pages
│   ├── services/         # TxLINE API and Auth Services
│   └── stores/           # Global State Management
├── package.json          
└── pnpm-lock.yaml        
```

---
*Built with ❤️ for the TxLINE World Cup Hackathon.*