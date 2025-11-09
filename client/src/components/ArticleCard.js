import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

const ArticleCard = ({ article, image }) => (
  <div className="article-card bg-white mt-16 h-84 w-72 overflow-hidden shadow-lg p-4 rounded-xl transform transition-transform duration-300 hover:scale-105">
    <div className='mx-auto' style={{ width: '90%', position: 'relative', paddingBottom:'200px'}}>
      <img 
        className='mx-auto'
        style={{ position: 'absolute', width: '100%', height: '100%' }} 
        src={image} 
        alt={article.title} 
      />
    </div>
    <div className="">
      <div className="border-black border-2 p-2 w-40 text-center bg-grayBanner font-bold text-l mb-2 mx-auto rounded-lg hover-effect">{article.title}</div>
      <p className="text-gray-700 text-base text-center"><strong>Price: </strong>{article.price}€</p>
      
      <Link 
        to={`/article/${article.id}`}
        className="text-center justify-end text-sm text-gray-700 font-bold py-2 px-4 hover:text-gray-500 inline-block mt-2"
      >
        Voir
      </Link>
    </div>
  </div>
);

export default ArticleCard;