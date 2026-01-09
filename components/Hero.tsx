import React from 'react';
import { FileText, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/moving-border';

interface HeroProps {
  onDemoClick?: () => void;
  onGetStarted?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDemoClick, onGetStarted }) => {
  return (
    <section className="relative overflow-hidden pb-10 pt-10 lg:pb-32 lg:pt-20">
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-zylo-greenLight rounded-full opacity-40 blur-[120px] hidden lg:block"></div>
      <div className="absolute top-40 left-0 -z-10 w-[400px] h-[400px] bg-zylo-purpleLight rounded-full opacity-40 blur-[100px] hidden lg:block"></div>

      <div className="container mx-auto px-6 md:px-12 text-center">
        
        {/* Badge Indicator */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-zylo-greenLight/50 px-5 py-2 text-sm font-bold text-zylo-black border border-zylo-green/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zylo-green"></span>
            </span>
            Contenido viral basado en datos reales
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-zylo-black sm:text-6xl md:text-7xl mb-4 leading-[1.1]">
          Dejá de adivinar qué grabar.<br />
          Recibí <span className="text-zylo-purple">ideas de videos virales</span> que ya están funcionando en tu industria
        </h1>

        {/* Descriptive Text */}
        <p className="mx-auto max-w-3xl text-base md:text-xl text-gray-500 mb-10 font-medium px-4">
          Contenido real. Analizado por IA. Listo para copiar, adaptar y publicar.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-16 px-4">
          <Button 
            onClick={onGetStarted}
            borderRadius="9999px"
            containerClassName="p-[2px] w-full sm:w-auto"
            borderClassName="bg-[radial-gradient(var(--zylo-purple)_40%,transparent_60%)]"
            duration={3000}
            className="flex items-center justify-center gap-3 bg-zylo-black px-8 md:px-10 py-4 md:py-5 text-lg font-bold text-white transition-all hover:bg-gray-800 cursor-pointer shadow-xl w-full"
          >
            Empezar ahora
            <ArrowRight size={20} />
          </Button>
          
          <button 
            onClick={onDemoClick}
            className="flex items-center justify-center gap-3 rounded-full bg-white border-2 border-gray-200 px-8 md:px-10 py-4 md:py-5 text-lg font-bold text-zylo-black hover:border-zylo-black hover:bg-gray-50 transition-all shadow-sm group w-full sm:w-auto"
          >
            <FileText size={20} className="text-gray-400 group-hover:text-zylo-black transition-colors" />
            Ver reporte demo
          </button>
        </div>
        
        {/* Restored Features / Trust Markers - Optimized for Responsive Layout */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 md:gap-10 mb-16 animate-fade-in px-4">
            <div className="flex items-center gap-3 text-gray-400 font-bold group">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zylo-green text-zylo-green group-hover:bg-zylo-green/10 transition-colors">
                    <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-base md:text-xl">Reportes personalizados</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400 font-bold group">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zylo-green text-zylo-green group-hover:bg-zylo-green/10 transition-colors">
                    <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-base md:text-xl">7 días gratis</span>
            </div>

            <div className="flex items-center gap-3 text-gray-400 font-bold group">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zylo-green text-zylo-green group-hover:bg-zylo-green/10 transition-colors">
                    <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-base md:text-xl">Sin tarjeta de crédito</span>
            </div>
        </div>

        {/* Floating Mockup Cards - Optimized for Mobile */}
        <div className="relative mx-auto mt-10 max-w-4xl px-2">
            <div className="flex justify-center items-center gap-2 md:gap-10 perspective-1000 scale-[0.85] sm:scale-100">
                
                {/* Retention Card */}
                <div className="w-28 sm:w-40 md:w-60 h-24 sm:h-28 md:h-40 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl sm:rounded-3xl shadow-xl transform rotate-[-6deg] sm:rotate-[-8deg] translate-x-2 sm:translate-x-0 hover:rotate-0 transition-transform duration-500 flex flex-col p-3 sm:p-6 items-start justify-end text-left border border-white/20">
                     <div className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Retención Promedio</div>
                     <div className="text-white text-xl sm:text-3xl font-black">94.2%</div>
                </div>

                {/* Growth Card (Center) */}
                <div className="w-32 sm:w-48 md:w-64 h-28 sm:h-32 md:h-44 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 transform scale-110 flex flex-col p-4 sm:p-8 items-start justify-end text-left border border-white/10">
                    <div className="flex flex-col mb-1 sm:mb-2">
                        <span className="text-zylo-green text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none">Crecimiento</span>
                        <span className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none">Mensual</span>
                    </div>
                    <div className="text-white text-lg sm:text-2xl md:text-3xl font-black leading-tight">
                        +12.4k<br/>followers
                    </div>
                </div>

                {/* Viral Score Card */}
                <div className="w-28 sm:w-40 md:w-60 h-24 sm:h-28 md:h-40 bg-gradient-to-br from-zylo-purple to-indigo-600 rounded-2xl sm:rounded-3xl shadow-xl transform rotate-[6deg] sm:rotate-[8deg] -translate-x-2 sm:translate-x-0 hover:rotate-0 transition-transform duration-500 flex flex-col p-3 sm:p-6 items-start justify-end text-left border border-white/20">
                    <div className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Score de Viralidad</div>
                    <div className="text-white text-xl sm:text-3xl font-black">9.8/10</div>
                </div>
            </div>
            
            {/* Visual Fade effect */}
            <div className="absolute inset-x-0 -bottom-10 h-32 md:h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-20"></div>
        </div>
      </div>
    </section>
  );
};