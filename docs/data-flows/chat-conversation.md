# Chat Conversation Data Flow

This diagram illustrates the data flow when a user interacts with an agent in the chat interface. It covers sending a message, backend processing including LLM and tool interaction, and receiving the response.

```mermaid
graph TD
    U[User @ ChatPage] -->|Types and Sends Message| CUI(Chat UI / ChatInput Component)
    CUI -->|Calls useChat Hook & chatService.sendMessage| CS{chatService.sendMessage}
    CS -->|POST /api/chat/{agentId}/message with UserMessage, History| API[Backend API: /api/chat/:agentId/message]

    subgraph Backend Processing
        API -->|Retrieves Agent Configuration (LLM, Tools, System Prompt)| DB[(Database: AgentConfig)]
        API -->|Constructs Prompt with History & User Message| API
        API -->|Sends Prompt to LLM| LLMS(Language Model Service / OpenAI)
        LLMS -->|Processes Prompt, May Trigger Function Calls (Tools)| LLMS
        LLMS -- Optional: Function Call Request --> API
        API -- Optional: If Function Call --> TE(Tool Executor)
        TE -- Optional: Executes Specific Tool (e.g., Knowledge Base Search) --> KB(Knowledge Base / Vector Store)
        KB -- Optional: Returns Search Results --> TE
        TE -- Optional: Returns Tool Output to API --> API
        API -- Optional: Sends Tool Output back to LLM --> LLMS
        LLMS -->|Generates Final Text Response| API
    end

    API -->|Streams Response Chunks or Full Response to Client| CS
    CS -->|Updates UI State (e.g., Zustand store, appends message)| CUI
    CUI -->|Displays Agent's Response to User| U
```
