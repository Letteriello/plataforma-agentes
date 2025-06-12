-- supabase/migrations/20250612112900_create_dashboard_functions.sql

-- Function to get main ROI dashboard metrics (KPIs)
CREATE OR REPLACE FUNCTION public.get_roi_dashboard_metrics(
    p_user_id UUID,
    start_date_current TIMESTAMPTZ,
    end_date_current TIMESTAMPTZ,
    start_date_previous TIMESTAMPTZ,
    end_date_previous TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_cost_current', COALESCE(SUM(CASE WHEN created_at BETWEEN start_date_current AND end_date_current THEN cost ELSE 0 END), 0),
        'total_cost_previous', COALESCE(SUM(CASE WHEN created_at BETWEEN start_date_previous AND end_date_previous THEN cost ELSE 0 END), 0),
        'total_tokens_current', COALESCE(SUM(CASE WHEN created_at BETWEEN start_date_current AND end_date_current THEN input_tokens + output_tokens ELSE 0 END), 0),
        'total_tokens_previous', COALESCE(SUM(CASE WHEN created_at BETWEEN start_date_previous AND end_date_previous THEN input_tokens + output_tokens ELSE 0 END), 0),
        'avg_cost_per_session_current', COALESCE(AVG(CASE WHEN created_at BETWEEN start_date_current AND end_date_current THEN cost END), 0),
        'avg_cost_per_session_previous', COALESCE(AVG(CASE WHEN created_at BETWEEN start_date_previous AND end_date_previous THEN cost END), 0),
        'cost_by_model_current', (SELECT jsonb_object_agg(model_name, total_cost) FROM (SELECT model_name, SUM(cost) as total_cost FROM public.usage_metrics WHERE user_id = p_user_id AND created_at BETWEEN start_date_current AND end_date_current GROUP BY model_name) as sub),
        'tokens_by_model_current', (SELECT jsonb_object_agg(model_name, total_tokens) FROM (SELECT model_name, SUM(input_tokens + output_tokens) as total_tokens FROM public.usage_metrics WHERE user_id = p_user_id AND created_at BETWEEN start_date_current AND end_date_current GROUP BY model_name) as sub)
    ) INTO result
    FROM public.usage_metrics
    WHERE user_id = p_user_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get time series data for charts
CREATE OR REPLACE FUNCTION public.get_roi_time_series(
    p_user_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(jsonb_build_object(
        'timestamp', day,
        'cost', total_cost,
        'tokens', total_tokens
    ))
    INTO result
    FROM (
        SELECT
            DATE_TRUNC('day', created_at)::DATE AS day,
            SUM(cost) AS total_cost,
            SUM(input_tokens + output_tokens) AS total_tokens
        FROM public.usage_metrics
        WHERE user_id = p_user_id AND created_at BETWEEN start_date AND end_date
        GROUP BY day
        ORDER BY day
    ) AS daily_metrics;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;
