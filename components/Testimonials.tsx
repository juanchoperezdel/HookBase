import React from 'react';
import { TestimonialsColumn, Testimonial } from './ui/testimonials-columns-1';
import { motion } from "motion/react";

const testimonials: Testimonial[] = [
  {
    text: "Estaba a punto de dejar de subir Reels porque me llevaban horas. Con esto tardo 15 minutos en grabar y las ventas de la tienda subieron un 30%.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    name: "Camila Rossi",
    role: "Dueña de Marca de Decoración",
  },
  {
    text: "Lo que más me gusta es que no tengo que bailar ni hacer payasadas. Son ideas directas para vender mis asesorías. Gané 4 clientes nuevos el primer mes.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    name: "Marcos Varela",
    role: "Personal Trainer",
  },
  {
    text: "Mis clientes me piden guiones todo el tiempo. HookBase me salva la vida cuando me quedo en blanco. Literalmente es mi herramienta secreta.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    name: "Sofía Méndez",
    role: "Creadora UGC",
  },
  {
    text: "El sector inmobiliario es difícil en redes, pero los hooks que me dieron para mostrar propiedades funcionaron increíble. Muy recomendado.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    name: "Lucas P.",
    role: "Agente Inmobiliario",
  },
  {
    text: "Antes subía videos explicando cosas técnicas y nadie los veía. Ahora uso las estructuras de HookBase y la gente comenta un montón.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
    name: "Valentina G.",
    role: "Nutricionista",
  },
  {
    text: "Directo al grano. Sin humo. Pago la suscripción Pro y se paga sola con el tiempo que me ahorro en reuniones de brainstorming.",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=faces",
    name: "Andrés T.",
    role: "Fundador SaaS",
  },
  {
    text: "Me costaba mucho vender servicios high-ticket por Instagram. Las ideas de 'autoridad' me ayudaron a posicionarme como experta sin parecer arrogante.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces",
    name: "Mariana Ruiz",
    role: "Fotógrafa de Bodas",
  },
  {
    text: "Sinceramente, pensé que iba a ser otra herramienta de IA genérica. Me sorprendió la calidad de los guiones, se sienten muy humanos y reales.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    name: "Diego F.",
    role: "Consultor de Marketing",
  },
  {
    text: "Pasé de tener 200 vistas a tener un video de 45k en dos semanas. No es magia, es estrategia pura, pero te la dan servida en bandeja.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&h=100&fit=crop&crop=faces",
    name: "Clara B.",
    role: "Emprendedora de Moda",
  },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-white/50 py-20 relative overflow-hidden">
      <div className="container z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-12 text-center"
        >
          <div className="flex justify-center mb-4">
             <span className="inline-flex items-center gap-2 rounded-full bg-zylo-purpleLight px-4 py-1.5 text-xs font-bold text-zylo-purple uppercase tracking-wide">
                Comunidad
             </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zylo-black mb-4">
            Lo que dicen nuestros <span className="text-zylo-purple">creadores</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Personas reales consiguiendo resultados reales.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[600px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};