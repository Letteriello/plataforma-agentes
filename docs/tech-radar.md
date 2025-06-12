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
*   **APIs RESTful:** Para a comunicação padrão entre frontend e backend.
*   **Mecanismos de Personalização de Agentes (Templates e Prompts Reutilizáveis):** Para permitir que os usuários criem, salvem e reutilizem configurações de agentes e prompts, aumentando a eficiência e adaptabilidade.
*   **Monitoramento Básico de Uso de LLMs (e.g., contagem de tokens, logs de interações):** Para fornecer transparência sobre o consumo de recursos e custos associados à execução dos agentes.

## Testar (Trial)

Tecnologias e práticas que acreditamos terem potencial e que estamos ativamente experimentando para validar sua adequação antes de uma adoção mais ampla.

*   **Suporte Multimodal para Agentes (Processamento/Geração de Imagem, Áudio):** Integração de modelos e ferramentas que permitem aos agentes entender e gerar diferentes tipos de mídia, como imagens e áudio, para atender à demanda por interações mais ricas e casos de uso diversificados.
*   **Assistência Preditiva na Configuração de Agentes (Sugestões baseadas em IA):** Desenvolvimento de funcionalidades que utilizam IA para sugerir configurações, ferramentas ou prompts durante a criação e edição de agentes, visando melhorar a experiência do usuário, acelerar o desenvolvimento e reduzir a curva de aprendizado.
*   **Interfaces de "Vibe-coding" (Configuração de Agentes via Linguagem Natural):** Exploração de paradigmas de desenvolvimento onde os usuários podem configurar agentes ou seus comportamentos usando linguagem natural ou prompts de alto nível, tornando a criação de agentes mais intuitiva e acessível, especialmente para usuários menos técnicos.

## Avaliar (Assess)

Tecnologias e práticas que são promissoras e que merecem ser exploradas para uso futuro.

*   **tRPC ou GraphQL:** Para comunicação entre frontend e backend, como alternativas ao REST tradicional, visando melhorar a type safety e a eficiência das queries.
*   **Server Components (React):** Para explorar a renderização de componentes no servidor e reduzir o JavaScript enviado ao cliente, melhorando a performance.
*   **Ferramentas Avançadas de Monitoramento e Observabilidade (e.g., Sentry, Datadog, OpenTelemetry):** Para coletar métricas detalhadas de custo (uso de tokens), latência, e outros indicadores de desempenho dos LLMs, além de rastrear erros complexos e entender o comportamento da aplicação e dos agentes em produção.
*   **Microsserviços para Módulos Específicos:** Avaliar se partes do sistema (e.g., processamento de documentos para Knowledge Base, execução de ferramentas complexas) se beneficiariam de serem extraídas para microsserviços independentes.
*   **Frameworks para Filtros de Segurança Configuráveis e IA Responsável (e.g., NeMo Guardrails, ferramentas de análise de viés):** Para pesquisar e implementar soluções que permitam aos usuários definir seus próprios níveis de segurança e moderação de conteúdo, além de incorporar práticas de IA ética e mitigar vieses.
*   **Bancos de Dados Vetoriais Dedicados (e.g., Pinecone, Weaviate, Milvus):** Para explorar soluções especializadas que possam oferecer melhor performance, escalabilidade e funcionalidades avançadas para RAG e busca semântica em grandes volumes de dados, complementando o `pgvector`.
*   **Plataformas Avançadas de Orquestração de Agentes (e.g., Autogen, CrewAI):** Para investigar frameworks que permitam a construção de agentes mais complexos, colaborativos, com capacidades de planejamento sofisticadas e múltiplos agentes trabalhando em conjunto, complementando as capacidades do Langchain.

## Evitar (Hold/Deprecate)

Tecnologias e práticas que não são mais recomendadas para novos desenvolvimentos neste projeto, ou que estão sendo ativamente substituídas.

*   **Uso excessivo de `any` em TypeScript:** Priorizar a criação de tipos específicos para melhorar a segurança e manutenibilidade do código.
*   **Gerenciamento de estado manual complexo com Context API:** Para estados globais ou complexos, preferir Zustand. Context API ainda é útil para estados locais e específicos de subárvores de componentes.
*   **(Nenhum item formalmente em "Hold" no início do projeto, mas será atualizado conforme necessário)**

---

## Atualizações do Tech Radar

Este Tech Radar é um documento vivo e deve ser revisado e atualizado periodicamente pela equipe (e.g., trimestralmente ou semestralmente) para refletir nosso aprendizado, a evolução do ecossistema tecnológico e as necessidades do projeto.
