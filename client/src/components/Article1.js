import React from 'react';

const Article1 = () => {
  return (
    <div
      className="h-96 mx-auto p-6 bg-black bg-opacity-90 shadow-md bg-cover bg-center"
      style={{
        backgroundImage: "url('/assets/2bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
      >
      <h1 className="text-3xl font-bold mb-4 text-white text-center">
        Pourquoi choisir Lex Horlogerie ?
      </h1>
      <p className="text-lg leading-relaxed text-white text-center">
        Nous offrons une large sélection de produits de qualité, avec des prix
        compétitifs et un service client exceptionnel.
      </p>
    </div>
  );
};

export default Article1;
