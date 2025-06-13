# Plano de Trabalho: Etapa 6 - Fortalecimento da Segurança do Backend

**Objetivo Principal:** Refatorar a camada de serviço do backend para abandonar o uso da `service_role_key` do Supabase e, em vez disso, utilizar o JSON Web Token (JWT) do usuário para todas as operações, garantindo que as Row Level Security (RLS) policies sejam aplicadas corretamente.

---

### Tarefa 6.1: Análise de Impacto e Planejamento
- **Status:** Não iniciado
- **Descrição:** Identificar todos os locais no código que atualmente dependem da `service_role_key`. Analisar as funções CRUD para entender como o `user_id` é atualmente utilizado e planejar a injeção de um cliente Supabase com escopo de usuário.
- **Ações:**
  - [ ] `grep` por `service_role_key` e `create_client` no diretório `server/`.
  - [ ] Mapear todas as funções que fazem chamadas diretas ao Supabase.
  - [ ] Esboçar a nova função/dependência para criar o cliente por requisição.

### Tarefa 6.2: Refatoração da Lógica de Autenticação
- **Status:** Não iniciado
- **Descrição:** Modificar a lógica de autenticação para capturar o token do usuário e usá-lo para inicializar o cliente Supabase.
- **Ações:**
  - [ ] Criar uma nova dependência FastAPI (ex: `get_scoped_supabase_client`) que extrai o token da requisição.
  - [ ] A dependência deve usar o token para criar uma instância do cliente Supabase para aquela requisição específica.
  - [ ] Garantir que a dependência lida com casos de token inválido ou ausente.

### Tarefa 6.3: Refatoração das Funções CRUD
- **Status:** Não iniciado
- **Descrição:** Substituir o cliente Supabase global (baseado na service key) pelo cliente com escopo de usuário em todas as operações de banco de dados.
- **Ações:**
  - [ ] Injetar a nova dependência (`get_scoped_supabase_client`) em todos os endpoints CRUD.
  - [ ] Modificar as chamadas `.from().select()` etc., para usar a instância do cliente injetado.
  - [ ] Remover a passagem manual do `user_id` onde for possível, confiando no RLS.

### Tarefa 6.4: Validação com Testes de Integração
- **Status:** Não iniciado
- **Descrição:** Criar e executar testes para validar que as permissões estão funcionando como esperado.
- **Ações:**
  - [ ] Escrever um teste que simula o Usuário A tentando acessar/modificar um recurso do Usuário B.
  - [ ] Verificar se a API retorna o erro esperado (403 Forbidden ou 404 Not Found, dependendo da política RLS).

### Tarefa 6.5: Execução dos Advisors de Segurança
- **Status:** Não iniciado
- **Descrição:** Utilizar as ferramentas do Supabase para uma verificação de segurança final.
- **Ações:**
  - [ ] Chamar `mcp3_get_advisors` com `type='security'`.
  - [ ] Analisar o relatório e aplicar correções se necessário.

### Tarefa 6.6: Atualização da Documentação
- **Status:** Não iniciado
- **Descrição:** Documentar a mudança arquitetural.
- **Ações:**
  - [ ] Atualizar `arquiteturaDesign.md` com o novo fluxo de autenticação do backend.
  - [ ] Adicionar notas em `stackTecnologica.md` sobre o padrão implementado.

### Tarefa 6.7: Conclusão e Registro
- **Status:** Não iniciado
- **Descrição:** Finalizar a etapa e registrar o progresso.
- **Ações:**
  - [ ] Remover a `SUPABASE_SERVICE_KEY` do arquivo `server/app/core/config.py` e instruir a remoção do `.env`.
  - [ ] Criar o arquivo `registro_tarefas/2025-06-13_ETAPA6_SegurancaBackend.md`.
  - [ ] Atualizar `progresso.md` e `contextoAtivo.md`.
