# Agent Creation Data Flow

This diagram illustrates the process of a user creating a new agent within the application. It shows the interaction from the user interface, through the frontend services, to the backend API, and finally to the database.

```mermaid
graph TD
    A[User @ AgentConfiguratorPage] -->|Inputs Agent Details: Name, LLM Config, Tools, Knowledge Base| B(Agent Configuration UI)
    B -->|User Clicks "Save Agent"| C{agentService.createAgent / agentService.updateAgent}
    C -->|Sends AgentData via POST /api/agents or PUT /api/agents/:id| D[Backend API: /api/agents]
    D -->|Validates Data (Zod Schema)| D
    D -->|Saves Agent to Database| E[(Database: Agent Table)]
    D -->|Returns Saved Agent or Error| C
    C -->|Updates UI State (e.g., Zustand store, redirects, shows notification)| B
    B -->|Displays Success/Error to User| A
```
