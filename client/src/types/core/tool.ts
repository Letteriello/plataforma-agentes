export type ToolParameterType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'integer'
  | 'null'

/**
 * Parameter for a tool
 */
export interface ToolParameter {
  name: string
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'array'
    | 'integer'
    | 'null'
  description?: string
  required?: boolean
  default?: unknown
  enum?: unknown[]
  items?: ToolParameter
  properties?: Record<string, ToolParameter>
}

/**
 * Tool definition
 */
export interface Tool {
  id: string
  name: string
  description: string
  parameters?: ToolParameter[]
  returnType?: string
  required?: string[]
  schema?: {
    type: string
    properties: Record<string, unknown>
    required?: string[]
  }
}

/**
 * Tool call definition
 */
export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export type ToolResult = {
  toolCallId: string
  output: unknown
  error?: string
}

/**
 * Tool execution context
 */
export interface ToolExecutionContext {
  /**
   * The ID of the current execution
   */
  executionId: string

  /**
   * The ID of the current session
   */
  sessionId?: string

  /**
   * The ID of the current user
   */
  userId?: string

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>
}

/**
 * Tool handler function
 */
export type ToolHandler = (
  /**
   * The parameters for the tool
   */
  params: Record<string, unknown>,

  /**
   * The execution context
   */
  context: ToolExecutionContext,
) => Promise<unknown>

/**
 * Tool definition with handler
 */
export interface ToolWithHandler extends Tool {
  /**
   * The handler function for the tool
   */
  handler: ToolHandler
}
