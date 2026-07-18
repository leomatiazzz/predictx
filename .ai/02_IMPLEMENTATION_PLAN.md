# 02_IMPLEMENTATION_PLAN.md

# ProofLens - Implementation Plan

## Purpose

Este documento define a ordem oficial de implementação do projeto.

Todo desenvolvimento deve seguir esta sequência.

Não implementar etapas futuras antes da conclusão das etapas anteriores.

---

# Development Strategy

O desenvolvimento será incremental.

Cada etapa deve:

- funcionar isoladamente;
- manter a aplicação compilando;
- não quebrar funcionalidades existentes;
- ser revisável individualmente.

Nenhuma etapa deve introduzir grandes refatorações.

---

# Current State

O projeto atualmente possui:

✅ Interface React pronta

✅ Componentes de UI

✅ Layout completo

✅ Navegação

✅ Dados mockados

Ainda não possui:

❌ Integração TxLINE

❌ Autenticação

❌ Server-Sent Events

❌ Settlement Engine

❌ Validação on-chain

❌ Explainable Layer

---

# Final Objective

Entregar um MVP funcional capaz de:

- consumir dados reais da TxLINE;
- atualizar partidas em tempo real;
- validar resultados;
- demonstrar liquidação verificável;
- explicar a liquidação ao usuário.

---

# Phase 0 — Project Audit

## Goal

Entender completamente o projeto.

## Tasks

- identificar páginas;
- identificar componentes;
- identificar hooks;
- identificar stores;
- identificar mocks;
- identificar pontos de integração.

## Deliverables

Relatório técnico.

Nenhum código deve ser alterado.

---

# Phase 1 — Infrastructure

## Goal

Preparar a estrutura para integração.

## Tasks

Criar:

```

src/services/txline/

```

Criar:

- apiClient
- auth
- fixtures
- scores
- odds
- stream
- validation

Criar:

```

src/types/

```

## Acceptance Criteria

A aplicação continua funcionando.

Nenhuma funcionalidade muda.

---

# Phase 2 — TypeScript Models

## Goal

Criar todas as interfaces.

## Models

- Match
- Fixture
- Team
- Odds
- Market
- Settlement
- Proof
- Validation
- User
- StreamEvent

## Acceptance Criteria

Nenhum uso de any.

---

# Phase 3 — Authentication

## Goal

Implementar autenticação TxLINE.

Fluxo esperado:

Wallet

↓

Subscribe

↓

Guest JWT

↓

Wallet Signature

↓

Activate Token

↓

API Token

## Acceptance Criteria

Usuário autenticado.

API Token disponível.

---

# Phase 4 — Snapshot Integration

## Goal

Substituir dados mockados.

## Integrar

- fixtures
- scores
- odds

## Não alterar

- layout
- componentes

## Acceptance Criteria

Todas as telas utilizam dados reais.

---

# Phase 5 — Live Stream

## Goal

Implementar SSE.

Eventos:

- Goal
- Card
- Match Start
- Match End
- Odds Update

## Acceptance Criteria

Interface atualiza automaticamente.

Sem refresh.

---

# Phase 6 — Settlement Engine

## Goal

Implementar liquidação.

Integrar:

- validate_stat
- Proof
- Signature
- Timestamp

## Acceptance Criteria

Liquidação funcionando.

---

# Phase 7 — Explainable Layer

## Goal

Traduzir dados técnicos.

Entrada

- hash
- signature
- proof
- validation

Saída

Texto amigável.

Exemplo:

"O resultado foi validado automaticamente utilizando assinatura criptográfica registrada na blockchain Solana."

---

# Phase 8 — Receipt

## Goal

Criar recibo verificável.

Campos

- Match
- Market
- Odds
- Result
- Timestamp
- Signature
- Proof
- Validation Status

---

# Phase 9 — Testing

## Checklist

- Build
- TypeScript
- ESLint
- REST
- SSE
- Wallet
- Settlement

---

# Phase 10 — Polish

Melhorias:

- Loading
- Error States
- Empty States
- Performance
- Responsividade

---

# Phase 11 — Presentation

Preparar demonstração.

Fluxo esperado:

1. Abrir aplicação.

2. Visualizar partidas.

3. Mostrar atualização em tempo real.

4. Encerrar partida.

5. Mostrar liquidação.

6. Mostrar Merkle Proof.

7. Mostrar explicação.

8. Mostrar recibo.

---

# MVP Checklist

## Core

- [ ] Dashboard
- [ ] Fixtures
- [ ] Odds
- [ ] Scores

## Authentication

- [ ] Wallet
- [ ] JWT
- [ ] API Token

## Realtime

- [ ] SSE
- [ ] Live Updates

## Validation

- [ ] Settlement
- [ ] Proof
- [ ] Signature

## UX

- [ ] Explainable Layer
- [ ] Receipt

---

# Rules

Cada fase deve terminar com:

- aplicação compilando;
- TypeScript sem erros;
- ESLint sem erros;
- código revisado.

Nunca iniciar uma nova fase com erros pendentes.

---

# AI Development Rules

Antes de implementar qualquer fase:

1. Explique o objetivo.

2. Liste os arquivos que serão modificados.

3. Explique o motivo.

4. Implemente apenas esta fase.

5. Gere um resumo técnico.

6. Aguarde a próxima instrução.

---

# Definition of Done

Uma fase somente poderá ser considerada concluída quando:

- Todos os critérios de aceite forem atendidos.
- O projeto continuar compilando.
- Nenhum componente existente for quebrado.
- Nenhuma funcionalidade anterior deixar de funcionar.
- A arquitetura continuar consistente.

---

# Important Note

Durante este hackathon, prioridade máxima é entregar um MVP funcional.

Sempre priorizar:

1. Funcionalidade.
2. Estabilidade.
3. Clareza.
4. Simplicidade.

Evitar implementações excessivamente complexas que coloquem a entrega em risco.