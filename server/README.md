# Backend da Plataforma de Agentes

Este diretório contém o backend em FastAPI que serve a API para a plataforma.

## Configuração do Ambiente

1.  **Crie um arquivo `.env`** na raiz deste diretório (`server/`) copiando o `.env.example`.
2.  **Preencha as variáveis de ambiente** no arquivo `.env` com suas credenciais do Supabase e outras configurações:

    ```
    PROJECT_NAME="Plataforma de Agentes"
    API_V1_STR="/api/v1"

    # Configurações do Supabase
    SUPABASE_URL="SUA_URL_SUPABASE"
    SUPABASE_KEY="SUA_CHAVE_SERVICE_ROLE_SUPABASE"
    SUPABASE_JWT_SECRET="SEU_SEGREDO_JWT_SUPABASE"
    ```

## Executando Localmente (Desenvolvimento)

1.  Certifique-se de ter o Python 3.11+ instalado.
2.  Crie e ative um ambiente virtual:
    ```sh
    python -m venv .venv
    source .venv/bin/activate  # No Windows: .venv\Scripts\activate
    ```
3.  Instale as dependências:
    ```sh
    pip install -r requirements.txt
    ```
4.  Inicie o servidor:
    ```sh
    uvicorn main:app --reload
    ```

    A API estará disponível em `http://localhost:8000`.

## Executando com Docker (Produção/Teste)

1.  **Construa a imagem Docker:**
    A partir do diretório `server`, execute:
    ```sh
    docker build -t plataforma-agentes-backend .
    ```

2.  **Execute o contêiner:**
    ```sh
    docker run -d -p 8000:8000 --env-file .env --name plataforma-agentes-backend-container plataforma-agentes-backend
    ```

    A API estará acessível em `http://localhost:8000`.
