// Definição local de FormToolParameter para evitar erros de tipo
// Definição local de FormToolParameter para evitar erros de tipo
interface FormToolParameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: string;
  enum?: string[];
}

// Interface correta para ferramenta no formulário
interface FormTool {
  id: string;
  name: string;
  description: string;
  parameters: FormToolParameter[];
  enabled: boolean;
  required?: boolean;
  condition?: string;
  returnType?: string;
}

