import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const mercadopagoAccessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
    try {
        const url = new URL(req.url);
        // Handle Webhook verification (optional, but good practice) or just process POST
        if (req.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }

        const payload = await req.json();
        console.log("Webhook payload received:", JSON.stringify(payload));

        // We are interested in 'subscription_preapproval' notifications or 'payment'
        // For subscriptions, MP sends type: 'subscription_preapproval' and action: 'created' or 'updated'
        // OR type: 'subscription_preapproval_plan'

        // Check if it's a preapproval (subscription) notification
        if (payload.type === "subscription_preapproval") {
            const preapprovalId = payload.data.id;

            // Fetch details from MercadoPago to trust the status
            const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
                headers: {
                    Authorization: `Bearer ${mercadopagoAccessToken}`,
                },
            });

            if (!mpResponse.ok) {
                throw new Error(`Failed to fetch preapproval ${preapprovalId}`);
            }

            const preapprovalData = await mpResponse.json();
            console.log("Preapproval Data:", JSON.stringify(preapprovalData));

            const { status, external_reference } = preapprovalData;

            if (!external_reference) {
                console.error("No external_reference found");
                return new Response("No external_reference", { status: 400 });
            }

            // HANDLE COMPOUND ID: userId_timestamp
            const userId = external_reference.split("_")[0];
            console.log(`Processing update for user: ${userId} (Ref: ${external_reference})`);

            if (status === "authorized") {
                // Init Supabase Client
                const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

                // 1. Check if client exists
                const { data: existingClient } = await supabase
                    .from("clients")
                    .select("id")
                    .eq("id", userId)
                    .single();

                if (!existingClient) {
                    console.log(`Client ${userId} not found. Creating from onboarding_leads...`);
                    
                    // 2. Fetch Lead Data
                    const { data: lead } = await supabase
                        .from('onboarding_leads')
                        .select('*')
                        .eq('user_id', userId)
                        .single();

                    if (!lead) {
                        console.error(`Lead not found for user ${userId}. Cannot create client.`);
                        // We return 200 to MP to avoid retries if it's a critical data inconsistencies pattern
                        // But we verify logging for debugging.
                        // Ideally we should throw if we want MP to retry, but if data is missing, retrying won't help.
                    } else {
                        // 3. Create Client
                        const { error: createError } = await supabase
                            .from('clients')
                            .insert([{
                                id: userId,
                                full_name: lead.full_name || "Nuevo Cliente",
                                email: lead.email,
                                whatsapp: lead.whatsapp,
                                company_name: lead.company_name,
                                industry: lead.industry,
                                brand_tone: lead.brand_tone,
                                goal: lead.goal,
                                video_formats: lead.video_formats,
                                usp: lead.usp,
                                brand_perception: lead.brand_perception,
                                brand_aspiration: lead.brand_aspiration,
                                target_pain_point: lead.target_pain_point,
                                competitors: lead.competitors,
                                business_description: lead.company_name || lead.industry || "General",
                                subscription_status: "active",
                                status: "active",
                                plan: "pro",
                                payment_id: preapprovalId
                            }]);

                        if (createError) {
                            console.error("Error creating client from webhook:", createError);
                            throw createError;
                        }
                        console.log("Client created successfully from webhook.");
                    }
                } else {
                    console.log(`Client ${userId} exists. Updating status...`);
                    // 4. Update Existing Client
                    const { error } = await supabase
                        .from("clients")
                        .update({
                            subscription_status: "active",
                            status: "active", // Legacy field just in case
                            plan: "pro",
                            payment_id: preapprovalId
                        })
                        .eq("id", userId);

                    if (error) {
                        console.error("Supabase update error:", error);
                        throw error;
                    }
                    console.log("User subscription updated successfully");
                }
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error) {
        console.error("Webhook Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});
