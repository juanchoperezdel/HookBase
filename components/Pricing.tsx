import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 border border-green-200 transform -rotate-1 shadow-sm">
            <Sparkles size={14} />
            La decisión financiera más fácil de tu mes
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black leading-tight">
             Resultados virales por <br className="hidden md:block" />
             <span className="text-zylo-yellow bg-black px-2 rounded-md transform rotate-1 inline-block mt-2">menos de lo que cuesta un almuerzo</span>
          </h2>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
             Desde $15 al mes. Literalmente te sale más barato que una hamburguesa, pero te ahorra 20 horas de estrés y guiones en blanco.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-end">
          {/* Starter Plan */}
          <div className="rounded-[2.5rem] bg-orange-50 p-8 border border-orange-100 relative group hover:border-orange-200 transition-colors">
             <h3 className="text-xl font-bold text-zylo-black text-center mb-2">Starter</h3>
             <div className="text-center mb-6">
                <span className="text-4xl font-extrabold text-zylo-black">$15</span>
                <span className="text-gray-500 text-sm">/mes</span>
             </div>
             <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {[
                    "10 ideas virales por semana",
                    "1 rubro / 1 plataforma",
                    "Análisis básico",
                    "Soporte por email"
                ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <Check size={16} className="text-orange-500 mt-0.5" /> {feat}
                    </li>
                ))}
             </ul>
             <button className="w-full rounded-full bg-orange-400 py-3 text-sm font-bold text-white hover:bg-orange-500 transition-colors">
                Empezar ahora
             </button>
          </div>

          {/* Pro Plan - Featured */}
          <div className="relative rounded-[2.5rem] bg-zylo-purpleLight p-10 border-2 border-zylo-purple shadow-xl z-10">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 px-4 py-1 text-xs font-bold text-white uppercase tracking-wide shadow-md">
                Más Popular
             </div>
             <h3 className="text-2xl font-bold text-zylo-black text-center mb-2">Pro</h3>
             <div className="text-center mb-6">
                <span className="text-5xl font-extrabold text-zylo-black">$29</span>
                <span className="text-gray-500 text-sm">/mes</span>
             </div>
             <ul className="space-y-4 mb-10 text-sm text-zylo-black font-medium">
                {[
                    "25 ideas por semana",
                    "Hasta 3 rubros",
                    "Análisis de competidores",
                    "Plantillas de hooks",
                    "Soporte prioritario"
                ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <Check size={18} className="text-purple-600 mt-0.5" /> {feat}
                    </li>
                ))}
             </ul>
             
             <button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Empezar ahora
             </button>
          </div>

          {/* Elite Plan */}
          <div className="rounded-[2.5rem] bg-green-50 p-8 border border-green-100 relative group hover:border-green-200 transition-colors">
             <h3 className="text-xl font-bold text-zylo-black text-center mb-2">Elite</h3>
             <div className="text-center mb-6">
                <span className="text-4xl font-extrabold text-zylo-black">$49</span>
                <span className="text-gray-500 text-sm">/mes</span>
             </div>
             <ul className="space-y-3 mb-8 text-sm text-gray-600">
                {[
                    "Todo lo anterior",
                    "Plantillas listas para grabar",
                    "Soporte personalizado",
                    "Análisis de trending topics",
                    "Reportes mensuales"
                ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5" /> {feat}
                    </li>
                ))}
             </ul>
             <button className="w-full rounded-full bg-zylo-green py-3 text-sm font-bold text-zylo-black hover:bg-emerald-400 transition-colors">
                Empezar ahora
             </button>
          </div>
        </div>
        
        <div className="mt-12 text-center">
             <button className="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform">
                Quiero empezar ahora
             </button>
        </div>
      </div>
    </section>
  );
};