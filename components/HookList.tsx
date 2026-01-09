import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
import { HookIdea } from '../types';

interface HookListProps {
  hooks: HookIdea[];
}

export const HookList: React.FC<HookListProps> = ({ hooks }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openOriginalVideo = (hookText: string) => {
    // Generamos un link de búsqueda en TikTok para ver ejemplos del hook en acción
    const searchUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(hookText)}`;
    window.open(searchUrl, '_blank');
  };

  if (hooks.length === 0) return null;

  return (
    <div className="w-full mt-24">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-zylo-black tracking-tight mb-4">
          Tus Ganchos <br/>Estratégicos
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl">
          Seleccionamos patrones virales adaptados a tu tema. Haz clic en el icono de la flecha para ver ejemplos reales o copia el texto para empezar a grabar.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {hooks.map((item, index) => {
            const isYellow = index % 2 === 0;
            const cardClasses = isYellow 
                ? 'bg-zylo-yellowLight text-zylo-black' 
                : 'bg-zylo-purpleLight text-zylo-black';
            
            const tagClasses = 'bg-white text-zylo-black';
            const iconContainerClasses = 'bg-white';

            return (
                <div 
                    key={index} 
                    className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-card flex flex-col min-h-[320px] ${cardClasses}`}
                >
                    {/* Top Tag */}
                    <div className="flex justify-between items-start">
                        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm ${tagClasses}`}>
                            <div className={`w-2 h-2 rounded-full ${isYellow ? 'bg-zylo-purple' : 'bg-zylo-green'}`}></div>
                            {item.category}
                        </span>
                    </div>

                    <div className="mt-8 mb-6">
                        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                           "{item.hook}"
                        </h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-end justify-between mt-auto gap-4">
                        <div className="max-w-full md:max-w-[65%]">
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Psicología del Hook</p>
                             <p className="text-sm font-medium leading-relaxed opacity-70">
                                {item.explanation}
                             </p>
                        </div>
                        
                        <div className="flex gap-2">
                            {/* Botón para abrir video original (Referencia) */}
                            <button 
                                onClick={() => openOriginalVideo(item.hook)}
                                title="Ver video original / referencia"
                                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all hover:scale-110 active:scale-95 border border-black/5 ${iconContainerClasses}`}
                            >
                                <ArrowUpRight size={20} className="text-zylo-black" />
                            </button>

                            {/* Botón para copiar */}
                            <button 
                                onClick={() => handleCopy(item.hook, index)}
                                title="Copiar gancho"
                                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all hover:scale-110 active:scale-95 border border-black/5 ${iconContainerClasses}`}
                            >
                                {copiedIndex === index ? (
                                    <Check size={20} className="text-green-500" />
                                ) : (
                                    <Copy size={18} className="text-zylo-black" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Decorative Patterns */}
                    {isYellow ? (
                        <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-zylo-yellow opacity-40 blur-3xl pointer-events-none"></div>
                    ) : (
                         <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-zylo-purple opacity-40 blur-3xl pointer-events-none"></div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};