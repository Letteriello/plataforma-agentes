### **Documentação: Personas dos Utilizadores**

#### **Introdução**

Para garantir que a plataforma atenda às necessidades reais de seus utilizadores, criamos duas personas principais. Cada persona representa um dos segmentos do nosso público-alvo, encapsulando seus objetivos, frustrações e a forma como a plataforma pode empoderá-los.

---

### **Persona 1: A Empreendedora Visionária (Utilizadora No-Code)**

- **Nome:** Sofia Oliveira
- **Idade:** 34
- **Profissão:** Fundadora de uma startup de e-commerce.
- **Perfil Técnico:** Conhecimentos básicos de tecnologia, utiliza diversas ferramentas SaaS, mas **não sabe programar**.
- **Frase:** _"Tenho imensas ideias para automatizar o meu negócio com IA, mas as soluções atuais são muito complexas ou exigem um programador."_

#### **Contexto e Objetivos**

Sofia gere uma loja online em crescimento. Ela quer melhorar a experiência do cliente e otimizar as operações internas usando IA, mas tem um orçamento e recursos técnicos limitados.

- **Objetivo Principal:** Implementar rapidamente um agente de IA para o atendimento ao cliente no seu site, capaz de responder a perguntas frequentes sobre produtos, rastreio de encomendas e políticas de devolução.
- **Objetivos Secundários:**
    - Criar um agente interno que possa gerar descrições de produtos para novos itens do seu catálogo.
    - Automatizar a categorização de feedback de clientes.

#### **Frustrações Atuais**

- A complexidade de plataformas de IA existentes, que parecem ser feitas apenas para programadores.
- O custo elevado de contratar um freelancer ou uma agência para desenvolver soluções de IA personalizadas.
- A dificuldade em encontrar uma ferramenta que seja ao mesmo tempo poderosa e intuitiva.

#### **Como a Nossa Plataforma Ajuda a Sofia?**

A plataforma será a solução ideal para a Sofia, oferecendo uma ponte entre as suas ideias de negócio e a tecnologia de IA.

- **Modo de Utilização:** Sofia utilizará exclusivamente o **Modo Assistido (No-Code)**.
- **Jornada na Plataforma:**
    1. Ela selecionará o template "Agente de Atendimento ao Cliente".
    2. O **agente assistente** da plataforma irá guiá-la, fazendo perguntas simples em português, como: "Qual o nome do seu agente?" e "Onde posso encontrar as informações sobre os seus produtos e políticas (por favor, forneça o link do seu FAQ)?".
    3. Ela irá ao módulo **Memória** para fazer o upload de um PDF com as suas políticas de devolução e adicionar o link da sua página de FAQ, alimentando a base de conhecimento do agente (RAG).
    4. Através do módulo de **Chat**, ela poderá testar o agente que acabou de criar, fazendo-lhe perguntas como se fosse um cliente.
    5. Satisfeita com o resultado, ela procurará uma opção simples de "Implantar" ou "Integrar no meu site".

---

### **Persona 2: O Desenvolvedor Inovador (Utilizador Low-Code)**

- **Nome:** David Martins
- **Idade:** 27
- **Profissão:** Engenheiro de Software numa empresa de tecnologia.
- **Perfil Técnico:** Experiente em Python e JavaScript, familiarizado com APIs REST e com os conceitos de bibliotecas como Langchain e CrewAI.
- **Frase:** _"Adoro o poder das bibliotecas de agentes, mas passo demasiado tempo a escrever código repetitivo para orquestração e configuração. Preciso de uma forma mais rápida de prototipar e construir sistemas multiagente complexos."_

#### **Contexto e Objetivos**

David está encarregado de desenvolver um novo produto na sua empresa: um sistema de análise de mercado automatizado. A tarefa exige a coordenação de múltiplos agentes com diferentes capacidades.

- **Objetivo Principal:** Construir um sistema multiagente que: 1) utiliza um agente para pesquisar notícias financeiras na web; 2) outro agente para analisar o sentimento dessas notícias; 3) e um terceiro para compilar um relatório diário resumido.
- **Objetivos Secundários:**
    - Integrar uma API interna da empresa como uma **ferramenta personalizada (Custom Tool)**.
    - Contribuir com os seus próprios templates de agentes para a comunidade da plataforma.

#### **Frustrações Atuais**

- A quantidade de código "boilerplate" (repetitivo) necessária para orquestrar agentes em bibliotecas puramente de código.
- A dificuldade em visualizar e depurar o fluxo de trabalho entre múltiplos agentes.
- A falta de uma interface unificada para gerir a configuração, as ferramentas e a memória de todos os seus agentes.

#### **Como a Nossa Plataforma Ajuda o David?**

A plataforma oferece ao David a combinação perfeita de abstração e controlo, permitindo-lhe acelerar drasticamente o seu desenvolvimento sem sacrificar a personalização.

- **Modo de Utilização:** David utilizará principalmente o **Modo Avançado (Low-Code)**.
- **Jornada na Plataforma:**
    1. No **Construtor de Agentes**, ele criará um novo agente do tipo **`SequentialAgent`** (Agente Sequencial) para orquestrar o seu fluxo de trabalho.
    2. Ele criará três sub-agentes `LlmAgent`: "Pesquisador", "Analisador de Sentimento" e "Relator".
    3. No módulo de **Ferramentas**, ele irá ativar a ferramenta pré-configurada "Web Search" para o agente "Pesquisador". Em seguida, criará uma **Ferramenta Personalizada** para conectar-se à API interna da sua empresa.
    4. No construtor visual do `SequentialAgent`, ele irá arrastar e soltar os seus três sub-agentes na ordem correta, configurando o fluxo.
    5. Finalmente, ele irá utilizar a funcionalidade de "Exportar Agente" para partilhar o seu template de "Sistema de Análise de Mercado" com a sua equipa e a comunidade.