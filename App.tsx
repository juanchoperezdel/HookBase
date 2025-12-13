import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { DataProof } from './components/DataProof';
import { PainPoints } from './components/PainPoints';
import { Features } from './components/Features';
import { DemoCard } from './components/DemoCard';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { ReportPage } from './components/ReportPage';
import { Zap } from 'lucide-react';

function App() {
  const [view, setView] = useState<'landing' | 'report'>('landing');

  // If we are in 'report' view, show the separate report page
  if (view === 'report') {
    return <ReportPage onBack={() => setView('landing')} />;
  }

  // Otherwise show the main landing page
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-zylo-greenLight selection:text-zylo-black">
      <Header onLogoClick={() => setView('landing')} />
      
      <main className="flex-1 pt-24">
        <Hero onDemoClick={() => setView('report')} />
        <DataProof />
        <PainPoints />
        <Features />
        <DemoCard onShowReport={() => setView('report')} />
        <Pricing />
        <FAQ />
        
        {/* Bottom CTA Banner */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="relative overflow-hidden rounded-[3rem] bg-[#111827] px-6 py-20 text-center shadow-2xl md:px-16">
               
               {/* Decorative blurred background effect */}
               <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-zylo-purple opacity-20 blur-[100px]"></div>
               <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-zylo-green opacity-10 blur-[100px]"></div>

               <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                 
                 {/* Icon */}
                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 backdrop-blur-md shadow-inner border border-white/10">
                    <Zap className="text-zylo-green" size={24} fill="currentColor" />
                 </div>

                 {/* Headline */}
                 <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                   No adivines más qué grabar.
                 </h2>

                 {/* Subheadline with Economic Angle */}
                 <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                   Recibí ideas virales listas para publicar. <br className="hidden md:block"/>
                   <span className="text-gray-200">Cuesta menos que una hamburguesa al mes ($15 USD).</span>
                 </p>

                 {/* Button */}
                 <div className="pt-2">
                     <a href="#pricing" className="inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-zylo-black hover:bg-gray-100 transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
                        Quiero probar HookBase
                     </a>
                 </div>

                 {/* Footer Checkmarks */}
                 <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500 font-medium pt-4">
                    <span className="flex items-center gap-2">✓ 7 días gratis</span>
                    <span className="flex items-center gap-2">✓ Sin compromiso</span>
                    <span className="flex items-center gap-2">✓ Cancela cuando quieras</span>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;