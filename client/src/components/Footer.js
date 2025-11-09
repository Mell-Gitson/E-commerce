import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-8 text-black">
      <div className="container mx-auto px-4 flex flex-wrap justify-between">

        <div className="w-full sm:w-1/3 mb-8 sm:mb-0">
          <h1 className="text-2xl font-bold mb-4">Lex Horlogerie</h1>
          <p className="text-black">Des montres élégantes et sophistiquées pour chaque occasion.</p>
        </div>
      </div>
      <div className="mt-8 pt-4 text-center">
        <p className="text-black">&copy; 2024 Lex Horlogerie. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
