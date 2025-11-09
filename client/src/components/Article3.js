import React from 'react';

const Article3 = () => {
  return (
    <section className="mt-8 h-auto mx-auto p-6 bg-black bg-opacity-90 shadow-md bg-cover bg-center" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <h1 className="text-2xl font-bold mb-4 text-white">Titre de la Section</h1>
      <img src="/assets/url-de-l-image.jpg" alt="Description de l'image" className="w-full h-auto mb-4 rounded" />
      <p className="text-lg leading-relaxed text-white mb-8">
        Ceci est le contenu de la section. Vous pouvez ajouter plus de texte ici pour décrire la section en détail.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow-md">
          <img src="/assets/montre1.jpg" alt="Montre 1" className="w-full h-auto mb-4 rounded" />
          <h2 className="text-xl font-bold mb-2">Montre 1</h2>
          <p className="text-gray-700">Description de la montre 1.</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <img src="/assets/montre2.jpg" alt="Montre 2" className="w-full h-auto mb-4 rounded" />
          <h2 className="text-xl font-bold mb-2">Montre 2</h2>
          <p className="text-gray-700">Description de la montre 2.</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <img src="/assets/montre3.jpg" alt="Montre 3" className="w-full h-auto mb-4 rounded" />
          <h2 className="text-xl font-bold mb-2">Montre 3</h2>
          <p className="text-gray-700">Description de la montre 3.</p>
        </div>
      </div>
    </section>
  );
};

export default Article3;