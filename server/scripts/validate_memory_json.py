import json
import sys
from pathlib import Path

def validate_memory_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        assert 'entities' in data, "Chave 'entities' não encontrada."
        assert isinstance(data['entities'], list), "'entities' deve ser uma lista."
        for entity in data['entities']:
            assert 'type' in entity, "Toda entidade deve ter campo 'type'."
            assert 'name' in entity, "Toda entidade deve ter campo 'name'."
            assert 'observations' in entity, "Toda entidade deve ter campo 'observations'."
            assert isinstance(entity['observations'], list), "'observations' deve ser uma lista."
        print('memory.json válido.')
        return 0
    except AssertionError as e:
        print(f'Erro de validação: {e}')
        return 1
    except Exception as e:
        print(f'Erro ao ler memory.json: {e}')
        return 2

if __name__ == '__main__':
    path = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).parent.parent / 'memory.json')
    exit(validate_memory_json(path))
