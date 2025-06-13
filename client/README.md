# Cliente da Plataforma de Agentes

Este diretório contém o frontend em React e TypeScript. A arquitetura completa é descrita em [../ARCHITECTURE.md](../ARCHITECTURE.md) e na pasta `docs`.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

1. Navegue até `client/` e execute `npm install` para instalar as dependências.
2. Copie `.env.example` para um novo arquivo `.env` (ou `.env.development` se preferir).
3. Preencha as seguintes variáveis de ambiente no seu arquivo `.env`:

   - `VITE_API_BASE_URL`: A URL base do seu backend FastAPI (ex: `http://localhost:8000`).
   - `VITE_SUPABASE_URL`: A URL do seu projeto Supabase.
   - `VITE_SUPABASE_ANON_KEY`: A chave anônima (public) do seu projeto Supabase.

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

## Implantação

1.  **Gerar o Build de Produção:**
    Execute o comando abaixo para gerar os arquivos estáticos otimizados no diretório `dist/`:
    ```sh
    npm run build
    ```

2.  **Servir os Arquivos Estáticos:**
    Após o build, o conteúdo da pasta `dist/` pode ser servido por qualquer servidor web estático (como Nginx, Apache, Vercel, Netlify, etc.).

    Para um teste rápido local, você pode usar o comando `preview`:
    ```sh
    npm run preview
    ```

3.  **Configuração do Servidor (Importante):**
    Como esta é uma Single-Page Application (SPA) que utiliza o React Router, seu servidor precisa ser configurado para redirecionar todas as solicitações de navegação para o arquivo `index.html`. Isso permite que o React Router gerencie as rotas no lado do cliente.

    -   **Exemplo para Nginx:**
        ```nginx
        location / {
          try_files $uri $uri/ /index.html;
        }
        ```
