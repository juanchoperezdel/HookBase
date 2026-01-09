
import React from 'react';
import { ArrowLeft, FileText, Mail, Info, Scale } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-black uppercase tracking-tight">Términos de Servicio</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-card border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-zylo-yellowLight text-yellow-600 rounded-3xl">
              <Scale size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Términos de Servicio – HookBase</h2>
              <p className="text-gray-400 font-medium text-sm uppercase tracking-widest mt-1">Última actualización: 26 de diciembre de 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed font-medium">
            <p>
              Leé atentamente estos Términos de Servicio (“Términos”) antes de utilizar <a href="https://hookbase.app" className="text-zylo-purple font-bold">https://hookbase.app</a> (el “Servicio”), operado por <strong>Activeta Agency SAS (CUIT 30-71859931-4)</strong> (“Activeta”, “nosotros”).
            </p>
            <p className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
              Al acceder o usar el Servicio, aceptás estos Términos. Si no estás de acuerdo, no utilices el Servicio.
            </p>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 1) Definiciones
              </h3>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Servicio / HookBase:</strong> plataforma web para acceso a funcionalidades y reportes.</li>
                <li><strong>Usuario / Cliente:</strong> persona que crea una cuenta y utiliza el Servicio.</li>
                <li><strong>Cuenta:</strong> acceso individual asociado a un correo electrónico.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 2) Cuenta y seguridad
              </h3>
              <p className="pl-4">Para usar el Servicio debés crear una Cuenta proporcionando información veraz. Sos responsable de mantener la confidencialidad de tus credenciales y de toda actividad realizada desde tu Cuenta.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 3) Uso permitido y restricciones
              </h3>
              <p className="pl-4">Queda prohibido usar el Servicio para fines ilegales, intentar acceder sin autorización, interferir con el sistema o realizar ingeniería inversa del software.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 4) Reportes y comunicaciones
              </h3>
              <p className="pl-4">Al registrarte aceptás recibir correos operativos del Servicio (envío de reportes, avisos técnicos y de seguridad).</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 5) Planes, pagos y facturación
              </h3>
              <p className="pl-4">Los pagos se procesan a través de <strong>Mercado Pago</strong>. Activeta no almacena datos de tarjetas. La habilitación del servicio depende de la confirmación del pago.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 6) Propiedad intelectual
              </h3>
              <p className="pl-4">El Servicio y sus contenidos son propiedad de Activeta. El uso del Servicio no otorga derechos de propiedad intelectual sobre el mismo.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 7) Disponibilidad del Servicio
              </h3>
              <p className="pl-4">El Servicio se brinda “tal cual”. No garantizamos disponibilidad ininterrumpida debido a mantenimientos o cambios técnicos.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-yellow rounded-full"></div> 8) Terminación
              </h3>
              <p className="pl-4">Podemos suspender el acceso por incumplimiento de términos o motivos de seguridad. Podés solicitar la baja escribiendo a contact@veta.agency.</p>
            </section>

            <div className="mt-12 p-8 bg-zylo-black rounded-[2rem] text-white">
                <h3 className="text-lg font-black flex items-center gap-2 mb-4">
                    <Info size={20} className="text-zylo-green" /> Nota Importante
                </h3>
                <p className="text-sm opacity-80 leading-relaxed">
                    Activeta no será responsable por daños indirectos o pérdida de datos derivados del uso del Servicio. Podemos actualizar estos términos en cualquier momento publicando la versión vigente en este sitio.
                </p>
            </div>

            <section className="pt-8 text-center">
              <p className="text-sm font-bold text-gray-400">¿Consultas sobre estos términos?</p>
              <a href="mailto:contact@veta.agency" className="inline-flex items-center gap-2 mt-2 text-zylo-purple font-black hover:scale-105 transition-transform">
                <Mail size={16} /> contact@veta.agency
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
