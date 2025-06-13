---
description: Workflow Mestre de Trabalho – Plano Macro
---

# Workflow Mestre de Trabalho

## Estrutura Geral
Este documento descreve as 7 etapas principais e suas respectivas 7 tarefas que orientam o fluxo de trabalho do projeto.

### Etapa 1 – SessionStart
1. Executar comando "SessionStart"
2. Carregar Banco de Memórias (`memorias/`)
3. Validar consistência de arquivos‐núcleo
4. Atualizar checksums (se necessário)
5. Registrar contexto ativo em `contextoAtivo.md`
6. Registrar evento no log de tarefas
7. Confirmar conclusão da inicialização

### Etapa 2 – Planejamento Macro
1. Definir visão geral dos próximos objetivos
2. Quebrar objetivos em 7 etapas principais (1-7)
3. Para cada etapa, criar 7 tarefas claras e objetivas
4. Mapear ferramentas necessárias
5. Salvar plano neste arquivo
6. Atualizar `indiceMemoria.md`
7. Validar compreensão do plano

### Etapa 3 – Consulta de Documentação (contex7-mcp)
1. Identificar tópicos críticos de docs
2. Resolver IDs das bibliotecas necessárias
3. Baixar documentação atualizada
4. Armazenar resumos em `stackTecnologica.md`
5. Atualizar links de referência
6. Criar notas de estudo rápidas
7. Sincronizar mudanças no Banco de Memórias

### Etapa 4 – Operações em Arquivos (desktop-commander)
1. Listar diretórios alvo
2. Ler arquivos chave
3. Criar/editar arquivos necessários
4. Deletar artefatos obsoletos
5. Validar lint/testes locais
6. Commit incremental (git)
7. Registrar alterações em `registro_tarefas`

### Etapa 5 – Gerenciamento de Memória (memory)
1. Criar/atualizar memórias relevantes
2. Remover memórias inconsistentes
3. Relacionar observações e entidades
4. Sincronizar curto/longo prazo
5. Documentar evento em `registro_tarefas`
6. Atualizar checksums
7. Validar recuperação automática

### Etapa 6 – Backend Supabase (supabase-mcp-server)
1. Definir impacto da alteração
2. Buscar custo e confirmar criação/branch
3. Aplicar migrações ou funções Edge
4. Verificar status do deploy
5. Rodar advisors de segurança/performance
6. Atualizar documentação de banco
7. Registrar no Banco de Memórias

### Etapa 7 – Pesquisa Web (@web)
1. Formular query de pesquisa
2. Executar busca
3. Avaliar fontes e filtrar ruído
4. Salvar insights úteis
5. Referenciar links
6. Atualizar memória de stack tecnológica
7. Registrar conclusão da pesquisa
