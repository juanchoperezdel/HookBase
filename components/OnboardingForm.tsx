
import React, { useState } from 'react';
import { ArrowLeft, Send, Plus, X, CheckCircle, ChevronRight, Instagram, Globe, SkipForward, Target, Star, MessageSquare, Mic2, HeartHandshake, Eye, EyeOff, Sparkles, CreditCard, ShieldCheck, Zap, Lock, Loader2, ExternalLink, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabaseClient'; // <--- IMPORTANTE: Asegúrate de que esta ruta sea correcta

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
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
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
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: '+54',
    whatsapp: '',
    companyName: '',
    industry: '',
    otherIndustry: '',
    brandTone: '',
    targetPainPoint: '',
    videoFormats: [] as string[],
    usp: '',
    brandPerception: '', 
    brandAspiration: '', 
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
    setCurrentStep(prev => (prev + 1) as Step);
  };
  
  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => (prev - 1) as Step);
  };

  const addCompetitor = () => {
    const cleanValue = competitorInput.trim().replace(/[@#$%\^&*()]/g, '');
    if (cleanValue && formData.competitors.length < 5 && !formData.competitors.includes(cleanValue)) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, cleanValue]
      }));
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== indexToRemove)
    }));
  };

  const isStep1Valid = formData.name.trim() !== '' && 
                       formData.email.trim() !== '' && 
                       formData.email.includes('@') && 
                       formData.whatsapp.trim() !== '' &&
                       isPasswordValid;

  const isStep2Valid = formData.companyName.trim() !== '' && 
                       formData.industry !== '' && 
                       (formData.industry !== 'Other' || formData.otherIndustry.trim() !== '') &&
                       formData.brandTone !== '' &&
                       formData.targetPainPoint.trim() !== '' &&
                       formData.videoFormats.length > 0 &&
                       formData.usp.trim() !== '' &&
                       formData.brandPerception.trim() !== '' &&
                       formData.brandAspiration.trim() !== '' &&
                       formData.goal !== '';

const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // 🧹 LIMPIEZA OBLIGATORIA (La cura para tu error)
    // .trim() borra los espacios fantasmas que te están jodiendo la vida
    const cleanEmail = formData.email.trim(); 
    const cleanPassword = formData.password.trim();

    try {
      console.log(`📧 Intentando registrar: '${cleanEmail}'`);

      // 1. CREAR USUARIO CON DATOS LIMPIOS
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,       // <--- USÁ LA VARIABLE LIMPIA
        password: cleanPassword, // <--- USÁ LA VARIABLE LIMPIA
        options: {
          data: {
            full_name: formData.name,
            whatsapp: `${formData.countryCode} ${formData.whatsapp}`,
          }
        }
      });

      if (authError) {
        console.error("❌ Error CRÍTICO en Auth:", authError);
        alert("Error al crear usuario: " + authError.message);
        setIsSubmitting(false);
        return;
      }

      // 🚨 LA PRUEBA DE FUEGO: ¿TENEMOS ID?
      const newUserId = authData.user?.id;
      
      if (!newUserId) {
        console.error("❌ SOCORRO: Supabase no devolvió un ID de usuario. Algo está muy mal.");
        alert("Error: No se generó ID de usuario.");
        setIsSubmitting(false);
        return;
      }

      console.log("✅ ÉXITO: Usuario creado en Auth. ID:", newUserId);
      console.log("2️⃣ Enviando este ID al Bot...");
// ---------------------------------------------------
      // PASO 2: PREPARAR EL PAQUETE (PAYLOAD) CORREGIDO
      // ---------------------------------------------------
      
      // 1. APLANAR COMPETIDORES: Si es un array, lo convertimos a texto "a, b, c"
      let competitorsString = "Sin competencia especifica";
      
      if (Array.isArray(formData.competitors)) {
          // Si es un array (['a', 'b']), lo unimos con comas
          competitorsString = formData.competitors.join(", ");
      } else if (typeof formData.competitors === 'string' && formData.competitors.trim() !== '') {
          // Si ya es un texto, lo usamos tal cual
          competitorsString = formData.competitors;
      }

      // 2. GENERAR DESCRIPCIÓN
      const generatedDescription = `Empresa: ${formData.companyName}. Industria: ${formData.industry}. USP: ${formData.usp}. Objetivo: ${formData.goal}`;

      const payload = {
        userId: newUserId,
        clientName: formData.name || "Cliente",
        clientEmail: cleanEmail,
        
        businessDescription: generatedDescription, 
        
        // 🚨 AQUÍ ESTABA EL ERROR: Ahora enviamos siempre un TEXTO (String), nunca un Array
        username: competitorsString, 

        companyName: formData.companyName || "",
        industry: formData.industry || "General",
        brandTone: formData.brandTone || "Neutral",
        targetPainPoint: formData.targetPainPoint || "",
        videoFormats: formData.videoFormats || [],
        brandPerception: formData.brandPerception || "",
        brandAspiration: formData.brandAspiration || "",
        goal: formData.goal || "",
        whatsapp: formData.whatsapp ? `${formData.countryCode} ${formData.whatsapp}` : ""
      };
      
      console.log("🚀 Payload DEFINITIVO:", payload);
      // Usamos await para asegurar que el bot reciba la orden
      try {
        const botResponse = await fetch('https://bot-analizador.onrender.com/webhook/new-report', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(payload),
        });
        
        console.log("🤖 Respuesta del Bot:", await botResponse.json());
        
// ... (código del fetch al bot) ...

      } catch (botError: any) {
         console.error("❌ ERROR AL LLAMAR AL BOT:", botError);
         alert("El Bot falló: " + botError.message);
      }

      console.log("3️⃣ El flujo terminó. Debería ir a Mercado Pago.");

      // 🛑 FRENO DE MANO TEMPORAL (Para poder ver la consola)
      // Comenta esta línea poniendo dos barras // al principio:
      // window.location.href = MP_SUBSCRIPTION_URL; 
      
      alert("🛑 ¡STOP! Mira la consola ahora. El usuario se creó. ¿Qué dice el log del Bot?");

      // Cuando ya funcione todo, descomentas la línea de arriba y borras este alert.
    } catch (error: any) {
      console.error("🔥 Error general:", error);
      setIsSubmitting(false);
    }
  
  };
  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-zylo-greenLight text-zylo-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-zylo-black mb-4 tracking-tight">¡Cuenta Creada!</h2>
          <p className="text-gray-500 text-base mb-8 leading-relaxed font-medium">
            Redirigiendo al pago...
          </p>
        </motion.div>
      </div>
    );
  }

  // ... (El resto del renderizado es idéntico a tu código original)
  // He copiado la estructura visual exacta de tu componente abajo para que no se pierda nada.
  
  return (
    <div className="min-h-screen bg-gray-50/30 font-sans pb-10">
      {/* Sticky Header with Progress */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between max-w-4xl">
          <button onClick={onBack} className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === s ? 'w-8 bg-zylo-purple' : 'w-2 bg-gray-200'}`}
              />
            ))}
          </div>
          
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Paso {currentStep}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-[2.5rem] shadow-card border border-gray-100 overflow-hidden">
          
          <div className="p-6 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-zylo-black mb-3 tracking-tight">Crea tu Cuenta</h1>
                    <p className="text-gray-500 font-medium text-sm">Regístrate para guardar tu progreso y recibir el análisis.</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Nombre Completo</label>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez" 
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base focus:border-zylo-purple/40 outline-none transition-all font-medium"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Email</label>
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                        placeholder="tu@email.com" 
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base focus:border-zylo-purple/40 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Contraseña</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" value={formData.password} onChange={handleInputChange}
                          placeholder="Crea una contraseña segura" 
                          className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base focus:border-zylo-purple/40 outline-none transition-all font-medium pr-12"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zylo-purple transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 px-1">
                        <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passValidation.length ? 'text-zylo-green' : 'text-gray-400'}`}>
                           <CheckCircle size={12} className={passValidation.length ? 'text-zylo-green' : 'text-gray-200'} /> 8+ Caracteres
                        </div>
                        <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passValidation.uppercase ? 'text-zylo-green' : 'text-gray-400'}`}>
                           <CheckCircle size={12} className={passValidation.uppercase ? 'text-zylo-green' : 'text-gray-200'} /> 1 Mayúscula
                        </div>
                        <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passValidation.special ? 'text-zylo-green' : 'text-gray-400'}`}>
                           <CheckCircle size={12} className={passValidation.special ? 'text-zylo-green' : 'text-gray-200'} /> 1 Especial
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">WhatsApp</label>
                      <div className="flex gap-2">
                        <div className="relative flex-shrink-0">
                          <select 
                            name="countryCode" 
                            value={formData.countryCode} 
                            onChange={handleInputChange}
                            className="h-full bg-white border-2 border-gray-100 rounded-2xl pl-4 pr-10 py-4 text-base focus:border-zylo-purple/40 outline-none appearance-none font-bold text-gray-700"
                          >
                            {COUNTRY_CODES.map(c => (
                              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                             <Globe size={14} />
                          </div>
                        </div>
                        <input 
                          type="text" 
                          name="whatsapp" 
                          value={formData.whatsapp} 
                          onChange={handleInputChange}
                          placeholder="1112345678" 
                          className="flex-1 bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base focus:border-zylo-purple/40 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    disabled={!isStep1Valid}
                    onClick={nextStep}
                    className="w-full bg-zylo-black text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl disabled:opacity-30 active:scale-95 mt-4"
                  >
                    Siguiente Paso <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-zylo-black mb-2 tracking-tight">Esencia de Marca</h1>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.15em]">Personalización Estratégica</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Nombre Comercial</label>
                      <input 
                        type="text" name="companyName" value={formData.companyName} onChange={handleInputChange}
                        placeholder="Ej. Studio Digital" 
                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Rubro Principal</label>
                      <select 
                        name="industry" value={formData.industry} onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none appearance-none font-bold"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Real Estate">Inmobiliaria</option>
                        <option value="Fitness">Fitness & Salud</option>
                        <option value="Ecommerce">E-commerce</option>
                        <option value="Professional Services">Servicios Profesionales</option>
                        <option value="Other">Otro</option>
                      </select>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.industry === 'Other' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <input 
                          type="text" name="otherIndustry" value={formData.otherIndustry} onChange={handleInputChange}
                          placeholder="Especificar Rubro..." 
                          className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none font-medium"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
                        <Mic2 size={12} className="text-zylo-purple" /> Tono de Voz
                      </label>
                      <select 
                        name="brandTone" value={formData.brandTone} onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none appearance-none font-bold"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Friendly">Amigable y Cercano</option>
                        <option value="Professional">Profesional y Autoritario</option>
                        <option value="Disruptive">Provocador y Directo</option>
                        <option value="Scientific">Educativo y Basado en Datos</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
                        <Target size={12} className="text-zylo-green" /> Objetivo Viral
                      </label>
                      <select 
                        name="goal" value={formData.goal} onChange={handleInputChange}
                        className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none appearance-none font-bold"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Ventas">Generar Ventas</option>
                        <option value="Seguidores">Crecer Audiencia</option>
                        <option value="Autoridad">Marca Personal / Autoridad</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1.5">
                        <Eye size={14} className="text-blue-500" /> ¿Qué piensan tus seguidores de vos hoy?
                      </label>
                      <textarea 
                        name="brandPerception" value={formData.brandPerception} onChange={handleInputChange}
                        rows={3} 
                        placeholder="Ej: Siento que me ven demasiado técnico..." 
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base focus:border-zylo-purple/40 outline-none resize-none font-medium leading-relaxed"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-zylo-yellow" /> ¿Qué te gustaría que piensen al ver un video tuyo?
                      </label>
                      <textarea 
                        name="brandAspiration" value={formData.brandAspiration} onChange={handleInputChange}
                        rows={3} 
                        placeholder="Ej: Quiero que sientan que soy la autoridad número 1..." 
                        className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base focus:border-zylo-purple/40 outline-none resize-none font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
                      <HeartHandshake size={12} className="text-red-400" /> Problema Principal que Resolvés
                    </label>
                    <input 
                      type="text" name="targetPainPoint" value={formData.targetPainPoint} onChange={handleInputChange}
                      placeholder="Ej. Les cuesta ahorrar..." 
                      className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
                      <Star size={12} className="text-zylo-yellow" /> Tu Diferencial Único
                    </label>
                    <input 
                      type="text" name="usp" value={formData.usp} onChange={handleInputChange}
                      placeholder="Ej. Resultados rápidos..." 
                      className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-base focus:border-zylo-purple/40 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Formatos de Video</label>
                    <div className="flex flex-wrap gap-2.5">
                        {VIDEO_FORMATS.map((format) => {
                            const isSelected = formData.videoFormats.includes(format);
                            return (
                                <button
                                    key={format} type="button" onClick={() => toggleVideoFormat(format)}
                                    className={`px-4 py-3 rounded-full text-xs font-bold border-2 transition-all active:scale-90 ${
                                        isSelected ? 'bg-zylo-black text-white border-zylo-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 shadow-sm'
                                    }`}
                                >
                                    {format} {isSelected && <CheckCircle size={10} className="inline ml-1" />}
                                </button>
                            );
                        })}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                    <button onClick={prevStep} className="px-6 py-4 rounded-full border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 active:scale-95">Atrás</button>
                    <button 
                      disabled={!isStep2Valid}
                      onClick={nextStep}
                      className="flex-1 bg-zylo-black text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl disabled:opacity-30 active:scale-95"
                    >
                      Continuar <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-zylo-black mb-4 tracking-tight">Competencia</h1>
                    <p className="text-gray-500 font-medium leading-relaxed text-sm">Agregá cuentas de Instagram que te gusten o a las que quieras superar.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Instagram Usernames</label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                             <Instagram size={18} />
                          </div>
                          <input 
                            type="text" value={competitorInput} onChange={(e) => setCompetitorInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                            placeholder="Ej. nike (sin @)" 
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-base focus:border-zylo-purple/40 outline-none transition-all font-medium"
                          />
                        </div>
                        <button 
                          type="button" onClick={addCompetitor}
                          className="bg-zylo-black text-white p-4 rounded-2xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg"
                        >
                          <Plus size={24} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    <div className="min-h-[160px] p-6 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-wrap gap-3 items-center justify-center">
                      {formData.competitors.map((c, i) => (
                        <div key={i} className="bg-white border-2 border-gray-100 shadow-sm px-4 py-2 rounded-full flex items-center gap-3 font-bold text-xs animate-in zoom-in duration-200">
                          <span className="text-zylo-purple">@</span>{c}
                          <button onClick={() => removeCompetitor(i)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-6">
                    <button onClick={prevStep} className="px-6 py-4 rounded-full border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 active:scale-95">Atrás</button>
                    <button 
                      onClick={nextStep}
                      className="flex-1 bg-zylo-black text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl active:scale-95"
                    >
                      Revisar y Pagar <ChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-zylo-black mb-2 tracking-tight">Finalizar Activación</h1>
                    <p className="text-gray-500 font-medium text-sm">Estás a un paso de tus primeras 5 ideas virales.</p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-zylo-black rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-zylo-purple opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                      
                      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zylo-purple">Plan Seleccionado</span>
                            <h3 className="text-xl font-black">Plan Único Viral</h3>
                        </div>
                        <div className="text-right">
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Hoy</span>
                             <div className="text-2xl font-black text-zylo-green">$10.000</div>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-2">
                        {[
                            "2 diagnósticos de IA personalizados",
                            "5 ideas virales listas para grabar",
                            "Soporte prioritario por email"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                <div className="w-1 h-1 rounded-full bg-zylo-green"></div>
                                {item}
                            </li>
                        ))}
                      </ul>
                  </div>

                  {/* INFO PAYMENT UI */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
                      <div className="p-3 bg-zylo-purpleLight text-zylo-purple rounded-xl">
                          <Lock size={20} />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-gray-900 mb-1">Pago seguro vía Mercado Pago</p>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">Al hacer clic en el botón, serás redirigido a Mercado Pago para completar tu suscripción. Tus datos de onboarding se guardarán automáticamente.</p>
                      </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button 
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        name="MP-payButton"
                        className="w-full bg-zylo-green text-zylo-black py-5 rounded-full font-black text-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-xl active:scale-95 group"
                    >
                        {isSubmitting ? 'Guardando Datos...' : 'Pagar $10.000 y Activar'}
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Zap size={20} fill="currentColor" className="group-hover:scale-125 transition-transform" />}
                    </button>

                    <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                          <img src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadopago/logo__large.png" className="h-4" alt="Mercado Pago" />
                    </div>

                    <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                          <ShieldCheck size={14} className="text-zylo-green" /> Procesamiento Seguro • Cancelá cuando quieras
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};