# 05_UI_GUIDELINES.md

# UI Guidelines

## Purpose

Este documento define as diretrizes de interface do projeto.

O objetivo é manter uma experiência consistente durante todo o desenvolvimento.

A prioridade NÃO é redesenhar a aplicação.

A prioridade é integrar as funcionalidades da TxLINE preservando a interface existente.

---

# UI Philosophy

A interface já representa um MVP funcional.

Sempre que possível:

- reutilizar componentes existentes;
- preservar layout;
- preservar identidade visual;
- adicionar funcionalidades sem alterar a experiência do usuário.

---

# Design Principles

Toda interface deve seguir os seguintes princípios:

- simplicidade;
- clareza;
- consistência;
- responsividade;
- acessibilidade.

---

# Components

Sempre reutilizar componentes existentes antes de criar novos.

Antes de criar um componente novo, verificar:

- já existe um componente semelhante?
- ele pode ser adaptado?
- ele pode receber novas props?

Evitar componentes duplicados.

---

# Layout

Não alterar:

- estrutura das páginas;
- navegação;
- sidebar;
- header;
- footer;
- grids principais.

Alterações estruturais somente quando aprovadas pela equipe.

---

# Styling

Preservar:

- espaçamentos;
- alinhamentos;
- tipografia;
- cores;
- sombras;
- bordas;
- animações existentes.

Evitar mudanças estéticas sem necessidade.

---

# Shadcn/UI

Caso o projeto utilize Shadcn/UI:

Sempre utilizar os componentes existentes.

Nunca substituir componentes apenas por preferência.

Exemplos:

- Button
- Card
- Badge
- Dialog
- Tooltip
- Table
- Tabs

---

# Icons

Manter a biblioteca de ícones já utilizada.

Não misturar múltiplas bibliotecas de ícones.

---

# Colors

Manter a identidade visual existente.

Nunca alterar:

- paleta principal;
- cores de destaque;
- cores dos botões.

Novas cores somente quando realmente necessárias.

---

# Typography

Não alterar:

- fonte principal;
- escala tipográfica;
- pesos;
- tamanhos globais.

---

# Spacing

Utilizar sempre os espaçamentos já adotados pelo projeto.

Evitar valores arbitrários.

Manter consistência visual.

---

# Responsiveness

Toda nova funcionalidade deve funcionar em:

- Desktop
- Tablet
- Mobile

Nenhuma implementação pode quebrar o layout responsivo existente.

---

# Loading States

Toda chamada para API deve possuir:

- loading;
- erro;
- sucesso.

Nunca deixar áreas vazias enquanto os dados são carregados.

---

# Empty States

Sempre tratar listas vazias.

Exemplo:

Nenhuma partida disponível.

Nenhum mercado encontrado.

Nenhuma liquidação registrada.

---

# Error States

Sempre exibir mensagens amigáveis.

Nunca mostrar erros técnicos diretamente ao usuário.

Exemplo

❌ Evitar

TypeError: Cannot read property...

✅ Preferir

Não foi possível carregar os dados.

---

# Realtime Updates

Atualizações recebidas via SSE devem acontecer sem:

- recarregar página;
- piscar componentes;
- perder scroll;
- quebrar animações.

As atualizações devem parecer naturais.

---

# Animations

Utilizar animações discretas.

Evitar:

- animações excessivas;
- efeitos chamativos;
- transições lentas.

---

# Accessibility

Sempre que possível:

- utilizar elementos semânticos;
- manter contraste adequado;
- utilizar aria-label quando necessário;
- preservar navegação por teclado.

---

# Performance

Evitar:

- renderizações desnecessárias;
- componentes muito grandes;
- re-render completo da página.

---

# AI Rules

Antes de alterar qualquer componente:

1. verificar se o componente já existe;
2. reutilizar antes de criar;
3. preservar aparência;
4. alterar apenas o necessário.

Nunca redesenhar a interface por iniciativa própria.

---

# Do Not Modify

Sem autorização explícita da equipe, NÃO alterar:

- identidade visual;
- design system;
- componentes base;
- estrutura de navegação;
- experiência do usuário.

---

# Preferred Workflow

Sempre seguir esta ordem:

1. integrar dados;
2. testar funcionalidade;
3. ajustar loading;
4. ajustar estados de erro;
5. ajustar estados vazios;
6. revisar responsividade.

A interface deve ser a última preocupação, nunca a primeira.

---

# Definition of Done

Uma funcionalidade de UI somente será considerada concluída quando:

- utiliza componentes existentes;
- mantém consistência visual;
- funciona em telas menores;
- trata loading;
- trata erro;
- trata listas vazias;
- não quebra outras telas.

---


# Protected Components

Os seguintes elementos devem ser considerados protegidos:

- estrutura de navegação;
- layout principal;
- componentes compartilhados;
- tema da aplicação;
- estilos globais.

Caso uma funcionalidade nova exija alterações nesses componentes, o agente deve:

1. justificar tecnicamente a alteração;
2. minimizar o impacto;
3. preservar a compatibilidade com as demais páginas.

# Final Rule

O objetivo deste hackathon é demonstrar a integração com a TxLINE.

A interface já é suficiente para esse objetivo.

Priorizar sempre a funcionalidade em vez de alterações visuais.