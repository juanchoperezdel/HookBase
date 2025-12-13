import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="w-full border-t border-gray-100 bg-white py-12 mt-20 scroll-mt-24">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 font-medium">
          © {new Date().getFullYear()} HookBase. Todos los derechos reservados. 
        </p>
      </div>
    </footer>
  );
};