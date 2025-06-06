---
description: Novo Agente
---

# Workflow para criar um novo nó de agente visual do zero.

[[step]]
prompt = "Qual o nome do novo nó de agente? (ex: EmailSender)"
# A variável 'nodeName' vai guardar a sua resposta.
capture = "nodeName"

[[step]]
prompt = "Com base na documentação do shadcn/ui e nos princípios do nosso design system, gere o código React para um componente de Card que represente o nó '$nodeName'. Ele deve ter um título e uma área para as propriedades."
# Usa a IA para gerar o código com base no conhecimento prévio.
tool = "context7-mcp"
args = ["--source", "./docs/"]
capture = "nodeCode"

[[step]]
prompt = "Crie o arquivo para o novo nó e insira o código gerado."
tool = "desktop-commander"
# Cria o arquivo e usa a variável 'nodeCode' para preenchê-lo.
args = ["write", "./client/src/components/agents/nodes/${nodeName}.tsx", "${nodeCode}"]

[[step]]
prompt = "Nó '$nodeName' criado com sucesso em ./client/src/components/agents/nodes/!"