import React from 'react';
import imgbanner from './ok.gif';
import '../App.css';
import '../Test.css';

const Banner = () => {
  return (
    <div className="bg-black bg-cover bg-center py-8 mt-2 bannerimgfont banner-zoom">
      <img className="w-full imgbaner justify-center" width={'500px'} src={imgbanner} alt='banniere' />
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-100">Lex Horlogerie</h1>
        <p className="text-gray-700 text-xl">L'horlogerie sur mesure</p>
      </div>
    </div>
  );
};

export default Banner;