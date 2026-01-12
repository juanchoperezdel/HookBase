-- 1. Habilitar la extensión net (si no está ya habilitada)
-- La mayoría de los proyectos de Supabase ya tienen esto.
-- Si no, descomenta la siguiente línea:
-- CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- 2. Crear la función del Trigger
CREATE OR REPLACE FUNCTION public.handle_report_update_webhook()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo enviamos el webhook si el final_slide_url cambió de null a un valor
    IF (OLD.final_slide_url IS NULL AND NEW.final_slide_url IS NOT NULL) THEN
        PERFORM
            net.http_post(
                url := 'https://znumctnmiuswxvaoznfw.supabase.co/functions/v1/resend-webhook',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudW1jdG5taXVzd3h2YW96bmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTQ0NTYsImV4cCI6MjA2NjYzMDQ1Nn0.ylBl6M0a06ollU5yQ38epYPfHa1NPCsinI8FPGOtuGg'
                ),
                body := jsonb_build_object(
                    'type', 'UPDATE',
                    'table', 'reports',
                    'record', row_to_json(NEW),
                    'old_record', row_to_json(OLD)
                )
            );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el Trigger
DROP TRIGGER IF EXISTS on_report_ready ON public.reports;
CREATE TRIGGER on_report_ready
    AFTER UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_report_update_webhook();
