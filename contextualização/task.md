# ProofLens — Task List

## Etapa 1 — Fundação (Types + API Client + Env)
- `[ ]` Criar `src/types/txline.ts` com todas as interfaces
- `[ ]` Criar `src/services/txline/config.ts` com configuração de rede
- `[ ]` Criar `src/services/txline/apiClient.ts` com wrapper HTTP
- `[ ]` Criar `.env` com variáveis de ambiente

## Etapa 2 — Wallet Solana Real
- `[ ]` Instalar dependências `@solana/wallet-adapter-*`
- `[ ]` Criar `src/services/txline/wallet.tsx` (WalletProvider)
- `[ ]` Atualizar `src/App.tsx` com providers Solana
- `[ ]` Atualizar `src/stores/main.ts` com estado real da wallet
- `[ ]` Atualizar `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`

## Etapa 3 — Autenticação TxLINE
- `[ ]` Criar `src/services/txline/auth.ts`
- `[ ]` Atualizar store com auth state
- `[ ]` Atualizar Header com status de autenticação

## Etapa 4 — Dados REST (Substituir Mocks)
- `[ ]` Criar `src/services/txline/fixtures.ts`
- `[ ]` Criar `src/services/txline/odds.ts`
- `[ ]` Criar `src/services/txline/scores.ts`
- `[ ]` Reescrever `src/hooks/use-tx-line.ts`
- `[ ]` Atualizar componentes do dashboard

## Etapa 5 — SSE Stream
- `[ ]` Criar `src/services/txline/stream.ts`
- `[ ]` Integrar SSE no hook `use-tx-line.ts`
- `[ ]` Atualizar status pills no Header

## Etapa 6 — Settlement + Proofs + Explainable
- `[ ]` Criar `src/services/txline/validation.ts`
- `[ ]` Criar `src/services/txline/explainable.ts`
- `[ ]` Atualizar VerificationStepper com dados dinâmicos
- `[ ]` Atualizar SettlementEngine com dados reais

## Etapa 7 — Polish + Bugs
- `[ ]` Corrigir MatchDetails `:id` ignorado
- `[ ]` Corrigir market.title vs market.titleKey
- `[ ]` Corrigir settlement.timeAgo vs minutesAgo
- `[ ]` Corrigir formato de endereço wallet
- `[ ]` Loading skeletons e error states

## Etapa 8 — Deploy + Vídeo
- `[ ]` Build de produção
- `[ ]` Deploy (Vercel/Netlify)
- `[ ]` Gravar vídeo demo
- `[ ]` Submissão no Superteam Earn
