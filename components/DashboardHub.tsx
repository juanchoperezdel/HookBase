import React, { useEffect, useState } from 'react';
import {
    Plus, Search, Calendar, ChevronRight,
    Layout, BarChart3, Settings, LogOut,
    FileText, Clock, Filter, ArrowUpRight, Loader2, ExternalLink, Menu, X, Zap,
    Mic2, Target, HeartHandshake, Star, Sparkles, Eye, CheckCircle, Lock, Key,
    User, Award, TrendingUp, Sparkle, ChevronDown, ShieldCheck
} from 'lucide-react';
import { supabase } from './supabaseClient'; // Asegúrate de que la ruta sea correcta

interface DashboardHubProps {
    onNavigate: (view: 'onboarding' | 'report' | 'landing', reportId?: string) => void;
}

interface ReportView {
    id: string;
    created_at: string;
    status: string;
    final_slide_url: string | null;
    client_id: string;
    niche: string;
    client_name: string;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'home' | 'settings' | 'billing'>('home');
    const [reports, setReports] = useState<ReportView[]>([]);
    const [loading, setLoading] = useState(true);
    const [clientInfo, setClientInfo] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [daysUntilNextReport, setDaysUntilNextReport] = useState<number | null>(null);

    // States for Editing (Settings)
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    onNavigate('landing');
                    return;
                }

                // 2. BUSCAR DATOS COMPLETOS DEL CLIENTE
                const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (clientError || !clientData) {
                    console.error("Error buscando cliente:", clientError);
                    setLoading(false);
                    return;
                }

                setClientInfo(clientData);
                setEditData({
                    full_name: clientData.full_name,
                    company_name: clientData.company_name,
                    industry: clientData.industry,
                    goal: clientData.goal,
                    whatsapp: clientData.whatsapp,
                    brand_tone: clientData.brand_tone,
                    usp: clientData.usp,
                    video_formats: Array.isArray(clientData.video_formats) ? clientData.video_formats : [],
                    brand_perception: clientData.brand_perception,
                    brand_aspiration: clientData.brand_aspiration,
                    target_pain_point: clientData.target_pain_point,
                    competitors: Array.isArray(clientData.competitors) ? clientData.competitors : []
                });

                // 3. BUSCAR REPORTES
                const { data: reportsData, error: reportsError } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('client_id', user.id)
                    .order('created_at', { ascending: false });

                if (reportsError) throw reportsError;

                const combinedData: ReportView[] = (reportsData || []).map(r => ({
                    id: r.id,
                    created_at: r.created_at,
                    status: r.status,
                    final_slide_url: r.final_slide_url,
                    client_id: r.client_id,
                    niche: clientData.industry || "General",
                    client_name: clientData.full_name
                }));

                setReports(combinedData);

                // 4. CALCULAR TIMER (15 días desde el último reporte)
                if (combinedData.length > 0) {
                    const lastReportDate = new Date(combinedData[0].created_at);
                    const nextReportDate = new Date(lastReportDate.getTime() + 15 * 24 * 60 * 60 * 1000);
                    const diffMs = nextReportDate.getTime() - new Date().getTime();
                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    setDaysUntilNextReport(diffDays > 0 ? diffDays : 0);
                } else {
                    // Si no hay reportes, el primero debería ser inminente o mostrar 15
                    setDaysUntilNextReport(1);
                }

            } catch (err) {
                console.error("Error en Dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [onNavigate]);

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            // Aseguramos que los datos se envíen correctamente según el tipo de columna
            const dataToUpdate = {
                full_name: editData.full_name,
                company_name: editData.company_name,
                industry: editData.industry,
                goal: editData.goal,
                whatsapp: editData.whatsapp,
                brand_tone: editData.brand_tone,
                usp: editData.usp,
                video_formats: editData.video_formats,
                brand_perception: editData.brand_perception,
                brand_aspiration: editData.brand_aspiration,
                target_pain_point: editData.target_pain_point,
                competitors: editData.competitors
            };

            const { error } = await supabase
                .from('clients')
                .update(dataToUpdate)
                .eq('id', clientInfo.id);

            if (error) {
                console.error("Error detallado de Supabase:", error);
                throw error;
            }

            setClientInfo({ ...clientInfo, ...editData });
            alert("¡Ajustes guardados con éxito!");
        } catch (err: any) {
            console.error("Error guardando ajustes:", err);
            alert(`Hubo un error al guardar: ${err.message || 'Error desconocido'}`);
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setNewPassword('');
            alert("¡Contraseña actualizada con éxito!");
        } catch (err: any) {
            console.error("Error actualizando contraseña:", err);
            alert("Error: " + (err.message || "No se pudo actualizar la contraseña"));
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onNavigate('landing');
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date);
    };

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'completed' || s === 'completado') return { label: 'Listo', bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' };
        if (s === 'processing' || s === 'procesando') return { label: 'IA...', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' };
        if (s === 'failed') return { label: 'Error', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' };
        return { label: 'Pendiente', bg: 'bg-yellow-50', text: 'text-yellow-600', dot: 'bg-yellow-500' };
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Zap size={20} className="text-zylo-black fill-current" />
                    <span className="text-xl font-bold text-zylo-black">HookBase</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-8 hidden lg:block">
                    <div className="flex items-center gap-2">
                        <Zap size={24} className="text-zylo-black fill-current" />
                        <span className="text-2xl font-bold text-zylo-black tracking-tight">HookBase</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-8 lg:py-0 space-y-2">
                    <button
                        onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'home' ? 'text-zylo-purple bg-zylo-purpleLight/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Layout size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === 'settings' ? 'text-zylo-purple bg-zylo-purpleLight/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Settings size={18} /> Ajustes
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => { setActiveTab('billing'); setIsMobileMenuOpen(false); }}
                        className={`w-full bg-gray-900 rounded-2xl p-4 text-white mb-4 text-left transition-all hover:bg-gray-800 ${activeTab === 'billing' ? 'ring-2 ring-zylo-purple ring-offset-2 ring-offset-white' : ''}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-xs">Pro Plan</span>
                            <span className="text-[10px] bg-zylo-purple/20 text-zylo-purple px-1.5 py-0.5 rounded font-bold uppercase">Activo</span>
                        </div>
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mb-2">
                            <div className="bg-zylo-green h-full w-[100%]"></div>
                        </div>
                        <p className="text-[10px] text-gray-400">Reportes Automáticos</p>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={18} /> Salir
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 transition-all duration-500 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Header */}
                    <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                        <div className="animate-in fade-in slide-in-from-left-6 duration-700">
                            <div className="flex items-center gap-3 mb-3">
                                {activeTab !== 'home' && (
                                    <button
                                        onClick={() => setActiveTab('home')}
                                        className="lg:hidden p-2 -ml-2 bg-white rounded-full shadow-sm border border-gray-100 text-zylo-purple animate-in fade-in slide-in-from-right-4"
                                    >
                                        <ChevronRight className="rotate-180" size={20} />
                                    </button>
                                )}
                                <div className="px-3 py-1 bg-zylo-purpleLight/40 backdrop-blur-md rounded-full border border-zylo-purple/10">
                                    <span className="text-[10px] font-black text-zylo-purple uppercase tracking-[0.2em]">
                                        {activeTab === 'home' ? 'Resumen Estratégico' : activeTab === 'settings' ? 'Centro de Configuración' : 'Suscripción Pro'}
                                    </span>
                                </div>
                                <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-zylo-black tracking-tight leading-[0.9] mb-4">
                                {activeTab === 'home' ? (
                                    <>¡Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zylo-purple via-zylo-purple to-zylo-black">{clientInfo?.full_name?.split(' ')[0] || 'Cero'}</span>! 👋</>
                                ) : activeTab === 'settings' ? 'Tus Ajustes' : 'Tu Cuenta'}
                            </h1>
                            <p className="text-gray-500 font-medium text-sm md:text-lg max-w-xl leading-relaxed">
                                {activeTab === 'home'
                                    ? "Acá tenés una vista panorámica de cómo tu marca está dominando el algoritmo."
                                    : activeTab === 'settings'
                                        ? "Personalizá cada detalle estratégico para que tu IA aprenda más rápido."
                                        : "Gestioná tus pagos y mantené tu cuenta siempre activa para no detener el flujo."}
                            </p>
                        </div>

                        {activeTab === 'home' && daysUntilNextReport !== null && (
                            <div className="animate-in fade-in slide-in-from-right-6 duration-700 relative group overflow-hidden bg-white p-6 rounded-[2.5rem] shadow-glass border border-white flex items-center gap-8 transition-all hover:shadow-2xl">
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="48" cy="48" r="42"
                                            fill="transparent"
                                            stroke="#F3F4F6"
                                            strokeWidth="8"
                                        />
                                        <circle
                                            cx="48" cy="48" r="42"
                                            fill="transparent"
                                            stroke="url(#purple_gradient)"
                                            strokeWidth="8"
                                            strokeDasharray={263.89}
                                            strokeDashoffset={263.89 - (263.89 * (15 - (daysUntilNextReport || 0))) / 15}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-in-out"
                                        />
                                        <defs>
                                            <linearGradient id="purple_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#8A2BE2" />
                                                <stop offset="100%" stopColor="#4169E1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-2xl font-black text-zylo-black leading-none">{daysUntilNextReport}</span>
                                        <span className="text-[8px] font-black text-gray-400 uppercase">Días</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Próxima Ola Viral</h3>
                                    <p className="text-xl font-bold text-zylo-black">
                                        {daysUntilNextReport === 1 ? '¡Mañana mismo!' : `Lanza en ${daysUntilNextReport} días`}
                                    </p>
                                    <div
                                        onClick={() => setActiveTab('settings')}
                                        className="flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer"
                                    >
                                        <span className="text-[10px] font-black text-zylo-purple uppercase tracking-widest">Ver Detalles</span>
                                        <ArrowUpRight size={14} className="text-zylo-purple" />
                                    </div>
                                </div>
                                {/* Subtle Glow Background */}
                                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-zylo-purple/5 blur-[50px] rounded-full"></div>
                            </div>
                        )}
                    </header>

                    {activeTab === 'home' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            {/* Stats Grid AAA */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Reportes Listos', val: reports.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', sub: 'Estrategias generadas' },
                                    { label: 'Nicho Estratégico', val: clientInfo?.industry || '...', icon: Target, color: 'text-zylo-purple', bg: 'bg-zylo-purpleLight/50', sub: 'Tu foco actual' },
                                    { label: 'Status Cuenta', val: 'PRO', icon: Award, color: 'text-zylo-yellow', bg: 'bg-zylo-yellow/10', sub: 'Acceso total habilitado' }
                                ].map((stat, i) => (
                                    <div key={i} className="group relative bg-white p-10 rounded-[3rem] shadow-glass border border-white/50 transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                            <stat.icon size={28} />
                                        </div>
                                        <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                                        <div className="text-4xl font-black text-zylo-black tracking-tight mb-2 uppercase break-words">{stat.val}</div>
                                        <p className="text-gray-400 text-xs font-medium">{stat.sub}</p>
                                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                                            <TrendingUp size={60} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Enhanced History Table */}
                            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-glass border border-white overflow-hidden p-4 md:p-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-zylo-purple rounded-full"></div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-zylo-black tracking-tight">Historial Viral</h2>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tus armas secretas de contenido</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1 md:flex-initial">
                                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="text"
                                                placeholder="Buscar por fecha..."
                                                className="pl-12 pr-6 py-4 bg-gray-50/50 border border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all w-full md:w-64 shadow-inner"
                                            />
                                        </div>
                                        <button className="p-4 bg-white rounded-2xl text-gray-400 hover:text-zylo-purple hover:shadow-lg transition-all border border-gray-100">
                                            <Filter size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Mobile Row View */}
                                <div className="md:hidden space-y-4 px-2">
                                    {reports.length === 0 ? (
                                        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Sin reportes aún.</div>
                                    ) : reports.map((report) => {
                                        const isReady = report.status === 'ready' || report.final_slide_url;
                                        const dateStr = new Date(report.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                                        return (
                                            <div key={report.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReady ? 'bg-zylo-purpleLight/50 text-zylo-purple' : 'bg-gray-100 text-gray-300'}`}>
                                                            <Sparkle size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-zylo-black text-sm">Estrategia Viral</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{dateStr}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isReady ? 'bg-zylo-green/10 text-zylo-green' : 'bg-amber-400/10 text-amber-500'}`}>
                                                        {isReady ? 'LISTO' : 'IA...'}
                                                    </div>
                                                </div>
                                                {isReady && (
                                                    <a
                                                        href={report.final_slide_url || '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full flex items-center justify-center gap-2 py-3 bg-zylo-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl"
                                                    >
                                                        Ver Reporte <ArrowUpRight size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Estrategia</th>
                                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nicho</th>
                                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Estado</th>
                                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50/50">
                                            {reports.map((report) => {
                                                const dateStr = new Date(report.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                                                const isReady = report.status === 'ready' || report.final_slide_url;
                                                return (
                                                    <tr key={report.id} className="group hover:bg-white/80 transition-all cursor-pointer">
                                                        <td className="px-6 py-8">
                                                            <div className="flex items-center gap-5">
                                                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 ${isReady ? 'bg-zylo-purpleLight/50 text-zylo-purple' : 'bg-gray-100 text-gray-300'}`}>
                                                                    <Sparkle size={24} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-lg font-bold text-zylo-black leading-tight">Reporte Estratégico</div>
                                                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{dateStr}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-8">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500 group-hover:bg-zylo-black group-hover:text-white transition-colors">{report.niche || 'General'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-8">
                                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${isReady ? 'bg-zylo-green/10 text-zylo-green' : 'bg-amber-400/10 text-amber-500'} group-hover:border-current transition-all animate-pulse`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-zylo-green' : 'bg-amber-500'}`}></div>
                                                                {isReady ? 'Listo para detonar' : 'Procesando IA'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-8 text-right">
                                                            {isReady ? (
                                                                <a
                                                                    href={report.final_slide_url || '#'}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-3 px-6 py-3.5 bg-zylo-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zylo-purple hover:scale-105 active:scale-95 shadow-xl transition-all"
                                                                >
                                                                    Ver Reporte <ArrowUpRight size={14} />
                                                                </a>
                                                            ) : (
                                                                <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-50 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-2xl">
                                                                    Generando <Clock size={14} className="animate-spin" />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 items-start">
                            {/* Main Settings Area */}
                            <div className="xl:col-span-2 space-y-12">
                                {/* Section: Identity */}
                                <div className="bg-white/70 backdrop-blur-xl p-10 md:p-12 rounded-[3.5rem] shadow-glass border border-white space-y-10">
                                    <div>
                                        <h2 className="text-2xl font-black text-zylo-black tracking-tight mb-2">Identidad de Marca</h2>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Lo que define el alma de tu contenido</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                                            <input
                                                type="text"
                                                value={editData?.company_name || ''}
                                                onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[1.5rem] px-6 py-5 text-base outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm"
                                                placeholder="Tu marca..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rubro Principal</label>
                                            <div className="relative">
                                                <select
                                                    value={editData?.industry || ''}
                                                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[1.5rem] px-6 py-5 text-base outline-none appearance-none font-bold shadow-sm"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Real Estate">Inmobiliaria</option>
                                                    <option value="Fitness">Fitness & Salud</option>
                                                    <option value="Ecommerce">E-commerce</option>
                                                    <option value="Professional Services">Servicios Profesionales</option>
                                                    <option value="Other">Otro</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Mic2 size={14} className="text-zylo-purple" /> Tono de Voz
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={editData?.brand_tone || ''}
                                                    onChange={(e) => setEditData({ ...editData, brand_tone: e.target.value })}
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[1.5rem] px-6 py-5 text-base outline-none appearance-none font-bold shadow-sm"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Friendly">Amigable y Cercano</option>
                                                    <option value="Professional">Profesional y Autoritario</option>
                                                    <option value="Disruptive">Provocador y Directo</option>
                                                    <option value="Scientific">Educativo y Basado en Datos</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Target size={14} className="text-zylo-green" /> Objetivo Viral
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={editData?.goal || ''}
                                                    onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[1.5rem] px-6 py-5 text-base outline-none appearance-none font-bold shadow-sm"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Ventas">Generar Ventas</option>
                                                    <option value="Seguidores">Crecer Audiencia</option>
                                                    <option value="Autoridad">Marca Personal / Autoridad</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Content Strategy */}
                                <div className="bg-white/70 backdrop-blur-xl p-10 md:p-12 rounded-[3.5rem] shadow-glass border border-white space-y-10">
                                    <div>
                                        <h2 className="text-2xl font-black text-zylo-black tracking-tight mb-2">Estrategia de Contenido</h2>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Lo que le dice a la IA cómo pensar</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Eye size={16} className="text-blue-500" /> Percepción Actual
                                            </label>
                                            <textarea
                                                value={editData?.brand_perception || ''}
                                                onChange={(e) => setEditData({ ...editData, brand_perception: e.target.value })}
                                                rows={3}
                                                placeholder="Ej: Siento que me ven demasiado técnico..."
                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[2rem] px-8 py-6 text-base outline-none resize-none font-medium leading-relaxed shadow-sm transition-all"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                <Sparkles size={16} className="text-zylo-yellow" /> Aspiración de Marca
                                            </label>
                                            <textarea
                                                value={editData?.brand_aspiration || ''}
                                                onChange={(e) => setEditData({ ...editData, brand_aspiration: e.target.value })}
                                                rows={3}
                                                placeholder="Ej: Quiero que sientan que soy la autoridad número 1..."
                                                className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[2rem] px-8 py-6 text-base outline-none resize-none font-medium leading-relaxed shadow-sm transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <HeartHandshake size={16} className="text-red-400" /> Dolor del Cliente
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editData?.target_pain_point || ''}
                                                    onChange={(e) => setEditData({ ...editData, target_pain_point: e.target.value })}
                                                    placeholder="Ej. No llegan a fin de mes..."
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[1.5rem] px-6 py-5 text-base outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                    <Star size={16} className="text-zylo-yellow" /> Tu Diferencial (USP)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editData?.usp || ''}
                                                    onChange={(e) => setEditData({ ...editData, usp: e.target.value })}
                                                    placeholder="Ej. Resultados en 30 días..."
                                                    className="w-full bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-[1.5rem] px-6 py-5 text-base outline-none transition-all font-bold placeholder:text-gray-300 shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Formatos de Video Preferidos</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['Cara a cámara', 'Narrado con stock/B-roll', 'Tutorial de pantalla', 'Voz en off con texto', 'POV / Lifestyle'].map((format) => {
                                                    const isSelected = editData?.video_formats?.includes(format);
                                                    return (
                                                        <button
                                                            key={format}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = editData.video_formats || [];
                                                                const next = current.includes(format)
                                                                    ? current.filter((f: string) => f !== format)
                                                                    : [...current, format];
                                                                setEditData({ ...editData, video_formats: next });
                                                            }}
                                                            className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all active:scale-95 flex items-center gap-2 ${isSelected ? 'bg-zylo-black text-white border-zylo-black shadow-lg scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-zylo-purple/20 hover:text-zylo-purple shadow-sm'}`}
                                                        >
                                                            {format} {isSelected && <CheckCircle size={14} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Settings: Competitors & Account */}
                            <div className="space-y-12">
                                {/* Competitors Card */}
                                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3.5rem] shadow-glass border border-white space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zylo-purpleLight/50 text-zylo-purple rounded-xl flex items-center justify-center">
                                            <BarChart3 size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-zylo-black tracking-tight">Competencia</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-2 min-h-[50px]">
                                            {editData?.competitors.map((comp: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2 bg-zylo-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-in zoom-in duration-300">
                                                    @{comp}
                                                    <button
                                                        onClick={() => setEditData({ ...editData, competitors: editData.competitors.filter((_: any, i: number) => i !== idx) })}
                                                        className="hover:text-red-400 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {editData?.competitors.length === 0 && (
                                                <div className="w-full py-8 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Sin competencia</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Ej: nicolasgalli"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = (e.currentTarget.value).trim().replace('@', '');
                                                        if (val && !editData.competitors.includes(val)) {
                                                            setEditData({ ...editData, competitors: [...editData.competitors, val] });
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }}
                                                className="w-full pl-6 pr-14 py-5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white outline-none font-bold transition-all text-sm"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-300 border border-gray-200 px-2 py-0.5 rounded uppercase tracking-tighter">Enter</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Security/Account Card */}
                                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[3.5rem] shadow-glass border border-white space-y-8 border-dashed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center">
                                            <Lock size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-zylo-black tracking-tight">Seguridad</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full pl-6 pr-14 py-5 bg-gray-50/50 border-2 border-transparent focus:border-zylo-purple/20 focus:bg-white rounded-2xl text-base outline-none transition-all font-bold placeholder:text-gray-200"
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                                                    <Key size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleUpdatePassword}
                                            disabled={isUpdatingPassword || !newPassword}
                                            className="w-full py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] bg-white border-2 border-gray-100 text-gray-400 hover:border-zylo-purple hover:text-zylo-purple hover:bg-zylo-purple/5 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:scale-100 active:scale-95"
                                        >
                                            {isUpdatingPassword ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                                            Actualizar Acceso
                                        </button>
                                    </div>
                                </div>

                                {/* Floating Save Button AAA */}
                                <div className="sticky bottom-10 z-20">
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSavingSettings}
                                        className="w-full group bg-zylo-black text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-zylo-purple/40 hover:bg-zylo-purple transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                        {isSavingSettings ? <Loader2 className="animate-spin" size={24} /> : <Sparkle size={24} className="group-hover:rotate-180 transition-transform duration-700" />}
                                        <span className="relative z-10">{isSavingSettings ? 'Guardando...' : 'Detonar Cambios'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="relative overflow-hidden bg-zylo-black rounded-[4rem] shadow-2xl p-1 md:p-1.5">
                                {/* Decorative Gradient */}
                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-zylo-purple/30 blur-[100px] rounded-full"></div>
                                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-zylo-purple/20 blur-[100px] rounded-full"></div>

                                <div className="relative bg-white/5 backdrop-blur-2xl rounded-[3.8rem] p-10 md:p-16 border border-white/10 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-zylo-purple via-zylo-purple to-zylo-purpleLight rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(138,43,226,0.3)] mb-10 group hover:scale-110 transition-transform duration-500">
                                        <Award size={48} className="text-white animate-pulse" />
                                    </div>

                                    <div className="space-y-4 mb-12">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zylo-purple/20 rounded-full border border-zylo-purple/20">
                                            <span className="w-2 h-2 rounded-full bg-zylo-purple animate-ping"></span>
                                            <span className="text-[10px] font-black text-zylo-purpleLight uppercase tracking-[0.2em]">Suscripción Activa</span>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">HookBase <span className="text-transparent bg-clip-text bg-gradient-to-r from-zylo-purpleLight to-white">PRO</span></h2>
                                        <p className="text-gray-400 text-lg font-medium max-w-sm">Tenés acceso ilimitado a toda la potencia de nuestra IA generativa.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mb-12">
                                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-left group hover:bg-white/10 transition-colors">
                                            <p className="text-[10px] font-black text-zylo-purpleLight uppercase tracking-widest mb-2">Inversión Mensual</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-white">$10.000</span>
                                                <span className="text-sm font-bold text-gray-500">/mes</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-left group hover:bg-white/10 transition-colors">
                                            <p className="text-[10px] font-black text-zylo-purpleLight uppercase tracking-widest mb-2">Próxima Renovación</p>
                                            <div className="text-3xl font-black text-white">
                                                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full max-w-xl space-y-6">
                                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6 text-left">
                                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0">
                                                <ShieldCheck size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">Seguridad Mercado Pago</h4>
                                                <p className="text-gray-400 text-sm font-medium">Tus pagos están protegidos. Podés cancelar en cualquier momento desde tu panel de MP.</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a
                                                href="https://www.mercadopago.com.ar/subscriptions#from-section=menu"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 py-5 bg-white text-zylo-black rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-zylo-purple hover:text-white transition-all text-center shadow-xl hover:shadow-zylo-purple/20"
                                            >
                                                Gestionar Pagos
                                            </a>
                                            <button
                                                className="px-10 py-5 bg-white/5 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                                                onClick={() => alert("Comunícate con soporte para soporte prioritario Pro.")}
                                            >
                                                Soporte VIP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};