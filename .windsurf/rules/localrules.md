---
trigger: always_on
---

# .localrules — só vale dentro deste diretório (recursivo)
# SCHEMA RESUMIDO
phases:                # sobrescreve fases do workflow carregado
  coder:
    tools: [Filesystem, DesktopCommander]
    env:
      GOEXPERIMENT: "rangefunc"
    before:
      - run: "echo 'Lintando só arquivos alterados…'"
      - cmd: "golangci-lint run $(git diff --name-only -- '*.go')"
  tester:
    allowFlaky: false
    coverageThreshold: 95

scope:                 # restringe leitura/escrita de arquivos
  include: ["src/payments/**"]
  exclude: ["vendor/**"]

memories:              # ajustes finos de memória
  ignorePaths: ["docs/**"]
  workingTTLminutes: 180

tools:                 # override de políticas por ferramenta
  DesktopCommander:
    writeLimitLines: 300
    networkAccess: false
