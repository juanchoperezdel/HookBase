
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    { 
      q: "¿Esto es Inteligencia Artificial o manual?", 
      a: `Es 100% Inteligencia Artificial.
HookBase está diseñado para analizar miles de videos, métricas y patrones en tiempo real, algo imposible de hacer manualmente.

No genera ideas al azar.
Detecta estructuras que ya están funcionando y las traduce en ideas claras para que las adaptes a tu contenido.

La ventaja no es “usar IA”.
La ventaja es ver datos que otros no están mirando.` 
    },
    { 
      q: "¿Necesito saber editar o grabar bien?", 
      a: `No.
Las ideas están pensadas para edición mínima.

Nos enfocamos en qué decís y cómo lo decís,
no en cámaras, efectos o producción compleja.

Si podés grabarte con el celular, alcanza.` 
    },
    { 
      q: "¿Funciona para mi industria?", 
      a: `Sí.
HookBase funciona para cualquier industria que use video para captar atención.

Marcas, servicios, creadores, agencias o negocios locales.
Si en algún nicho específico no hay suficiente data relevante,
lo aclaramos antes.

Preferimos ser honestos antes que venderte algo que no te sirva.` 
    },
    { 
      q: "¿Puedo cancelar cuando quiera?", 
      a: `Sí.
No hay contratos ni compromisos a largo plazo.

Podés cancelar cuando quieras desde tu panel,
con un solo clic.

Sin vueltas.` 
    },
    { 
      q: "¿Cómo recibo las ideas?", 
      a: `Recibís acceso a un dashboard privado
con todas tus ideas organizadas y listas para usar.

Además, cada semana te enviamos un resumen por email
con las mejores ideas seleccionadas para tu perfil.

Abrís. Elegís. Grabás.` 
    },
    { 
      q: "¿Esto es copiar contenido?", 
      a: `No.
No copiás videos. Copiás patrones que funcionan.

Usás la estructura, el ángulo y el hook,
pero el mensaje es tuyo.` 
    },
    { 
      q: "¿Por qué pagar HookBase si puedo usar ChatGPT?", 
      a: `Buena pregunta.
ChatGPT te responde cuando le pedís algo.

HookBase analiza qué está pasando ahora.

La diferencia está en:

• Miles de videos reales analizados cada semana
• Un algoritmo propio que detecta patrones de viralidad
• Un modelo de scoring que prioriza lo que mejor rinde
• Recomendaciones basadas en datos, no en suposiciones
• Ideas adaptadas a tu industria, no respuestas genéricas

ChatGPT es una herramienta.
HookBase es un sistema de decisión.` 
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black mb-4 tracking-tight">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
            Todo lo que necesitas saber sobre HookBase para transformar tu contenido.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`group rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden relative ${
                  isOpen 
                    ? 'bg-zylo-purpleLight/30 border-zylo-purple shadow-[0_20px_60px_-15px_rgba(232,121,249,0.2)] -translate-y-1' 
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/30'
                }`}
              >
                {/* Visual accent bar for open state */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 bg-zylo-purple transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />

                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-7 md:p-9 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg md:text-2xl transition-colors duration-300 pr-8 ${isOpen ? 'text-zylo-black' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {faq.q}
                  </span>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 flex-shrink-0 ${isOpen ? 'bg-zylo-purple text-white rotate-180 shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600 shadow-sm'}`}>
                    <ChevronDown size={24} strokeWidth={2.5} />
                  </div>
                </button>
                <div 
                  className={`grid transition-[grid-template-rows,opacity,padding] duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pb-9' : 'grid-rows-[0fr] opacity-0 pb-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-9 text-gray-700 leading-relaxed font-medium whitespace-pre-line text-base md:text-lg">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
