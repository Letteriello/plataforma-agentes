---
description: Roadmap de Implementação – Versão 1
---

# Roadmap de Implementação (7 Etapas × 7 Tarefas)

## Etapa 1 – Fundação Backend (CRUD de Agentes)
1. Configurar SQLAlchemy e conexão PostgreSQL
2. Criar modelo `Agent` no ORM
3. Implementar endpoint `POST /agents` (criação)
4. Implementar endpoint `GET /agents` (listagem)
5. Implementar endpoints `PUT` e `DELETE` (update/delete)
6. Implementar autenticação JWT
7. Testes unitários para endpoints de agentes

## Etapa 2 – Vertical Slice Frontend–Backend
1. Atualizar `apiClient` para usar JWT
2. Conectar `agentService.ts` aos endpoints reais
3. Integrar `AgentsDashboard` para listar agentes reais
4. Integrar `AgentEditor` para salvar/atualizar agentes
5. Criar feedback de loading/erro na UI
6. Testes E2E com Playwright (fluxo criação agente)
7. Atualizar documentação do fluxo

## Etapa 3 – Módulo de Ferramentas
1. Modelar `Tool` e `ToolParameter` no ORM
2. Criar endpoints CRUD `/tools`
3. Implementar associação agente→ferramenta
4. Atualizar UI `ToolsPage` para consumo de API
5. Adicionar interface de seleção de ferramentas em `AgentEditor`
6. Testes unitários e E2E para ferramentas
7. Documentar exemplos de uso de ferramentas

## Etapa 4 – Chat & Memória Básica
1. Modelar sessão de chat e mensagens
2. Implementar endpoint `/sessions` (CRUD)
3. Implementar endpoint `/chat/{agent_id}/message`
4. Integrar `ChatPage` ao backend
5. Persistir histórico de mensagens em Supabase
6. Implementar armazenamento básico em memória de conversas
7. Testes de latência e carga do chat

## Etapa 5 – RAG / Base de Conhecimento
1. Configurar `pgvector` no Supabase
2. Criar modelo `KnowledgeBase` e `Document` no ORM
3. Implementar upload e processamento de documentos
4. Gerar embeddings e armazenar vetores
5. Integrar busca por similaridade no chat
6. Interface de gestão de documentos no frontend
7. Testes de relevância e precisão

## Etapa 6 – Observabilidade & ROI Dashboard
1. Instrumentar métricas de uso de tokens/custos
2. Criar endpoints `/metrics` para custos e uso
3. Desenvolver componentes `TokenUsageCard` e `ResourceConsumptionCard`
4. Construir página de Dashboard de ROI
5. Agregar logs de Supabase Advisors
6. Alertas de custo alto via e-mail
7. Documentar guias de análise de ROI

## Etapa 7 – Hardening & Deploy
1. Revisão completa de segurança (RLS, JWT)
2. Auditoria de dependências e vulnerabilidades
3. Configurar CI/CD (GitHub Actions → Cloud Run)
4. Scripts de backup e restore de banco
5. Configurar CDN e caching para frontend
6. Testes de carga end-to-end
7. Lançamento versão v1.0 e anúncio
