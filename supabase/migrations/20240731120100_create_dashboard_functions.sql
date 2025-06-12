-- Função para obter o uso diário de tokens para um usuário dentro de um intervalo de datas
CREATE OR REPLACE FUNCTION get_daily_token_usage(p_user_id UUID, p_start_date TIMESTAMPTZ, p_end_date TIMESTAMPTZ)
RETURNS TABLE(day DATE, total_tokens BIGINT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE(t.created_at) AS day,
        SUM(t.total_tokens)::BIGINT AS total_tokens
    FROM
        public.token_usage_logs AS t
    WHERE
        t.user_id = p_user_id
        AND t.created_at >= p_start_date
        AND t.created_at <= p_end_date
    GROUP BY
        DATE(t.created_at)
    ORDER BY
        day;
END;
$$;

-- Função para obter o total de tokens de um usuário no mês corrente
CREATE OR REPLACE FUNCTION get_monthly_token_total(p_user_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    total BIGINT;
BEGIN
    SELECT
        COALESCE(SUM(t.total_tokens), 0)
    INTO
        total
    FROM
        public.token_usage_logs AS t
    WHERE
        t.user_id = p_user_id
        AND t.created_at >= DATE_TRUNC('month', NOW());
    RETURN total;
END;
$$;
