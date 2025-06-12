-- Cria a tabela para registrar o uso de tokens
CREATE TABLE public.token_usage_logs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id BIGINT NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    model_name TEXT NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL
);

-- Habilita Row-Level Security
ALTER TABLE public.token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Concede permissões de uso no schema public para o role authenticated
GRANT USAGE ON SCHEMA public TO authenticated;

-- Concede permissões específicas na tabela para o role authenticated
GRANT SELECT ON TABLE public.token_usage_logs TO authenticated;

-- Política: Usuários podem ler apenas seus próprios logs de uso de token
CREATE POLICY "Allow users to read their own token usage logs"
ON public.token_usage_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Índices para otimizar consultas
CREATE INDEX idx_token_usage_logs_user_id ON public.token_usage_logs(user_id);
CREATE INDEX idx_token_usage_logs_agent_id ON public.token_usage_logs(agent_id);
CREATE INDEX idx_token_usage_logs_created_at ON public.token_usage_logs(created_at);
