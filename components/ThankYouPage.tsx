import React, { useRef, useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { Confetti, ConfettiRef } from '@/components/ui/confetti';
import { supabase } from './supabaseClient';

interface ThankYouPageProps {
    onGoToLogin: () => void;
}

type PaymentStatus = 'processing' | 'approved' | 'failed' | 'idle';

export function ThankYouPage({ onGoToLogin }: ThankYouPageProps) {
    const confettiRef = useRef<ConfettiRef>(null);
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const mpStatus = queryParams.get('status');
        const userId = queryParams.get('external_reference');

        console.log("MP Callback:", { mpStatus, userId });

        if (mpStatus === 'approved' && userId) {
            handleApprovedPayment(userId);
        } else if (mpStatus === 'rejected' || mpStatus === 'cancelled') {
            setStatus('failed');
            setErrorMessage('El pago no fue aprobado. Si crees que esto es un error, contactanos.');
        } else {
            // Default behavior if no params (direct visit)
            setStatus('approved');
            triggerConfetti();
        }
    }, []);

    const triggerConfetti = () => {
        setTimeout(() => {
            confettiRef.current?.fire({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500);
    };

    const handleApprovedPayment = async (rawUserId: string) => {
        setStatus('processing');
        // Handle cases where external_reference is a compound ID (e.g., userId_timestamp)
        const userId = rawUserId.split('_')[0];
        console.log("Processing activation for clean userId:", userId);

        try {
            // 1. Update status in Supabase (onboarding_leads)
            const { data: leadData, error: updateError } = await supabase
                .from('onboarding_leads')
                .update({ status: 'paid' })
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError) {
                console.error("Error updating lead status:", updateError);
                // If we can't find the lead by ID, maybe it's already updated or doesn't exist?
                // We'll try to fetch it anyway to see if we can proceed
            }

            // 2. Initialize Client in 'clients' table
            // This ensures they appear in the dashboard/reports after paying
            const lead = leadData || (await supabase.from('onboarding_leads').select().eq('user_id', userId).single()).data;

            if (lead) {
                console.log("Lead found, activating client profile...");
                const { error: clientError } = await supabase
                    .from('clients')
                    .upsert([{
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
                        plan: "pro"
                    }]);

                if (clientError) {
                    console.error("Error activating client profile:", clientError);
                }

                // 3. Bot Triggered automatically via Database Webhook
                // When we updated onboarding_leads above, a Supabase trigger automatically
                // launched the bot webhook with the correct payload.
                console.log("Database updated. Bot activation should be triggered via DB Hook.");
            } else {
                console.error("Lead not found for activation:", userId);
                throw new Error("No se encontró el registro del lead.");
            }

            setStatus('approved');
            triggerConfetti();

        } catch (error: any) {
            console.error("Critical error in Thank You page:", error);
            setStatus('failed');
            setErrorMessage('Ocurrió un error al procesar tu activación. Por favor contactá a soporte.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full pointer-events-none"
            />

            {/* Background blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-zylo-purple opacity-10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-zylo-green opacity-10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-xl w-full text-center relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">

                {status === 'processing' && (
                    <div className="space-y-6">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zylo-purpleLight mb-6 shadow-soft">
                            <Loader2 className="h-12 w-12 text-zylo-purple animate-spin" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-zylo-black tracking-tight">
                            Verificando activación...
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Estamos confirmando tu pago con Mercado Pago para generar tu reporte. No cierres esta ventana.
                        </p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="space-y-6">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 mb-6 shadow-soft">
                            <XCircle className="h-12 w-12 text-red-500" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-zylo-black tracking-tight">
                            ¡Ops! Algo salió mal
                        </h1>
                        <p className="text-gray-500 text-lg">
                            {errorMessage || 'Tuvimos un problema al procesar tu solicitud.'}
                        </p>
                        <div className="pt-4 flex flex-col gap-3 items-center">
                            <button
                                onClick={() => window.location.href = '/empezar'}
                                className="inline-flex items-center gap-2 font-bold text-zylo-purple hover:underline"
                            >
                                Volver a intentar
                            </button>
                            <p className="text-sm text-gray-400">O escribinos por WhatsApp para soporte directo.</p>
                        </div>
                    </div>
                )}

                {status === 'approved' && (
                    <div className="space-y-8">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zylo-greenLight mb-6 shadow-soft">
                            <CheckCircle className="h-12 w-12 text-zylo-green" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-zylo-black tracking-tight">
                            ¡Gracias, ya estás dentro!
                        </h1>

                        <div className="space-y-4 text-lg text-gray-500">
                            <p>
                                Tu reporte está siendo generado en este momento.
                            </p>
                            <p className="font-medium text-zylo-purple">
                                Te llegará un mail avisando cuando esté listo.
                            </p>
                            <hr className="border-gray-100 w-1/2 mx-auto my-6" />
                            <p className="text-base text-gray-400">
                                Mientras tanto, podés iniciar sesión y empezar a explorar el dashboard.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={onGoToLogin}
                                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-zylo-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-zylo-purple focus:ring-offset-2"
                            >
                                Ir al Login
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
