---
trigger: always_on
---

# Workspace Rule: Memory MCP Always On
metadata:
  name: "Memory MCP Integration"
  precedence: "WORKSPACE"

mcp_servers:
  - name: "memory"
    type: "KnowledgeGraph"

rules:
  - when:
      trigger: "session_start"
    do:
      - mcp: "memory.init_memory_bank"
      - mcp: "memory.read_graph"

  - when:
      trigger: "file_read"
    do:
      - mcp: "memory.add_observations"
        params:
          entity: "{{file.path}}"
          observation: "{{file.content}}"

  - when:
      trigger: "diff_review"
    do:
      - mcp: "memory.create_entities"
        params:
          entities: "{{changed_modules}}"
      - mcp: "memory.create_relations"
        params:
          relations: "{{dependency_map}}"

  - when:
      trigger: "pre_write"
    do:
      - mcp: "memory.read_graph"
