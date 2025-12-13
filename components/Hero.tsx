import React from 'react';
import { Play, CheckCircle, FileText } from 'lucide-react';
import { Button } from './ui/moving-border';

interface HeroProps {
  onDemoClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDemoClick }) => {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 lg:pb-32 lg:pt-20">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-zylo-greenLight rounded-bl-[100px] rounded-tl-[50px] opacity-60 blur-3xl hidden lg:block"></div>
      <div className="absolute top-40 left-0 -z-10 w-80 h-80 bg-zylo-purpleLight rounded-tr-[100px] rounded-br-[50px] opacity-60 blur-3xl hidden lg:block"></div>

      <div className="container mx-auto px-6 md:px-12 text-center">
        
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-zylo-greenLight px-4 py-1.5 text-sm font-bold text-zylo-black ring-1 ring-inset ring-zylo-green/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Contenido viral basado en datos reales
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-zylo-black sm:text-5xl md:text-6xl mb-6 leading-[1.15]">
          Dejá de adivinar qué grabar. <br className="hidden md:block" />
          Recibí <span className="text-transparent bg-clip-text bg-gradient-to-r from-zylo-purple to-purple-600">ideas de videos virales</span> que ya están funcionando en tu industria
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-500 mb-10 leading-relaxed">
          Contenido real. Analizado por IA. Listo para copiar, adaptar y publicar.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button 
            as="a"
            href="#pricing"
            borderRadius="9999px"
            containerClassName="p-[1px]"
            borderClassName="bg-[radial-gradient(var(--zylo-purple)_40%,transparent_60%)]"
            className="flex items-center gap-2 bg-zylo-black px-8 py-4 text-base font-bold text-white transition-all hover:bg-gray-800"
          >
            <Play size={18} fill="currentColor" />
            Probar gratis ahora
          </Button>
          
          <button 
            onClick={onDemoClick}
            className="flex items-center gap-2 rounded-full bg-white border-2 border-gray-100 px-8 py-4 text-base font-bold text-zylo-black hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <FileText size={18} />
            Ver ejemplo de reporte
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-zylo-green" /> Sin compromiso</span>
            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-zylo-green" /> Cancela cuando quieras</span>
        </div>

        {/* Visual Mockup (Abstracted Cards) */}
        <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="flex justify-center gap-4 md:gap-8 opacity-90">
                {/* Card 1 */}
                <div className="w-32 md:w-48 h-20 md:h-28 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl shadow-lg transform rotate-[-6deg] translate-y-4 flex items-center justify-center">
                     <div className="text-white text-xs md:text-sm font-bold">VIRAL TREND</div>
                </div>
                 {/* Card 2 */}
                <div className="w-32 md:w-48 h-20 md:h-28 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl shadow-xl z-10 transform scale-110 flex items-center justify-center">
                    <div className="text-white text-xs md:text-sm font-bold">HIGH ENGAGEMENT</div>
                </div>
                 {/* Card 3 */}
                <div className="w-32 md:w-48 h-20 md:h-28 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg transform rotate-[6deg] translate-y-4 flex items-center justify-center">
                    <div className="text-white text-xs md:text-sm font-bold">89K VIEWS</div>
                </div>
            </div>
            {/* Glassmorphism overlay effect */}
            <div className="absolute inset-0 -bottom-10 bg-gradient-to-t from-white via-white/50 to-transparent z-20"></div>
        </div>
      </div>
    </section>
  );
};