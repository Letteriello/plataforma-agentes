/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // Outras variáveis de ambiente podem ser adicionadas aqui
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

