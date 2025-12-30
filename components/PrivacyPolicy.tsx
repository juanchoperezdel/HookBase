
import React from 'react';
import { ArrowLeft, ShieldCheck, Mail, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-black uppercase tracking-tight">Política de Privacidad</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-card border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-zylo-purpleLight text-zylo-purple rounded-3xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Privacidad – HookBase</h2>
              <p className="text-gray-400 font-medium text-sm uppercase tracking-widest mt-1">Última actualización: 26 de diciembre de 2025</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed font-medium">
            <p>
              Esta Política explica cómo <strong>Activeta Agency SAS (CUIT 30-71859931-4) (“Activeta”)</strong> recopila, utiliza y protege datos personales al operar HookBase en <a href="https://hookbase.app" className="text-zylo-purple font-bold">https://hookbase.app</a>.
            </p>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-purple rounded-full"></div> 1) Responsable del tratamiento
              </h3>
              <ul className="list-none space-y-1 pl-4">
                <li><strong>Responsable:</strong> Activeta Agency SAS</li>
                <li><strong>CUIT:</strong> 30-71859931-4</li>
                <li><strong>Sitio:</strong> https://hookbase.app</li>
                <li><strong>Contacto:</strong> contact@veta.agency</li>
                <li><strong>Domicilio:</strong> no publicado en el sitio (puede ser informado a requerimiento).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-purple rounded-full"></div> 2) Datos personales que recopilamos
              </h3>
              <div className="pl-4 space-y-2">
                <p><strong>2.1 Datos que brindás:</strong> Nombre, Apellido, Correo electrónico.</p>
                <p><strong>2.2 Datos técnicos:</strong> IP, fecha/hora de acceso, registros de autenticación, tipo de navegador/dispositivo y eventos de seguridad.</p>
                <p className="text-sm italic">HookBase no solicita datos sensibles (salud, biometría, ideología, etc.) para el uso estándar del Servicio.</p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-purple rounded-full"></div> 3) Finalidades del tratamiento
              </h3>
              <p className="pl-4">Usamos los datos para crear y administrar tu cuenta, enviar reportes, soporte, seguridad y mejora técnica. <strong>No vendemos ni alquilamos datos personales.</strong></p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-purple rounded-full"></div> 4) Base legal
              </h3>
              <p className="pl-4">Tratamos datos en base a la ejecución del servicio (contrato), interés legítimo (seguridad) y cumplimiento legal.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-purple rounded-full"></div> 5) Pagos con Mercado Pago
              </h3>
              <p className="pl-4">Los pagos se procesan mediante Mercado Pago. Activeta no almacena datos de tarjeta. Mercado Pago trata los datos según sus propias políticas.</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-zylo-purple rounded-full"></div> 6) Con quién compartimos datos
              </h3>
              <p className="pl-4">Solo con proveedores necesarios para operar el servicio (hosting, infraestructura, seguridad) y autoridades cuando exista obligación legal.</p>
            </section>

            <section className="space-y-3 text-sm bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-2">
                <FileText size={20} className="text-zylo-purple" /> Derechos del titular
              </h3>
              <p>Podés solicitar acceso, rectificación y eliminación escribiendo a <strong>contact@veta.agency</strong>.</p>
              <p className="mt-2 font-bold text-gray-700 underline underline-offset-4">Derecho de acceso gratuito (Argentina):</p>
              <p>El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis (6) meses, salvo que se acredite un interés legítimo al efecto, conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326.</p>
            </section>

            <section className="pt-8 border-t border-gray-100 text-center">
              <p className="text-sm font-bold text-gray-400">¿Dudas sobre tus datos?</p>
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
