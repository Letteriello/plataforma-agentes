---
name: Pull Request
about: Crie um pull request para enviar suas alterações para o projeto.
title: 'feat: Adiciona nova funcionalidade X'
labels: 'enhancement'
---

## 📝 Descrição

Descreva de forma clara e concisa as alterações que você está propondo. Explique o "porquê" por trás da mudança, não apenas o "o quê".

**Issue relacionada:** [Link para a issue #ID](https://github.com/seu-usuario/seu-repositorio/issues/ID)

---

## ✅ Checklist de Autoavaliação

Antes de solicitar a revisão, certifique-se de que seu PR atende aos seguintes critérios. Marque as caixas que se aplicam.

- [ ] **Código Limpo e Legível:** Meu código segue as diretrizes de estilo do projeto.
- [ ] **Comentários:** Adicionei comentários, especialmente em áreas de difícil compreensão.
- [ ] **Documentação:** A documentação relevante foi atualizada (ex: README, documentação de componentes).
- [ ] **Testes:**
  - [ ] Novos testes foram adicionados para cobrir minhas alterações.
  - [ ] Todos os testes (novos e existentes) passam localmente (`npm test`).
- [ ] **Storybook:**
  - [ ] As stories dos componentes foram atualizadas ou criadas.
  - [ ] O Storybook foi verificado localmente (`npm run storybook`).
- [ ] **Linting e Formatação:**
  - [ ] O linter não aponta novos problemas (`npm run lint`).
  - [ ] O código foi formatado com o Prettier (`npm run format`).
- [ ] **Responsividade:** As alterações foram testadas em diferentes tamanhos de tela.
- [ ] **Acessibilidade:** As diretrizes de acessibilidade (WCAG) foram consideradas.

---

## 🧪 Como Testar

Forneça instruções passo a passo sobre como os revisores podem testar suas alterações. Inclua quaisquer configurações necessárias.

1.  Faça o checkout do branch: `git checkout <nome-do-branch>`
2.  Instale as dependências: `npm install`
3.  Execute a aplicação: `npm run dev`
4.  Siga os seguintes passos para verificar a funcionalidade:
    - ...
    - ...

---

## 🖼️ Screenshots (se aplicável)

Se suas alterações incluem mudanças na interface do usuário, adicione screenshots ou GIFs para ajudar a visualizar as mudanças.

| Antes | Depois |
| :---: | :----: |
|       |        |

---

## ❗️ Informações Adicionais

Adicione qualquer outro contexto ou informação que possa ser útil para os revisores.
