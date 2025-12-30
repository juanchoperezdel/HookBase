import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Calendar, ChevronRight, 
  Layout, BarChart3, Settings, LogOut, 
  FileText, Clock, Filter, ArrowUpRight, Loader2, ExternalLink, Menu, X, Zap
} from 'lucide-react';
import { supabase } from './supabaseClient';

// --- CONFIGURACIÓN DE USUARIO (Mock) ---
const USER_EMAIL = "agustinhlahun@gmail.com"; 

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
  const [reports, setReports] = useState<ReportView[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<{name: string, niche: string} | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, name, business_description')
          .eq('email', USER_EMAIL)
          .single();

        if (clientError || !clientData) {
            setLoading(false);
            return;
        }

        setClientInfo({
            name: clientData.name || "Usuario",
            niche: clientData.business_description || "General"
        });

        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });

        if (reportsError) throw reportsError;

        const combinedData: ReportView[] = (reportsData || []).map(r => ({
            id: r.id,
            created_at: r.created_at,
            status: r.status,
            final_slide_url: r.final_slide_url,
            client_id: r.client_id,
            niche: clientData.business_description || "General",
            client_name: clientData.name
        }));

        setReports(combinedData);
      } catch (err) {
        console.error("Error en la carga de datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date);
  };

  const getStatusStyles = (status: string) => {
      const s = status?.toLowerCase() || '';
      if (s === 'completed' || s === 'completado') return { label: 'Listo', bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' };
      if (s === 'processing' || s === 'procesando') return { label: 'IA...', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' };
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

      {/* Sidebar (Desktop & Mobile Overlay) */}
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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zylo-purple bg-zylo-purpleLight/50 rounded-xl transition-colors">
                <Layout size={18} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                <Settings size={18} /> Ajustes
            </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-900 rounded-2xl p-4 text-white mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs">Pro Plan</span>
                    <span className="text-[10px] bg-zylo-purple/20 text-zylo-purple px-1.5 py-0.5 rounded font-bold">ACTIVO</span>
                </div>
                <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mb-2">
                    <div className="bg-zylo-green h-full w-[65%]"></div>
                </div>
                <p className="text-[10px] text-gray-400">{reports.length}/25 créditos</p>
            </div>
            <button 
                onClick={() => onNavigate('landing')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
                <LogOut size={18} /> Salir
            </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10">
        
        {/* Header con Datos Dinámicos */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 lg:mb-12">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-zylo-black">
                    Hola, {clientInfo ? clientInfo.name : '...'} 👋
                </h1>
                <p className="text-gray-500 text-sm md:text-base font-medium">
                    {clientInfo ? 'Tus reportes estratégicos están listos.' : 'Cargando...'}
                </p>
            </div>
            <button 
                onClick={() => onNavigate('onboarding')}
                className="flex items-center justify-center gap-2 bg-zylo-black text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 transition-all active:scale-95"
            >
                <Plus size={20} /> <span className="text-sm">Nuevo Reporte</span>
            </button>
        </header>

        {/* Stats Grid - Now vertical on small mobile */}
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
                    <h3 className="text-xl font-black truncate">{clientInfo?.niche || "Rubro activo"}</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tu Industria</p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-zylo-purple opacity-20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            </div>
        </div>

        {/* Reports History Section */}
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
                    <button className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Content: Mobile Cards vs Desktop Table */}
            <div className="block md:hidden">
                {/* Mobile view - Simple vertical list of cards */}
                {loading ? (
                    <div className="p-10 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Cargando...</div>
                ) : reports.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">Sin reportes aún.</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {reports.map((report) => {
                            const styles = getStatusStyles(report.status);
                            const displayTitle = report.niche 
                                ? `Estrategia ${report.niche}` 
                                : "Reporte Viral";
                            return (
                                <div 
                                    key={report.id}
                                    onClick={() => onNavigate('report', report.id)}
                                    className="p-6 active:bg-gray-50 flex flex-col gap-4"
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
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                             {report.final_slide_url && (
                                                <a 
                                                    href={report.final_slide_url} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 bg-blue-50 text-blue-500 rounded-lg"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                             )}
                                        </div>
                                        <button className="flex items-center gap-1 text-xs font-bold text-zylo-purple">
                                            Ver Reporte <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Desktop View - Traditional Table */}
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
                                    <Loader2 className="animate-spin inline-block" />
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
                                            <span className="font-bold text-gray-900 capitalize truncate max-w-[200px]">
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
                                        <div className="flex justify-end gap-2">
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
                                            <div className="p-2 rounded-xl text-gray-300 group-hover:text-zylo-purple transition-colors">
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

            {!loading && reports.length > 0 && (
                <div className="p-6 bg-gray-50/30 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>{reports.length} Reportes en total</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl border border-gray-100 bg-white opacity-50 cursor-not-allowed">Atras</button>
                        <button className="px-4 py-2 rounded-xl border border-gray-100 bg-white opacity-50 cursor-not-allowed">Siguiente</button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};