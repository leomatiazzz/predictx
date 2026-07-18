# 03_API_GUIDE.md

# TxLINE API Integration Guide

## Purpose

Este documento reúne todas as informações conhecidas sobre a API TxLINE.

Sempre utilize este documento juntamente com a documentação oficial.

Caso exista conflito entre este documento e a documentação oficial da TxLINE, prevalece a documentação oficial.

---

# Official Documentation

Documentação principal

- Quickstart
- Odds
- Scores
- Solana Programs
- Examples
- OpenAPI Specification

Os links oficiais encontram-se na documentação fornecida pela organização do hackathon.

---

# API Architecture

A plataforma disponibiliza dois tipos principais de comunicação.

## REST API

Utilizada para:

- carregar dados iniciais;
- buscar partidas;
- buscar mercados;
- buscar odds;
- consultar informações.

Fluxo esperado:

Frontend

↓

REST API

↓

JSON

↓

React

---

## Server-Sent Events (SSE)

Utilizado para:

- atualização em tempo real;
- mudanças de odds;
- eventos da partida;
- alterações de status.

Fluxo esperado:

TxLINE

↓

SSE

↓

Frontend

↓

Atualização automática da interface

---

# Authentication Flow

De acordo com a documentação do hackathon, a autenticação segue várias etapas.

Fluxo:

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

REST + SSE

Toda implementação deve respeitar esta sequência.

---

# Wallet

Responsabilidade

- conectar carteira;
- assinar mensagens;
- participar do fluxo de ativação.

A implementação deve permanecer isolada da interface.

---

# Guest JWT

Primeiro token obtido durante a autenticação.

Função:

- autenticação inicial;
- permitir ativação.

---

# API Token

Token utilizado para consumir os serviços da plataforma.

Sempre deve ser obtido através do fluxo oficial.

Nunca utilizar tokens fixos no código.

---

# API Client

Toda comunicação com a TxLINE deverá passar por uma única camada.

Estrutura esperada:

src/services/txline/apiClient.ts

Responsabilidades:

- autenticação;
- headers;
- tratamento de erros;
- configuração do cliente HTTP.

Nenhum componente React deve chamar a API diretamente.

---

# REST Resources

Os seguintes recursos deverão ser integrados.

## Fixtures

Responsabilidade

Partidas disponíveis.

Status

Pendente.

---

## Scores

Responsabilidade

Placar.

Status

Pendente.

---

## Odds

Responsabilidade

Mercados e odds.

Status

Pendente.

---

## Settlement

Responsabilidade

Liquidação.

Status

Pendente.

---

# SSE Resources

Os seguintes eventos deverão atualizar a interface automaticamente.

Exemplos esperados

- início da partida;
- gol;
- cartão;
- atualização das odds;
- encerramento da partida.

Os nomes exatos dos eventos deverão seguir a documentação oficial.

---

# Blockchain

Blockchain utilizada

Solana

Objetivo

Validar informações da plataforma.

Não desenvolver novos smart contracts.

A integração deverá utilizar apenas os recursos disponibilizados pela TxLINE.

---

# Validation

A documentação menciona mecanismos de validação utilizando:

- assinatura criptográfica;
- Merkle Proof;
- validação on-chain.

Esses recursos serão utilizados na Settlement Engine.

---

# Explainable Layer

Após validar os dados, a aplicação deverá gerar uma explicação amigável ao usuário.

Entrada

- hash;
- assinatura;
- prova;
- timestamp.

Saída

Texto compreensível.

---

# Error Handling

Toda chamada deverá tratar:

- erro de autenticação;
- token expirado;
- falha de conexão;
- resposta inválida;
- timeout.

Nunca permitir falhas silenciosas.

---

# Security Rules

Nunca:

- armazenar secrets no repositório;
- hardcodar tokens;
- expor credenciais;
- utilizar endpoints não documentados.

Utilizar variáveis de ambiente sempre que necessário.

---

# Environment Variables

Exemplo esperado

.env

TXLINE_BASE_URL=

TXLINE_API_KEY=

SOLANA_NETWORK=

Os nomes definitivos deverão seguir a documentação oficial.

---

# Integration Order

A integração deverá seguir esta sequência.

1. API Client
2. Authentication
3. Fixtures
4. Scores
5. Odds
6. SSE
7. Settlement
8. Validation
9. Explainable Layer

Nunca alterar essa ordem sem justificativa.

---

# Current Integration Status

| Recurso | Status |
|----------|--------|
| API Client | ⏳ Não iniciado |
| Wallet | ⏳ Não iniciado |
| Authentication | ⏳ Não iniciado |
| Fixtures | ⏳ Não iniciado |
| Scores | ⏳ Não iniciado |
| Odds | ⏳ Não iniciado |
| SSE | ⏳ Não iniciado |
| Settlement | ⏳ Não iniciado |
| Validation | ⏳ Não iniciado |

---

# References

Sempre consultar:

- documentação oficial da TxLINE;
- exemplos oficiais;
- OpenAPI Specification;
- exemplos Devnet.

Não assumir comportamento que não esteja documentado.

# ARQUIVOS DE DOCUMENTAÇÃO

# TxLINE Documentation

## Documentation

- [Quickstart](https://txline.txodds.com/documentation/quickstart): Start here for the current free and paid TxLINE onboarding flows.
- [World Cup Free Tier](https://txline.txodds.com/documentation/worldcup): Free World Cup and International Friendlies access tiers.
- [Subscription Tiers](https://txline.txodds.com/documentation/subscription-tiers): Service levels, delays, and pricing.

## Odds

- [Odds Overview](https://txline.txodds.com/documentation/odds/overview): StablePrice odds overview.
- [StablePrice Feed](https://txline.txodds.com/documentation/odds/odds-coverage): Covered odds competitions and soccer league download.

## Scores

- [Scores Overview](https://txline.txodds.com/documentation/scores/overview): Scores feed overview.
- [Schedule](https://txline.txodds.com/documentation/scores/schedule): Confirmed fixtures currently listed for TxLINE match data coverage.
- [Soccer Feed](https://txline.txodds.com/documentation/scores/soccer-feed): Soccer score encodings and feed docs.
- [American Football Feed](https://txline.txodds.com/documentation/scores/football-feed): American football score encodings and feed docs.
- [Basketball Feed](https://txline.txodds.com/documentation/scores/basketball-feed): Basketball score encodings and feed docs.

## Solana Programs

- [Program Addresses](https://txline.txodds.com/documentation/programs/addresses): Current mainnet/devnet addresses and public validation account derivation.
- [Program Reference (Mainnet)](https://txline.txodds.com/documentation/programs/mainnet): Public mainnet integration values and validation accounts.
- [Program Reference (Devnet)](https://txline.txodds.com/documentation/programs/devnet): Public devnet integration values and validation accounts.

## Examples

- [Fetching Snapshots](https://txline.txodds.com/documentation/examples/fetching-snapshots): Fixtures, odds, and scores snapshot examples.
- [Streaming Data](https://txline.txodds.com/documentation/examples/streaming-data): Server-Sent Events examples for odds and scores.
- [On-Chain Validation](https://txline.txodds.com/documentation/examples/onchain-validation): Fetch proofs and validate data on-chain.
- [Runnable Devnet Examples](https://txline.txodds.com/documentation/examples/devnet-examples): End-to-end devnet scripts for activation, streaming, fixture validation, and validateStatV2.
- [Troubleshooting](https://txline.txodds.com/documentation/examples/troubleshooting): Diagnose activation, streaming, authentication, and validation errors.

## API Reference

- [OpenAPI YAML](https://txline.txodds.com/docs/docs.yaml): Current TxLINE OpenAPI source.