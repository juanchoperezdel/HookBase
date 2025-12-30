
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ExternalLink, Video, Music, 
  ChevronRight, ChevronLeft, Zap, Camera, 
  Loader2, Play, Info, Share2, BarChart3, 
  Target, MessageCircle, Clock, TrendingUp
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'motion/react';

const ScriptItem = ({ title, audio, visual, color }: any) => {
    const colors: any = {
        purple: "bg-zylo-purpleLight text-zylo-purple border-zylo-purple/20",
        green: "bg-zylo-greenLight text-emerald-600 border-zylo-green/20",
        yellow: "bg-zylo-yellowLight text-amber-600 border-zylo-yellow/20"
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-soft hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[color] || colors.purple}`}>
                    {title}
                </span>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-zylo-purple transition-colors">
                    <Zap size={14} fill="currentColor" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Music size={12} /> Audio (Lo que dices)
                    </p>
                    <div className="p-5 rounded-2xl border-2 border-gray-50 bg-gray-50/30 group-hover:border-zylo-purple/20 transition-colors">
                        <p className="text-zylo-black font-bold text-base leading-relaxed">
                            {audio ? `“${audio}”` : <span className="text-gray-300 italic">No especificado en la base de datos.</span>}
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Camera size={12} /> Visual (Lo que muestras)
                    </p>
                    <div className="px-1">
                        <p className="text-gray-500 text-sm leading-relaxed italic">
                            {visual || "Sin instrucciones visuales específicas."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ReportPage = ({ onBack, reportId }: { onBack: () => void, reportId?: string }) => {
  const [report, setReport] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!reportId) return;
    try {
        setLoading(true);
        // 1. Traer metadata del reporte
        const { data: reportData } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .single();
        
        setReport(reportData);

        // 2. Traer los 5 videos analizados con sus guiones adaptados
        const { data: postsData } = await supabase
            .from('posts')
            .select('*')
            .eq('report_id', reportId)
            .order('final_score', { ascending: false })
            .limit(5);
        
        setVideos(postsData || []);
    } catch (e) {
        console.error("Error loading report data", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reportId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
            <Loader2 className="animate-spin text-zylo-purple" size={48} />
            <Zap className="absolute inset-0 m-auto text-zylo-purple animate-pulse" size={20} fill="currentColor" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Sincronizando con Supabase...</p>
    </div>
  );

  const activeVideo = videos[activeIndex];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans text-zylo-black">
      {/* Navbar Superior */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-zylo-black transition-colors group">
                <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-zylo-black group-hover:text-white transition-all">
                    <ArrowLeft size={18} />
                </div>
                Volver al Dashboard
            </button>
            <div className="flex items-center gap-3">
                <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest text-gray-300">Compartir Reporte</span>
                <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    <Share2 size={18} className="text-gray-400" />
                </button>
            </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-12 mt-12 max-w-7xl">
        <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-zylo-green text-zylo-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Reporte Analizado</span>
                        <span className="text-gray-300 text-[10px] font-bold">ID: {reportId?.slice(0, 8)}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Estrategia Viral</h1>
                </div>
                <div className="flex gap-2">
                    {videos.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveIndex(i)}
                            className={`w-10 h-10 rounded-xl font-black text-sm transition-all border-2 ${activeIndex === i ? 'bg-zylo-black text-white border-zylo-black shadow-lg scale-110' : 'bg-white text-gray-300 border-gray-100 hover:border-gray-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar con Video Original */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-zylo-black rounded-[3rem] p-1 overflow-hidden shadow-2xl group border-4 border-white">
                    <div className="aspect-[9/16] bg-gray-900 relative rounded-[2.8rem] overflow-hidden">
                        {/* Placeholder de Video o Video Real */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Play size={32} className="text-white fill-current" />
                            </div>
                            <h4 className="text-white font-black text-xl mb-2">Referencia Viral</h4>
                            <p className="text-gray-400 text-xs mb-8">Este es el video original que analizamos para crear tu guion.</p>
                            <a 
                                href={activeVideo?.original_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-white text-zylo-black px-6 py-3 rounded-full font-black text-xs flex items-center gap-2 hover:bg-zylo-green transition-colors"
                            >
                                <ExternalLink size={14} /> Ver en Plataforma
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-soft">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <BarChart3 size={12} /> Métricas de Referencia
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Viral Score</p>
                            <p className="text-2xl font-black text-zylo-purple">{(activeVideo?.final_score * 10).toFixed(1)}/10</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Account</p>
                            <p className="text-xs font-bold truncate">@{activeVideo?.account_name || 'Creator'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido Principal - Guion de Supabase */}
            <div className="lg:col-span-8 space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-3 bg-zylo-black text-white rounded-2xl">
                                    <Video size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Analizando Estrategia</p>
                                    <h2 className="text-2xl font-black">Escaleta de Producción #{activeIndex + 1}</h2>
                                </div>
                             </div>
                             <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-gray-300">
                                {/* Fix: Added missing Clock and TrendingUp imports above */}
                                <span className="flex items-center gap-1"><Clock size={12} /> ~45s</span>
                                <span className="flex items-center gap-1 text-zylo-green"><TrendingUp size={12} /> Alta Retención</span>
                             </div>
                        </div>

                        <ScriptItem 
                            title="1. El Hook (Gancho)" 
                            audio={activeVideo?.hook_audio} 
                            visual={activeVideo?.hook_visual}
                            color="purple" 
                        />

                        <ScriptItem 
                            title="2. El Body (Valor)" 
                            audio={activeVideo?.body_audio} 
                            visual={activeVideo?.body_visual}
                            color="green" 
                        />

                        <ScriptItem 
                            title="3. El CTA (Llamada a la acción)" 
                            audio={activeVideo?.cta_audio} 
                            visual={activeVideo?.cta_visual}
                            color="yellow" 
                        />

                        <div className="bg-zylo-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/10 mt-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-zylo-green opacity-10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-zylo-green text-zylo-black rounded-lg">
                                        <Target size={20} />
                                    </div>
                                    <h3 className="text-xl font-black">Ángulo de Adaptación</h3>
                                </div>
                                <p className="text-gray-300 text-lg leading-relaxed font-medium italic">
                                    {activeVideo?.adaptation_angle || "Mantén el ritmo acelerado del original pero cambia el sujeto por tu producto estrella. Asegúrate de que el hook de texto en pantalla coincida exactamente con el audio."}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between pt-10 border-t border-gray-100">
                    <button 
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                        className="flex items-center gap-2 font-black text-sm text-gray-400 hover:text-zylo-black disabled:opacity-20 transition-all group"
                    >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Video Anterior
                    </button>
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        {activeIndex + 1} de {videos.length}
                    </div>
                    <button 
                        disabled={activeIndex === videos.length - 1}
                        onClick={() => setActiveIndex(prev => Math.min(videos.length - 1, prev + 1))}
                        className="flex items-center gap-2 font-black text-sm text-gray-400 hover:text-zylo-black disabled:opacity-20 transition-all group"
                    >
                        Siguiente Estrategia <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};
