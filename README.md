# PredictX

This repository brings together a React/Vite frontend application with Solana integrations and an experimental Anchor program designed to validate Merkle proofs and trigger a CPI to TxLINE.

## Project Overview

The project is organized into two main parts:

- A web frontend built with React, TypeScript, and Vite, featuring a UI based on shadcn/ui components and Tailwind CSS.
- A standalone Anchor program located in [programs/merkle_validator](programs/merkle_validator), responsible for validating a Merkle proof, preparing a call to TxLINE's `validate_stat` instruction, and subsequently executing an SPL Token transfer.

The current implementation serves as a proof of concept or initial framework for the hackathon and still requires on-chain validation for full integration with TxLINE.

## Core Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Solana Web3 / wallet adapter
- Anchor
- SPL Token
- TxLINE IDL snapshot at [src/services/txline/txoracle.json](src/services/txline/txoracle.json)

## Prerequisites

### Frontend

- Node.js 18+
- npm or pnpm

### Anchor / Solana Program

If you wish to compile, test, or deploy the Anchor program, you will also need to install:

- Rust + Cargo
- Anchor CLI
- Solana CLI
- A locally configured Solana wallet

## Frontend Installation

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

## Running the Application Locally

```bash
npm run dev
```

The application will be available at http://localhost:5173.

## Production Build

```bash
npm run build
```

Optimized artifacts will be generated in the `dist/` folder. ## Anchor / Merkle Validator Program

The Anchor program is located at [programs/merkle_validator/src/lib.rs](programs/merkle_validator/src/lib.rs), and the Anchor workspace is configured in [Anchor.toml](Anchor.toml).

### Key commands

```bash
anchor build
anchor test
anchor deploy
```

> The full deployment and validation workflow requires a live environment with the correct Program ID, accounts compatible with TxLINE, and a configured network.

## Comprehensive operating guide

A detailed guide covering installation, Solana environment setup, building, testing, deployment, account configuration, and CPI validation can be found at:

- [programs/merkle_validator/OPERATING_GUIDE.md](programs/merkle_validator/OPERATING_GUIDE.md)

This file serves as the primary reference for getting the program up and running in a practical setting.

## Relevant repository structure

```text
.
├── src/                                # React/Vite frontend
├── programs/
│   └── merkle_validator/              # standalone Anchor program
├── Anchor.toml                         # Anchor workspace configuration
├── package.json                        # frontend dependencies and scripts
└── programs/merkle_validator/OPERATING_GUIDE.md
```

## Important note

This repository combines a frontend application with a Solana/Anchor proof-of-concept. For hackathon purposes, the most relevant aspects to demonstrate are the integration structure and the validation/transfer workflow designed for TxLINE. Full compatibility with the actual TxLINE program still requires on-chain validation and adjustments to the account layout based on the deployed version.