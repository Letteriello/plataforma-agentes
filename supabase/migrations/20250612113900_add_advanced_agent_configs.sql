-- supabase/migrations/20250612113900_add_advanced_agent_configs.sql

ALTER TABLE public.agents
ADD COLUMN autonomy_level TEXT DEFAULT 'ask' CHECK (autonomy_level IN ('auto', 'ask')),
ADD COLUMN security_config JSONB NULL,
ADD COLUMN planner_config JSONB NULL,
ADD COLUMN code_executor_config JSONB NULL;

COMMENT ON COLUMN public.agents.autonomy_level IS 'Defines the autonomy level of the agent (auto or ask).';
COMMENT ON COLUMN public.agents.security_config IS 'Stores dynamic security rules for the agent.';
COMMENT ON COLUMN public.agents.planner_config IS 'Stores configuration for the agent''s planner.';
COMMENT ON COLUMN public.agents.code_executor_config IS 'Stores configuration for the agent''s code executor.';
