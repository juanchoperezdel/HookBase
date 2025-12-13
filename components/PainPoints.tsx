import React from 'react';
import { AlertCircle, Clock, HelpCircle } from 'lucide-react';

export const PainPoints: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black mb-12">
          Crear contenido cada semana es <br />
          <span className="text-red-500">agotador.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="rounded-[2.5rem] bg-orange-50 p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
            <div className="mb-4 rounded-full bg-orange-100 p-4 text-orange-500">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-zylo-black">No sabés qué funciona</h3>
            <p className="mt-2 text-gray-500 text-sm">
              Gastas horas pensando ideas que luego tienen 200 vistas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-[2.5rem] bg-zylo-yellowLight p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
             <div className="mb-4 rounded-full bg-yellow-100 p-4 text-yellow-600">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-bold text-zylo-black">No tenés tiempo para analizar</h3>
            <p className="mt-2 text-gray-500 text-sm">
              Tu negocio te necesita y el análisis de tendencias lleva horas.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-[2.5rem] bg-gray-50 p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
             <div className="mb-4 rounded-full bg-gray-200 p-4 text-gray-600">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-zylo-black">Estás adivinando qué grabar</h3>
            <p className="mt-2 text-gray-500 text-sm">
              Sin datos, crear contenido es como tirar dados.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white font-bold text-lg shadow-lg max-w-2xl mx-auto transform -rotate-1">
            Mientras tanto, tu competencia crece en TikTok, Reels y Shorts.
        </div>
      </div>
    </section>
  );
};