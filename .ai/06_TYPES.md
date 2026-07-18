# 06_TYPES.md

# Domain Model

## Purpose

Este documento descreve todas as entidades do domínio do projeto.

Não contém código TypeScript.

O objetivo é documentar os conceitos do sistema para desenvolvedores e agentes de IA.

As interfaces reais deverão ser implementadas em:

src/types/

---

# Domain Overview

O projeto trabalha com os seguintes conceitos:

User

↓

Wallet

↓

Match

↓

Market

↓

Odds

↓

Settlement

↓

Proof

↓

Validation

↓

Receipt

---

# Match

Representa uma partida esportiva.

Exemplos:

- Brasil x Argentina
- França x Espanha

Responsabilidades

- identificar a partida
- armazenar horário
- armazenar status
- armazenar equipes

Relacionamentos

Match

↓

possui

↓

Markets

↓

Scores

↓

Events

---

# Team

Representa uma equipe participante.

Exemplos

Brasil

Argentina

Alemanha

Campos esperados

- identificador
- nome
- abreviação
- escudo (opcional)

---

# Fixture

Representa o agendamento da partida.

Contém informações antes do início do jogo.

Exemplos

- data
- horário
- estádio
- campeonato

---

# Match Event

Representa um evento ocorrido durante a partida.

Exemplos

- gol
- cartão amarelo
- cartão vermelho
- substituição
- intervalo
- encerramento

Esses eventos deverão ser atualizados via SSE.

---

# Score

Representa o placar da partida.

Exemplos

2 x 1

1 x 1

0 x 0

O placar pode ser atualizado diversas vezes.

---

# Market

Representa um mercado disponível para previsão.

Exemplos

- vencedor
- total de gols
- ambas marcam
- primeiro gol

Cada Match pode possuir vários Markets.

---

# Odds

Representa as odds associadas a um Market.

Características

- mudam ao longo do jogo;
- são atualizadas via SSE.

---

# Settlement

Representa a liquidação de um mercado.

Exemplo

Mercado:

Brasil vence

Resultado:

Liquidado

Responsabilidades

- armazenar resultado;
- armazenar status;
- armazenar informações de validação.

---

# Validation

Representa o resultado da validação fornecida pela TxLINE.

Pode indicar:

- válido;
- inválido;
- pendente.

---

# Proof

Representa a prova criptográfica utilizada na validação.

Pode conter:

- hash
- Merkle Proof
- assinatura
- timestamp

A estrutura exata deverá seguir a documentação oficial.

---

# Signature

Representa a assinatura criptográfica utilizada pela plataforma.

Nunca deverá ser modificada pela aplicação.

Apenas exibida e validada.

---

# Receipt

Representa o comprovante final da liquidação.

Pode conter

- partida
- mercado
- resultado
- timestamp
- assinatura
- prova
- status da validação

---

# Wallet

Representa a carteira Solana do usuário.

Responsabilidades

- conectar
- desconectar
- assinar mensagens

A implementação deve permanecer isolada da interface.

---

# Authentication

Representa o estado de autenticação.

Fluxo esperado

Wallet

↓

Guest JWT

↓

Activation

↓

API Token

↓

Authenticated

---

# Stream Event

Representa qualquer evento recebido via Server-Sent Events.

Exemplos

- Goal
- Card
- Match Started
- Match Finished
- Odds Updated

Todos os eventos devem ser processados pela camada de Services.

---

# Explainable Result

Representa a explicação amigável da liquidação.

Entrada

- Validation
- Proof
- Signature

Saída

Texto compreensível para usuários não técnicos.

---

# Entity Relationships

```

Match

├── Team (Home)

├── Team (Away)

├── Fixture

├── Score

├── Market[]

│ └── Odds[]

├── Settlement

│ ├── Validation

│ ├── Proof

│ └── Receipt

└── Stream Events[]

```

---

# Ownership

| Entity | Source |
|---------|--------|
| Match | TxLINE |
| Team | TxLINE |
| Fixture | TxLINE |
| Score | TxLINE |
| Market | TxLINE |
| Odds | TxLINE |
| Settlement | TxLINE |
| Validation | TxLINE |
| Proof | TxLINE |
| Wallet | Solana |
| Receipt | Frontend |

---

# Type Organization

As interfaces deverão ser organizadas em:

```

src/types/

match.ts

team.ts

fixture.ts

score.ts

market.ts

odds.ts

settlement.ts

validation.ts

proof.ts

wallet.ts

receipt.ts

stream.ts

auth.ts

```

Cada arquivo deve possuir apenas uma responsabilidade.

---

# Design Rules

As interfaces TypeScript deverão:

- representar apenas um conceito;
- evitar propriedades desnecessárias;
- utilizar nomes claros;
- evitar duplicação.

---

# Future Expansion

Caso novos recursos sejam adicionados pela TxLINE, criar novas entidades em vez de sobrecarregar entidades existentes.

Evitar objetos excessivamente grandes.

---

# AI Guidelines

Antes de criar qualquer interface:

1. verificar se a entidade já existe;
2. reutilizar tipos existentes;
3. evitar duplicação;
4. manter um arquivo por entidade.

Nunca criar interfaces gigantes contendo múltiplos conceitos.

---

# Final Rule

Este documento descreve o domínio do sistema.

A implementação TypeScript deve refletir estes conceitos, mas não precisa reproduzir exatamente esta estrutura caso a documentação oficial da TxLINE exija adaptações.