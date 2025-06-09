# Cliente da Plataforma de Agentes

Este diretório contém o frontend em React e TypeScript. A arquitetura completa é descrita em [../ARCHITECTURE.md](../ARCHITECTURE.md) e na pasta `docs`.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

1. Navegue até `client/` e execute `npm install` para instalar as dependências.
2. Copie `.env.example` para `.env.development`, `.env.staging` e `.env.production`.
   Ajuste `VITE_API_BASE_URL` conforme a URL do backend.

## Scripts Disponíveis

- `npm run dev` – inicia o servidor de desenvolvimento.
- `npm run build` – gera o build de produção em `dist/`.
- `npm run preview` – visualiza o build já gerado.
- `npm run test` – executa os testes com Vitest.
- `npm run lint` – roda o ESLint.
- `npm run format` – formata o código com Prettier.
- `npm run storybook` – abre o Storybook para visualizar componentes.

## Estrutura de Pastas

```
src/
├── api/
├── assets/
├── components/
│   ├── features/
│   ├── layouts/
│   └── ui/
├── data/
├── hooks/
├── lib/
├── pages/
├── routes/
├── store/
└── types/
```

Para mais detalhes consulte `docs/docs/ai/07_estrutura_do_projeto.md`.
