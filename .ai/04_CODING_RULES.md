# 04_CODING_RULES.md

# Coding Rules

## Purpose

Este documento define as regras obrigatórias para qualquer alteração de código neste projeto.

Todos os desenvolvedores e agentes de IA devem seguir estas regras.

Caso exista conflito entre preferência pessoal e estas regras, prevalecem as regras deste documento.

---

# General Principles

Sempre priorizar:

- simplicidade;
- legibilidade;
- previsibilidade;
- reutilização;
- estabilidade.

O objetivo é entregar um MVP robusto para o hackathon.

Não buscamos criar uma arquitetura excessivamente sofisticada.

---

# Before Writing Code

Antes de modificar qualquer arquivo, o agente deve:

1. compreender a tarefa;
2. identificar a camada correta;
3. localizar arquivos relacionados;
4. explicar o plano de implementação;
5. somente então escrever código.

---

# One Task at a Time

Implementar apenas uma funcionalidade por vez.

Nunca:

- corrigir bugs não relacionados;
- reorganizar arquitetura;
- realizar refatorações amplas;
- adicionar funcionalidades extras.

---

# Architecture

Respeitar obrigatoriamente a arquitetura definida em:

.ai/01_ARCHITECTURE.md

Não criar novas camadas sem necessidade.

Não mover arquivos apenas por preferência.

---

# TypeScript

Obrigatório:

- strict typing;
- interfaces reutilizáveis;
- tipos bem definidos.

Evitar:

- any;
- unknown desnecessário;
- type assertions sem justificativa.

Sempre preferir tipagem explícita.

---

# Components

Componentes devem:

- renderizar interface;
- receber props;
- permanecer pequenos.

Nunca:

- chamar APIs;
- abrir conexões SSE;
- implementar regras de negócio.

---

# Hooks

Hooks devem:

- consumir services;
- organizar estados;
- encapsular lógica React.

Nunca:

- renderizar JSX;
- acessar diretamente a interface.

---

# Services

Toda comunicação externa deve ocorrer exclusivamente através de:

src/services/

Nunca utilizar:

- fetch;
- axios;
- EventSource;

diretamente em componentes ou páginas.

---

# Code Reuse

Antes de criar qualquer função:

Verificar se já existe implementação semelhante.

Evitar duplicação.

Preferir reutilização.

---

# File Modifications

Alterar apenas os arquivos necessários.

Evitar modificar arquivos sem relação com a tarefa.

Se mais de cinco arquivos precisarem ser alterados, justificar tecnicamente.

---

# Comments

Comentários somente quando agregarem valor.

Evitar comentar código óbvio.

Priorizar nomes claros para funções e variáveis.

---

# Naming

Utilizar nomes descritivos.

Evitar:

data

item

obj

temp

value

Sempre utilizar nomes relacionados ao domínio do projeto.

Exemplos:

fixture

settlement

validation

market

odds

proof

signature

---

# Error Handling

Toda chamada externa deve tratar:

- loading;
- sucesso;
- erro;
- timeout.

Nunca ignorar erros.

Nunca utilizar catch vazio.

---

# Async Code

Sempre utilizar:

async / await

Evitar:

.then()

quando possível.

---

# Imports

Organizar imports.

Remover imports não utilizados.

Evitar dependências desnecessárias.

---

# Refactoring

Refatorações somente quando:

- fizerem parte da tarefa;
- corrigirem problema real;
- reduzirem complexidade.

Nunca refatorar apenas por preferência.

---

# Performance

Evitar:

- renderizações desnecessárias;
- loops repetitivos;
- chamadas duplicadas para API;
- processamento pesado em componentes.

Otimizar somente quando necessário.

Não realizar otimizações prematuras.

---

# Git

Cada alteração deve representar uma única responsabilidade.

Evitar commits muito grandes.

Alterações devem ser facilmente revisáveis.

---

# Security

Nunca:

- armazenar tokens no código;
- hardcodar credenciais;
- expor secrets;
- registrar informações sensíveis em logs.

Sempre utilizar variáveis de ambiente quando aplicável.

---

# AI Restrictions

O agente NÃO deve:

- alterar layout sem solicitação;
- trocar bibliotecas;
- reorganizar pastas;
- renomear arquivos sem necessidade;
- criar abstrações excessivas;
- adicionar dependências sem justificativa.

---

# AI Workflow

Toda tarefa deve seguir esta sequência.

1. Compreender o problema.

2. Explicar a solução.

3. Listar arquivos que serão alterados.

4. Implementar.

5. Validar.

6. Gerar resumo técnico.

7. Encerrar a tarefa.

Nunca continuar automaticamente para outra funcionalidade.

---

# Code Review Checklist

Antes de concluir qualquer tarefa, verificar:

- Build funcionando.
- Sem erros TypeScript.
- Sem erros ESLint.
- Imports corretos.
- Tipagem consistente.
- Nenhum código morto.
- Nenhuma duplicação.
- Nenhum arquivo alterado desnecessariamente.

---

# Definition of Done

Uma tarefa somente será considerada concluída quando:

- resolver o problema proposto;
- preservar a arquitetura;
- não quebrar funcionalidades existentes;
- manter o projeto compilando;
- passar pela revisão de código.

---


# Decision Policy

Quando existir mais de uma forma de implementar uma solução, seguir esta ordem de prioridade:

1. Preservar a arquitetura existente.
2. Reutilizar código já existente.
3. Fazer a menor alteração possível.
4. Evitar novas dependências.
5. Priorizar legibilidade em vez de "código inteligente".
6. Priorizar estabilidade em vez de otimização.
7. Em caso de dúvida, parar e solicitar orientação em vez de assumir uma decisão.

# Scope Limitation

Cada execução do agente deve concluir apenas uma tarefa do backlog.

O agente nunca deve:

- implementar múltiplas fases em uma única execução;
- alterar arquivos fora do escopo da tarefa;
- iniciar uma nova funcionalidade automaticamente após concluir a atual.

Ao final de cada tarefa, o agente deve interromper a execução e aguardar novas instruções.

# Final Rule

Durante este hackathon, a prioridade é entregar um MVP funcional.

Sempre priorizar:

1. Código correto.
2. Código simples.
3. Código legível.
4. Código fácil de manter.

Evitar soluções excessivamente complexas apenas por elegância técnica.