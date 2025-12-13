import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Download, ExternalLink, Copy, 
  CheckCircle2, Video, Type, Music, Clock, Film, 
  MoreHorizontal, Search, Bell, Calendar,
  TrendingUp, Users, Eye, Heart, Share2, PlayCircle,
  ChevronRight, ChevronLeft, Check, Sparkles, Layers,
  Lightbulb, Zap, AlertCircle
} from 'lucide-react';

interface ReportPageProps {
  onBack: () => void;
}

const VIDEO_DATA = [
  {
    id: 1,
    format: "Reel",
    score: "7.86",
    url: "instagram.com/p/DRNsBrRj-8Q/",
    fullUrl: "https://www.instagram.com/p/DRNsBrRj-8Q/",
    views: "2,933",
    engagement: "6.0%",
    likes: "142",
    comments: "12",
    viewToLike: "14.96%",
    commentsToLike: "3.59%",
    account: "@agosscifo",
    role: "Travel Creator",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    goal: "Inspirar y motivar a explorar.",
    whyViral: "Hook emocional + visuales dinámicos.",
    adaptationKeys: "Resaltar historia y legado.",
    script: {
        hook: {
            audio: "¿Imaginas cruzar fronteras con más de 90 años de historia?",
            text: "HOOKBASE",
            visual: "Flashback en blanco y negro que se transforma en color mostrando antiguas y modernas unidades de transporte.",
            time: "0:00 - 0:03"
        },
        body: {
            audio: "Desde 1933, llevamos tus sueños a nuevos destinos. Con tecnologías modernas como Wi-Fi y opciones de compra online, cada viaje es una historia que tú escribes.",
            text: "",
            visual: "Secuencia de personas de diversas edades usando diferentes tecnologías dentro de los autobuses, sonriendo y disfrutando el viaje.",
            time: "0:03 - 0:25"
        },
        cta: {
            audio: "Visita nuestra web y descubre promociones exclusivas. Emprende tu próxima aventura con nosotros.",
            text: "",
            visual: "Usuario navegando en un smartphone",
            time: "0:25 - 0:30"
        }
    },
    metrics: {
        hookStrength: 85,
        visualRetention: 92,
        storytelling: 78,
        ctaClarity: 65
    },
    variations: [
        { style: "Educativo", hook: "¿Sabías que el Wi-Fi a bordo transformó viajar?", focus: "Explicar innovaciones tecnológicas.", icon: Lightbulb, color: "blue" },
        { style: "Comunidad", hook: "Descubre cómo nuestra comunidad se expandió...", focus: "Testimonios de varias generaciones.", icon: Users, color: "green" },
        { style: "Autoridad", hook: "Lideramos con más de 90 años de experiencia.", focus: "Expertos hablando de seguridad.", icon: CheckCircle2, color: "purple" },
        { style: "Miedo/Negativo", hook: "El error nº1 al elegir tu transporte de larga distancia.", focus: "Comparativa de seguridad vs informalidad.", icon: AlertCircle, color: "red" }
    ]
  },
  {
    id: 2,
    format: "Reel",
    score: "4.51",
    url: "instagram.com/p/DRimur3kRwA/",
    fullUrl: "https://www.instagram.com/p/DRimur3kRwA/",
    views: "36,872",
    engagement: "9.0%",
    likes: "3,300",
    comments: "45",
    viewToLike: "25.53%",
    commentsToLike: "0.01%",
    account: "@cele.torresf",
    role: "Lifestyle Vlogger",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    goal: "Conexión emocional repetitiva.",
    whyViral: "Frase memorable + eco rítmico.",
    adaptationKeys: "Adaptar 'adiós' a contexto turismo.",
    script: {
        hook: {
            audio: "¡Hasta pronto rutina! ¡Hasta pronto estrés! ¡Hola aventura!",
            text: "MODO AVIÓN: ON ✈️",
            visual: "La protagonista aparece de golpe con su maleta, saludando a la cámara como despidiéndose de su casa.",
            time: "0:00 - 0:04"
        },
        body: {
            audio: "Porque la vida es demasiado corta para quedarse en un solo lugar. Ya sea playa, montaña o ciudad, lo importante es moverte.",
            text: "Tu Próximo Destino 🌎",
            visual: "Secuencia rápida: Café en el aeropuerto, subiendo al transporte, pies tocando la arena y brindis.",
            time: "0:04 - 0:20"
        },
        cta: {
            audio: "¿Y vos? ¿A dónde te vas a escapar este fin de semana? Contame abajo.",
            text: "COMENTÁ 👇",
            visual: "Ella se deja caer relajada en la cama del hotel o arena, riendo y señala hacia los comentarios.",
            time: "0:20 - 0:30"
        }
    },
    metrics: {
        hookStrength: 95,
        visualRetention: 60,
        storytelling: 45,
        ctaClarity: 30
    },
    variations: [
        { style: "Educativo", hook: "¡Descubre! ¡Descubre! ¡Descubre!", focus: "Divulgar conocimientos sobre destinos.", icon: Lightbulb, color: "blue" },
        { style: "Comunidad", hook: "¡Únete a nosotros! ¡Únete a nosotros!", focus: "Construir comunidad de viajeros.", icon: Users, color: "green" },
        { style: "Entretenimiento", hook: "¡Aventura tras aventura! ¡Aventura!", focus: "Contenido divertido y vibrante.", icon: Sparkles, color: "pink" },
        { style: "Curiosidad", hook: "No vas a creer lo que encontramos en este asiento...", focus: "Objetos perdidos o historias curiosas.", icon: Zap, color: "yellow" }
    ]
  },
  {
    id: 3,
    format: "Reel",
    score: "2.30",
    url: "instagram.com/p/DRfYyGQiqMQ/",
    fullUrl: "https://www.instagram.com/p/DRfYyGQiqMQ/",
    views: "277",
    engagement: "0.0%",
    likes: "64",
    comments: "0",
    viewToLike: "23.08%",
    commentsToLike: "0.08%",
    account: "@catainternacional",
    role: "Transport Business",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    goal: "Interés de marca con gesto.",
    whyViral: "Gesto específico + formato corto.",
    adaptationKeys: "Frase memorable + gesto encantador.",
    script: {
        hook: {
            audio: "¡Hey! Este asiento tiene tu nombre.",
            text: "TE ESTAMOS ESPERANDO 👋",
            visual: "El conductor uniformado mira al frente, gira hacia la cámara, guiña un ojo y señala el asiento vacío.",
            time: "0:00 - 0:03"
        },
        body: {
            audio: "Subite que nos vamos. Tenemos destinos increíbles esperando y el mejor servicio a bordo. No te quedes abajo.",
            text: "Confort Total ✨",
            visual: "Punto de vista (POV) caminando por el pasillo del autobús, mostrando pantallas encendidas y espacio amplio.",
            time: "0:03 - 0:25"
        },
        cta: {
            audio: "Arrancamos en 3, 2, 1... ¡Reserva ya!",
            text: "LINK EN BIO 📲",
            visual: "Plano exterior de las ruedas del autobús comenzando a girar. El bus sale de la terminal.",
            time: "0:25 - 0:30"
        }
    },
    metrics: {
        hookStrength: 40,
        visualRetention: 55,
        storytelling: 30,
        ctaClarity: 80
    },
    variations: [
        { style: "Educativo", hook: "¿Sabías estos datos increíbles?", focus: "Datos interesantes sobre lugares.", icon: Lightbulb, color: "blue" },
        { style: "Comunidad", hook: "Únete a nuestra comunidad.", focus: "Grupos de viajeros interactuando.", icon: Users, color: "green" },
        { style: "Entretenimiento", hook: "¿Dónde te llevará tu próxima aventura?", focus: "Concursos o aventuras con clientes.", icon: Sparkles, color: "pink" },
        { style: "Controversial", hook: "Por qué los aviones están sobrevalorados.", focus: "Comparación comodidad Bus vs Avión.", icon: AlertCircle, color: "red" }
    ]
  }
];

interface VideoListSectionProps {
  className?: string;
  activeVideoIndex: number;
  setActiveVideoIndex: (index: number) => void;
}

const VideoListSection: React.FC<VideoListSectionProps> = ({ className = "", activeVideoIndex, setActiveVideoIndex }) => {
  return (
    <div className={`bg-white rounded-[2.5rem] p-8 shadow-card ${className}`}>
        <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-gray-900">Videos Analizados</h3>
            <div className="p-2 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
                <Calendar size={18} className="text-gray-400" />
            </div>
        </div>

        <div className="space-y-6">
            {VIDEO_DATA.map((video, index) => {
                const isActive = index === activeVideoIndex;
                return (
                    <div 
                        key={video.id}
                        onClick={() => setActiveVideoIndex(index)}
                        className={`group flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 pt-1">
                                <span className="text-xs font-medium text-gray-400">Score</span>
                                <span className={`text-sm font-bold ${isActive ? 'text-zylo-purple' : 'text-gray-800'}`}>{video.score}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-zylo-purple transition-colors">Video #{video.id}</span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Video size={10} /> {video.format}
                                </span>
                            </div>
                        </div>
                        <div className={`transform transition-transform ${isActive ? '-rotate-45 text-zylo-purple' : 'text-gray-300'}`}>
                            <ExternalLink size={18} />
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
            <button className="w-full py-3 text-sm font-bold text-gray-500 hover:text-zylo-purple flex items-center justify-center gap-2 transition-colors">
                Ver todos los videos <ChevronRight size={14} />
            </button>
        </div>
    </div>
  );
};

export const ReportPage: React.FC<ReportPageProps> = ({ onBack }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [copiedScript, setCopiedScript] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeVideo = VIDEO_DATA[activeVideoIndex];

  const handleCopyScript = () => {
    let text = `
Hook (${activeVideo.script.hook.time}):
Audio: "${activeVideo.script.hook.audio}"
Visual: ${activeVideo.script.hook.visual}
`;

    if (activeVideo.script.hook.text) {
        text += `Texto: "${activeVideo.script.hook.text}"\n`;
    }

    text += `
Cuerpo (${activeVideo.script.body.time}):
Audio: "${activeVideo.script.body.audio}"
Visual: ${activeVideo.script.body.visual}
`;
    if (activeVideo.script.body.text) {
        text += `Texto: "${activeVideo.script.body.text}"\n`;
    }

    text += `
CTA (${activeVideo.script.cta.time}):
Audio: "${activeVideo.script.cta.audio}"
Visual: ${activeVideo.script.cta.visual}
`;
    if (activeVideo.script.cta.text) {
        text += `Texto: "${activeVideo.script.cta.text}"\n`;
    }

    navigator.clipboard.writeText(text.trim());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCardColorClasses = (color: string) => {
    switch(color) {
        case 'blue': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'green': return 'bg-green-50 text-green-600 border-green-100';
        case 'purple': return 'bg-purple-50 text-purple-600 border-purple-100';
        case 'red': return 'bg-red-50 text-red-600 border-red-100';
        case 'pink': return 'bg-pink-50 text-pink-600 border-pink-100';
        case 'yellow': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };
  
  const getGradientBorder = (color: string) => {
     switch(color) {
        case 'blue': return 'from-blue-400 to-cyan-300';
        case 'green': return 'from-green-400 to-emerald-300';
        case 'purple': return 'from-purple-400 to-pink-300';
        case 'red': return 'from-red-400 to-orange-300';
        case 'pink': return 'from-pink-400 to-rose-300';
        case 'yellow': return 'from-yellow-400 to-amber-300';
        default: return 'from-gray-400 to-gray-300';
     }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 md:p-8">
      
      {/* Top Navigation Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
             <button 
              onClick={onBack}
              className="p-3 bg-white rounded-full hover:bg-gray-50 text-gray-500 shadow-sm transition-transform hover:scale-105"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reporte Viral #42</h1>
                <p className="text-xs text-gray-500">Generado para Turismo & Viajes</p>
            </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar métricas..." 
                    className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-zylo-purple/20 shadow-sm text-gray-600"
                />
            </div>
            <button className="p-3 bg-white rounded-full text-gray-500 shadow-sm hover:text-zylo-purple transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-zylo-black text-white flex items-center justify-center font-bold text-sm shadow-md">
                HB
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* === LEFT COLUMN (MAIN CONTENT) - Spans 8 or 9 cols === */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Top Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Account / Profile Card */}
                <div className="bg-white rounded-[2rem] p-6 shadow-card flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-gray-300 group-hover:text-zylo-purple transition-colors cursor-pointer">
                        <Share2 size={18} />
                    </div>
                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-pink-500">
                             <img src={activeVideo.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full text-[10px] font-bold border-2 border-white">
                             <TrendingUp size={10} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{activeVideo.account}</h3>
                    <p className="text-xs text-gray-500 mb-6">{activeVideo.role}</p>
                    
                    <div className="flex items-center gap-6 w-full justify-center px-4">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1 font-bold">
                                <Users size={12} />
                            </div>
                            <span className="font-bold text-sm text-gray-800">{activeVideo.likes}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1 font-bold">
                                <Heart size={12} />
                            </div>
                            <span className="font-bold text-sm text-gray-800">{activeVideo.engagement}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1 font-bold">
                                <Eye size={12} />
                            </div>
                            <span className="font-bold text-sm text-gray-800">{activeVideo.views}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Gradient Card 1 - Score */}
                <div className="bg-gradient-to-br from-orange-100 via-pink-100 to-rose-200 rounded-[2rem] p-8 shadow-card flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-sm">HookBase Score</h3>
                        <div className="p-2 bg-white/30 backdrop-blur-sm rounded-full">
                            <Clock size={16} className="text-gray-700" />
                        </div>
                    </div>
                    <div className="mt-4">
                         <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{activeVideo.score}</span>
                         <p className="text-xs font-medium text-gray-600 mt-2">Avg. Performance</p>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 blur-2xl rounded-full"></div>
                </div>

                {/* 3. Gradient Card 2 - Viral Metric */}
                <div className="bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 rounded-[2rem] p-8 shadow-card flex flex-col justify-between relative overflow-hidden">
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-sm">Retention Potential</h3>
                        <div className="p-2 bg-white/30 backdrop-blur-sm rounded-full">
                            <CheckCircle2 size={16} className="text-gray-700" />
                        </div>
                    </div>
                    <div className="mt-4">
                         <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{activeVideo.metrics.visualRetention}%</span>
                         <p className="text-xs font-medium text-gray-600 mt-2">Completion Rate Est.</p>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 blur-2xl rounded-full"></div>
                </div>
            </div>

            {/* Middle Bar - Trackers/Actions */}
            <div className="bg-gray-200/50 rounded-[1.5rem] p-2 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-4 px-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Plataforma Detectada:</span>
                    <div className="flex items-center gap-2">
                         <div className="px-3 py-1 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs font-bold shadow-sm text-pink-600">
                             Instagram Reels
                         </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 pr-4 text-xs font-medium text-gray-500">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">Trending now</span>
                </div>
            </div>
            
            {/* MOBILE ONLY: Video List before Script */}
            <VideoListSection 
                className="lg:hidden" 
                activeVideoIndex={activeVideoIndex} 
                setActiveVideoIndex={setActiveVideoIndex} 
            />

            {/* Bottom Large Card - Script Breakdown (Focusing Area) */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-card flex-1 min-h-[400px] relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Guión Viral Detallado</h2>
                        <p className="text-sm text-gray-400">Instrucciones de grabación paso a paso</p>
                    </div>
                    <button 
                        onClick={handleCopyScript}
                        className="flex items-center gap-2 bg-zylo-black text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-800 transition-all hover:scale-105 shadow-md"
                    >
                        {copiedScript ? <Check size={16} /> : <Copy size={16} />}
                        {copiedScript ? '¡Copiado!' : 'Copiar Guión'}
                    </button>
                </div>

                {/* Vertical Timeline Visualization */}
                <div className="space-y-6 relative z-10">
                    {/* Line connecting items */}
                    <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gray-100 hidden md:block"></div>

                    {/* Step 1: Hook */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Time/Label Marker */}
                            <div className="md:w-20 flex-shrink-0 flex md:flex-col items-start md:items-center gap-2 md:gap-1 z-10">
                                <div className="w-10 h-10 rounded-full bg-red-100 border-4 border-white shadow-sm flex items-center justify-center text-red-500 shrink-0">
                                    <span className="font-bold text-xs">1</span>
                                </div>
                                <span className="text-[10px] font-black uppercase text-red-400 tracking-wider bg-red-50 px-2 py-0.5 rounded-full">Hook</span>
                            </div>
                            
                            {/* Content Card */}
                            <div className="flex-1 bg-gray-50 group-hover:bg-red-50/50 transition-colors p-6 rounded-2xl border border-gray-100">
                                <div className="grid md:grid-cols-12 gap-6">
                                    <div className="md:col-span-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                            <Music size={12}/> Audio / Voz
                                        </div>
                                        <p className="font-bold text-gray-900 text-lg leading-snug mb-4">
                                            "{activeVideo.script.hook.audio}"
                                        </p>
                                        
                                        {/* New Text Overlay Field - Conditionally Rendered */}
                                        {activeVideo.script.hook.text && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                                    <Type size={12}/> Texto en Pantalla
                                                </div>
                                                <div className="bg-gray-100/80 rounded-lg px-4 py-2 inline-block border border-gray-200">
                                                    <p className="font-semibold text-sm text-gray-700">
                                                        "{activeVideo.script.hook.text}"
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="md:col-span-5 bg-white rounded-xl p-4 border border-dashed border-gray-200">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                            <Video size={12}/> Dirección Visual
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            {activeVideo.script.hook.visual}
                                        </p>
                                        <div className="mt-3 text-[10px] font-bold text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">
                                            {activeVideo.script.hook.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Body */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-20 flex-shrink-0 flex md:flex-col items-start md:items-center gap-2 md:gap-1 z-10">
                                <div className="w-10 h-10 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center text-blue-500 shrink-0">
                                    <span className="font-bold text-xs">2</span>
                                </div>
                                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">Body</span>
                            </div>
                            
                            <div className="flex-1 bg-gray-50 group-hover:bg-blue-50/50 transition-colors p-6 rounded-2xl border border-gray-100">
                                <div className="grid md:grid-cols-12 gap-6">
                                    <div className="md:col-span-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                            <Music size={12}/> Audio / Voz
                                        </div>
                                        <p className="font-bold text-gray-900 text-lg leading-snug mb-4">
                                            "{activeVideo.script.body.audio}"
                                        </p>

                                         {/* New Text Overlay Field - Conditionally Rendered */}
                                        {activeVideo.script.body.text && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                                    <Type size={12}/> Texto en Pantalla
                                                </div>
                                                <div className="bg-gray-100/80 rounded-lg px-4 py-2 inline-block border border-gray-200">
                                                    <p className="font-semibold text-sm text-gray-700">
                                                        "{activeVideo.script.body.text}"
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="md:col-span-5 bg-white rounded-xl p-4 border border-dashed border-gray-200">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                            <Video size={12}/> Dirección Visual
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            {activeVideo.script.body.visual}
                                        </p>
                                        <div className="mt-3 text-[10px] font-bold text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">
                                            {activeVideo.script.body.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: CTA */}
                    <div className="relative group">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-20 flex-shrink-0 flex md:flex-col items-start md:items-center gap-2 md:gap-1 z-10">
                                <div className="w-10 h-10 rounded-full bg-green-100 border-4 border-white shadow-sm flex items-center justify-center text-green-500 shrink-0">
                                    <span className="font-bold text-xs">3</span>
                                </div>
                                <span className="text-[10px] font-black uppercase text-green-400 tracking-wider bg-green-50 px-2 py-0.5 rounded-full">CTA</span>
                            </div>
                            
                            <div className="flex-1 bg-gray-50 group-hover:bg-green-50/50 transition-colors p-6 rounded-2xl border border-gray-100">
                                <div className="grid md:grid-cols-12 gap-6">
                                    <div className="md:col-span-7">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                            <Music size={12}/> Audio / Voz
                                        </div>
                                        <p className="font-bold text-gray-900 text-lg leading-snug mb-4">
                                            "{activeVideo.script.cta.audio}"
                                        </p>
                                        
                                        {/* New Text Overlay Field - Conditionally Rendered */}
                                        {activeVideo.script.cta.text && (
                                            <>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                                    <Type size={12}/> Texto en Pantalla
                                                </div>
                                                <div className="bg-gray-100/80 rounded-lg px-4 py-2 inline-block border border-gray-200">
                                                    <p className="font-semibold text-sm text-gray-700">
                                                        "{activeVideo.script.cta.text}"
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="md:col-span-5 bg-white rounded-xl p-4 border border-dashed border-gray-200">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
                                            <Video size={12}/> Dirección Visual
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            {activeVideo.script.cta.visual}
                                        </p>
                                        <div className="mt-3 text-[10px] font-bold text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">
                                            {activeVideo.script.cta.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                 <div className="absolute bottom-8 right-8 text-8xl font-extrabold text-gray-50 opacity-50 select-none pointer-events-none">
                    {activeVideo.metrics.storytelling}%
                </div>
            </div>

             {/* === REFACTORED SECTION: VARIATIONS CAROUSEL === */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-card">
                 <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Otras Versiones Posibles</h2>
                            <p className="text-sm text-gray-400">4 ángulos distintos para maximizar alcance</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                     </div>
                 </div>

                 {/* Scroll Container */}
                 <div 
                    ref={scrollRef} 
                    className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-2 px-2 [&::-webkit-scrollbar]:hidden"
                 >
                     {activeVideo.variations.map((variant, idx) => (
                         <div 
                             key={idx} 
                             className="min-w-[300px] md:min-w-[340px] flex-shrink-0 snap-start bg-white rounded-3xl p-6 border border-gray-100 
                                shadow-sm hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] 
                                transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
                         >
                             {/* Top Color Bar */}
                             <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${getGradientBorder(variant.color)}`}></div>

                             <div className="flex justify-between items-start mb-6">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getCardColorClasses(variant.color)}`}>
                                    {variant.icon && <variant.icon size={14} strokeWidth={2.5} />}
                                    {variant.style}
                                </span>
                             </div>
                             
                             <h4 className="font-bold text-gray-900 text-xl mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                                "{variant.hook}"
                             </h4>
                             
                             <div className="flex items-start gap-3 mt-auto pt-4 border-t border-gray-50">
                                 <div className="mt-0.5 p-1.5 rounded-full bg-gray-50 text-gray-400 group-hover:bg-zylo-purpleLight group-hover:text-zylo-purple transition-colors">
                                    <Sparkles size={14} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Enfoque</p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {variant.focus}
                                    </p>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

        </div>

        {/* === RIGHT COLUMN (SIDEBAR) - Spans 4 or 3 cols === */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            
            {/* List Section (Videos) - DESKTOP ONLY */}
            <VideoListSection 
                className="hidden lg:block flex-1" 
                activeVideoIndex={activeVideoIndex} 
                setActiveVideoIndex={setActiveVideoIndex} 
            />

            {/* Metrics Bars Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-card">
                 <h3 className="font-bold text-lg text-gray-900 mb-2">Métricas de Calidad</h3>
                 <p className="text-xs text-gray-400 mb-8">Áreas de mayor impacto potencial</p>

                 <div className="space-y-8">
                    {/* Metric 1 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base font-bold text-gray-800">Fuerza del Hook</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500">{activeVideo.metrics.hookStrength}%</span>
                                <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center">
                                    <TrendingUp size={12} className="text-red-500" />
                                </div>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeVideo.metrics.hookStrength}%` }}></div>
                        </div>
                    </div>

                     {/* Metric 2 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base font-bold text-gray-800">Retención Visual</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500">{activeVideo.metrics.visualRetention}%</span>
                                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                                    <TrendingUp size={12} className="text-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeVideo.metrics.visualRetention}%` }}></div>
                        </div>
                    </div>

                     {/* Metric 3 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base font-bold text-gray-800">Storytelling</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500">{activeVideo.metrics.storytelling}%</span>
                                <div className="h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center">
                                    {/* Minimal placeholder/dot to align with design language without explicit icon if needed, or using TrendingUp gray */}
                                     {activeVideo.metrics.storytelling > 50 ? null : <TrendingUp size={12} className="text-gray-400" />}
                                </div>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeVideo.metrics.storytelling}%` }}></div>
                        </div>
                    </div>

                     {/* Metric 4 */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-base font-bold text-gray-800">Claridad del CTA</span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-500">{activeVideo.metrics.ctaClarity}%</span>
                                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                                    <TrendingUp size={12} className="text-blue-500" />
                                </div>
                            </div>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeVideo.metrics.ctaClarity}%` }}></div>
                        </div>
                    </div>
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
};