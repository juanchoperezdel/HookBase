
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, ExternalLink, Copy, CheckCircle2, Video, Music, Clock, 
  Calendar, Eye, Heart, ChevronRight, ChevronLeft, Check, Layers,
  ChevronDown, ChevronUp, TrendingUp, Play, Scissors, Sparkles, Camera, Lightbulb, Zap,
  MousePointer2, Share2, ClipboardCheck, BarChart3, ArrowRight, Loader2
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { GoogleGenAI, Type } from "@google/genai";
import { motion } from 'motion/react';

// --- HELPERS ---

/**
 * Función de extracción con prompt ultra-específico basado en el formato exacto del reporte proporcionado por el usuario.
 */
const extractFidelityScriptFromAI = async (detailedAnalysis: string, docLink: string | null) => {
  if (!detailedAnalysis || detailedAnalysis.length < 10) return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      ACTÚA COMO UN TRANSCRIPTOR DE DATOS DE ALTA FIDELIDAD.
      TU ÚNICA MISIÓN: Extraer el texto EXACTO del reporte proporcionado. NO resumas. NO adaptes. NO cambies ni una coma.

      CONEXIÓN CON EL DOCUMENTO FUENTE:
      Link del Google Doc analizado: ${docLink || 'No disponible'}

      CONTENIDO DEL REPORTE A ANALIZAR (DETAILED ANALYSIS):
      "${detailedAnalysis}"

      INSTRUCCIONES DE EXTRACCIÓN (REGLAS DE ORO):
      Debes localizar la sección "🎬 Guión Adaptado (Listo para Grabar)" y procesar cada bloque exactamente así:

      1. HOOK (Gancho): Busca la sección "🎤 Hook". Extrae literalmente lo que sigue a "Texto hablado:" y lo que sigue a "Descripción visual:".
      2. BODY (Desarrollo): Busca la sección "📄 Desarrollo / Body". Extrae literalmente lo que sigue a "Texto hablado:" y lo que sigue a "Descripción visual:".
      3. CTA (Cierre): Busca la sección "📢 CTA". Extrae literalmente lo que sigue a "Texto hablado:" y lo que sigue a "Descripción visual:".
      4. GUÍA TÉCNICA Y VISUAL: Extrae de forma íntegra y literal las secciones:
         - "📷 Visuales sugeridas"
         - "🎞️ Sugerencia de visuales tipo"
         - "🔤 Tipografías sugeridas"
         - "🎙️ Tono sugerido"
         - "📽️ Formato de ejecución"
         - "⏱️ Duración estimada"

      FORMATO DE RESPUESTA REQUERIDO (JSON ESTRICTO):
      {
        "hook": {
          "audio": "Contenido literal de Texto hablado del Hook",
          "visual": "Contenido literal de Descripción visual del Hook"
        },
        "body": {
          "audio": "Contenido literal de Texto hablado del Body",
          "visual": "Contenido literal de Descripción visual del Body"
        },
        "cta": {
          "audio": "Contenido literal de Texto hablado del CTA",
          "visual": "Contenido literal de Descripción visual del CTA"
        },
        "guide": "Contenido literal concatenado de Visuales sugeridas, Tipografía, Tono, Formato y Duración"
      }

      AVISO: El usuario necesita una copia fiel y exacta. Si el texto dice "Texto hablado: '¿Sabías que...?'", tu respuesta en el JSON debe ser "¿Sabías que...?".
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { 
              type: Type.OBJECT, 
              properties: { audio: { type: Type.STRING }, visual: { type: Type.STRING } }, 
              required: ["audio", "visual"] 
            },
            body: { 
              type: Type.OBJECT, 
              properties: { audio: { type: Type.STRING }, visual: { type: Type.STRING } }, 
              required: ["audio", "visual"] 
            },
            cta: { 
              type: Type.OBJECT, 
              properties: { audio: { type: Type.STRING }, visual: { type: Type.STRING } }, 
              required: ["audio", "visual"] 
            },
            guide: { type: Type.STRING }
          },
          required: ["hook", "body", "cta", "guide"]
        }
      }
    });

    const result = response.text;
    if (!result) return null;
    return JSON.parse(result);
  } catch (error) {
    console.error("Fidelity Extraction Error:", error);
    return null;
  }
};

const adaptToUI = (posts: any[], analyses: any[], reportData: any) => {
  return posts.map((post, idx) => {
    const analysis = analyses.find(a => String(a.post_id) === String(post.id)) || {};
    return {
      id: post.id || idx,
      account: post.username ? `@${post.username}` : "Usuario",
      score: Number(post.final_score || 0).toFixed(1),
      url: post.post_url,
      doc_link: reportData?.final_slide_url || null,
      avatar: `https://ui-avatars.com/api/?name=${post.username || 'U'}&background=random&color=fff`,
      detailed_analysis: analysis.analisis_detallado || "",
      isLoaded: false,
      script: {
        hook: { audio: "Extrayendo del reporte...", visual: "Analizando visuales..." },
        body: { audio: "Buscando en el documento...", visual: "Analizando visuales..." },
        cta: { audio: "Preparando cierre...", visual: "Analizando visuales..." },
        guide: ""
      }
    };
  });
};

const ScriptItem = ({ index, type, audio, visual, guide, color }: any) => {
    const [showGuide, setShowGuide] = useState(false);
    const colorMap: any = {
        red: { bg: 'bg-red-50', text: 'text-red-500', circle: 'border-red-100 text-red-400' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-500', circle: 'border-blue-100 text-blue-400' },
        green: { bg: 'bg-green-50', text: 'text-green-500', circle: 'border-green-100 text-green-400' }
    };
    const s = colorMap[color] || colorMap.blue;

    return (
        <div className="flex gap-4 md:gap-8 items-start relative">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border mt-4 bg-white shadow-sm ${s.circle}`}>
                {index + 1}
            </div>
            
            <div className="flex-1 bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-soft hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <span className={`${s.bg} ${s.text} text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase`}>{type}</span>
                    </div>
                    <button 
                        onClick={() => setShowGuide(!showGuide)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${showGuide ? 'bg-zylo-black text-white' : 'text-gray-400 border-gray-100 hover:border-gray-300'}`}
                    >
                        <Scissors size={14} /> Guía
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Music size={12} /> Audio Literal
                        </div>
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-dashed border-gray-100 min-h-[80px] flex items-center">
                             <p className="text-gray-900 font-bold text-base leading-relaxed">“{audio}”</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Video size={12} /> Visual Literal
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed px-1 italic">{visual}</p>
                    </div>
                </div>

                {showGuide && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-6 border-t border-gray-100"
                    >
                        <div className="bg-zylo-purpleLight/20 p-5 rounded-2xl border border-zylo-purple/10">
                            <div className="flex items-center gap-2 text-[10px] font-black text-zylo-purple uppercase mb-3">
                                <Lightbulb size={14} /> Instrucciones Técnicas
                            </div>
                            <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-line">{guide || "Sigue el ritmo del video original analizado."}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export const ReportPage = ({ onBack, reportId }: any) => {
  const [videoData, setVideoData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const processingRef = useRef<Set<number>>(new Set());

  const loadData = async () => {
    if (!reportId) return;
    
    const { data: reportInfo } = await supabase.from('reports').select('*').eq('id', reportId).single();
    const { data: posts } = await supabase.from('posts').select('*').eq('report_id', reportId).order('final_score', { ascending: false });
    const { data: analyses } = await supabase.from('analyses').select('*').eq('report_id', reportId);
    
    if (posts) {
      setVideoData(prev => {
        const newData = adaptToUI(posts, analyses || [], reportInfo);
        return newData.map(item => {
          const existing = prev.find(p => p.id === item.id);
          // Si ya lo tenemos cargado y tiene script real, mantenerlo
          if (existing && existing.isLoaded) return existing;
          return item;
        });
      });
    }
  };

  useEffect(() => {
    const init = async () => {
        setLoading(true);
        await loadData();
        setLoading(false);
    };
    init();

    const channel = supabase
      .channel(`report-fidelity-${reportId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'analyses', filter: `report_id=eq.${reportId}` },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reportId]);

  // PROCESADOR DE FIDELIDAD EN TIEMPO REAL
  useEffect(() => {
    const syncCurrent = async () => {
        const current = videoData[activeIndex];
        if (!current || !current.detailed_analysis || current.isLoaded || processingRef.current.has(activeIndex)) {
            return;
        }

        processingRef.current.add(activeIndex);
        setSyncing(true);

        const res = await extractFidelityScriptFromAI(current.detailed_analysis, current.doc_link);
        
        if (res) {
            setVideoData(prev => {
                const copy = [...prev];
                if (copy[activeIndex]) {
                    copy[activeIndex] = {
                        ...copy[activeIndex],
                        isLoaded: true,
                        script: {
                            hook: { audio: res.hook.audio, visual: res.hook.visual },
                            body: { audio: res.body.audio, visual: res.body.visual },
                            cta: { audio: res.cta.audio, visual: res.cta.visual },
                            guide: res.guide
                        }
                    };
                }
                return copy;
            });
        }
        
        setSyncing(false);
    };

    if (videoData.length > 0) {
        syncCurrent();
    }
  }, [activeIndex, videoData]);

  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <Loader2 className="animate-spin text-zylo-purple mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sincronizando Reporte de Google Docs...</p>
      </div>
  );

  const activeVideo = videoData[activeIndex] || { script: { hook: {}, body: {}, cta: {} } };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft size={20}/></button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-black uppercase tracking-tight">Estrategia Viral</h1>
                    <div className="flex items-center gap-2">
                        {syncing ? (
                            <span className="text-[9px] font-black text-zylo-purple animate-pulse flex items-center gap-1"><Zap size={10} fill="currentColor"/> Extrayendo Guión Adaptado...</span>
                        ) : (
                            <span className="text-[9px] font-black text-zylo-green flex items-center gap-1"><CheckCircle2 size={10}/> Reporte Sincronizado</span>
                        )}
                    </div>
                </div>
            </div>
            {activeVideo.doc_link && (
                <a 
                    href={activeVideo.doc_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-zylo-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                >
                    <ExternalLink size={14} /> Abrir Google Docs
                </a>
            )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-card flex flex-col items-center text-center border border-gray-100">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-zylo-purple to-zylo-green mb-4">
                        <img src={activeVideo.avatar} className="w-full h-full rounded-full border-4 border-white" alt="profile"/>
                    </div>
                    <h2 className="text-2xl font-black">{activeVideo.account}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Referencia Viral</p>
                    <a href={activeVideo.url} target="_blank" className="bg-zylo-black text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all">
                        <Play size={14} fill="currentColor"/> Ver Referencia
                    </a>
                </div>
                <div className="bg-zylo-black rounded-[2.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl border border-gray-800">
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-zylo-green uppercase tracking-widest mb-2 block">Viral Score</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl font-black tracking-tighter">{activeVideo.score}</span>
                            <span className="text-xl font-bold text-gray-500">/10</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zylo-purple opacity-20 blur-3xl rounded-full"></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-card border border-gray-100">
                <div className="mb-12">
                    <h3 className="text-3xl font-black tracking-tight mb-2">Guion Adaptado</h3>
                    <p className="text-gray-400 font-medium">Contenido extraído directamente de la sección "🎬 Guión Adaptado" del reporte.</p>
                </div>
                <div className="space-y-12">
                    <ScriptItem index={0} type="HOOK" audio={activeVideo.script?.hook?.audio} visual={activeVideo.script?.hook?.visual} guide={activeVideo.script?.guide} color="red" />
                    <ScriptItem index={1} type="BODY" audio={activeVideo.script?.body?.audio} visual={activeVideo.script?.body?.visual} guide={activeVideo.script?.guide} color="blue" />
                    <ScriptItem index={2} type="CTA" audio={activeVideo.script?.cta?.audio} visual={activeVideo.script?.cta?.visual} guide={activeVideo.script?.guide} color="green" />
                </div>
            </div>
        </div>

        <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-6 shadow-card sticky top-28 border border-gray-100">
                <h3 className="font-bold mb-6 px-2 flex items-center justify-between">
                    Reportes Disponibles
                    <span className="text-[10px] text-gray-400 font-black">{videoData.length} TOTAL</span>
                </h3>
                <div className="space-y-3">
                    {videoData.map((v, i) => (
                        <div 
                            key={v.id}
                            onClick={() => setActiveIndex(i)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${i === activeIndex ? 'bg-zylo-black text-white border-zylo-black shadow-lg scale-[1.02]' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black ${i === activeIndex ? 'text-zylo-green' : 'text-gray-400'}`}>{v.score}</span>
                                <span className="text-xs font-bold truncate w-32">{v.account}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {v.isLoaded ? (
                                    <CheckCircle2 size={16} className="text-zylo-green" />
                                ) : (
                                    v.detailed_analysis ? (
                                        <Loader2 size={14} className="animate-spin text-zylo-purple" />
                                    ) : (
                                        <Clock size={14} className="text-gray-300" />
                                    )
                                )}
                                <ChevronRight size={14} className={i === activeIndex ? 'text-white/40' : 'text-gray-300'}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
