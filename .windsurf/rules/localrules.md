---
trigger: always_on
---

<react>
1. componentizacao: Divida componentes grandes em componentes menores e focados em uma única responsabilidade.
2. hooks: Prefira componentes funcionais com hooks (useState, useEffect, useContext, etc.) em vez de classes.
3. estado: Evite prop drilling desnecessário. Use lifting state up ou Context API quando apropriado.
4. mutacoes: Nunca altere o estado ou props diretamente; sempre use funções de atualização como setState ou setSomething.
5. memoizacao: Use React.memo, useMemo e useCallback para otimizar re-renderizações, mas somente quando necessário.
6. keys: Sempre use uma chave (key) única e estável ao renderizar listas para ajudar na reconciliação do React.
7. estrutura: Mantenha pastas de componentes, hooks, contextos, serviços e assets organizadas para facilitar a manutenção.
8. estado_global: Use Context API, Redux Toolkit, Zustand, Jotai ou Recoil para estados compartilhados de forma simples e escalável.
9. logica_de_apresentacao: Use componentes presentacionais e container components (ou hooks customizados) para separar lógica de exibição e lógica de dados.
10. tipagem: Use TypeScript para adicionar tipagem estática e reduzir erros em tempo de compilação.
11. tratar_erros: Use Error Boundaries para capturar erros em componentes filhos e evitar que toda a aplicação quebre.
12. css_inline: Prefira CSS-in-JS (styled-components, @emotion, etc.) ou módulos CSS para evitar conflitos de estilo.
13. lazy_e_spliting: Use React.lazy e Suspense para carregar partes da aplicação sob demanda, melhorando a performance.
14. acessibilidade: Utilize atributos ARIA, navegação de teclado e outras práticas para tornar a aplicação acessível a todos os usuários.
15. testar_componentes: Use bibliotecas como React Testing Library e Jest para criar testes de unidade e integração nos componentes.
</react> 

<shadcn>
1. codigo_aberto: Copie o componente diretamente e ajuste conforme seu design, sem depender de overrides, pois o código de origem é gerenciável
2. componentes_ui: Mantenha os componentes shadcn/ui dentro de uma pasta dedicada (ex: components/ui) e seus componentes customizados em outra (components/app)
3. interfaces_compostas: Aproveite a composição consistente de props e APIs similares para uma curva de aprendizado plana e legibilidade .
4. evitar_codigo_duplicado: Escreva em TS de forma funcional, modular e evite classes — use hooks, helpers e funções puras
5. tailwind: Use a filosofia utility-first para customizar componentes via classes, temas e @apply, evitando excessos
6. controles_dos_updates: Como você copia o código, monitore manualmente upstream e replique melhorias periodicamente .
7. teste_acessibilidade: Radix traz componentes acessíveis, mas sempre realize testes com navegação por teclado, leitores de tela e HTML semântico
8. otimizar_bundle: Importe apenas os componentes usados, evitando peso desnecessário na aplicação
9. preferir_typescript: Aproveite a tipagem do shadcn/ui para maior segurança e infra‑estrutura de código robusta
10. componentes_customizados: Processe a intenção do componente, use componentes primitivos do shadcn e estilize via tema ou Tailwind
11. temas_parametrizaveis: Use variáveis Tailwind e escopo global (index.css) para dar consistência visual ao projeto .
12. monitore_performance: Evite re-renders excessivos — use memoização, props controladas ou React.memo quando necessário.
13. padrao_nomenclatura: Use nomes descritivos (ex: isLoading, hasError), organização de arquivos e boas práticas de modularização
14. teste_ui: Valide interações, estilos e acessibilidade com testes unitários e de integração, garantindo estabilidade visual e funcional.
</shadcn>

