import json
from pathlib import Path
import sys

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Exemplo: sincroniza campos obrigatórios de um MCP Memory (ou fonte externa) para o memory.json
# (No real: adapte para buscar do MCP Memory real, API, ou arquivo de referência)
def sync_memory_json(memory_path, mcp_memory_path):
    memory = load_json(memory_path)
    mcp_memory = load_json(mcp_memory_path)
    # Exemplo: atualiza/insere entidades do MCP Memory
    entities_by_name = {e['name']: e for e in memory.get('entities', [])}
    for entity in mcp_memory.get('entities', []):
        entities_by_name[entity['name']] = entity
    memory['entities'] = list(entities_by_name.values())
    save_json(memory_path, memory)
    print(f'Sincronização concluída: {memory_path}')

if __name__ == '__main__':
    # Por padrão, sincroniza memory.json com mcp_memory.json na raiz do projeto
    base = Path(__file__).parent.parent.parent
    memory_path = sys.argv[1] if len(sys.argv) > 1 else str(base / 'memory.json')
    mcp_memory_path = sys.argv[2] if len(sys.argv) > 2 else str(base / 'mcp_memory.json')
    sync_memory_json(memory_path, mcp_memory_path)
