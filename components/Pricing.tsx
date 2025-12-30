import React from 'react';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface PricingProps {
  onGetStarted?: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onGetStarted }) => {
  return (
    <section id="pricing" className="py-24 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-zylo-purpleLight px-4 py-1.5 text-sm font-bold text-zylo-purple border border-zylo-purple/20 transform -rotate-1 shadow-sm">
            <Sparkles size={14} />
            La decisión estratégica más simple de tu mes
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black leading-tight">
             Impulsá tu contenido por <br className="hidden md:block" />
             <span className="text-zylo-yellow bg-black px-3 py-1 rounded-md transform rotate-1 inline-block mt-2">un precio imbatible</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
             Accedé a la inteligencia de datos que usan los grandes creadores. Sin vueltas, un solo plan diseñado para que no pares de crecer.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Plan Único Viral */}
          <div className="relative rounded-[3rem] bg-white p-10 md:p-14 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border-2 border-zylo-black group hover:-translate-y-2 transition-all duration-500">
             
             {/* Decorative Badge */}
             <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-zylo-yellow border-2 border-zylo-black px-6 py-2 text-xs font-black text-zylo-black uppercase tracking-widest shadow-lg">
                Plan Único Viral
             </div>

             <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl font-black text-gray-400">$</span>
                    <span className="text-7xl font-black text-zylo-black tracking-tighter">10.000</span>
                </div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Pago mensual • Sin contratos</span>
             </div>

             <div className="space-y-8 mb-12">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs font-black text-zylo-purple uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Zap size={14} fill="currentColor" /> Incluye:
                    </p>
                    <p className="text-sm font-bold text-gray-700 leading-tight">
                        2 diagnósticos mensuales para saber qué copiar, qué evitar y dónde poner tu presupuesto.
                    </p>
                </div>

                <ul className="space-y-5 text-sm md:text-base text-zylo-black font-semibold pl-1">
                    {[
                        "5 ideas virales listas (basadas en lo que hoy está funcionando)",
                        "20 adaptaciones accionables para reels, ads o shorts",
                        "Top 3 videos de tu competencia para no llegar tarde ni repetir errores",
                        "Soporte por mail para ajustar rápido y seguir avanzando"
                    ].map((feat, i) => (
                        <li key={i} className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-zylo-green/20 text-zylo-green flex items-center justify-center">
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <span className="leading-tight">{feat}</span>
                        </li>
                    ))}
                </ul>
             </div>
             
             <button 
                onClick={onGetStarted}
                className="w-full rounded-full bg-zylo-black py-5 text-lg font-black text-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] hover:bg-gray-800 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                Empezar ahora <Zap size={20} fill="currentColor" />
             </button>

             <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Garantía de satisfacción HookBase
             </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
            <p className="text-gray-400 text-sm font-medium">
                ¿Necesitás algo a medida para tu agencia? <a href="#" className="text-zylo-purple underline decoration-2 underline-offset-4 font-bold">Hablemos por WhatsApp</a>
            </p>
        </div>
      </div>
    </section>
  );
};
