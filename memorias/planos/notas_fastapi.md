# Notas Rápidas: FastAPI

## Estruturando Aplicações Maiores (`APIRouter`)
- **Organização:** Dividir em módulos/subpacotes (`__init__.py`).
  - `main.py`: Instância principal FastAPI.
  - `routers/`: Subpacote para agrupar `APIRouter`s por funcionalidade (ex: `users.py`, `items.py`).
- **`APIRouter`**: Agrupa path operations relacionadas.
  - Incluir no `main.py` via `app.include_router(router_instancia)`.
  - **Customização na Inclusão:** `prefix`, `tags`, `dependencies`, `responses` podem ser definidos ao incluir o router, permitindo reuso.

## Modelos Pydantic Aninhados
- **Tipos Aninhados:** Atributos de modelos Pydantic podem ser outros modelos Pydantic, permitindo estruturas JSON complexas e validação em múltiplos níveis.
  - Ex: `Offer` contém `list[Item]`, `Item` contém `Image`.
- **Listas e Conjuntos (`set`):**
  - `list[SubModel]` para listas de submodelos.
  - `set[str]` para campos com itens únicos (ex: tags). Pydantic converte duplicatas para sets.
- **Benefícios:** Suporte de editor, conversão de dados, validação robusta, documentação automática detalhada.

## Autenticação JWT com Supabase
- **Cliente Supabase:** Use `supabase-py` para `sign_up`, `sign_in_with_password`, etc.
- **Segredo JWT:** `SUPABASE_JWT_SECRET` (das configurações do projeto Supabase) é essencial para validar tokens no backend.
- **Proteger Rotas:**
  - Crie uma classe `JWTBearer(HTTPBearer)`.
  - No `__call__`, extraia o token do header `Authorization: Bearer <token>`.
  - Valide o token usando `jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"], audience="authenticated")`.
  - Use `Depends(JWTBearer())` nas rotas protegidas.
- **Payload do Token:** O `sub` (subject) no payload do JWT é o `user_id` do Supabase.
- **Vinculação Local (Opcional):** Armazene o `user_id` do Supabase em sua tabela de usuários local para ligar os sistemas.
- **Bibliotecas:** `fastapi`, `supabase-py`, `python-jose` ou `pyjwt`.
- **Boas Práticas:** HTTPS, manuseio de refresh tokens, validação de `exp`, `aud`, `iss`.

## Referências
- Bigger Applications: [https://fastapi.tiangolo.com/tutorial/bigger-applications/](https://fastapi.tiangolo.com/tutorial/bigger-applications/)
- Nested Models: [https://fastapi.tiangolo.com/tutorial/body-nested-models/](https://fastapi.tiangolo.com/tutorial/body-nested-models/)
- Supabase Auth Docs (JWTs): [https://supabase.com/docs/guides/auth/jwts](https://supabase.com/docs/guides/auth/jwts)
- Artigo DEV.to: [https://dev.to/j0/integrating-fastapi-with-supabase-auth-780](https://dev.to/j0/integrating-fastapi-with-supabase-auth-780)
- Artigo Medium (Phil Harper): [https://phillyharper.medium.com/implementing-supabase-auth-in-fastapi-63d9d8272c7b](https://phillyharper.medium.com/implementing-supabase-auth-in-fastapi-63d9d8272c7b)