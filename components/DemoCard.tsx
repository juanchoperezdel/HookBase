import React from 'react';
import { Eye, Heart, Target, Video, MessageCircle, Lightbulb, ExternalLink } from 'lucide-react';

interface DemoCardProps {
  onShowReport?: () => void;
}

export const DemoCard: React.FC<DemoCardProps> = ({ onShowReport }) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 via-transparent to-transparent opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black tracking-tight mb-6">
            Así se ve una entrega de <span className="text-zylo-green">HookBase</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
             Recibes tarjetas de estrategia claras, visuales y accionables. Sin relleno.
          </p>
        </div>

        {/* The Card Container */}
        <div className="mx-auto max-w-[800px] bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative transition-transform hover:-translate-y-2 duration-500">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zylo-black text-white text-lg font-bold shadow-lg shadow-gray-200">
                #1
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Idea Viral</span>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-gray-100 px-6 py-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
              SKINCARE
            </span>
          </div>

          {/* Hook Box */}
          <div className="mb-8 group">
            <div className="flex items-center gap-2 mb-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">
                <span className="text-red-500 text-sm">📍</span> Hook:
            </div>
            <div className="rounded-3xl bg-[#FFF5F5] p-6 md:p-8 border border-red-50 transition-colors group-hover:border-red-100">
                <p className="text-xl md:text-3xl font-extrabold text-gray-900 leading-tight text-center md:text-left">
                    "3 cosas que <span className="text-red-500">NADIE</span> te dice sobre tu shampoo"
                </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 mb-10">
            <div className="rounded-3xl bg-[#E6FFFA] p-6 flex flex-col justify-center border border-emerald-50">
                <div className="flex items-center gap-2 mb-2 text-emerald-600 text-[10px] md:text-xs font-black uppercase tracking-widest">
                    <Eye size={14} strokeWidth={3} /> VIEWS
                </div>
                <span className="text-3xl md:text-4xl font-black text-emerald-900 tracking-tight">243K</span>
            </div>
            <div className="rounded-3xl bg-[#FFF5F5] p-6 flex flex-col justify-center border border-rose-50">
                <div className="flex items-center gap-2 mb-2 text-rose-600 text-[10px] md:text-xs font-black uppercase tracking-widest">
                    <Heart size={14} strokeWidth={3} /> LIKES
                </div>
                <span className="text-3xl md:text-4xl font-black text-rose-900 tracking-tight">19.400</span>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-5 mb-10 pl-2">
            <div className="flex items-start md:items-center gap-4 text-base">
                <div className="mt-1 md:mt-0 p-2 rounded-full bg-purple-50 text-purple-600">
                    <Target size={20} />
                </div>
                <div className="flex flex-col md:flex-row md:gap-2">
                    <span className="font-bold text-gray-900">Tipo:</span> 
                    <span className="text-gray-600 font-medium">Educativo + shock</span>
                </div>
            </div>
            <div className="flex items-start md:items-center gap-4 text-base">
                <div className="mt-1 md:mt-0 p-2 rounded-full bg-blue-50 text-blue-600">
                    <Video size={20} />
                </div>
                <div className="flex flex-col md:flex-row md:gap-2">
                    <span className="font-bold text-gray-900">Formato:</span> 
                    <span className="text-gray-600 font-medium">Face to cam + texto en pantalla</span>
                </div>
            </div>
            <div className="flex items-start md:items-center gap-4 text-base">
                <div className="mt-1 md:mt-0 p-2 rounded-full bg-green-50 text-green-600">
                    <MessageCircle size={20} />
                </div>
                 <div className="flex flex-col md:flex-row md:gap-2">
                    <span className="font-bold text-gray-900">CTA:</span> 
                    <span className="text-gray-600 font-medium">Implícita ("no cometas estos errores")</span>
                </div>
            </div>
          </div>

          {/* Adaptation Advice - Dark Box */}
          <div className="rounded-3xl bg-[#1A202C] p-8 text-white relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-zylo-green opacity-10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

             <div className="flex items-center gap-2 mb-3 font-bold text-zylo-green text-sm uppercase tracking-wider relative z-10">
                 <Lightbulb size={18} strokeWidth={2.5} /> Adaptalo así:
             </div>
             <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90 relative z-10">
                 Mismo formato, pero con tu producto estrella + frase "Evitalo YA"
             </p>
          </div>
          
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
            <button 
                onClick={onShowReport}
                className="group inline-flex items-center gap-3 rounded-full bg-white border-2 border-gray-100 px-8 py-4 text-lg font-bold text-zylo-black shadow-lg hover:border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all duration-300"
            >
                Ver ejemplo de reporte completo
                <ExternalLink size={18} className="text-gray-400 group-hover:text-zylo-purple transition-colors" />
            </button>
        </div>

      </div>
    </section>
  );
};