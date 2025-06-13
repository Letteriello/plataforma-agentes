# Pilha Tecnológica e Dependências

## 1. Backend (Core)

- **Linguagem:** Python 3.11+
- **Framework Web:** FastAPI (com Pydantic para validação de dados)
- **Banco de Dados Relacional:** PostgreSQL (via Supabase)
- **Banco de Dados Vetorial:** pg_vector (integrado ao Supabase para funcionalidades RAG)
- **Comunicação Assíncrona:** Planejado o uso de um message bus como RabbitMQ ou NATS para comunicação entre agentes.
- **Containerização:** Docker

## 2. Frontend (Shell)

- **Framework:** React 18+ (com Vite como bundler)
- **Linguagem:** TypeScript
- **Gerenciamento de Estado Global:** Zustand (escolhido pela simplicidade, performance e baixo boilerplate)
- **Componentes de UI:** shadcn/ui
- **Estilização:** Tailwind CSS
- **Comunicação com API:** Axios
- **Validação de Schema (Client-side):** Zod

## 3. Inteligência Artificial e LLMs

- **Provedor Principal:** Google Cloud (Vertex AI, Modelos Gemini)
- **Framework de Desenvolvimento de Agentes:** A arquitetura é inspirada e compatível com os conceitos do Google Agent Development Kit (ADK).

## 4. DevOps e Qualidade de Código

- **Testes (Frontend):** Vitest e React Testing Library
- **Testes (Backend):** Pytest
- **Qualidade de Código (Frontend):** ESLint e Prettier
- **Qualidade de Código (Backend):** Black e Ruff
- **CI/CD:** GitHub Actions
- **Infraestrutura como Código (IaC):** Planejado o uso de Terraform ou Pulumi.