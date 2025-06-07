# Guia de Gerenciamento de Estado, Testes e Arquitetura Desacoplada

Este documento resume como o projeto utiliza **Zustand** para gerenciar estado, **Vitest** com **React Testing Library** para testes e a filosofia de desacoplamento de UI por meio de **hooks** e **serviços**.

## 1. Gerenciamento de Estado com Zustand

### 1.1 Documentação Oficial
- Repositório: <https://github.com/pmndrs/zustand>
- Guia rápido: consulte o README do projeto para criar seu primeiro store.

### 1.2 Melhores Práticas
- **Divisão de Stores**: cada domínio possui seu store, como `agentStore` e `sessionStore`, evitando um estado global gigantesco.
- **Seletores**: extraia apenas o que o componente precisa para reduzir re-renderizações.
- **Ações**: defina funções dentro do `create` para atualizar o estado de forma centralizada.

### 1.3 Exemplo no Projeto
O arquivo `client/src/store/agentStore.ts` define um store com lista de agentes e agente ativo, incluindo ações como `addAgent` e `setActiveAgent` para manipular o estado.

### 1.4 Alternativas
- **Redux Toolkit** – robusto e com ótimas ferramentas de depuração, porém mais verboso.
- **Jotai** – abordagem atômica e simples, mas pode ser limitado em cenários complexos.

## 2. Testes com Vitest e React Testing Library

### 2.1 Vitest
- Configurado em `client/vite.config.ts` dentro da chave `test`.
- `client/src/setupTests.ts` importa `@testing-library/jest-dom` para matchers adicionais.

### 2.2 React Testing Library
- A filosofia é testar o comportamento visível para o usuário.
- Use seletores acessíveis (`getByRole`, `getByLabelText`) antes de recorrer a `getByTestId`.

### 2.3 Exemplo no Projeto
O teste `client/src/components/agents/AgentList.test.tsx` mostra como mockar o store do Zustand e verificar a renderização de agentes com `screen.getByText()`.

## 3. Arquitetura de Desacoplamento

### 3.1 Camada de Serviços
`client/src/api/agentService.ts` exemplifica a separação das chamadas de API. Nenhum componente de UI faz requisições diretamente.

### 3.2 Hooks Personalizados
Hooks como `client/src/hooks/useTheme.ts` encapsulam lógica reutilizável e servem de ponte entre serviços ou stores e os componentes.

A UI concentra-se apenas em renderizar e delega efeitos colaterais e comunicação de dados aos hooks e serviços.
