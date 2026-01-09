import React, { useRef, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Confetti, ConfettiRef } from '@/components/ui/confetti';

interface ThankYouPageProps {
    onGoToLogin: () => void;
}

export function ThankYouPage({ onGoToLogin }: ThankYouPageProps) {
    const confettiRef = useRef<ConfettiRef>(null);

    useEffect(() => {
        // Initial fire is handled by the component, 
        // but we can add more "pop" if we want
        const timer = setTimeout(() => {
            confettiRef.current?.fire({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Confetti effect */}
            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full pointer-events-none"
            />

            {/* Background blobs similar to Hero/Footer */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-zylo-purple opacity-10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-zylo-green opacity-10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-xl w-full text-center relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Icon */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-zylo-greenLight mb-6 shadow-soft">
                    <CheckCircle className="h-12 w-12 text-zylo-green" />
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-zylo-black tracking-tight">
                    ¡Gracias, ya estás dentro!
                </h1>

                {/* Subtext */}
                <div className="space-y-4 text-lg text-gray-500">
                    <p>
                        Tu reporte está siendo generado en este momento.
                    </p>
                    <p className="font-medium text-zylo-purple">
                        Te llegará un mail avisando cuando esté listo.
                    </p>
                    <hr className="border-gray-100 w-1/2 mx-auto my-6" />
                    <p className="text-base">
                        Mientras tanto, podés iniciar sesión y empezar a explorar el dashboard.
                    </p>
                </div>

                {/* CTA Button */}
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
        </div>
    );
}
