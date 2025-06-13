# Plano da Etapa 4: Design da Arquitetura (Operações em Arquivos)

## Objetivo Principal
Definir e documentar a arquitetura de alto nível da plataforma ai.da, incluindo a estrutura de diretórios e arquivos para os componentes de backend (FastAPI) e frontend (React), e os principais modelos de dados. Esta etapa foca em traduzir os requisitos e a pesquisa técnica em um esqueleto de projeto tangível.

## Ferramentas Principais
- `desktop-commander` (para listar, criar, editar arquivos e diretórios)
- `memory` (para registrar decisões de arquitetura)

## Tarefas Detalhadas

### Tarefa 4.1: Revisão e Preparação
- **Descrição:** Revisar os artefatos das etapas anteriores (requisitos, stack tecnológica, notas de pesquisa) e o `workflow_master.md` para garantir alinhamento.
- **Entregáveis:** Confirmação de que toda a informação necessária está disponível.
- **Ferramentas:** `desktop-commander` (para ler arquivos de memória).

### Tarefa 4.2: Design da Estrutura de Diretórios (Backend e Frontend)
- **Descrição:** Definir e criar a estrutura de diretórios raiz para o backend (FastAPI) e frontend (React).
  - Exemplo Backend: `app/`, `app/routers/`, `app/models/`, `app/services/`, `app/core/` (config, db), `tests/`.
  - Exemplo Frontend: `src/`, `src/components/`, `src/pages/`, `src/services/`, `src/hooks/`, `src/store/`, `src/assets/`.
- **Entregáveis:** Estruturas de diretórios criadas no sistema de arquivos.
- **Ferramentas:** `desktop-commander` (`create_directory`).

### Tarefa 4.3: Esqueleto dos Arquivos Principais (Backend)
- **Descrição:** Criar os arquivos Python iniciais para o backend FastAPI, incluindo `main.py`, arquivos de `APIRouter` básicos (ex: `agents_router.py`, `tools_router.py`), e arquivos para modelos Pydantic iniciais (`schemas.py` ou `models.py`).
- **Entregáveis:** Arquivos `.py` vazios ou com estrutura mínima criados.
- **Ferramentas:** `desktop-commander` (`write_to_file`).

### Tarefa 4.4: Esqueleto dos Arquivos Principais (Frontend)
- **Descrição:** Criar os arquivos TypeScript/TSX iniciais para o frontend React, incluindo `App.tsx`, `main.tsx`, e arquivos de componentes/páginas básicos (ex: `AgentListPage.tsx`, `CreateAgentPage.tsx`).
- **Entregáveis:** Arquivos `.tsx` / `.ts` vazios ou com estrutura mínima criados.
- **Ferramentas:** `desktop-commander` (`write_to_file`).

### Tarefa 4.5: Definição dos Modelos de Dados Iniciais (Pydantic/Zod)
- **Descrição:** Esboçar as definições dos modelos Pydantic (backend) e Zod (frontend, se aplicável para validação client-side ou consistência) para as entidades centrais: Agente, Ferramenta, Usuário. Considerar os campos principais e relacionamentos iniciais.
- **Entregáveis:** Definições de modelos adicionadas aos arquivos relevantes (ex: `app/models/schemas.py` no backend).
- **Ferramentas:** `desktop-commander` (`edit_block` ou `write_to_file` se for novo).

### Tarefa 4.6: Documentação da Arquitetura Inicial
- **Descrição:** Documentar as decisões de design da arquitetura, a estrutura de diretórios e os modelos de dados iniciais no arquivo `memorias/nucleo/arquiteturaDesign.md`.
- **Entregáveis:** Seção atualizada ou criada em `arquiteturaDesign.md`.
- **Ferramentas:** `desktop-commander` (`edit_block` ou `write_to_file`).
- **Memória:** `create_memory` para registrar as decisões chave.

### Tarefa 4.7: Registro e Validação
- **Descrição:** Registrar a conclusão da Etapa 4 no `registro_tarefas`, atualizar `progresso.md` e `contextoAtivo.md`. Validar se o esqueleto do projeto está consistente com os planos.
- **Entregáveis:** Arquivos de log e progresso atualizados.
- **Ferramentas:** `desktop-commander` (`write_to_file`).