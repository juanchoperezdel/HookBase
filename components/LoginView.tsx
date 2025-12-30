
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, ChevronRight, Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de login y verificación de suscripción
    setTimeout(() => {
      // Mock: si el email contiene "unpaid", lo mandamos a pagar
      const hasPaid = !email.includes('unpaid');
      setIsLoading(false);
      onLoginSuccess(hasPaid);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
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
          <h1 className="text-3xl font-extrabold text-zylo-black tracking-tight">Bienvenido</h1>
          <p className="text-gray-500 font-medium text-sm mt-2">Ingresa tus datos para acceder al dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-5 py-4 text-base focus:border-zylo-purple/40 focus:bg-white outline-none transition-all font-medium"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-12 py-4 text-base focus:border-zylo-purple/40 focus:bg-white outline-none transition-all font-medium"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zylo-purple transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-zylo-black text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Entrar'}
            {!isLoading && <ChevronRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm font-medium">
                ¿Aún no tienes cuenta? <button onClick={onRegister} className="text-zylo-purple font-black hover:underline ml-1">Crea una ahora</button>
            </p>
        </div>
      </motion.div>
    </div>
  );
};
