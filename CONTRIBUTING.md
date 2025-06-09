# Guia de Contribuição

Bem-vindo ao projeto! Agradecemos seu interesse em contribuir. Para garantir a qualidade e consistência do código, siga as diretrizes abaixo.

## Configuração do Ambiente
(Esta seção será preenchida posteriormente, conforme item 4.3 do plano geral)

## Convenções de Nomenclatura

Para manter o código organizado e legível, adotamos as seguintes convenções de nomenclatura:

### Geral
- **Arquivos e Diretórios:** Use `kebab-case` para nomes de arquivos e diretórios que não sejam componentes React (ex: `meu-modulo`, `api-client.ts`). Para componentes React e arquivos relacionados diretamente a eles, use `PascalCase` (ex: `MeuComponente.tsx`, `MeuComponente.module.css`).
- **Variáveis e Funções:** Use `camelCase` (ex: `minhaVariavel`, `calcularResultado()`).
- **Constantes:** Use `UPPER_SNAKE_CASE` para constantes globais ou valores que não mudam (ex: `MAX_USERS`, `API_URL`).
- **Classes e Construtores:** Use `PascalCase` (ex: `class MinhaClasse {}`).

### Específico do Projeto (dentro de `client/src/`)

- **Componentes React:**
    - Arquivos: `NomeDoComponente.tsx` (ex: `AgentCard.tsx`, `UserProfile.tsx`)
    - Nomes de Componentes: `PascalCase` (ex: `function AgentCard() {}`)
    - Páginas: `NomeDaPaginaPage.tsx` (ex: `DashboardPage.tsx`, `SettingsPage.tsx`)
    - Layouts: `NomeDoLayoutLayout.tsx` (ex: `MainLayout.tsx`)

- **Hooks:**
    - Arquivos: `useNomeDaFeature.ts` (ex: `useAgentForm.ts`, `useTheme.ts`)
    - Nomes de Hooks: `useNomeDaFeature` (ex: `function useAgentForm() {}`)

- **Serviços/API (Camada de API Client):**
    - Arquivos: `nomeDoRecursoService.ts` (ex: `agentService.ts`, `authenticationService.ts`)
    - Funções de Serviço: `camelCase` (ex: `getAgentById()`, `loginUser()`)

- **Stores (Zustand):**
    - Arquivos: `nomeDaFeatureStore.ts` (ex: `agentStore.ts`, `sessionStore.ts`)
    - Nomes de Stores (variáveis): `useNomeDaFeatureStore` (ex: `const useAgentStore = create(...)`)

- **Tipos TypeScript:**
    - Arquivos: `nomeDaEntidade.ts` ou `nomeDoModulo.types.ts` (ex: `agent.ts`, `chat.types.ts`).
    - Nomes de Interfaces/Tipos: `PascalCase`. Prefixar com `I` é opcional, mas se usado, deve ser consistente (ex: `AgentConfig` ou `IAgentConfig`). O padrão atual é sem `I`.

- **Testes:**
    - Arquivos: `nomeDoArquivo.test.ts` ou `nomeDoArquivo.spec.ts` (o padrão atual é `.test.ts`, ex: `agentService.test.ts`).

- **Diretórios de Features/Módulos:**
    - Use `kebab-case` (ex: `client/src/features/agent-configurator/`) ou `PascalCase` se for um agrupamento de componentes com o mesmo nome (ex: `client/src/components/MeuComponente/`).

## Mensagens de Commit
(Esta seção será preenchida posteriormente, ligada à tarefa 1.3)

## Processo de Pull Request
(Esta seção será preenchida posteriormente)
