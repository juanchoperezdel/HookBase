
import React from 'react';

interface FooterProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick }) => {
  return (
    <footer id="contact" className="w-full border-t border-gray-100 bg-white py-12 mt-20 scroll-mt-24">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 font-medium mb-4">
          © {new Date().getFullYear()} HookBase. Todos los derechos reservados. 
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <button 
            onClick={onTermsClick}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-zylo-purple transition-colors"
          >
            Términos de Servicio
          </button>
          <button 
            onClick={onPrivacyClick}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-zylo-purple transition-colors"
          >
            Política de Privacidad
          </button>
          <a 
            href="mailto:contact@veta.agency" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-zylo-purple transition-colors"
          >
            Soporte
          </a>
        </div>
      </div>
    </footer>
  );
};
