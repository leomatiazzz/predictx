# 01_ARCHITECTURE.md

# Architecture Overview

Este documento define a arquitetura oficial do projeto.

Todos os desenvolvedores e agentes de IA devem seguir esta arquitetura.

Não criar novas camadas ou alterar a organização sem justificativa técnica.

---

# Architecture Philosophy

O projeto utiliza uma arquitetura em camadas.

Cada camada possui uma única responsabilidade.

```
                User

                  │

                  ▼

              React Pages

                  │

                  ▼

            React Components

                  │

                  ▼

                Hooks

                  │

                  ▼

               Services

                  │

                  ▼

          TxLINE REST / SSE

                  │

                  ▼

               Solana
```

---

# Source Tree

```
src/

├── components/
├── pages/
├── hooks/
├── services/
├── stores/
├── lib/
├── types/
└── assets/
```

---

# Components Layer

Responsabilidade:

Renderizar interface.

Pode:

- receber props
- chamar hooks

Não pode:

- chamar APIs
- usar fetch
- abrir EventSource
- acessar blockchain
- conter regras de negócio

Componentes devem ser reutilizáveis.

---

# Pages Layer

Responsabilidade:

Montar telas.

Pode:

- importar componentes
- utilizar hooks
- organizar layout

Não pode:

- chamar APIs diretamente
- conter lógica complexa

---

# Hooks Layer

Responsabilidade:

Conectar interface e serviços.

Pode:

- chamar services
- utilizar useEffect
- utilizar useState
- consumir stores

Não pode:

- renderizar interface
- conhecer detalhes da implementação da API

Exemplo:

```
useLiveMatches()

↓

services/fixtures.ts

↓

TxLINE
```

---

# Services Layer

Responsabilidade:

Toda comunicação externa.

Nenhum componente pode chamar a API diretamente.

Estrutura esperada:

```
services/

txline/

    apiClient.ts

    auth.ts

    fixtures.ts

    scores.ts

    odds.ts

    stream.ts

    validation.ts

    proofs.ts
```

Cada arquivo possui apenas uma responsabilidade.

---

# Stores Layer

Responsabilidade:

Estado global.

Exemplos:

- partidas
- mercados
- odds
- autenticação
- liquidação

Caso não seja necessário estado global, utilizar apenas hooks.

---

# Types Layer

Todos os modelos TypeScript ficam nesta pasta.

Exemplo:

```
types/

Match.ts

Fixture.ts

Odds.ts

Settlement.ts

Proof.ts

Validation.ts
```

Nunca declarar interfaces grandes dentro dos componentes.

---

# Data Flow

Fluxo para dados REST.

```
TxLINE

↓

Service

↓

Hook

↓

Component

↓

UI
```

---

Fluxo para dados em tempo real.

```
TxLINE

↓

SSE Stream

↓

stream.ts

↓

Hook

↓

Store

↓

React

↓

Tela
```

---

# Authentication Flow

```
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

↓

REST

↓

SSE
```

Toda autenticação deve ser centralizada.

Nunca espalhar lógica de autenticação pelos componentes.

---

# Settlement Flow

```
Fim da partida

↓

Settlement

↓

Proof

↓

Validation

↓

Explainable Layer

↓

Interface
```

---

# Explainable Layer

Objetivo:

Traduzir informações técnicas em linguagem natural.

Entrada:

- Signature
- Merkle Proof
- Timestamp
- Validation

Saída:

Texto amigável ao usuário.

Essa camada nunca deve acessar a API diretamente.

---

# Folder Responsibilities

components/

Interface.

---

pages/

Telas.

---

hooks/

Lógica React.

---

services/

Comunicação externa.

---

stores/

Estado.

---

types/

Modelos.

---

lib/

Funções auxiliares.

---

assets/

Imagens.

---

# Dependency Rules

Permitido

Pages

↓

Components

↓

Hooks

↓

Services

↓

API

---

Nunca

Components

↓

Services

---

Nunca

Components

↓

API

---

Nunca

Pages

↓

API

---

Nunca

Services

↓

Components

---

# Error Handling

Toda comunicação externa deve retornar erros padronizados.

Hooks são responsáveis por transformar erros em estados da interface.

Componentes apenas exibem mensagens.

---

# Performance Guidelines

Preferir:

- componentes pequenos
- hooks especializados
- memoização quando necessário

Evitar:

- renderizações desnecessárias
- chamadas repetidas
- lógica pesada em componentes

---

# AI Instructions

Antes de modificar qualquer arquivo:

1. identificar a camada correta;
2. verificar se já existe um arquivo responsável;
3. reutilizar código existente;
4. evitar criar novas abstrações.

Sempre preservar esta arquitetura.

---

# Future Architecture

Arquitetura planejada:

```
TxLINE

↓

apiClient

↓

Services

↓

Hooks

↓

Stores

↓

Components

↓

Pages

↓

User
```

Toda nova funcionalidade deve seguir esse fluxo.

---

# Architecture Principles

- Single Responsibility
- Separation of Concerns
- Reutilização
- Componentes desacoplados
- Tipagem forte
- Código previsível
- Alterações incrementais

---

# Final Rule

Em caso de dúvida:

Preservar a arquitetura existente.

Criar novas camadas somente quando houver necessidade técnica comprovada.

Não modificar a estrutura do projeto apenas por preferência pessoal.

## EM RESUMO

# Current Architecture

(Como o projeto está hoje)

- React + Vite
- Hooks com dados mockados
- Componentes de apresentação
- Sem integração com TxLINE
- Sem SSE
- Sem autenticação

---

# Target Architecture

(Como o projeto deverá ficar)

- Dados vindos da TxLINE
- Serviços centralizados
- SSE integrado
- Autenticação via Wallet + API Token
- Settlement Engine funcional
- Explainable Layer

