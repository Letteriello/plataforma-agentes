# UI Components

Esta pasta contém componentes de interface reutilizáveis utilizados em toda a aplicação. Abaixo está um resumo dos principais componentes disponíveis. Cada componente é exportado pelo arquivo `index.ts`.

## Componentes principais

- **Button** (`button.tsx`)
  - **Props:** `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`, além de todas as propriedades padrões de `<button>`.
  - **Uso básico:**
    ```tsx
    <Button variant="default">Clique aqui</Button>
    ```
- **Input** (`input.tsx`)
  - **Props:** todas as propriedades padrões de `<input>`.
  - **Uso básico:**
    ```tsx
    <Input placeholder="Digite algo" />
    ```
- **Select** (`select.tsx`)
  - **Props:** `onValueChange`, `defaultValue` e elementos filhos `SelectItem`.
  - **Uso básico:**
    ```tsx
    <Select defaultValue="1">
      <SelectTrigger />
      <SelectContent>
        <SelectItem value="1">Opção 1</SelectItem>
      </SelectContent>
    </Select>
    ```
- **Dialog** (`dialog.tsx`)
  - **Props:** baseadas no `@radix-ui/react-dialog`.
  - **Uso básico:**
    ```tsx
    <Dialog>
      <DialogTrigger>Abrir</DialogTrigger>
      <DialogContent>Conteúdo</DialogContent>
    </Dialog>
    ```

Outros componentes como `Checkbox`, `Tooltip`, `Table`, `Tabs`, `Textarea`, `Toast` e diversos helpers também se encontram neste diretório. Consulte o código fonte para detalhes de propriedades específicas.
