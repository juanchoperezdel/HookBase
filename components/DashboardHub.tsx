
import React, { useEffect, useState } from 'react';
import { Plus, Layout, LogOut, Loader2, Zap, ChevronRight, Database, Search, ShieldAlert, Copy, Check, Terminal, AlertCircle, User, Mail, RefreshCw, Link2 } from 'lucide-react';
import { supabase } from './supabaseClient';

interface DashboardHubProps {
  onNavigate: (view: 'onboarding' | 'report' | 'landing' | 'login', reportId?: string) => void;
}

interface ReportView {
  id: string;
  created_at: string;
  status: string;
  final_slide_url: string | null;
  client_id: string;
  display_name: string;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<ReportView[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<{name: string, email: string} | null>(null);
  const [copiedFix, setCopiedFix] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [orphanCount, setOrphanCount] = useState(0);
  const [oldClientId, setOldClientId] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
         onNavigate('login');
         return;
      }

      const currentAuthId = user.id;
      setUserId(currentAuthId);
      const userEmail = user.email || '';
      
      setClientInfo({ 
        name: user.user_metadata?.full_name || userEmail.split('@')[0], 
        email: userEmail 
      });

      // 1. Buscar reportes con el ID de Auth actual
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .eq('client_id', currentAuthId)
        .order('created_at', { ascending: false });

      if (reportsData && reportsData.length > 0) {
        setReports(reportsData.map(r => ({
            id: r.id,
            created_at: r.created_at,
            status: r.status,
            final_slide_url: r.final_slide_url,
            client_id: r.client_id,
            display_name: `Estrategia Viral #${r.id.slice(0, 4)}`
        })));
        setOrphanCount(0);
        setOldClientId(null);
      } else {
        // 2. Si no hay reportes, buscamos si hay registros con el mismo email pero ID diferente
        const { data: oldClientData } = await supabase
            .from('clients')
            .select('id')
            .eq('email', userEmail)
            .neq('id', currentAuthId)
            .maybeSingle();

        if (oldClientData) {
            setOldClientId(oldClientData.id);
            const { count } = await supabase
                .from('reports')
                .select('*', { count: 'exact', head: true })
                .eq('client_id', oldClientData.id);
            
            setOrphanCount(count || 0);
        } else {
            setOrphanCount(0);
            setOldClientId(null);
        }
        setReports([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMigrate = async () => {
    if (!userId || !clientInfo?.email || !oldClientId) return;
    setIsMigrating(true);
    try {
        // MIGRACIÓN ATÓMICA PARA EVITAR 23503 (FK) Y 23505 (Unique Email)
        
        // PASO 1: Obtener datos del viejo
        const { data: oldData } = await supabase
            .from('clients')
            .select('*')
            .eq('id', oldClientId)
            .single();

        if (oldData) {
            // PASO 2: Liberar el email en el viejo (para evitar conflicto UNIQUE)
            await supabase
                .from('clients')
                .update({ email: `${clientInfo.email}_old_${Date.now()}` })
                .eq('id', oldClientId);

            // PASO 3: Crear el nuevo registro con el ID de Auth actual
            await supabase
                .from('clients')
                .insert({
                    id: userId,
                    name: oldData.name,
                    email: clientInfo.email,
                    business_description: oldData.business_description
                });

            // PASO 4: Mover los reportes al nuevo ID (Ahora la FK no falla porque el ID ya existe)
            await supabase
                .from('reports')
                .update({ client_id: userId })
                .eq('client_id', oldClientId);
            
            // PASO 5: Borrar el viejo (Ahora no falla porque no tiene reportes asociados)
            await supabase
                .from('clients')
                .delete()
                .eq('id', oldClientId);
        }
        
        await fetchData();
    } catch (e) {
        console.error("Migration failed", e);
        alert("Error de integridad: " + (e as any).message);
    } finally {
        setIsMigrating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    onNavigate('landing');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  const migrationSQL = `BEGIN;\n  -- 1. Liberar email\n  UPDATE clients SET email = email || '_old' WHERE id = '${oldClientId || 'ID_VIEJO'}';\n\n  -- 2. Crear nuevo cliente\n  INSERT INTO clients (id, name, email, business_description)\n  SELECT '${userId}', name, '${clientInfo?.email}', business_description FROM clients WHERE id = '${oldClientId || 'ID_VIEJO'}';\n\n  -- 3. Mover reportes\n  UPDATE reports SET client_id = '${userId}' WHERE client_id = '${oldClientId || 'ID_VIEJO'}';\n\n  -- 4. Borrar viejo\n  DELETE FROM clients WHERE id = '${oldClientId || 'ID_VIEJO'}';\nCOMMIT;`;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-zylo-purple mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Reparando base de datos...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans text-zylo-black">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-10 flex items-center gap-2">
            <Zap size={24} className="text-zylo-black fill-current" />
            <span className="text-2xl font-black tracking-tight">HookBase</span>
        </div>
        <nav className="flex-1 px-6 space-y-2">
            <button className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-zylo-purple bg-zylo-purpleLight/40 rounded-2xl">
                <Layout size={18} /> Dashboard
            </button>
            <button onClick={() => onNavigate('onboarding')} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-gray-400 hover:text-zylo-black rounded-2xl">
                <Plus size={18} /> Nuevo Reporte
            </button>
        </nav>
        <div className="p-6 mt-auto space-y-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
                <LogOut size={18} /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-[1400px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">Hola, {clientInfo?.name}</h1>
                <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-gray-400 text-xs font-medium flex items-center gap-1">
                        <Mail size={12} /> {clientInfo?.email}
                    </p>
                    <p className="text-gray-400 text-xs font-medium flex items-center gap-1">
                        <User size={12} /> Auth ID: <span className="text-zylo-black font-mono font-bold">{userId.slice(0, 8)}...</span>
                    </p>
                </div>
            </div>
            <button onClick={() => onNavigate('onboarding')} className="bg-zylo-black text-white px-10 py-5 rounded-full font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                <Plus size={20} strokeWidth={3} /> Nuevo Reporte
            </button>
        </header>

        {reports.length === 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3rem] p-10 shadow-card border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${orphanCount > 0 ? 'bg-zylo-purpleLight animate-pulse' : 'bg-amber-50'}`}>
                        {orphanCount > 0 ? <Link2 size={32} className="text-zylo-purple" /> : <AlertCircle size={32} className="text-amber-500" />}
                    </div>
                    
                    {orphanCount > 0 ? (
                        <>
                            <h3 className="text-2xl font-black mb-2">Reparación Maestra</h3>
                            <p className="text-gray-400 max-w-sm font-medium mb-8 leading-relaxed">
                                Detectamos <span className="text-zylo-black font-bold">{orphanCount} reportes</span> bloqueados por un conflicto de IDs. Haz clic abajo para forzar la migración segura.
                            </p>
                            <button 
                                onClick={handleMigrate} 
                                disabled={isMigrating}
                                className="bg-zylo-purple text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                                {isMigrating ? <RefreshCw className="animate-spin" /> : <ShieldAlert />}
                                {isMigrating ? 'Migrando datos...' : 'Arreglar mi Cuenta'}
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-black mb-2">No hay reportes</h3>
                            <p className="text-gray-400 max-w-sm font-medium mb-8">
                                No encontramos datos para <strong>{clientInfo?.email}</strong>.
                            </p>
                            <button onClick={() => fetchData()} className="bg-zylo-black text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all">
                                Reintentar
                            </button>
                        </>
                    )}
                </div>

                <div className="bg-zylo-black rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-gray-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-zylo-purple opacity-10 blur-[100px]"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-zylo-green text-zylo-black rounded-lg"><Terminal size={20} /></div>
                            <h3 className="text-xl font-black tracking-tight text-zylo-green">Query Anti-Errores</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-zylo-green/10 rounded-3xl border border-zylo-green/20">
                                <p className="text-zylo-green font-bold text-[10px] uppercase tracking-[0.2em] mb-4">SQL DE REPARACIÓN TOTAL:</p>
                                <div className="relative group">
                                    <div className="bg-gray-900 rounded-xl p-5 font-mono text-[8px] text-gray-300 border border-zylo-green/30 overflow-x-auto pr-16 leading-relaxed">
                                        <pre>{migrationSQL}</pre>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(migrationSQL)}
                                        className="absolute right-3 top-3 p-3 bg-zylo-green text-zylo-black rounded-xl hover:scale-105 transition-all"
                                    >
                                        {copiedFix ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={3} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
                                    Usa este código en el <strong>SQL Editor</strong> de Supabase. Cambia el email del viejo para evitar el error de duplicado y luego mueve los reportes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white rounded-[3rem] shadow-card border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estrategia</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {reports.map((report) => (
                            <tr key={report.id} onClick={() => onNavigate('report', report.id)} className="group hover:bg-gray-50 transition-all cursor-pointer">
                                <td className="px-10 py-8 font-black text-lg">{report.display_name}</td>
                                <td className="px-10 py-8 text-gray-400 font-medium">
                                    {new Date(report.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="inline-flex p-3 bg-zylo-black text-white rounded-2xl shadow-lg group-hover:translate-x-1 transition-transform">
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>
    </div>
  );
};
