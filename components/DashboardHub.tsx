import React, { useEffect, useState } from 'react';
import {
    Plus, Search, Calendar, ChevronRight,
    Layout, BarChart3, Settings, LogOut,
    FileText, Clock, Filter, ArrowUpRight, Loader2, ExternalLink, Menu, X, Zap
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
            const { error } = await supabase
                .from('clients')
                .update({
                    full_name: editData.full_name,
                    company_name: editData.company_name,
                    industry: editData.industry,
                    goal: editData.goal,
                    competitors: editData.competitors
                })
                .eq('id', clientInfo.id);

            if (error) throw error;
            setClientInfo({ ...clientInfo, ...editData });
            alert("¡Ajustes guardados con éxito!");
        } catch (err) {
            console.error("Error guardando ajustes:", err);
            alert("Hubo un error al guardar.");
        } finally {
            setIsSavingSettings(false);
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
            <main className="flex-1 p-4 md:p-8 lg:p-10">

                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 lg:mb-12">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-zylo-black">
                            {loading ? <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg"></div> :
                                activeTab === 'settings' ? 'Ajustes del Perfil' :
                                    activeTab === 'billing' ? 'Tu Suscripción' :
                                        `Hola, ${clientInfo?.full_name?.split(' ')[0] || '...'} 👋`}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base font-medium">
                            {activeTab === 'settings' ? 'Gestiona tu competencia y datos estratégicos.' :
                                activeTab === 'billing' ? 'Administra tu plan y facturación.' :
                                    'Tus reportes estratégicos están listos.'}
                        </p>
                    </div>
                    {activeTab === 'home' && (
                        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-soft border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="p-2 bg-zylo-purpleLight text-zylo-purple rounded-xl">
                                <Clock size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Próximo Reporte</p>
                                <p className="text-sm font-bold text-zylo-black">
                                    {daysUntilNextReport !== null ? `en ${daysUntilNextReport} días` : 'Calculando...'}
                                </p>
                            </div>
                        </div>
                    )}
                </header>

                {activeTab === 'home' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 lg:mb-12">
                            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex items-center gap-4">
                                <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-zylo-black">{reports.length}</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Reportes</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex items-center gap-4">
                                <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
                                    <Clock size={22} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-zylo-black">{(reports.length * 2.5).toFixed(0)}h</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estrés evitado</p>
                                </div>
                            </div>

                            <div className="bg-zylo-black p-6 rounded-3xl shadow-xl border border-gray-900 text-white flex items-center gap-4 relative overflow-hidden sm:col-span-2 lg:col-span-1">
                                <div className="p-3.5 bg-white/10 text-white rounded-2xl relative z-10">
                                    <Zap size={22} />
                                </div>
                                <div className="relative z-10 overflow-hidden">
                                    <h3 className="text-xl font-black truncate max-w-[150px]">{clientInfo?.industry || "..."}</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tu Industria</p>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-zylo-purple opacity-20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        </div>

                        {/* Reports History */}
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-card border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <h2 className="text-lg md:text-xl font-extrabold text-zylo-black">Historial Estratégico</h2>

                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1 sm:flex-initial">
                                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar reporte..."
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-transparent focus:border-gray-200 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content: Mobile Cards vs Desktop Table */}
                            <div className="block md:hidden">
                                {loading ? (
                                    <div className="p-10 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Cargando...</div>
                                ) : reports.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400">Sin reportes aún.</div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {reports.map((report) => {
                                            const styles = getStatusStyles(report.status);
                                            const displayTitle = report.niche ? `Estrategia ${report.niche}` : "Reporte Viral";
                                            return (
                                                <div
                                                    key={report.id}
                                                    onClick={() => onNavigate('report', report.id)}
                                                    className="p-6 active:bg-gray-50 flex flex-col gap-4 cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-zylo-purple flex items-center justify-center shrink-0">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 leading-tight line-clamp-1">{displayTitle}</h4>
                                                                <p className="text-xs text-gray-400 font-medium">{formatDate(report.created_at)}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                                                            {styles.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Desktop View - Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/30 border-b border-gray-50">
                                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estrategia</th>
                                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="p-12 text-center text-gray-400">
                                                    <Loader2 className="animate-spin inline-block" /> Cargando...
                                                </td>
                                            </tr>
                                        ) : reports.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-12 text-center text-gray-400">
                                                    No hay reportes.
                                                </td>
                                            </tr>
                                        ) : reports.map((report) => {
                                            const styles = getStatusStyles(report.status);
                                            return (
                                                <tr
                                                    key={report.id}
                                                    onClick={() => onNavigate('report', report.id)}
                                                    className="group hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-zylo-purpleLight group-hover:text-zylo-purple transition-all">
                                                                <FileText size={18} />
                                                            </div>
                                                            <span className="font-bold text-gray-900 capitalize">
                                                                {report.niche ? `Estrategia ${report.niche}` : 'Reporte Viral'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-sm text-gray-500 font-medium">
                                                        {formatDate(report.created_at)}
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.text}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                                                            {styles.label}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex justify-end gap-2 text-gray-300">
                                                            {report.final_slide_url && (
                                                                <a
                                                                    href={report.final_slide_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors"
                                                                >
                                                                    <ExternalLink size={18} />
                                                                </a>
                                                            )}
                                                            <div className="p-2 rounded-xl group-hover:text-zylo-purple transition-colors">
                                                                <ChevronRight size={20} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Profile Info */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-gray-100 space-y-6">
                            <h2 className="text-xl font-extrabold text-zylo-black flex items-center gap-2">
                                <Zap size={20} className="text-zylo-purple" /> Información del Negocio
                            </h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={editData?.full_name || ''}
                                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-zylo-purple focus:bg-white outline-none font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        value={editData?.company_name || ''}
                                        onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-zylo-purple focus:bg-white outline-none font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Industria / Nicho</label>
                                    <input
                                        type="text"
                                        value={editData?.industry || ''}
                                        onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-zylo-purple focus:bg-white outline-none font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Objetivo del Canal</label>
                                    <textarea
                                        value={editData?.goal || ''}
                                        onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
                                        rows={3}
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-zylo-purple focus:bg-white outline-none font-medium transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Competitors */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-gray-100 flex flex-col">
                            <h2 className="text-xl font-extrabold text-zylo-black flex items-center gap-2 mb-6">
                                <BarChart3 size={20} className="text-zylo-purple" /> Competencia
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">Agregá los perfiles que querés que HookBase analice para tus reportes.</p>

                            <div className="flex-1 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {editData?.competitors.map((comp: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 bg-zylo-purpleLight/50 text-zylo-purple px-4 py-2 rounded-full text-sm font-bold">
                                            @{comp}
                                            <button
                                                onClick={() => setEditData({ ...editData, competitors: editData.competitors.filter((_: any, i: number) => i !== idx) })}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {editData?.competitors.length === 0 && (
                                        <p className="text-xs text-gray-400 italic">No hay competidores agregados.</p>
                                    )}
                                </div>

                                <div className="relative pt-4 border-t border-gray-50">
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
                                        className="w-full pl-5 pr-14 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-zylo-purple focus:bg-white outline-none font-medium transition-all"
                                    />
                                    <div className="absolute right-4 top-[2.4rem] text-[10px] font-black text-gray-300 uppercase">Enter para agregar</div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSettings}
                                disabled={isSavingSettings}
                                className="w-full bg-zylo-black text-white py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                            >
                                {isSavingSettings ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                                {isSavingSettings ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-gray-100 space-y-10">
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-20 h-20 bg-zylo-purpleLight text-zylo-purple rounded-[2rem] flex items-center justify-center shadow-soft">
                                    <Zap size={32} fill="currentColor" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-zylo-black tracking-tight">HookBase Pro</h2>
                                    <p className="text-gray-500 font-medium">Suscripción Mensual Activa</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-6 rounded-3xl space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Precio</p>
                                    <p className="text-lg font-bold text-zylo-black">$15 USD / mes</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-3xl space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Siguiente Pago</p>
                                    <p className="text-lg font-bold text-zylo-black">Próximo período</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-zylo-purple/5 border border-zylo-purple/10 p-6 rounded-3xl flex items-start gap-4">
                                    <div className="p-2 bg-zylo-purple text-white rounded-xl">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zylo-purple">¿Necesitás darte de baja?</h4>
                                        <p className="text-sm text-zylo-purple/70 font-medium mt-1">Podés cancelar en cualquier momento desde tu panel de Mercado Pago. Dejarás de recibir reportes al finalizar el período actual.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert("Para gestionar tu suscripción, ingresá a Mercado Pago > Mis Suscripciones o contactanos a soporte@hookbase.com")}
                                    className="w-full py-4 rounded-full font-bold text-red-500 border-2 border-red-50 hover:bg-red-50 transition-all text-center"
                                >
                                    Solicitar Baja
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};