import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Plane, Camera, Megaphone, UserCheck, PiggyBank } from 'lucide-react';

export const ROICalculator: React.FC = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(10000);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Calculations
  // Assuming HookBase saves ~80% of the time.
  const timeSavedPercentage = 0.8; 
  const hoursSavedPerMonth = (hoursPerWeek * 4) * timeSavedPercentage;
  const moneySavedPerMonth = hoursSavedPerMonth * hourlyRate;
  
  // Rotating suggestions for what to do with the money
  const suggestions = [
    { text: "invertir en más publicidad para tu negocio", icon: Megaphone },
    { text: "ahorrar para tus próximas vacaciones soñadas", icon: Plane },
    { text: "renovar tu cámara y equipo de grabación", icon: Camera },
    { text: "empezar tu portafolio de inversiones", icon: TrendingUp },
    { text: "delegar tareas operativas a un freelancer", icon: UserCheck },
    { text: "crear un fondo de emergencia para tu empresa", icon: PiggyBank },
  ];

  // Rotate suggestions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentSuggestion = suggestions[suggestionIndex];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black mb-4">
            ¿Cuánto te cuesta <span className="text-red-500 italic">no usar</span> HookBase?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Tu tiempo es dinero. Calcula cuánto estás perdiendo cada mes por buscar tendencias y guionar manualmente.
          </p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Controls Side (Left) */}
          <div className="p-8 md:p-12 flex-1 bg-gray-50 flex flex-col justify-center gap-10">
            
            {/* Slider: Hours */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
                        <Clock size={16} className="text-zylo-purple" /> Horas semanales creando contenido
                    </label>
                    <span className="text-2xl font-bold text-zylo-black bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                        {hoursPerWeek}h
                    </span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="40" 
                    step="1"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-zylo-purple hover:accent-purple-600 transition-all"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                    <span>1h (Hobby)</span>
                    <span>40h (Full Time)</span>
                </div>
            </div>

            {/* Input: Hourly Rate */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
                        <DollarSign size={16} className="text-zylo-green" /> Valor de tu hora (Pesos)
                    </label>
                    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden px-3 py-1 focus-within:ring-2 focus-within:ring-zylo-green/50 transition-all">
                        <span className="text-gray-400 font-bold mr-1">$</span>
                        <input 
                            type="number" 
                            min="1"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="w-24 font-bold text-xl text-zylo-black outline-none bg-transparent"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Si no sabés cuánto vale tu hora, pensá cuánto le pagarías a alguien por hacer tu trabajo operativo.
                </p>
            </div>

          </div>

          {/* Results Side (Right) */}
          <div className="p-8 md:p-12 flex-1 bg-zylo-black text-white flex flex-col justify-center relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-zylo-green opacity-20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-zylo-purple opacity-20 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

             <div className="relative z-10">
                <p className="text-gray-400 font-medium mb-2 uppercase tracking-widest text-xs">Ahorro Mensual Estimado</p>
                <div className="text-6xl md:text-7xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-zylo-green to-emerald-400">
                    ${moneySavedPerMonth.toLocaleString()}
                </div>
                <p className="text-gray-400 mb-8 flex items-center gap-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-bold">{hoursSavedPerMonth.toFixed(0)} horas</span> recuperadas al mes
                </p>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-32 flex items-center">
                    <div className="flex items-start gap-4 w-full">
                        {/* Animated Icon Container */}
                        <div 
                            key={`icon-${suggestionIndex}`}
                            className="p-3 bg-zylo-purple rounded-full text-white mt-1 shadow-lg shadow-purple-900/20 animate-in fade-in zoom-in duration-500"
                        >
                            <currentSuggestion.icon size={20} fill="currentColor" />
                        </div>
                        
                        <div className="flex-1">
                            <p className="font-bold text-lg mb-1">¿Qué podrías hacer con esto?</p>
                            <div className="text-gray-300 text-sm leading-relaxed">
                                Ese dinero extra te alcanzaría para... <br/>
                                {/* Animated Text Container */}
                                <span 
                                    key={`text-${suggestionIndex}`} 
                                    className="text-white font-bold underline decoration-zylo-green decoration-2 underline-offset-2 block mt-1 animate-in fade-in slide-in-from-bottom-2 duration-500"
                                >
                                    {currentSuggestion.text}.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between opacity-80">
                     <span className="text-sm">Inversión en HookBase:</span>
                     <span className="text-xl font-bold text-white">$10.000/mes</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
