-- supabase/migrations/20250612112713_create_usage_metrics_table.sql

CREATE TABLE public.usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    session_id TEXT,
    event_type TEXT NOT NULL,
    model_name TEXT,
    input_tokens INTEGER CHECK (input_tokens >= 0),
    output_tokens INTEGER CHECK (output_tokens >= 0),
    cost NUMERIC(10, 8) CHECK (cost >= 0),
    details JSONB
);

COMMENT ON TABLE public.usage_metrics IS 'Stores granular usage metrics for ROI calculation and observability.';
COMMENT ON COLUMN public.usage_metrics.id IS 'Unique identifier for the usage metric event.';
COMMENT ON COLUMN public.usage_metrics.user_id IS 'The user associated with the event.';
COMMENT ON COLUMN public.usage_metrics.agent_id IS 'The agent involved in the event.';
COMMENT ON COLUMN public.usage_metrics.session_id IS 'Identifier to group events from a single interaction session.';
COMMENT ON COLUMN public.usage_metrics.event_type IS 'Type of the event (e.g., ''chat_completion'', ''tool_call'').';
COMMENT ON COLUMN public.usage_metrics.model_name IS 'The language model used for the event.';
COMMENT ON COLUMN public.usage_metrics.input_tokens IS 'Number of tokens in the input/prompt.';
COMMENT ON COLUMN public.usage_metrics.output_tokens IS 'Number of tokens in the output/completion.';
COMMENT ON COLUMN public.usage_metrics.cost IS 'Calculated cost for the event.';
COMMENT ON COLUMN public.usage_metrics.details IS 'Additional JSON data, like tool name or error information.';

CREATE INDEX IF NOT EXISTS idx_usage_metrics_user_id ON public.usage_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_agent_id ON public.usage_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_event_type ON public.usage_metrics(event_type);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_created_at ON public.usage_metrics(created_at);

ALTER TABLE public.usage_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own usage metrics" 
ON public.usage_metrics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow service_role to insert all metrics" 
ON public.usage_metrics
FOR INSERT
WITH CHECK (true); -- Assuming inserts will be handled by the backend with elevated privileges.
