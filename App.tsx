
import React, { useState, useEffect } from 'react';
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
import { OnboardingForm } from './components/OnboardingForm';
import { LoginView } from './components/LoginView';
import { ROICalculator } from './components/ROICalculator';
import { DashboardHub } from './components/DashboardHub';
import { HookGenerator } from './components/HookGenerator';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { ThankYouPage } from './components/ThankYouPage';
import { Zap } from 'lucide-react';

type ViewType = 'landing' | 'report' | 'onboarding' | 'dashboard' | 'login' | 'privacy' | 'terms' | 'thank-you';

const PATH_MAP: Record<string, ViewType> = {
  '/': 'landing',
  '/pago-confirmado': 'thank-you',
  '/politicas-de-privacidad': 'privacy',
  '/terminos-de-servicio': 'terms',
  '/login': 'login',
  '/empezar': 'onboarding',
  '/dashboard': 'dashboard',
  '/reporte': 'report'
};

const VIEW_TO_PATH: Record<ViewType, string> = {
  'landing': '/',
  'thank-you': '/pago-confirmado',
  'privacy': '/politicas-de-privacidad',
  'terms': '/terminos-de-servicio',
  'login': '/login',
  'onboarding': '/empezar',
  'dashboard': '/dashboard',
  'report': '/reporte'
};

function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState<1 | 2 | 3 | 4>(1);

  // Initial routing based on URL
  useEffect(() => {
    try {
      const path = window.location.pathname;

      if (path.startsWith('/reporte/')) {
        const id = path.split('/reporte/')[1];
        if (id) {
          setSelectedReportId(id);
          setView('report');
          return;
        }
      }

      if (PATH_MAP[path]) {
        setView(PATH_MAP[path]);
      }
    } catch (e) {
      console.warn("Initial routing failed, defaulting to landing", e);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
        if (event.state.reportId) setSelectedReportId(event.state.reportId);
      } else {
        const path = window.location.pathname;
        if (PATH_MAP[path]) setView(PATH_MAP[path]);
        else setView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newView: ViewType, reportId?: string, initialStep: 1 | 2 | 3 | 4 = 1) => {
    if (newView === view && !reportId && initialStep === onboardingInitialStep) return;

    let path = VIEW_TO_PATH[newView] || '/';

    if (reportId) {
      setSelectedReportId(reportId);
      path = `/reporte/${reportId}`;
    }

    if (newView === 'onboarding') {
      setOnboardingInitialStep(initialStep);
    }

    // Wrap pushState in try-catch to avoid SecurityError in restricted origins
    try {
      window.history.pushState({ view: newView, reportId, initialStep }, '', path);
    } catch (e) {
      console.warn("Browser restricted URL path update. Falling back to state-only navigation.");
      try {
        // Try pushing without path as secondary fallback
        window.history.pushState({ view: newView, reportId, initialStep }, '');
      } catch (e2) {
        // Do nothing if even this fails
      }
    }

    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (paid: boolean) => {
    if (paid) {
      navigateTo('dashboard');
    } else {
      navigateTo('onboarding', undefined, 4);
    }
  };

  if (view === 'dashboard') {
    return <DashboardHub onNavigate={navigateTo} />;
  }

  if (view === 'login') {
    return (
      <LoginView
        onBack={() => navigateTo('landing')}
        onRegister={() => navigateTo('onboarding')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (view === 'report') {
    return (
      <ReportPage
        reportId={selectedReportId}
        onBack={() => navigateTo('dashboard')}
      />
    );
  }

  if (view === 'onboarding') {
    return <OnboardingForm onBack={() => window.history.back()} initialStep={onboardingInitialStep} />;
  }

  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => navigateTo('landing')} />;
  }

  if (view === 'terms') {
    return <TermsOfService onBack={() => navigateTo('landing')} />;
  }

  if (view === 'thank-you') {
    return <ThankYouPage onGoToLogin={() => navigateTo('login')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-zylo-greenLight selection:text-zylo-black">
      <Header
        onLogoClick={() => navigateTo('landing')}
        onGetStarted={() => navigateTo('login')}
      />

      <main className="flex-1 pt-24">
        <Hero
          onDemoClick={() => navigateTo('report')}
          onGetStarted={() => navigateTo('onboarding')}
        />

        <section id="generator" className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-zylo-black mb-4">
                Probá nuestro <span className="text-zylo-purple">generador gratuito</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Escribí el tema de tu próximo video y obtené 6 hooks virales al instante.
              </p>
            </div>
            <HookGenerator />
          </div>
        </section>

        <DataProof onGetStarted={() => navigateTo('onboarding')} />
        <PainPoints />
        <Features />

        <DemoCard onShowReport={() => navigateTo('report')} />

        <ROICalculator />

        <Pricing onGetStarted={() => navigateTo('onboarding')} />
        <FAQ />

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="relative overflow-hidden rounded-[3rem] bg-[#111827] px-6 py-20 text-center shadow-2xl md:px-16">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-zylo-purple opacity-20 blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-zylo-green opacity-10 blur-[100px]"></div>

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 backdrop-blur-md shadow-inner border border-white/10">
                  <Zap className="text-zylo-green" size={24} fill="currentColor" />
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                  No adivines más qué grabar.
                </h2>
                <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  Recibí ideas virales listas para publicar. <br className="hidden md:block" />
                  <span className="text-gray-200">Cuesta menos que una hamburguesa al mes ($15 USD).</span>
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('onboarding')}
                    className="inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-zylo-black hover:bg-gray-100 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    Quiero probar HookBase
                  </button>
                </div>
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

      <Footer
        onPrivacyClick={() => navigateTo('privacy')}
        onTermsClick={() => navigateTo('terms')}
      />
    </div>
  );
}

export default App;
