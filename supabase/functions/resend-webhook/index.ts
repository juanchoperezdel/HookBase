
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const payload = await req.json()
        console.log("Webhook received payload:", payload)

        // Solo procesamos actualizaciones de la tabla 'reports'
        if (payload.table !== 'reports' || payload.type !== 'UPDATE') {
            return new Response(JSON.stringify({ message: "Ignored" }), { status: 200 })
        }

        const { record, old_record } = payload

        // TRIGGER: Solo si final_slide_url pasó de null a tener valor
        const isNewReportReady = !old_record.final_slide_url && record.final_slide_url

        if (!isNewReportReady) {
            return new Response(JSON.stringify({ message: "Condition not met" }), { status: 200 })
        }

        // Inicializar Supabase con service role para saltar RLS y obtener el email del cliente
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // Obtener información del cliente
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('email, full_name')
            .eq('id', record.client_id)
            .single()

        if (clientError || !client?.email) {
            console.error("Error fetching client email:", clientError)
            return new Response(JSON.stringify({ error: "Client not found" }), { status: 404 })
        }

        // Enviar email vía Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'HookBase <onboarding@resend.dev>', // Usar este para pruebas si no tienes dominio verificado
                to: [client.email],
                subject: '¡Tu Reporte Estratégico está listo! 🚀',
                html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 30px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 20px;">¡Tu reporte está listo! 🚀</div>
                    <p style="font-size: 16px; color: #4a4a4a; line-height: 1.5; margin-bottom: 30px;">
                      Hola ${client.full_name.split(' ')[0]}, el análisis estratégico que solicitaste ya ha sido procesado por la IA y está disponible en tu panel.
                    </p>
                    <a href="https://hookbase.vercel.app/dashboard" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Ir al Dashboard
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; background-color: #f1f1f1; text-align: center; font-size: 12px; color: #888888;">
                    Recibiste este correo porque tu reporte en HookBase ha finalizado.<br>
                    © 2026 HookBase. Todos los derechos reservados.
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
            }),
        })

        const resData = await res.json()
        return new Response(JSON.stringify(resData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })

    } catch (error) {
        console.error("Error in webhook:", error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
