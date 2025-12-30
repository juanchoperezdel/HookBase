import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, ChevronRight, Globe, Zap, Loader2, Eye, EyeOff, Lock, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabaseClient';

interface OnboardingFormProps {
  onBack: () => void;
  initialStep?: Step;
}

type Step = 1 | 2 | 3 | 4;

const COUNTRY_CODES = [
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
];

const VIDEO_FORMATS = [
  'Cara a cámara',
  'Narrado con stock/B-roll',
  'Tutorial de pantalla',
  'Voz en off con texto',
  'POV / Lifestyle'
];

const MP_SUBSCRIPTION_URL = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=7fe1b531268349f3885c421e28f67978";

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onBack, initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: '+54',
    whatsapp: '',
    companyName: '',
    industry: '',
    otherIndustry: '',
    videoFormats: [] as string[],
    goal: '',
    competitors: [] as string[]
  });
  
  const [competitorInput, setCompetitorInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'whatsapp') {
      const onlyNums = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
  };

  const passValidation = validatePassword(formData.password);
  const isPasswordValid = passValidation.length && passValidation.uppercase && passValidation.special;

  const toggleVideoFormat = (format: string) => {
    setFormData(prev => ({
      ...prev,
      videoFormats: prev.videoFormats.includes(format)
        ? prev.videoFormats.filter(f => f !== format)
        : [...prev.videoFormats, format]
    }));
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setSubmitError(null);
    setCurrentStep(prev => (prev + 1) as Step);
  };
  
  const prevStep = () => {
    window.scrollTo(0, 0);
    setSubmitError(null);
    setCurrentStep(prev => (prev - 1) as Step);
  };

  const isStep1Valid = formData.name.trim() !== '' && 
                      formData.email.trim() !== '' && 
                      formData.email.includes('@') && 
                      formData.whatsapp.trim() !== '' &&
                      isPasswordValid;

  const isStep2Valid = formData.companyName.trim() !== '' && 
                      formData.industry !== '' && 
                      formData.videoFormats.length > 0 &&
                      formData.goal !== '';

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const industryFinal = formData.industry === 'Other' ? formData.otherIndustry : formData.industry;
    const fullWhatsapp = `${formData.countryCode} ${formData.whatsapp}`;
    
    // Descripción consolidada para la tabla 'clients'
    const businessDescription = `Empresa: ${formData.companyName}. Rubro: ${industryFinal}. Formatos: ${formData.videoFormats.join(', ')}. Objetivo: ${formData.goal}. WhatsApp: ${fullWhatsapp}`;

    try {
      // 1. Registro en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
            setSubmitError("Este email ya está registrado. Por favor, inicia sesión.");
            setIsSubmitting(false);
            return;
        }
        throw authError;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        throw new Error("No se pudo obtener el ID de usuario.");
      }

      // 2. Guardar en 'clients' (Columnas: id, name, email, business_description)
      const { error: dbError } = await supabase.from('clients').upsert({
        id: userId,
        name: formData.name,
        email: formData.email,
        business_description: businessDescription
      });

      if (dbError) throw dbError;

      // 3. Webhook no bloqueante
      fetch('https://bot-analizador.onrender.com/webhook/new-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          businessDescription: businessDescription,
          competitors: formData.competitors,
          userId: userId
        }),
      }).catch(() => null);

      // 4. Mercado Pago
      window.location.href = MP_SUBSCRIPTION_URL;
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Error al procesar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans pb-10 text-zylo-black">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between max-w-4xl">
          <button onClick={onBack} className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === s ? 'w-8 bg-zylo-purple' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Paso {currentStep}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-[2.5rem] shadow-card border border-gray-100 p-6 md:p-12 overflow-hidden">
            {submitError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0" />
                {submitError}
              </div>
            )}

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Crea tu Cuenta</h1>
                    <p className="text-gray-500 text-sm">Comienza tu camino hacia la viralidad hoy mismo.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Juan Pérez" className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email de acceso</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Mínimo 8 caracteres" className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zylo-purple transition-colors">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de contacto</label>
                        <div className="flex gap-2">
                            <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-3 py-4 font-bold outline-none focus:border-zylo-purple/40 transition-all">
                                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                            </select>
                            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="11 2233 4455" className="flex-1 border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" />
                        </div>
                    </div>
                  </div>
                  <button disabled={!isStep1Valid} onClick={nextStep} className="w-full bg-zylo-black text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-gray-800 disabled:opacity-30 transition-all mt-4 active:scale-95">Siguiente Paso</button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                   <div className="text-center mb-10">
                    <h1 className="text-2xl font-extrabold mb-2 tracking-tight">Esencia de Marca</h1>
                    <p className="text-gray-500 text-sm">Cuéntanos sobre tu negocio para personalizar tus ideas.</p>
                   </div>
                   <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre de Empresa / Marca</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Ej. Mi Marca Personal" className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rubro Principal</label>
                        <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-bold outline-none focus:border-zylo-purple/40 bg-white transition-all">
                            <option value="">Selecciona un rubro...</option>
                            <option value="Real Estate">Inmobiliaria</option>
                            <option value="Fitness">Fitness & Salud</option>
                            <option value="Ecommerce">E-commerce / Retail</option>
                            <option value="Marketing">Marketing & B2B</option>
                            <option value="Education">Educación / Infoproductos</option>
                            <option value="Other">Otro (especificar)</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Formatos de video preferidos</label>
                        <div className="flex flex-wrap gap-2">
                            {VIDEO_FORMATS.map(f => (
                            <button key={f} type="button" onClick={() => toggleVideoFormat(f)} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${formData.videoFormats.includes(f) ? 'bg-zylo-black text-white border-zylo-black shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>
                                {f}
                            </button>
                            ))}
                        </div>
                     </div>
                   </div>
                   <div className="flex gap-4 pt-4">
                     <button onClick={prevStep} className="px-8 py-4 rounded-full border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all">Atrás</button>
                     <button disabled={!isStep2Valid} onClick={nextStep} className="flex-1 bg-zylo-black text-white py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 disabled:opacity-30 transition-all">Continuar</button>
                   </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  <div className="text-center mb-10">
                    <h1 className="text-2xl font-extrabold mb-2 tracking-tight">Competencia</h1>
                    <p className="text-gray-500 text-sm">Añade cuentas que admires para que nuestra IA analice su estilo.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={competitorInput} 
                            onChange={(e) => setCompetitorInput(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && competitorInput.trim()) {
                                    setFormData(prev => ({...prev, competitors: [...prev.competitors, competitorInput.replace('@', '').trim()]}));
                                    setCompetitorInput('');
                                }
                            }}
                            placeholder="Instagram User (ej: activeta.agency)" 
                            className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl px-5 py-4 font-medium outline-none focus:border-zylo-purple/40 focus:bg-white transition-all" 
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                if (competitorInput.trim()) {
                                    setFormData(prev => ({...prev, competitors: [...prev.competitors, competitorInput.replace('@', '').trim()]}));
                                    setCompetitorInput('');
                                }
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-zylo-black text-white text-[10px] font-black px-4 py-2 rounded-xl"
                        >
                            AÑADIR
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        {formData.competitors.map((c, i) => (
                            <span key={i} className="bg-white border border-gray-100 text-zylo-black px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-sm animate-in zoom-in-50">
                                @{c}
                                <button onClick={() => setFormData(prev => ({...prev, competitors: prev.competitors.filter((_, idx) => idx !== i)}))} className="text-red-400 hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={prevStep} className="px-8 py-4 rounded-full border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all">Atrás</button>
                    <button onClick={nextStep} className="flex-1 bg-zylo-black text-white py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 transition-all">Revisar y Pagar</button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                  <div className="text-center">
                    <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Finalizar Activación</h1>
                    <p className="text-gray-500 text-sm">Todo listo para transformar tu contenido.</p>
                  </div>
                  
                  <div className="bg-zylo-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-zylo-green opacity-10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                     <div className="relative z-10">
                        <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                           <Zap size={20} className="text-zylo-green" fill="currentColor" /> Plan Único Viral
                        </h3>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Suscripción Mensual • Cancela cuando quieras</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-zylo-green">$10.000</span>
                            <span className="text-gray-400 font-bold text-sm">/ mes</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="w-full bg-zylo-green text-zylo-black py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
                        {isSubmitting ? 'Procesando registro...' : 'Pagar y Activar'}
                    </button>
                    
                    <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <ShieldCheck size={14} className="text-zylo-green" /> Pago Seguro vía Mercado Pago
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};