import React from 'react';
import { CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react';

interface DataProofProps {
  onGetStarted?: () => void;
}

export const DataProof: React.FC<DataProofProps> = ({ onGetStarted }) => {
  const samples = [
    {
      niche: "Inmobiliaria",
      hook: "Deja de perder dinero alquilando: la regla del 5%",
      views: "1.2M",
      type: "Educativo",
      badgeColor: "bg-pink-50 text-pink-600 border-pink-100"
    },
    {
      niche: "Fitness",
      hook: "3 errores de desayuno que te inflaman el abdomen",
      views: "850K",
      type: "Desmitificación",
      badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-100"
    },
    {
      niche: "Negocios",
      hook: "Cómo vender sin vender en 2024 (Estrategia)",
      views: "420K",
      type: "Estrategia",
      badgeColor: "bg-purple-50 text-purple-600 border-purple-100"
    }
  ];

  return (
    <section className="py-20 bg-gray-50/50 border-b border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zylo-black mb-6">
            Lo que <span className="text-zylo-purple">HookBase</span> detecta antes que vos
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {["Videos reales", "Métricas reales", "Nichos reales"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-bold text-gray-700">
                <CheckCircle2 size={16} className="text-zylo-green" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {samples.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-6 shadow-soft border border-gray-100 hover:shadow-card transition-all hover:-translate-y-1 group">
              
              {/* Top Row: Niche Only */}
              <div className="flex items-center mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${item.badgeColor}`}>
                   {item.niche}
                </span>
              </div>

              {/* Hook Content */}
              <div className="mb-6 relative">
                <div className="absolute -left-2 -top-2 text-4xl text-gray-100 font-serif font-black z-0">“</div>
                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-2 pl-1 relative z-10">HOOK DETECTADO</p>
                <h3 className="text-lg font-bold text-zylo-black leading-snug relative z-10 group-hover:text-zylo-purple transition-colors">
                  "{item.hook}"
                </h3>
              </div>

              {/* Bottom Metrics */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Vistas Reales</span>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                    <PlayCircle size={14} className="text-zylo-black fill-gray-100" />
                    {item.views}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Formato</span>
                   <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-zylo-green"></span>
                      {item.type}
                   </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
             <button 
               onClick={onGetStarted}
               className="inline-flex items-center gap-2 rounded-full bg-zylo-black px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-gray-800 hover:scale-105 transition-all group"
             >
                Quiero acceder a esta data ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
        </div>

      </div>
    </section>
  );
};