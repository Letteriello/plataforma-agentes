# Plataforma de Agentes

Este reposit\u00f3rio cont\u00e9m a implementa\u00e7\u00e3o da interface web da plataforma de agentes. A arquitetura completa est\u00e1 documentada em [ARCHITECTURE.md](ARCHITECTURE.md) e nos arquivos em `docs/docs/ai`.

## Estrutura

O frontend encontra-se em `client/` e segue a estrutura recomendada nos documentos:

```
client/src/
|-- api/            # Servi\u00e7os de comunica\u00e7\u00e3o com a API
|-- assets/
|-- components/
|   |-- features/
|   |-- layouts/
|   \-- ui/
|-- data/
|-- hooks/
|-- lib/
|-- pages/
|-- routes/
|-- store/
\-- types/
```

Os servi\u00e7os que antes estavam em `src/services/` foram movidos para `src/api/`, alinhando a nomenclatura com a documenta\u00e7\u00e3o.

Consulte `ARCHITECTURE.md` para detalhes sobre as camadas e boas pr\u00e1ticas.

## Ambiente

Crie arquivos `.env.development`, `.env.staging` e `.env.production` em `client/` para definir a URL da API conforme o ambiente. Exemplo:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

A aplicação lê `import.meta.env.VITE_API_BASE_URL` do Vite para se conectar ao backend adequado.
