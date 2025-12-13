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

  if (hooks.length === 0) return null;

  return (
    <div className="w-full mt-24">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-zylo-black tracking-tight mb-4">
          Elige tu Servicio de <br/>Crecimiento
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl">
          Selecciona el hook perfecto adaptado a tus necesidades y comienza a acelerar tu presencia en redes sociales hoy mismo.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {hooks.map((item, index) => {
            // Replicate the Yellow and Pink card styles from Zylo image
            const isYellow = index % 2 === 0; // "Starter Growth Pack" style
            const cardClasses = isYellow 
                ? 'bg-zylo-yellowLight text-zylo-black' 
                : 'bg-zylo-purpleLight text-zylo-black';
            
            // The tag/badge style inside the card
            const tagClasses = isYellow
                ? 'bg-white text-zylo-black'
                : 'bg-white text-zylo-black';

            // Button icon style
            const iconClasses = isYellow
                ? 'bg-white'
                : 'bg-white';

            return (
                <div 
                    key={index} 
                    className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-card ${cardClasses}`}
                >
                    {/* Top Tag */}
                    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${tagClasses}`}>
                        <div className={`w-2 h-2 rounded-full ${isYellow ? 'bg-zylo-purple' : 'bg-zylo-green'}`}></div>
                        {item.category}
                    </span>

                    <div className="mt-8 mb-12">
                        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
                           "{item.hook}"
                        </h3>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                        <div className="max-w-[70%]">
                             <p className="text-sm font-semibold opacity-80 mb-1">Por qué funciona:</p>
                             <p className="text-sm font-medium leading-relaxed opacity-70">
                                {item.explanation}
                             </p>
                        </div>
                        
                        <button 
                            onClick={() => handleCopy(item.hook, index)}
                            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-110 active:scale-95 ${iconClasses}`}
                        >
                            {copiedIndex === index ? (
                                <Check size={20} className="text-green-500" />
                            ) : (
                                <ArrowUpRight size={20} className="text-zylo-black" />
                            )}
                        </button>
                    </div>

                    {/* Decorative Image/Pattern Placeholder (Right side like in the image) */}
                    {isYellow ? (
                        <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-zylo-yellow opacity-50 blur-2xl pointer-events-none"></div>
                    ) : (
                         <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-zylo-purple opacity-50 blur-2xl pointer-events-none"></div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};