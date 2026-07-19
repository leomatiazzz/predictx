# PredictX

This repository brings together a React/Vite frontend application integrated with the TxLINE oracle infrastructure.

## Project Overview

The project is a web frontend built with React, TypeScript, and Vite, featuring a UI based on shadcn/ui components and Tailwind CSS. It serves as a Prediction Market Viewer and Verifiable Resolution UI, allowing users to connect their Solana wallets, subscribe to on-chain data streams, and verify cryptographically signed odds and scores in real-time.

## Core Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Solana Web3 / wallet adapter

## Prerequisites

- Node.js 18+
- npm or pnpm

## Installation

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

Optimized artifacts will be generated in the `dist/` folder.

## Relevant repository structure

```text
.
├── src/                                # React/Vite frontend
├── package.json                        # frontend dependencies and scripts
└── pnpm-lock.yaml                      # lockfile
```