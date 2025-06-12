import time
from typing import Any, Dict, List

from ..models.workflow import WorkflowNode

# Mock de uma função que simula a execução de um LLM
def _simulate_llm_call(instruction: str, input_data: Any) -> Dict[str, Any]:
    print(f"[LLM] Executando instrução: '{instruction}' com entrada: '{input_data}'")
    time.sleep(1) # Simula latência da rede/modelo
    output = f"Resultado simulado para '{instruction[:20]}...'"
    print(f"[LLM] Saída: {output}")
    return {"result": output}

def execute_node(node: WorkflowNode, input_data: Any) -> Any:
    """Executa recursivamente um único nó do workflow."""
    print(f"---\n[Engine] Executando nó: {node.id} (Tipo: {node.type}) com dados: {input_data}")

    node_type = node.type
    output_data = None

    if node_type == 'llmAgent':
        instruction = node.data.get('instruction', 'Nenhuma instrução fornecida.')
        output_data = _simulate_llm_call(instruction, input_data)

    elif node_type == 'sequentialAgent':
        # Executa os filhos em sequência, passando a saída de um como entrada para o próximo
        current_input = input_data
        for child_node in node.children:
            current_input = execute_node(child_node, current_input)
        output_data = current_input # A saída do sequencial é a saída do último nó

    elif node_type == 'parallelAgent':
        # Em uma implementação real, isso executaria em paralelo (ex: com asyncio.gather)
        # Por enquanto, executamos sequencialmente e coletamos os resultados.
        print("[Engine] Executando ParallelAgent (simulação sequencial)")
        parallel_outputs = []
        for child_node in node.children:
            result = execute_node(child_node, input_data)
            parallel_outputs.append(result)
        output_data = parallel_outputs

    elif node_type == 'loopAgent':
        iterations = int(node.data.get('iterations', 1))
        print(f"[Engine] Executando LoopAgent por {iterations} iterações")
        loop_output = None
        for i in range(iterations):
            print(f"[Engine] Loop iteração {i + 1}/{iterations}")
            loop_output = execute_node(node.children[0], input_data if i == 0 else loop_output)
        output_data = loop_output

    else:
        print(f"[Engine] WARN: Tipo de nó desconhecido '{node_type}'. Pulando.")
        output_data = input_data # Passa os dados de entrada adiante

    print(f"[Engine] Finalizado nó: {node.id}. Saída: {output_data}\n---")
    return output_data

def run_workflow(workflow_tree: List[WorkflowNode], initial_data: Dict[str, Any]) -> List[Any]:
    """Inicia a execução de uma árvore de workflow."""
    print("\n========================================")
    print("====== INICIANDO EXECUÇÃO DO WORKFLOW ======")
    print("========================================\n")
    
    final_outputs = []
    for root_node in workflow_tree:
        output = execute_node(root_node, initial_data)
        final_outputs.append(output)
    
    print("\n========================================")
    print("====== EXECUÇÃO DO WORKFLOW FINALIZADA ======")
    print(f"Saídas finais: {final_outputs}")
    print("========================================\n")
    return final_outputs
