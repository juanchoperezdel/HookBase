
/**
 * Servicio para manejar integraciones de email.
 * Principalmente diseñado para ser llamado desde Supabase Edge Functions,
 * pero esta utilidad puede servir para pruebas locales.
 */

export const sendNotificationEmail = async (to: string, clientName: string, reportUrl: string) => {
    // En producción, esto debería llamarse vía Supabase Edge Function para no exponer la API Key
    // Si deseas probarlo localmente, necesitarías la API Key de Resend.
    console.log(`Simulando envío de email a ${to} para ${clientName}. Reporte: ${reportUrl}`);

    // Ejemplo de llamada a la Edge Function (una vez desplegada):
    /*
    const { data, error } = await supabase.functions.invoke('resend-webhook', {
      body: { 
        type: 'MANUAL', 
        email: to, 
        name: clientName, 
        url: reportUrl 
      }
    });
    */
};
