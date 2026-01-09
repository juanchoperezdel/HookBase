import React from 'react';
import { Zap, Layout, Lightbulb, Globe, Clock, BarChart3, TrendingUp, CheckSquare, MessageSquare } from 'lucide-react';
import { Testimonials } from './Testimonials';

export const Features: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50/50 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Solution Section */}
        <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black mb-6">
                HookBase analiza por vos lo que <span className="text-zylo-green">ya está funcionando</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 mb-12">
                Elegís tu rubro, nosotros encontramos los videos virales que hoy la están rompiendo y te los entregamos listos para adaptar.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {[
                    { icon: Zap, text: "Hooks reales que captan atención", color: "bg-zylo-yellowLight text-yellow-600" },
                    { icon: Layout, text: "Estructura del video y CTA", color: "bg-zylo-greenLight text-green-600" },
                    { icon: Lightbulb, text: "Ideas adaptadas a tu rubro", color: "bg-zylo-purpleLight text-purple-600" },
                    { icon: Globe, text: "100% en español", color: "bg-blue-50 text-blue-600" }
                ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${item.color} font-bold text-sm text-left shadow-sm`}>
                        <item.icon size={20} />
                        {item.text}
                    </div>
                ))}
            </div>
        </div>

        {/* Green Banner */}
        <div className="my-20 rounded-[3rem] bg-gradient-to-r from-zylo-black to-gray-800 p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                    <CheckSquare size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Deja de adivinar. Empieza a crear con datos.
                </h3>
                <p className="text-gray-300 text-lg">
                    Cada idea viene con análisis detallado de por qué funciona.
                </p>
             </div>
             {/* Decor */}
             <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-zylo-green opacity-20 blur-[80px]"></div>
             <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-zylo-purple opacity-20 blur-[80px]"></div>
        </div>

        {/* Insert Testimonials Here */}
      </div>
      
      <Testimonials />

      <div className="container mx-auto px-6 md:px-12">

        {/* Why Choose Grid */}
        <div id="features" className="text-center mb-12 mt-20 scroll-mt-28">
            <h2 className="text-3xl md:text-4xl font-extrabold text-zylo-black">
                Por qué elegir <span className="text-zylo-yellow bg-black px-2 rounded-md transform -skew-x-6 inline-block">HookBase</span>
            </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
                { 
                    title: "Claridad de tu nicho", 
                    desc: "Descubrí qué reels funcionan ahora con datos reales.", 
                    icon: BarChart3, 
                    color: "text-blue-500 bg-blue-50" 
                },
                { 
                    title: "Ideas listas para grabar", 
                    desc: "Te damos el guión exacto para que tu reel explote.", 
                    icon: CheckSquare, 
                    color: "text-green-500 bg-green-50" 
                },
                { 
                    title: "Ahorro de tiempo", 
                    desc: "Olvidate de analizar reels. Nosotros lo hacemos.", 
                    icon: Clock, 
                    color: "text-red-500 bg-red-50" 
                },
                { 
                    title: "Tendencias aplicadas", 
                    desc: "Te decimos qué formato va con lo que vendés.", 
                    icon: TrendingUp, 
                    color: "text-purple-500 bg-purple-50" 
                },
                { 
                    title: "Entrega visual y clara", 
                    desc: "PDF lindo, con capturas e ideas listas. Sin humo.", 
                    icon: Layout, 
                    color: "text-yellow-500 bg-yellow-50" 
                },
                { 
                    title: "Regularidad y foco", 
                    desc: "Informe mensual 100% personalizado.", 
                    icon: MessageSquare, 
                    color: "text-teal-500 bg-teal-50" 
                },
            ].map((feature, i) => (
                <div key={i} className="group rounded-[2rem] bg-white p-8 shadow-soft border border-gray-100 transition-all hover:shadow-card hover:-translate-y-1">
                    <div className={`mb-4 inline-flex rounded-2xl p-3 ${feature.color}`}>
                        <feature.icon size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-zylo-black">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};