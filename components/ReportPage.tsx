```javascript
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, ExternalLink, CheckCircle2, Video, Music, Clock,
    ChevronRight, Play, Scissors, Lightbulb, Zap, Loader2, Sparkles, Star
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'motion/react';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const fadeIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

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
        if (scriptJson.tono_sugerido) guideText += `🎙️ Tono: ${ scriptJson.tono_sugerido } \n\n`;
        if (scriptJson.formato_de_ejecucion) guideText += `📽️ Formato: ${ scriptJson.formato_de_ejecucion } \n\n`;

        if (Array.isArray(scriptJson.visuales_sugeridas)) {
            guideText += `📷 Visuales Extra: \n• ${ scriptJson.visuales_sugeridas.join('\n• ') } `;
        }

        // Procesamos otras versiones
        // Ahora leemos directamente de la columna 'otras_versiones_posibles' de la tabla analyses
        const otherVersionsRaw = analysis.otras_versiones_posibles || scriptJson.otras_versiones_posibles || {};
        const otherVersions = Object.entries(otherVersionsRaw).map(([key, value]: any) => ({
            category: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
            hook: value.hook ? parseScriptPart(value.hook).audio : "...", // Extrelemos solo el audio del hook
            focus: value.enfoque
        }));

        return {
            id: post.id || idx,
            account: post.username ? `@${ post.username } ` : "Usuario",
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
const ScriptItem = ({ index, type, audio, visual, guide, color, isLast }: any) => {
    const [showGuide, setShowGuide] = useState(false);
    const colorMap: any = {
        red: { bg: 'bg-red-50', text: 'text-red-500', circle: 'border-red-100 text-red-500', glow: 'shadow-red-500/10' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-500', circle: 'border-blue-100 text-blue-500', glow: 'shadow-blue-500/10' },
        green: { bg: 'bg-green-50', text: 'text-green-500', circle: 'border-green-100 text-green-500', glow: 'shadow-green-500/10' }
    };
    const s = colorMap[color] || colorMap.blue;

    return (
        <div className="flex gap-6 md:gap-8 items-start relative group">
            {/* Timeline Line */}
            {!isLast && (
                <div className="absolute left-4 top-12 bottom-[-48px] w-0.5 bg-gray-100 group-hover:bg-gray-200 transition-colors z-0"></div>
            )}

            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border mt-6 bg-white shadow-sm z-10 ${s.circle} transition-transform group-hover:scale-110`}
            >
                {index + 1}
            </motion.div>

            <motion.div
                whileHover={{ y: -2 }}
                className={`flex-1 bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-soft hover:shadow-lg transition-all ${s.glow}`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className={`${s.bg} ${s.text} text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase`}>{type}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block flex items-center gap-1">
                            <Video size={10} /> Visual
                        </span>
                        <p className="text-sm font-medium text-gray-600 leading-relaxed italic border-l-2 border-gray-100 pl-4">
                            {visual}
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block flex items-center gap-1">
                            <Music size={10} /> Audio / Texto
                        </span>
                        <p className="text-base font-bold text-gray-900 leading-relaxed">
                            "{audio}"
                        </p>
                    </div>
                </div>
            </motion.div>
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
                { event: '*', schema: 'public', table: 'analyses', filter: `report_id=eq.${reportId}` },
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
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Cargando Estrategia...</p>
        </div>
    );

    const activeVideo = videoData[activeIndex] || { script: { hook: {}, body: {}, cta: {} } };

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20 selection:bg-zylo-purple selection:text-white">
            {/* HEADER GLASS */}
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm px-6 py-4 transition-all">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900"><ArrowLeft size={20} /></button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black uppercase tracking-tight text-gray-900">Estrategia Viral</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-zylo-green flex items-center gap-1 py-0.5 px-2 bg-zylo-green/10 rounded-full">
                                    <CheckCircle2 size={10} /> Sincronizado
                                </span>
                            </div>
                        </div>
                    </div>
                    {activeVideo.doc_link && (
                        <motion.a
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            href={activeVideo.doc_link}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 flex items-center gap-2 ring-2 ring-transparent hover:ring-white/50 transition-all"
                        >
                            <ExternalLink size={14} /> Abrir Google Docs
                        </motion.a>
                    )}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* COLUMNA IZQUIERDA: DETALLE DEL VIDEO */}
                <div className="lg:col-span-8 space-y-8">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeVideo.id}
                            initial="hidden" animate="visible" exit="hidden"
                            variants={containerVariants}
                            className="space-y-8"
                        >
                            {/* VIDEO INFO CARD */}
                            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-card flex flex-col items-center text-center border border-white/50 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-50 opacity-50" />
                                    <div className="relative z-10 flex flex-col items-center w-full">
                                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 mb-4 shadow-lg shadow-purple-500/20">
                                            <img src={activeVideo.avatar} className="w-full h-full rounded-full border-4 border-white object-cover" alt="profile" />
                                        </motion.div>
                                        <h2 className="text-2xl font-black text-gray-900">{activeVideo.account}</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Referencia Viral</p>
                                        <a href={activeVideo.url} target="_blank" className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all group-hover:shadow-xl group-hover:shadow-purple-500/10 active:scale-95">
                                            <Play size={14} fill="currentColor" /> Ver Video Original
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-purple-900/20 border border-gray-800 group">
                                    <div className="relative z-10">
                                        <span className="text-[10px] font-black text-zylo-green uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Sparkles size={12} className="text-yellow-400" /> Viral Score
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                                                {activeVideo.score}
                                            </span>
                                            <span className="text-xl font-bold text-gray-600">/10</span>
                                        </div>
                                    </div>
                                    {/* Animated blobs */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-purple-500 rounded-full blur-[80px]"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                        className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-blue-500 rounded-full blur-[80px]"
                                    />
                                </div>
                            </motion.div>

                            {/* SCRIPT CARD */}
                            <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-card border border-gray-100/50 relative">
                                <div className="mb-12">
                                    <h3 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
                                        <Scissors className="text-gray-900" size={28} />
                                        Guion Adaptado
                                    </h3>
                                    <p className="text-gray-400 font-medium">Estructura optimizada basada en el análisis de IA.</p>
                                </div>

                                {activeVideo.isLoaded ? (
                                    <div className="space-y-4">
                                        {/* 1. GUION PRINCIPAL */}
                                        <ScriptItem index={0} type="HOOK" audio={activeVideo.script?.hook?.audio} visual={activeVideo.script?.hook?.visual} guide={activeVideo.script?.guide} color="red" />
                                        <ScriptItem index={1} type="BODY" audio={activeVideo.script?.body?.audio} visual={activeVideo.script?.body?.visual} guide={activeVideo.script?.guide} color="blue" />
                                        <ScriptItem index={2} type="CTA" audio={activeVideo.script?.cta?.audio} visual={activeVideo.script?.cta?.visual} guide={activeVideo.script?.guide} color="green" isLast={true} />

                                        {/* 2. ANÁLISIS ESTRATÉGICO & TÉCNICO */}
                                        <div className="grid md:grid-cols-2 gap-8 pt-12 mt-4 border-t border-gray-100">
                                            {/* Columna Izq: Claves y Recomendación */}
                                            <div className="space-y-4">
                                                {activeVideo.script?.keys && (
                                                    <motion.div whileHover={{ y: -4 }} className="bg-yellow-50/50 p-8 rounded-[2rem] border border-yellow-100/50 hover:shadow-lg hover:shadow-yellow-500/5 transition-all">
                                                        <h4 className="flex items-center gap-2 font-black text-yellow-600 mb-4 text-xs uppercase tracking-widest">
                                                            <Lightbulb size={16} /> Claves del Éxito
                                                        </h4>
                                                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                                            {activeVideo.script.keys}
                                                        </p>
                                                    </motion.div>
                                                )}
                                                {activeVideo.script?.recommendation && (
                                                    <motion.div whileHover={{ y: -4 }} className="bg-purple-50/50 p-8 rounded-[2rem] border border-purple-100/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                                                        <h4 className="flex items-center gap-2 font-black text-purple-600 mb-4 text-xs uppercase tracking-widest">
                                                            <CheckCircle2 size={16} /> Recomendación Final
                                                        </h4>
                                                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                                            {activeVideo.script.recommendation}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Columna Der: Detalles Técnicos */}
                                            <motion.div whileHover={{ y: -4 }} className="bg-gray-50/80 p-8 rounded-[2rem] border border-gray-100 flex flex-col justify-center space-y-6 hover:shadow-lg transition-all">
                                                <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Star size={12} /> Ficha Técnica</h4>

                                                {activeVideo.script?.tone && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 border border-gray-50"><Music size={16} /></div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tono Sugerido</span>
                                                            <span className="text-sm font-bold text-gray-900">{activeVideo.script.tone}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {activeVideo.script?.duration && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 border border-gray-50"><Clock size={16} /></div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duración</span>
                                                            <span className="text-sm font-bold text-gray-900">{activeVideo.script.duration} seg</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {activeVideo.script?.visualStyle && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 border border-gray-50"><Video size={16} /></div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estilo Visual</span>
                                                            <span className="text-sm font-bold text-gray-900 leading-tight">{activeVideo.script.visualStyle}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {activeVideo.script?.typography?.nombre && (
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 border border-gray-50"><Scissors size={16} /></div>
                                                        <div>
                                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tipografía</span>
                                                            <span className="text-sm font-bold text-gray-900">{activeVideo.script.typography.nombre}</span>
                                                            <span className="block text-[10px] text-gray-400 leading-tight mt-1 max-w-[200px]">{activeVideo.script.typography.razon}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* 3. SECCIÓN OTRAS VERSIONES */}
                                        {activeVideo.script?.otherVersions?.length > 0 && (
                                            <div className="pt-12 border-t border-gray-100">
                                                <h4 className="text-xl font-black mb-6 flex items-center gap-2 text-gray-900">
                                                    <Zap size={20} className="text-yellow-500 fill-yellow-500" />
                                                    Ángulos Alternativos
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {activeVideo.script.otherVersions.map((v: any, idx: number) => (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ y: -4, backgroundColor: '#fff' }}
                                                            className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 transition-all cursor-default relative overflow-hidden group"
                                                        >
                                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Sparkles size={16} className="text-yellow-400" />
                                                            </div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-3 bg-purple-50 px-2 py-1 rounded-md inline-block border border-purple-100">
                                                                {v.category}
                                                            </div>
                                                            <p className="font-bold text-gray-900 text-sm mb-3">"{v.hook}"</p>
                                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{v.focus}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
                                        <Loader2 className="animate-spin mx-auto text-gray-300 mb-4" size={32} />
                                        <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Analizando video con IA...</p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* COLUMNA DERECHA: LISTA DE VIDEOS */}
                <div className="lg:col-span-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                        className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-card sticky top-28 border border-white/50"
                    >
                        <h3 className="font-bold mb-6 px-4 flex items-center justify-between text-gray-900">
                            Reportes Disponibles
                            <span className="text-[10px] text-gray-400 font-black tracking-widest bg-gray-100 px-2 py-1 rounded-full">{videoData.length} TOTAL</span>
                        </h3>
                        <div className="space-y-3">
                            {videoData.map((v, i) => (
                                <motion.div
                                    key={v.id}
                                    onClick={() => setActiveIndex(i)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between border relative overflow-hidden group ${i === activeIndex ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-900/20' : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md'}`}
                                >
                                    {i === activeIndex && (
                                        <motion.div layoutId="activeGlow" className="absolute inset-0 bg-white/10" />
                                    )}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${i === activeIndex ? 'bg-white/20 text-white' : 'bg-white text-gray-400'}`}>
                                            {v.score}
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${i === activeIndex ? 'text-gray-400' : 'text-gray-400'}`}>Video {i + 1}</span>
                                            <span className={`text-sm font-bold truncate w-32 block ${i === activeIndex ? 'text-white' : 'text-gray-900'}`}>{v.account}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 relative z-10">
                                        {v.isLoaded ? (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <CheckCircle2 size={18} className={i === activeIndex ? 'text-zylo-green' : 'text-gray-300'} />
                                            </motion.div>
                                        ) : (
                                            <Clock size={16} className={i === activeIndex ? 'text-gray-500' : 'text-gray-300'} />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};
```