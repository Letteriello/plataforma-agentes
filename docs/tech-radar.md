# Tech Radar da Plataforma de Agentes

Este documento define o Tech Radar para o projeto da Plataforma de Agentes. Ele serve como um guia para as tecnologias, ferramentas, linguagens e práticas que utilizamos ou consideramos para o desenvolvimento do projeto. O objetivo é alinhar as decisões tecnológicas e promover a adoção de boas práticas.

## Como Usar Este Radar

O radar é dividido em quatro anéis:

*   **Adotar (Adopt):** Tecnologias e práticas que são bem estabelecidas, comprovadas e recomendadas para uso em produção neste projeto. São a nossa escolha padrão para os problemas que solucionam.
*   **Testar (Trial):** Tecnologias e práticas que acreditamos terem potencial e que estamos ativamente experimentando em projetos piloto ou em contextos de baixo risco. O objetivo é validar sua adequação antes de uma adoção mais ampla.
*   **Avaliar (Assess):** Tecnologias e práticas que são promissoras e que merecem ser exploradas para uso futuro. Provas de conceito, estudos ou experimentos focados podem ser apropriados para entender melhor seus benefícios e desafios.
*   **Evitar (Hold/Deprecate):** Tecnologias e práticas que não são mais recomendadas para novos desenvolvimentos, ou que estão sendo ativamente substituídas. Podem ainda existir em partes legadas do sistema, mas o objetivo é reduzir seu uso.

---

## Adotar (Adopt)

Tecnologias e práticas que são bem-estabelecidas e recomendadas para uso neste projeto.

*   **TypeScript:** Para tipagem estática e melhoria da qualidade do código no frontend e backend (se aplicável).
*   **React (com Vite):** Para a construção da interface de usuário (client-side).
*   **Zustand:** Para gerenciamento de estado global no cliente.
*   **TailwindCSS:** Para estilização CSS utility-first.
*   **shadcn/ui:** Para a biblioteca de componentes UI, construída sobre TailwindCSS e Radix UI.
*   **Vite:** Para tooling de frontend (servidor de desenvolvimento, build).
*   **Storybook:** Para desenvolvimento, documentação e visualização de componentes UI.
*   **Vitest:** Para testes unitários e de integração no cliente.
*   **Playwright:** Para testes end-to-end.
*   **Node.js (com Express.js/Fastify - a ser especificado):** Para a API do backend. (Assumindo backend em Node.js; especificar framework quando definido).
*   **ESLint & Prettier:** Para linting e formatação de código.
*   **MermaidJS:** Para incorporar diagramas (como DFDs, fluxos) na documentação Markdown.
*   **Conventional Commits:** Para padronização das mensagens de commit.
*   **Husky & lint-staged:** Para automatizar verificações de qualidade (lint, formatação) antes dos commits.
*   **GitHub Actions:** Para Integração Contínua (CI) e implantação (CD - a ser configurado).
*   **ADRs (Architecture Decision Records):** Para documentar decisões arquiteturais importantes.
*   **RFCs (Request for Comments):** Para propor e discutir mudanças significativas.
*   **Zod:** Para validação de schemas e tipos de dados.

## Testar (Trial)

Tecnologias e práticas que acreditamos terem potencial e que estamos ativamente experimentando.

*   **(Nenhum item atualmente em teste formal)**
    *   *Exemplo: Poderíamos estar testando um novo framework backend aqui, ou uma biblioteca específica para uma nova funcionalidade complexa.*

## Avaliar (Assess)

Tecnologias e práticas que são promissoras e que merecem ser exploradas para uso futuro.

*   **tRPC ou GraphQL:** Para comunicação entre frontend e backend, como alternativas ao REST tradicional, visando melhorar a type safety e a eficiência das queries.
*   **Server Components (React):** Para explorar a renderização de componentes no servidor e reduzir o JavaScript enviado ao cliente, melhorando a performance.
*   **Ferramentas de Monitoramento e Observabilidade (e.g., Sentry, Datadog):** Para coletar métricas, rastrear erros e entender o comportamento da aplicação em produção.
*   **Microsserviços para Módulos Específicos:** Avaliar se partes do sistema (e.g., processamento de documentos para Knowledge Base) se beneficiariam de serem extraídas para microsserviços independentes.

## Evitar (Hold/Deprecate)

Tecnologias e práticas que não são mais recomendadas para novos desenvolvimentos neste projeto, ou que estão sendo ativamente substituídas.

*   **Uso excessivo de `any` em TypeScript:** Priorizar a criação de tipos específicos para melhorar a segurança e manutenibilidade do código.
*   **Gerenciamento de estado manual complexo com Context API:** Para estados globais ou complexos, preferir Zustand. Context API ainda é útil para estados locais e específicos de subárvores de componentes.
*   **(Nenhum item formalmente em "Hold" no início do projeto, mas será atualizado conforme necessário)**

---

## Atualizações do Tech Radar

Este Tech Radar é um documento vivo e deve ser revisado e atualizado periodicamente pela equipe (e.g., trimestralmente ou semestralmente) para refletir nosso aprendizado, a evolução do ecossistema tecnológico e as necessidades do projeto.
