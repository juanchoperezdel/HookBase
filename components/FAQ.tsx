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
    <section id="faq" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-zylo-black mb-4">
          Preguntas frecuentes
        </h2>
        <p className="text-center text-gray-500 mb-12">
            Todo lo que necesitas saber sobre HookBase
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-zylo-purpleLight border-2 border-zylo-purple shadow-md' 
                    : 'bg-gray-50 border border-gray-100 hover:border-gray-300'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-zylo-black' : 'text-gray-700'}`}>
                    {faq.q}
                  </span>
                  <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown 
                      size={20} 
                      className={isOpen ? 'text-zylo-purple' : 'text-gray-400'} 
                    />
                  </div>
                </button>
                <div 
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-gray-700 leading-relaxed font-medium whitespace-pre-line">
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