# 00_PROJECT_CONTEXT.md

# ProofLens

## Project Overview

ProofLens é uma plataforma de Prediction Markets construída para o **TxLINE World Cup Hackathon**.

O objetivo do projeto é demonstrar como mercados de previsão esportiva podem ser transparentes, verificáveis e fáceis de entender utilizando os recursos da plataforma TxLINE.

O principal diferencial NÃO é criar mais uma plataforma de apostas.

O objetivo é construir uma experiência onde qualquer usuário possa verificar como um resultado foi liquidado utilizando provas criptográficas (Merkle Proof), validação on-chain na Solana e uma explicação em linguagem natural.

---

# Hackathon

Evento:

TxLINE World Cup Hackathon

Tema:

Prediction Markets + Sports Data + Solana + AI

Objetivo da equipe:

Construir um MVP funcional utilizando a API oficial da TxLINE.

---

# Product Vision

O projeto deverá permitir que um usuário:

- visualizar partidas esportivas;
- visualizar mercados disponíveis;
- acompanhar partidas em tempo real;
- receber atualização automática dos eventos da partida;
- visualizar a liquidação de um mercado;
- verificar a autenticidade da liquidação;
- compreender o resultado através de uma explicação simples.

---

# Main Features

## Dashboard

Lista de partidas.

Mercados ativos.

Odds.

Eventos em tempo real.

---

## Live Match

Mostrar:

- placar
- tempo
- eventos
- estatísticas

Atualização através de Server-Sent Events (SSE).

---

## Featured Markets

Mercados em destaque.

Odds.

Status.

---

## Settlement Engine

Responsável por:

- exibir liquidação;
- exibir Merkle Proof;
- exibir assinatura;
- exibir timestamp;
- validar informações.

---

## Explainable Settlement

Transformar informações técnicas em uma explicação compreensível para qualquer usuário.

Exemplo:

Ao invés de mostrar apenas:

- Hash
- Signature
- Merkle Proof

Mostrar:

"O resultado foi confirmado utilizando uma assinatura criptográfica registrada na blockchain Solana."

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- Shadcn/UI

Realtime

- Server-Sent Events (SSE)

Blockchain

- Solana

API

- TxLINE

Version Control

- Git

---

# Current Status

O projeto já possui:

- interface pronta;
- componentes React;
- páginas principais;
- layout completo;
- dados mockados.

Ainda não possui:

- integração completa com a API TxLINE;
- autenticação;
- SSE;
- validação on-chain;
- liquidação automática.

---

# Current Goal

Substituir todos os dados mockados pelos dados reais da TxLINE.

Implementar o menor MVP possível, porém completamente funcional.

---

# MVP Scope

O MVP deverá possuir obrigatoriamente:

- Dashboard funcional
- Dados reais da TxLINE
- Odds
- Partidas
- Atualização em tempo real
- Liquidação
- Recibo verificável
- Explainable Settlement

Qualquer funcionalidade adicional somente deverá ser implementada após o MVP estar concluído.

---

# Development Philosophy

Este projeto segue uma arquitetura simples.

Prioridades:

1. Funcionar.
2. Código limpo.
3. Boa organização.
4. Facilidade de manutenção.

Não buscamos criar uma arquitetura excessivamente complexa.

O objetivo é entregar um MVP robusto durante o hackathon.

---

# AI Development Guidelines

O agente de IA atua como desenvolvedor do projeto.

Antes de modificar qualquer código:

1. compreender completamente a arquitetura;
2. compreender os documentos da pasta `.ai`;
3. explicar o plano de implementação;
4. implementar apenas uma etapa por vez.

Nunca implementar múltiplas funcionalidades simultaneamente.

---

# Non Goals

Este projeto NÃO pretende:

- criar uma plataforma completa de apostas;
- substituir a infraestrutura da TxLINE;
- criar novos protocolos blockchain;
- desenvolver smart contracts próprios.

O foco está na integração com a infraestrutura existente da TxLINE.

---

# Constraints

Não alterar:

- layout existente;
- componentes de UI sem necessidade;
- arquitetura principal;
- bibliotecas principais.

Não remover funcionalidades existentes.

Sempre reutilizar componentes já existentes.

---

# Code Quality Expectations

Todo código deve:

- utilizar TypeScript;
- ser fortemente tipado;
- ser reutilizável;
- seguir boas práticas React;
- evitar duplicação;
- ser documentado quando necessário.

---

# Success Criteria

O projeto será considerado bem-sucedido quando:

- consumir dados reais da TxLINE;
- atualizar informações em tempo real via SSE;
- demonstrar a liquidação verificável;
- apresentar uma interface intuitiva;
- estar estável para demonstração no hackathon.

---

# Priority Order

A implementação deverá seguir exatamente esta ordem:

1. Arquitetura
2. Integração REST
3. Atualização em tempo real (SSE)
4. Settlement Engine
5. Explainable Settlement
6. Refinamentos
7. Deploy

Nunca alterar essa ordem sem justificativa técnica.

---

# Final Instruction

Considere este documento como a fonte oficial do projeto.

Caso exista conflito entre este documento e qualquer decisão tomada durante a implementação, este documento deve prevalecer até que a equipe decida atualizá-lo.

# Assumed Knowledge

O agente deve assumir que:

- a documentação oficial da TxLINE é a principal referência técnica;
- a arquitetura existente deve ser preservada sempre que possível;
- o projeto utiliza dados mockados apenas como placeholder;
- toda integração deve substituir os mocks sem alterar o comportamento visual da aplicação;
- o objetivo do hackathon é demonstrar uma solução funcional, não implementar todas as funcionalidades possíveis.