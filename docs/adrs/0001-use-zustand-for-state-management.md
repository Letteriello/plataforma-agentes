# Use Zustand for Global State Management

**Status:** Accepted

**Context:**

The application requires a global state management solution for managing UI state, agent configurations, and chat history. Alternatives considered include Redux, Context API, and Zustand. Redux was considered too boilerplate-heavy for the current project size and complexity. Context API, while built-in, can lead to performance issues with frequent updates to deeply nested components.

**Decision:**

Zustand was chosen due to its simplicity, minimal boilerplate, and performance characteristics. It uses a hook-based API that is easy to integrate with React components and provides a centralized store that can be accessed from anywhere in the application. Its small bundle size is also a benefit.

**Consequences:**

Developers will need to learn the Zustand API. State updates should be handled immutably. For very complex state interactions, careful organization of the store will be necessary. Tooling for Zustand (like Redux DevTools) is available but might require specific setup.
