import React, { useState } from 'react';
import { Zap, Globe, Menu, X, Layout } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  onGetStarted?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, onGetStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGetStarted) {
      onGetStarted();
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-sm pt-4 pb-4 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between px-6 md:px-12">
        {/* Logo Area */}
        <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 group relative z-50">
          <div className="flex items-center justify-center transition-transform group-hover:scale-110">
             <Zap size={24} className="text-zylo-black fill-current" />
          </div>
          <span className="text-2xl font-bold text-zylo-black tracking-tight">
            HookBase
          </span>
        </a>
        
        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-3 relative z-50">
          <button className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-zylo-black hover:bg-gray-100 transition-all">
            <Globe size={16} />
            <span>ES</span>
          </button>
          
          <button 
            onClick={handleGetStarted}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-zylo-black px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-all"
          >
            <span>Acceder</span>
            <Layout size={16} />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="sm:hidden p-2 text-zylo-black hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 sm:hidden ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col items-center gap-4 mt-4">
           <button 
            onClick={handleGetStarted}
            className="rounded-full bg-zylo-black px-8 py-4 text-lg font-bold text-white shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            <Layout size={20} />
            Ir al Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};