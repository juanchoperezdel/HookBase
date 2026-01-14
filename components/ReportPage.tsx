import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, ExternalLink, CheckCircle2, Video, Music, Clock,
    ChevronRight, Play, Scissors, Lightbulb, Zap, Loader2
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { motion } from 'motion/react';

// --- 1. FUNCIÓN DE LIMPIEZA (EL "CORTADOR") ---
// Convierte: "Texto hablado: "Hola" | Descripción visual: "Cámara"" 
// En: { audio: "Hola", visual: "Cámara" }
const parseScriptPart = (rawText: any) => {
    if (!rawText || typeof rawText !== 'string') return { audio: "Sin contenido", visual: "Sin contenido" };

    // Dividimos por el separador "|"
    const parts = rawText.split('|');

    // Limpiamos los prefijos "Texto hablado:" y comillas
    const cleanAudio = parts[0]
        ?.replace(/Texto hablado:/gi, '')
        .replace(/^[\s"]+|[\s"]+$/g, '') // Quita comillas al inicio/final
        .trim();

    const cleanVisual = parts[1]
        ?.replace(/Descripción visual:/gi, '')
        .replace(/^[\s"]+|[\s"]+$/g, '')
        .trim();

    return {
        audio: cleanAudio || "...",
        visual: cleanVisual || "..."
    };
};

// --- 2. ADAPTADOR DE DATOS ---
const adaptToUI = (posts: any[], analyses: any[], reportData: any) => {
    return posts.map((post, idx) => {
        // Buscamos el análisis correspondiente a este post
        const analysis = analyses.find(a => String(a.post_id) === String(post.id)) || {};
        const scriptJson = analysis.guion_adaptado || {}; // Aquí ya viene el JSON directo de Supabase

        // Procesamos las partes usando nuestra función de limpieza
        const hookData = parseScriptPart(scriptJson.hook);
        const bodyData = parseScriptPart(scriptJson.body);
        const ctaData = parseScriptPart(scriptJson.cta);

        // Armamos la guía técnica combinando los arrays del JSON
        let guideText = "";
        if (scriptJson.tono_sugerido) guideText += `🎙️ Tono: ${scriptJson.tono_sugerido}\n\n`;
        if (scriptJson.formato_de_ejecucion) guideText += `📽️ Formato: ${scriptJson.formato_de_ejecucion}\n\n`;

        if (Array.isArray(scriptJson.visuales_sugeridas)) {
            guideText += `📷 Visuales Extra:\n• ${scriptJson.visuales_sugeridas.join('\n• ')}`;
        }

        // Procesamos otras versiones
        // Ahora leemos directamente de la columna 'otras_versiones_posibles' de la tabla analyses
        const otherVersionsRaw = analysis.otras_versiones_posibles || scriptJson.otras_versiones_posibles || {};
        const otherVersions = Object.entries(otherVersionsRaw).map(([key, value]: any) => ({
            category: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
            hook: parseScriptPart(value.hook).audio, // Extrelemos solo el audio del hook
            focus: value.enfoque
        }));

        return {
            id: post.id || idx,
            account: post.username ? `@${post.username}` : "Usuario",
            score: Number(post.final_score || 0).toFixed(1),
            url: post.post_url,
            doc_link: reportData?.final_slide_url || null,
            avatar: `https://ui-avatars.com/api/?name=${post.username || 'U'}&background=random&color=fff`,

            // ESTADO: Si hay hook, consideramos que está listo ("Loaded")
            isLoaded: !!scriptJson.hook,

            script: {
                hook: hookData,
                body: bodyData,
                cta: ctaData,
                guide: guideText,
                otherVersions, // <--- NUEVO CAMPO

                // Technical Details
                tone: scriptJson.tono_sugerido,
                duration: scriptJson.duracion_estimada_segundos,
                visualStyle: scriptJson.sugerencia_de_visuales_tipo,
                typography: Array.isArray(scriptJson.tipografias_sugeridas) ? scriptJson.tipografias_sugeridas[0] : null,

                // Strategic Insight (Top Level Columns)
                keys: analysis.claves_para_adaptar,
                recommendation: analysis.recomendacion_final
            }
        };


    });
};

// --- 3. COMPONENTE DE TARJETA DE GUION ---
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
                            <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-line">{guide || "Sigue el ritmo del video original."}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// --- 4. COMPONENTE PRINCIPAL ---
export const ReportPage = ({ onBack, reportId }: any) => {
    const [videoData, setVideoData] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Carga inicial
    useEffect(() => {
        const loadData = async () => {
            if (!reportId) return;
            setLoading(true);

            // Traemos Reporte, Posts y ANALYSES (donde está el JSON)
            const { data: reportInfo } = await supabase.from('reports').select('*').eq('id', reportId).single();
            const { data: posts } = await supabase.from('posts').select('*').eq('report_id', reportId).order('final_score', { ascending: false });
            const { data: analyses } = await supabase.from('analyses').select('*').eq('report_id', reportId);

            if (posts) {
                // Adaptamos usando el JSON directo, sin IA extra
                const processedData = adaptToUI(posts, analyses || [], reportInfo);
                setVideoData(processedData);
            }
            setLoading(false);
        };

        loadData();

        // Suscripción en tiempo real por si el bot termina de escribir mientras miramos
        const channel = supabase
            .channel(`report-live-${reportId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'analyses', filter: `report_id=eq.${reportId}` },
                () => loadData()
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'analyses', filter: `report_id=eq.${reportId}` },
                () => loadData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [reportId]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-zylo-purple mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cargando Estrategia...</p>
        </div>
    );

    const activeVideo = videoData[activeIndex] || { script: { hook: {}, body: {}, cta: {} } };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft size={20} /></button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black uppercase tracking-tight">Estrategia Viral</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-zylo-green flex items-center gap-1"><CheckCircle2 size={10} /> Sincronizado</span>
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

                {/* COLUMNA IZQUIERDA: DETALLE DEL VIDEO */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-card flex flex-col items-center text-center border border-gray-100">
                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-zylo-purple to-zylo-green mb-4">
                                <img src={activeVideo.avatar} className="w-full h-full rounded-full border-4 border-white" alt="profile" />
                            </div>
                            <h2 className="text-2xl font-black">{activeVideo.account}</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Referencia Viral</p>
                            <a href={activeVideo.url} target="_blank" className="bg-zylo-black text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all">
                                <Play size={14} fill="currentColor" /> Ver Referencia
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
                            <p className="text-gray-400 font-medium">Estructura optimizada basada en el análisis de IA.</p>
                        </div>

                        {activeVideo.isLoaded ? (
                            <div className="space-y-12">
                                {/* 1. GUION PRINCIPAL */}
                                <ScriptItem index={0} type="HOOK" audio={activeVideo.script?.hook?.audio} visual={activeVideo.script?.hook?.visual} guide={activeVideo.script?.guide} color="red" />
                                <ScriptItem index={1} type="BODY" audio={activeVideo.script?.body?.audio} visual={activeVideo.script?.body?.visual} guide={activeVideo.script?.guide} color="blue" />
                                <ScriptItem index={2} type="CTA" audio={activeVideo.script?.cta?.audio} visual={activeVideo.script?.cta?.visual} guide={activeVideo.script?.guide} color="green" />

                                {/* 2. ANÁLISIS ESTRATÉGICO & TÉCNICO */}
                                <div className="grid md:grid-cols-2 gap-8 pt-6">
                                    {/* Columna Izq: Claves y Recomendación */}
                                    <div className="space-y-6">
                                        {activeVideo.script?.keys && (
                                            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
                                                <h4 className="flex items-center gap-2 font-black text-yellow-600 mb-3 text-sm uppercase tracking-wider">
                                                    <Lightbulb size={16} /> Claves del Éxito
                                                </h4>
                                                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                                    {activeVideo.script.keys}
                                                </p>
                                            </div>
                                        )}
                                        {activeVideo.script?.recommendation && (
                                            <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                                                <h4 className="flex items-center gap-2 font-black text-purple-600 mb-3 text-sm uppercase tracking-wider">
                                                    <CheckCircle2 size={16} /> Recomendación Final
                                                </h4>
                                                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                                    {activeVideo.script.recommendation}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Columna Der: Detalles Técnicos */}
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-center space-y-4">
                                        <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-2">Ficha Técnica</h4>

                                        {activeVideo.script?.tone && (
                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400"><Music size={14} /></div>
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Tono Sugerido</span>
                                                    <span className="text-sm font-bold text-gray-800">{activeVideo.script.tone}</span>
                                                </div>
                                            </div>
                                        )}
                                        {activeVideo.script?.duration && (
                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400"><Clock size={14} /></div>
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Duración</span>
                                                    <span className="text-sm font-bold text-gray-800">{activeVideo.script.duration} seg</span>
                                                </div>
                                            </div>
                                        )}
                                        {activeVideo.script?.visualStyle && (
                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400"><Video size={14} /></div>
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Estilo Visual</span>
                                                    <span className="text-sm font-bold text-gray-800 leading-tight">{activeVideo.script.visualStyle}</span>
                                                </div>
                                            </div>
                                        )}
                                        {activeVideo.script?.typography?.nombre && (
                                            <div className="flex items-start gap-3">
                                                <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400"><Scissors size={14} /></div>
                                                <div>
                                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Tipografía</span>
                                                    <span className="text-sm font-bold text-gray-800">{activeVideo.script.typography.nombre}</span>
                                                    <span className="block text-[10px] text-gray-400 leading-tight mt-1">{activeVideo.script.typography.razon}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. SECCIÓN OTRAS VERSIONES */}
                                {activeVideo.script?.otherVersions?.length > 0 && (
                                    <div className="pt-12 border-t border-gray-100">
                                        <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                                            <Zap size={20} className="text-zylo-yellow" />
                                            Ángulos Alternativos
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {activeVideo.script.otherVersions.map((v: any, idx: number) => (
                                                <div key={idx} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all border-dashed hover:border-solid hover:border-gray-200">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-zylo-purple mb-3 bg-zylo-purple/5 px-2 py-1 rounded-md inline-block">
                                                        {v.category}
                                                    </div>
                                                    <p className="font-bold text-gray-800 text-sm mb-3">"{v.hook}"</p>
                                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{v.focus}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50">
                                <Loader2 className="animate-spin mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-400 font-bold text-sm">Esperando análisis del Bot...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: LISTA DE VIDEOS */}
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
                                            <Clock size={14} className="text-gray-300" />
                                        )}
                                        <ChevronRight size={14} className={i === activeIndex ? 'text-white/40' : 'text-gray-300'} />
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