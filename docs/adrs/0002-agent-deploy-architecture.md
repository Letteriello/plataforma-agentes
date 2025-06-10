# Agent Deployment Architecture

**Status:** Proposed

**Context:**

Users need to expose configured agents to external applications in a secure and scalable way. The platform currently lacks a unified method to route requests to a specific agent instance while handling authentication and rate limiting.

**Decision:**

Introduce an API Gateway that provides a single endpoint `/api/v1/agents/{agentId}/invoke`. All external requests will hit this gateway, which will perform authentication (via API keys), rate limiting and logging. The gateway then forwards the request to the appropriate agent runtime service responsible for executing the agent.

**Consequences:**

- Simplifies client integration by offering a consistent endpoint format.
- Centralizes security and monitoring concerns in the gateway layer.
- Requires implementing the gateway and runtime routing logic, which adds infrastructure complexity.
