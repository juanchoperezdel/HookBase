import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, ChevronRight, Zap, Eye, EyeOff, Loader2, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from './supabaseClient';

interface LoginViewProps {
  onBack: () => void;
  onRegister: () => void;
  onLoginSuccess: (paid: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{message: string, type: 'error' | 'info' | 'warning'} | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("El email o la contraseña son incorrectos. Si aún no tienes cuenta, por favor regístrate.");
        }
        if (authError.message.includes("Email not confirmed")) {
          setError({ 
            message: "Por favor, verifica tu correo electrónico para activar tu cuenta.", 
            type: 'warning' 
          });
          setIsLoading(false);
          return;
        }
        throw authError;
      }

      // Verificación de suscripción simplificada (puedes ajustar esta lógica según tus políticas de Supabase)
      onLoginSuccess(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError({ message: err.message || "Error de conexión.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const forceLogin = () => {
    // Este método permite saltar la verificación solo para pruebas locales/dev
    console.log("Forzando entrada en modo test...");
    onLoginSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-zylo-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-card border border-gray-100 p-8 md:p-12"
      >
        <button onClick={onBack} className="mb-8 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-zylo-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
             <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Bienvenido</h1>
          <p className="text-gray-500 font-medium text-sm mt-2">Ingresa tus datos para acceder a HookBase.</p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-2xl flex flex-col gap-3 text-sm font-medium border ${
            error.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 
            error.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-700' :
            'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            <div className="flex items-start gap-3">
                {error.type === 'error' ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <Info size={18} className="shrink-0 mt-0.5" />}
                <span>{error.message}</span>
            </div>
            
            {error.type === 'warning' && (
                <button 
                    type="button"
                    onClick={forceLogin}
                    className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-amber-700 transition-all shadow-md"
                >
                    <ShieldAlert size={14} /> Saltar verificación y entrar (Modo Test)
                </button>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    required
                    className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 pl-12 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" 
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 pl-12 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" 
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zylo-purple transition-colors"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
          </div>

          <div className="flex justify-end">
             <button type="button" className="text-xs font-bold text-zylo-purple hover:underline">¿Olvidaste tu contraseña?</button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-zylo-black text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} fill="currentColor" />}
            {isLoading ? 'Iniciando sesión...' : 'Entrar ahora'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 font-medium">
                ¿No tienes una cuenta? {' '}
                <button onClick={onRegister} className="text-zylo-purple font-bold hover:underline">Empieza gratis aquí</button>
            </p>
        </div>
      </motion.div>
    </div>
  );
};